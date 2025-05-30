package com.simpledrive.repository;

import com.simpledrive.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FileRepository extends JpaRepository<File, Long> {
    List<File> findByParentFileId(Long parentId);
} 