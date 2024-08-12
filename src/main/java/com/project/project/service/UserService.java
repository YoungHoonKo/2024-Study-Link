package com.project.project.service;

import com.project.project.dto.userServiceDto.UserPasswordChangeDTO;
import com.project.project.dto.userServiceDto.UserProfileDTO;
import com.project.project.dto.userServiceDto.UserProfileUpdateDTO;
import com.project.project.entity.User;
import com.project.project.exception.UserNotFoundException;
import com.project.project.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    //Admin save(Admin admin);
    User save(User user) {
        return user;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public boolean changeUserPassword(String email, UserPasswordChangeDTO userPasswordChangeDTO) {
        System.out.println("1231312");
        Optional<User> userOpt = userRepository.findByEmail(email);
        System.out.println("1231312");
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            log.info("123123");
            if (passwordEncoder.matches(userPasswordChangeDTO.getCurrentPassword(), user.getPassword())) {
                if (userPasswordChangeDTO.getNewPassword().equals(userPasswordChangeDTO.getConfirmPassword())) {
                    user.setPassword(passwordEncoder.encode(userPasswordChangeDTO.getNewPassword()));
                    userRepository.save(user);
                    return true;
                } else {
                    log.error("New password and confirm password do not match.");
                    throw new IllegalArgumentException("New password and confirm password do not match");
                }
            } else {
                log.error("Current password is incorrect.");
                throw new IllegalArgumentException("Current password is incorrect.");
            }
        } else {
            log.error("User not found for email: " + email);
            throw new NoSuchElementException("User not found.");
        }
    }

    public UserProfileDTO getUserProfileDTO(String email) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            UserProfileDTO dto = new UserProfileDTO();
            dto.setUsername(user.get().getUsername());
            dto.setEmail(user.get().getEmail());
            dto.setBio(user.get().getBio());
            dto.setSkill(user.get().getUserSkills());
            dto.setInterests(user.get().getUserInterests());
            dto.setAccountStatus(user.get().getStatus());
            System.out.println(dto);
            return dto;
        }
        return null;
    }

    @Transactional
    public void deleteUser(String email){
        if (!userRepository.existsUserByEmail(email)){
            throw new UserNotFoundException("사용자를 찾을 수 없습니다.");
        }
        userRepository.deleteUserByEmail(email);
    }

    public User updateUserProfile(String email, UserProfileUpdateDTO userProfileUpdateDTO){
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()){
            User user = userOptional.get();
            user.setUsername(userProfileUpdateDTO.getUsername());
            user.setBio(userProfileUpdateDTO.getBio());
            return userRepository.save(user);
        }else{
            throw new UserNotFoundException("사용자를 찾을 수 없습니다.");
        }

    }
}
