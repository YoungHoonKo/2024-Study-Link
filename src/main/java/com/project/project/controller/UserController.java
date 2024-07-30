package com.project.project.controller;

import com.project.project.dto.UserRegistrationDto;
import com.project.project.entity.User;
import com.project.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody UserRegistrationDto userRegistrationDto){
        try {
            User newUser = userService.registerUser(userRegistrationDto);
            return ResponseEntity.ok(newUser);
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(null);
        }
    }
}
