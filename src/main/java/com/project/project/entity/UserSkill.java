package com.project.project.entity;

import jakarta.persistence.*;

@Table(name = "user_skills")
@Entity
public class UserSkill {

    @Id
    private int id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
