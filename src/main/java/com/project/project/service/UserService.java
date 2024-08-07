package com.project.project.service;

import com.project.project.entity.User;
import com.project.project.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    UserRepository userRepository;
    //Admin save(Admin admin);
    User save(User user) {
        return user;
    }
    public List<User> findAll(){
        return userRepository.findAll();
    }

    UserService(){
    }

}
