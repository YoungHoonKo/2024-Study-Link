package com.project.project.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Table(name = "user_skills")
@Entity
@Getter
@Setter
public class UserSkill {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "skill", length = 255)
    private String skill;

    @Column(name = "level", length = 50, nullable = false)
    private String level;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
