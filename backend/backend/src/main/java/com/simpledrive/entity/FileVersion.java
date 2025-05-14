package com.simpledrive.entity;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.*;

@Entity
@Table(name = "file_versions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long versionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id", nullable = false)
    private File file;

    @Column(nullable = false)
    private String storageVersionId;

    @Column(nullable = false)
    private Instant uploadedAt;
} 