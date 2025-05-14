package com.simpledrive.service;

import com.simpledrive.entity.AccessControl;
import com.simpledrive.entity.File;
import com.simpledrive.repository.AccessControlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccessControlService {
    @Autowired
    private AccessControlRepository accessControlRepository;

    public boolean hasPermission(String userEmail, File file, String requiredPermission) {
        // Owner always has full access
        if (file.getOwnerEmail().equals(userEmail)) return true;
        // Check direct and inherited permissions
        File current = file;
        while (current != null) {
            AccessControl ac = accessControlRepository.findByFileAndSharedWithEmail(current, userEmail);
            if (ac != null && permissionSatisfies(ac.getPermission(), requiredPermission)) {
                return true;
            }
            current = current.getParent();
        }
        return false;
    }

    private boolean permissionSatisfies(String actual, String required) {
        // editor > viewer
        if (actual.equalsIgnoreCase("editor")) return true;
        return actual.equalsIgnoreCase(required);
    }
} 