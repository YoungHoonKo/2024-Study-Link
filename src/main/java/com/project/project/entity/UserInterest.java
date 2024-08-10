package com.project.project.entity;

import jakarta.persistence.*;

@Table(name = "usesr_interest")
@Entity
public class UserInterest {

    @Id
    private int id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
