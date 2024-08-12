package com.project.project.dto.userServiceDto;

import com.project.project.entity.UserInterest;
import com.project.project.entity.UserSkill;
import lombok.Data;

import java.util.List;

@Data
public class UserProfileDTO {
    private String username;
    private String email;
    private String bio;
    private String accountStatus;
    private List<UserSkill> skill;
    private List<UserInterest> interests;
}
