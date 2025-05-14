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

import com.simpledrive.service.AccessControlService;

@RestController
@RequestMapping("/files")
public class FileController {
    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private AccessControlService accessControlService;

    @Value("${cloud.gcs.bucket}")
    private String gcsBucket;

    private Storage getGcsClient() {
        return StorageOptions.getDefaultInstance().getService();
    }

    @GetMapping
    public List<File> listFiles(@RequestParam("ownerEmail") String ownerEmail, @RequestParam(required = false) Long parentId) {
        List<File> files = (parentId == null) ? fileRepository.findAll() : fileRepository.findByParentFileId(parentId);
        return files.stream().filter(f -> accessControlService.hasPermission(ownerEmail, f, "viewer")).toList();
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ownerEmail") String ownerEmail,
            @RequestParam(value = "parentId", required = false) Long parentId
    ) throws IOException {
        File parent = null;
        if (parentId != null) {
            parent = fileRepository.findById(parentId).orElse(null);
            if (parent != null && !accessControlService.hasPermission(ownerEmail, parent, "editor")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No write access to parent folder");
            }
        }
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
        if (parent != null) {
            dbFile.setParent(parent);
        }
        fileRepository.save(dbFile);
        return ResponseEntity.status(HttpStatus.CREATED)
                .header("X-GCS-Download-Url", signedUrl)
                .body(dbFile);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createFolder(@RequestBody FolderRequest folderRequest, @RequestParam("ownerEmail") String ownerEmail) {
        File parent = null;
        if (folderRequest.getParentId() != null) {
            parent = fileRepository.findById(folderRequest.getParentId()).orElse(null);
            if (parent != null && !accessControlService.hasPermission(ownerEmail, parent, "editor")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No write access to parent folder");
            }
        }
        File folder = new File();
        folder.setName(folderRequest.getName());
        folder.setIsFolder(true);
        folder.setSize(0L);
        folder.setCreatedAt(Instant.now());
        folder.setUpdatedAt(Instant.now());
        folder.setStorageKey("");
        folder.setContentType("folder");
        folder.setOwnerEmail(ownerEmail);
        if (parent != null) {
            folder.setParent(parent);
        }
        fileRepository.save(folder);
        return ResponseEntity.status(HttpStatus.CREATED).body(folder);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFile(@PathVariable Long id, @RequestParam("ownerEmail") String ownerEmail) {
        Optional<File> file = fileRepository.findById(id);
        if (file.isEmpty() || !accessControlService.hasPermission(ownerEmail, file.get(), "viewer")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No read access");
        }
        return ResponseEntity.ok(file.get());
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadFile(@PathVariable Long id, @RequestParam("ownerEmail") String ownerEmail) throws IOException {
        Optional<File> fileOpt = fileRepository.findById(id);
        if (fileOpt.isEmpty() || fileOpt.get().getIsFolder() || !accessControlService.hasPermission(ownerEmail, fileOpt.get(), "viewer")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No read access");
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
    public ResponseEntity<?> renameOrMoveFile(@PathVariable Long id, @RequestBody FileUpdateRequest req, @RequestParam("ownerEmail") String ownerEmail) {
        Optional<File> fileOpt = fileRepository.findById(id);
        if (fileOpt.isEmpty() || !accessControlService.hasPermission(ownerEmail, fileOpt.get(), "editor")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No write access");
        }
        File file = fileOpt.get();
        if (req.getName() != null) file.setName(req.getName());
        if (req.getParentId() != null) file.setParent(fileRepository.findById(req.getParentId()).orElse(null));
        file.setUpdatedAt(Instant.now());
        fileRepository.save(file);
        return ResponseEntity.ok(file);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id, @RequestParam("ownerEmail") String ownerEmail) {
        Optional<File> fileOpt = fileRepository.findById(id);
        if (fileOpt.isEmpty() || !accessControlService.hasPermission(ownerEmail, fileOpt.get(), "editor")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No write access");
        }
        File file = fileOpt.get();
        if (file.getIsFolder()) {
            deleteFolderRecursively(file.getFileId());
        } else {
            fileRepository.deleteById(id);
        }
        return ResponseEntity.noContent().build();
    }

    private void deleteFolderRecursively(Long folderId) {
        List<File> children = fileRepository.findByParentFileId(folderId);
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