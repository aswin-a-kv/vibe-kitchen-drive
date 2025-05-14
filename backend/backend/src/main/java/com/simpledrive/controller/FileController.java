package com.simpledrive.controller;

import com.simpledrive.entity.File;
import com.simpledrive.repository.FileRepository;
import com.google.cloud.storage.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/files")
public class FileController {
    @Autowired
    private FileRepository fileRepository;

    @Value("${cloud.gcs.bucket}")
    private String gcsBucket;

    private Storage getGcsClient() {
        return StorageOptions.getDefaultInstance().getService();
    }

    @GetMapping
    public List<File> listFiles(@RequestParam(required = false) Long parentId) {
        if (parentId == null) {
            return fileRepository.findAll();
        } else {
            return fileRepository.findByParent_FileId(parentId);
        }
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<File> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ownerEmail") String ownerEmail,
            @RequestParam(value = "parentId", required = false) Long parentId
    ) throws IOException {
        String objectName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Storage storage = getGcsClient();
        BlobId blobId = BlobId.of(gcsBucket, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();
        storage.create(blobInfo, file.getBytes());
        String signedUrl = storage.signUrl(blobInfo, 7, TimeUnit.DAYS, Storage.SignUrlOption.withV4Signature()).toString();
        File dbFile = new File();
        dbFile.setName(file.getOriginalFilename());
        dbFile.setIsFolder(false);
        dbFile.setSize(file.getSize());
        dbFile.setCreatedAt(Instant.now());
        dbFile.setUpdatedAt(Instant.now());
        dbFile.setStorageKey(objectName);
        dbFile.setContentType(file.getContentType());
        dbFile.setOwnerEmail(ownerEmail);
        dbFile.setSignedUrl(signedUrl);
        if (parentId != null) {
            dbFile.setParent(fileRepository.findById(parentId).orElse(null));
        }
        fileRepository.save(dbFile);
        return ResponseEntity.status(HttpStatus.CREATED)
                .header("X-GCS-Download-Url", signedUrl)
                .body(dbFile);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<File> createFolder(@RequestBody FolderRequest folderRequest) {
        File folder = new File();
        folder.setName(folderRequest.getName());
        folder.setIsFolder(true);
        folder.setSize(0L);
        folder.setCreatedAt(Instant.now());
        folder.setUpdatedAt(Instant.now());
        folder.setStorageKey("");
        folder.setContentType("folder");
        folder.setOwnerEmail(folderRequest.getOwnerEmail());
        if (folderRequest.getParentId() != null) {
            folder.setParent(fileRepository.findById(folderRequest.getParentId()).orElse(null));
        }
        fileRepository.save(folder);
        return ResponseEntity.status(HttpStatus.CREATED).body(folder);
    }

    @GetMapping("/{id}")
    public ResponseEntity<File> getFile(@PathVariable Long id) {
        Optional<File> file = fileRepository.findById(id);
        return file.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) throws IOException {
        Optional<File> fileOpt = fileRepository.findById(id);
        if (fileOpt.isEmpty() || fileOpt.get().getIsFolder()) {
            return ResponseEntity.notFound().build();
        }
        File file = fileOpt.get();
        Storage storage = getGcsClient();
        BlobId blobId = BlobId.of(gcsBucket, file.getStorageKey());
        byte[] data = storage.readAllBytes(blobId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.parseMediaType(file.getContentType()))
                .body(data);
    }

    @PutMapping("/{id}")
    public ResponseEntity<File> renameOrMoveFile(@PathVariable Long id, @RequestBody FileUpdateRequest req) {
        Optional<File> fileOpt = fileRepository.findById(id);
        if (fileOpt.isEmpty()) return ResponseEntity.notFound().build();
        File file = fileOpt.get();
        if (req.getName() != null) file.setName(req.getName());
        if (req.getParentId() != null) file.setParent(fileRepository.findById(req.getParentId()).orElse(null));
        file.setUpdatedAt(Instant.now());
        fileRepository.save(file);
        return ResponseEntity.ok(file);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long id) {
        Optional<File> fileOpt = fileRepository.findById(id);
        if (fileOpt.isEmpty()) return ResponseEntity.notFound().build();
        File file = fileOpt.get();
        if (file.getIsFolder()) {
            deleteFolderRecursively(file.getFileId());
        } else {
            fileRepository.deleteById(id);
        }
        return ResponseEntity.noContent().build();
    }

    private void deleteFolderRecursively(Long folderId) {
        List<File> children = fileRepository.findByParent_FileId(folderId);
        for (File child : children) {
            if (Boolean.TRUE.equals(child.getIsFolder())) {
                deleteFolderRecursively(child.getFileId());
            } else {
                fileRepository.deleteById(child.getFileId());
            }
        }
        fileRepository.deleteById(folderId);
    }

    // DTOs for requests
    public static class FolderRequest {
        private String name;
        private String ownerEmail;
        private Long parentId;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getOwnerEmail() { return ownerEmail; }
        public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }
        public Long getParentId() { return parentId; }
        public void setParentId(Long parentId) { this.parentId = parentId; }
    }
    public static class FileUpdateRequest {
        private String name;
        private Long parentId;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Long getParentId() { return parentId; }
        public void setParentId(Long parentId) { this.parentId = parentId; }
    }
} 