package com.simpledrive.repository;

import com.simpledrive.entity.FileVersion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileVersionRepository extends JpaRepository<FileVersion, Long> {
} 