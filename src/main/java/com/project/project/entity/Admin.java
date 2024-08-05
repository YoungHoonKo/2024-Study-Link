package com.project.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Admin {

    @Id
    private int id;

    @Column(name ="username", unique = true, nullable = false)
    private String username;

    @Column(name ="email", unique = true, nullable = false)
    private String email;

    @Column(name="pass_word", nullable = false)
    private String password;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    //getter setter
}
