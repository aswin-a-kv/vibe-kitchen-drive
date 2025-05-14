package com.simpledrive.repository;

import com.simpledrive.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, Long> {
} 