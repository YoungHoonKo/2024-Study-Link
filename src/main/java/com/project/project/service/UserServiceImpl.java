package com.project.project.service;

import com.project.project.dto.UserRegistrationDto;
import com.project.project.entity.User;
import com.project.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Optional<User> getUserbyId(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User registerUser(UserRegistrationDto userRegistrationDto) {
        // 이메일 중복 체크
        if (userRepository.findByEmail(userRegistrationDto.getEmail()).isPresent()) {
            throw new RuntimeException("이미 사용중인 이메일입니다.");
        }

        if (!userRegistrationDto.getPassword().equals(userRegistrationDto.getConfirmPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        User user = new User();
        user.setUsername(userRegistrationDto.getUsername());
        user.setEmail(userRegistrationDto.getEmail());
        // 비밀번호 암호화
        user.setPassword(passwordEncoder.encode(userRegistrationDto.getPassword()));
        user.setProfilePictureUrl(null);
        user.setBio(null);
        user.setSkill(null);
        user.setInterests(null);

        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User userDetails) {
        return null;
    }

    @Override
    public void deleteUser(Long id) {

    }
}
