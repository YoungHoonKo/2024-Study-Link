package com.project.project.entity;

import jakarta.persistence.*;

@Table(name = "user_interest")
@Entity
public class UserInterest {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "interest", length = 255)
    private String interest;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
