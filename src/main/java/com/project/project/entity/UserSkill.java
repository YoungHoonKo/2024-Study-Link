package com.project.project.entity;

import jakarta.persistence.*;

@Table(name = "user_skills")
@Entity
public class UserSkill {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "skill", length = 255)
    private String skill;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
