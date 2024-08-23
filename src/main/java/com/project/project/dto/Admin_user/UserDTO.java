package com.project.project.dto.Admin_user;

import com.project.project.entity.User;
import com.project.project.entity.UserInterest;
import com.project.project.entity.UserSkill;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserDTO {
    private Long id;
    private String username;
    private String password;
    private String status;
    private String role;
    private String email;

    //bibism - 회원 프로필 띄운다고 갖고옴
    private String bio;
    private String postcode;
    private String adress;
    private String profilePictureUrl;
    private String position;
    private String organization;
    //FIXME : 여기 list에서 에러뜸
    private List<UserSkill> userSkills;
    private List<UserInterest> userInterests;

}
