package com.simpledrive.repository;

import com.simpledrive.entity.AccessControl;
import com.simpledrive.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccessControlRepository extends JpaRepository<AccessControl, Long> {
    AccessControl findByFileAndSharedWithEmail(File file, String sharedWithEmail);
    List<AccessControl> findByFileInAndSharedWithEmail(List<File> files, String sharedWithEmail);
} 