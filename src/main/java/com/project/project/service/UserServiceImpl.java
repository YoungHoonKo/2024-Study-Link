package com.project.project.service;

import com.project.project.dto.UserRegistrationDto;
import com.project.project.entity.User;
import com.project.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public Optional<User> getUserbyId(Long id) {
        return Optional.empty();
    }

    @Override
    public User registerUser(UserRegistrationDto userRegistrationDto) {
        return null;
    }

    @Override
    public User updateUser(Long id, User userDetails) {
        return null;
    }

    @Override
    public void deleteUser(Long id) {

    }
}
