package com.project.project.service;

import com.project.project.dto.UserRegistrationDto;
import com.project.project.entity.User;

import java.util.Optional;

public interface UserService {
    Optional<User> getUserbyId(Long id);
    User registerUser(UserRegistrationDto userRegistrationDto);
    User updateUser(Long id, User userDetails);
    void deleteUser(Long id);
}
