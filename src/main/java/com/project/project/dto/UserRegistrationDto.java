package com.project.project.dto;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@Getter
@Setter
public class UserRegistrationDto {
    private String username;
    private String email;
    private String password;
    private String confirmPassword;
}
