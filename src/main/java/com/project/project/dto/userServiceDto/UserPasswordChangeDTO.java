package com.project.project.dto.userServiceDto;

import lombok.Data;

@Data
public class UserPasswordChangeDTO {
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}
