package com.project.project.controller;

import com.project.project.dto.CustomUserDetails;
import com.project.project.dto.userServiceDto.*;
import com.project.project.entity.User;
import com.project.project.entity.UserSkill;
import com.project.project.service.JwtTokenService;
import com.project.project.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;
    private final JwtTokenService jwtTokenService;

    private String getUser() {
        CustomUserDetails customUserDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return customUserDetails.getUsername();
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile() {
        String email = getUser();
        UserProfileDTO profile = userService.getUserProfileDTO(email);
        if (profile != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(profile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@RequestBody UserPasswordChangeDTO dto) {
        String email = getUser();
        boolean isPaasswordChanged = userService.changeUserPassword(email,dto);
        System.out.println(isPaasswordChanged);
        if (isPaasswordChanged){
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/delete-user")
    public ResponseEntity<Void> deleteUser(@RequestHeader("access") String accessToken,
                                           @RequestBody UserPasswordDTO userPasswordDTO){
        String email = getUser();

        if (email != null && userService.checkPassword(email,userPasswordDTO.getPassword())){
            userService.deleteUser(email);

            jwtTokenService.addToBlacklist(accessToken,email);

            jwtTokenService.deleteRefreshToken(accessToken,email);
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.status(401).build();
        }
    }

    @PutMapping("/update-profile")
    public ResponseEntity<Void> updateProfile(@RequestBody UserProfileUpdateDTO userProfileUpdateDTO){
        String email = getUser();
        User user = userService.updateUserProfile(email,userProfileUpdateDTO);

        return ResponseEntity.noContent().build();
    }


    @GetMapping("/skills")
    public ResponseEntity<List<SkillDTO>> getUserSkills(){
        List<UserSkill> userSkills = userService.getUserSkills(getUser());

        List<SkillDTO> userSkillsDTO = userSkills.stream()
                .map( skill -> {
                    SkillDTO dto = new SkillDTO();
                    dto.setSkill(skill.getSkill());
                    dto.setLevel(skill.getLevel());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok().body(userSkillsDTO);
    }

    @DeleteMapping("/delete-skill")
    public ResponseEntity<Void> deleteSkill(@RequestBody SkillDTO skillDTO){
        String email = getUser();
        boolean success = userService.deleteSkill(email, skillDTO.getSkill());

        if(success){
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.status(401).build();
        }
    }
}
