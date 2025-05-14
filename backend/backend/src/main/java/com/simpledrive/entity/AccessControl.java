package com.simpledrive.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "access_control")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccessControl {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id", nullable = false)
    private File file;

    @Column(nullable = false)
    private String sharedWithEmail;

    @Column(nullable = false)
    private String permission;

    // Getters and setters
    // ... (omitted for brevity)
} 