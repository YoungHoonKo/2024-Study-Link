package com.project.project.dto.userServiceDto;

import lombok.Data;

import java.util.List;

@Data
public class UserProfileUpdateDTO {
    private String username;
    private String position;
    private String organization;
    private String bio;
    List<String> skills;
    String interests;

}
