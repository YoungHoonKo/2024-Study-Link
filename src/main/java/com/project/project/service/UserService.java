package com.project.project.service;

import com.project.project.entity.User;
import com.project.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

   private final UserRepository userRepository;

   public List<User> getAllUsers() {
       return userRepository.findAll();
   }

    //Admin save(Admin admin);
    User save(User user) {
        return user;
    }
    public List<User> findAll(){
        return userRepository.findAll();
    }


}
