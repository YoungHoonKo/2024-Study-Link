package com.project.project.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class UserUpdateDto {
    private String username;
    private String email;
    private String password;
    private String confirmPassword;
    private String profilePictureUrl;
    private String bio;
    private List<String> skill;
    private List<String> interests;
}
