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
    private String name;
    private String email;
    private String password;
    private String confirmPassword;
    private String address;
    private String postcode;
}
