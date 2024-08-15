package com.project.project.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(AutoCloseable.class)
@Getter
public class BaseEntity {
    @CreationTimestamp
    @Column(updatable = false)  // 수정 시 관여를 하지 않음
    private LocalDateTime createdTime;

    @UpdateTimestamp
    @Column(insertable = false) // 입력시 관여를 하지 않음
    private LocalDateTime updatedTime;
}
