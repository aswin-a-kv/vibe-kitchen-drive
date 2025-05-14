package com.simpledrive.repository;

import com.simpledrive.entity.AccessControl;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessControlRepository extends JpaRepository<AccessControl, Long> {
} 