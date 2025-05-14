package com.simpledrive.controller;

import com.simpledrive.entity.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/me")
public class UserController {
    @GetMapping
    public User getCurrentUser() {
        // Mock user for now
        User user = new User();
        user.setUserId(1L);
        user.setEmail("test@example.com");
        user.setName("Test User");
        user.setQuotaUsed(0L);
        return user;
    }
} 