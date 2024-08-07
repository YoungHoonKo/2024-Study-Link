package com.project.project.service;

import com.project.project.entity.User;
import com.project.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor(onConstructor_ = {@Autowired})
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

}
