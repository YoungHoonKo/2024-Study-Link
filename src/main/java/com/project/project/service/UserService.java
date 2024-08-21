package com.project.project.service;

import com.project.project.dto.userServiceDto.SkillDTO;
import com.project.project.dto.userServiceDto.UserPasswordChangeDTO;
import com.project.project.dto.userServiceDto.UserProfileDTO;
import com.project.project.dto.userServiceDto.UserProfileUpdateDTO;
import com.project.project.entity.User;
import com.project.project.entity.UserInterest;
import com.project.project.entity.UserSkill;
import com.project.project.exception.UserNotFoundException;
import com.project.project.repository.UserInterestRepository;
import com.project.project.repository.UserRepository;
import com.project.project.repository.UserSkillRepository;
import jakarta.persistence.Id;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserSkillRepository userSkillRepository;
    private final UserInterestRepository userInterestRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Long getUserIdByEmail(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getId();
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
        if (userOpt.isPresent()) {
            User user = userOpt.get();
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

    public Boolean checkPassword(String email,String password){
        Optional<User> user = userRepository.findByEmail(email);

        if(user.isPresent()){
            if(passwordEncoder.matches(password,user.get().getPassword())){
                return true;
            }else{
                return false;
            }
        }else{
            throw new UserNotFoundException("User not found");
        }
    }

    public UserProfileDTO getUserProfileDTO(String email) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            UserProfileDTO dto = new UserProfileDTO();
            dto.setUsername(user.get().getUsername());
            dto.setBio(user.get().getBio());
            dto.setPosition(user.get().getPosition());
            dto.setOrganization(user.get().getOrganization());
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

    @Transactional
    public User updateUserProfile(String email, UserProfileUpdateDTO userProfileUpdateDTO){
        Optional<User> userOptional = userRepository.findByEmail(email);
        System.out.println(userProfileUpdateDTO);
        if (userOptional.isPresent()){
            User user = userOptional.get();
            user.setUsername(userProfileUpdateDTO.getUsername());
            user.setBio(userProfileUpdateDTO.getBio());
            user.setPosition(userProfileUpdateDTO.getPosition());
            user.setOrganization(userProfileUpdateDTO.getOrganization());

            userSkillRepository.deleteByUserId(user.getId());
            userInterestRepository.deleteByUserId(user.getId());
            UserInterest userInterest = new UserInterest();
            userInterest.setInterest(userProfileUpdateDTO.getInterest());
            userInterest.setUser(user);
            userInterestRepository.save(userInterest);

            for (SkillDTO skillDTO : userProfileUpdateDTO.getSkills()) {
                UserSkill userSkill = new UserSkill();
                userSkill.setUser(user);
                userSkill.setSkill(skillDTO.getSkill());
                userSkill.setLevel(skillDTO.getLevel());
                userSkillRepository.save(userSkill);
            }

            return userRepository.save(user);
        }else{
            throw new UserNotFoundException("사용자를 찾을 수 없습니다.");
        }

    }

    //FIXME : 에러 해결됨
//bibisam - 이 코드 내가 수정함
    @Transactional
    public User updateUserRole(Long userId, String role) {
        Optional<User> optionalUser = userRepository.findById(userId); // userId로 수정
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setRole(role);
            return userRepository.save(user);
        }
        return null;
    }


    public List<UserSkill> getUserSkills(String email){
        Long userId = getUserIdByEmail(email);
        return userSkillRepository.findByUserId(userId);
    }
    @Transactional
    public boolean deleteSkill(String email, String skill){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        UserSkill userSkill = userSkillRepository.findByUserIdAndSkill(user.getId(), skill);
        if (userSkill != null){
            userSkillRepository.deleteByUserIdAndSkill(user.getId(), skill);
            log.info("Skill '{}' deleted successfully for user '{}'", skill, email);
            System.out.println(userSkill.getSkill());
            return true;
        }else{
            System.out.println(userSkill.getSkill());
            log.warn("Skill '{}' not found for user '{}' ",skill,email);
            return false;
        }
    }
}
