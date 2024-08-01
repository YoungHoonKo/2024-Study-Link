package com.project.project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,name = "username",length = 20)
    private String username;

    @Column(nullable = false,name = "email", unique = true, length = 50)
    private String email;

    @Column(nullable = false, name = "password",length = 255)
    private String password;

    @Column(name = "role")
    private String role;

    @Column(name = "address")
    private String address;

    @Column(name = "postcode")
    private String postcode;

    @Column(name="status", nullable = false)
    private String status;

    @Column(name = "profilePictureUrl", length = 255)
    private String profilePictureUrl;

//    자기소개 column
    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @ElementCollection
    @CollectionTable(name = "user_skills", joinColumns = @JoinColumn(name = "id"))
    @Column(name = "skill")
    private List<String> skill;

    @ElementCollection
    @CollectionTable(name = "user_interest",joinColumns = @JoinColumn(name = "id"))
    @Column(name = "interest")
    private List<String> interests;

}
