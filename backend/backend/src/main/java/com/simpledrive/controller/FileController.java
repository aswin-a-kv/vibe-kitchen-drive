package com.simpledrive.controller;

import com.simpledrive.entity.File;
import com.simpledrive.entity.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/files")
public class FileController {
    @GetMapping
    public List<File> listFiles() {
        // Mock file for now
        File file = new File();
        file.setFileId(1L);
        file.setName("example.txt");
        file.setIsFolder(false);
        file.setSize(12345L);
        file.setCreatedAt(Instant.now());
        file.setUpdatedAt(Instant.now());
        file.setStorageKey("example.txt");
        file.setContentType("text/plain");
        file.setOwner(new User());
        return List.of(file);
    }
} 