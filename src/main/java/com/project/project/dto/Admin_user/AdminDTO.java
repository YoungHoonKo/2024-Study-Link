package com.project.project.dto.Admin_user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminDTO {
    private int id;
    private String username;
    private String password;
    private String role;
    private String status;
}
