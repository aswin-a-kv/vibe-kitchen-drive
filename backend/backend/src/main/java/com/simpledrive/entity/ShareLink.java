package com.simpledrive.entity;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.*;

@Entity
@Table(name = "share_links")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShareLink {
    @Id
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id", nullable = false)
    private File file;

    @Column(nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    private String createdByEmail;

    // Getters and setters
    // ... (omitted for brevity)
} 