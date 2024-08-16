package com.project.project.dto;

import lombok.Data;

@Data
public class AdminDto {
    private int id;
    private String username;
    private String password;
    private String role;
    private String status;
}
