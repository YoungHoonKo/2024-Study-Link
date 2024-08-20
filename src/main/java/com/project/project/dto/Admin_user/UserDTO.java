package com.project.project.dto.Admin_user;

import com.project.project.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserDTO {
    private String username;
    private String password;
    private String status;
    private String role;
    private String email;
}
