package com.project.project.service.User;

import com.project.project.dto.userServiceDto.InterestDTO;
import com.project.project.entity.User;
import com.project.project.entity.UserInterest;
import com.project.project.exception.UserNotFoundException;
import com.project.project.repository.UserInterestRepository;
import com.project.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserInterestService {
    private final UserRepository userRepository;
    private final UserInterestRepository userInterestRepository;

    public InterestDTO getUserInterests(String email){
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"))
                .getId();

        UserInterest userInterest = userInterestRepository.findByUserId(userId);
        InterestDTO userInterestDto = new InterestDTO();
        userInterestDto.setInterest(userInterest.getInterest());
        return userInterestDto;
    }

    public UserInterest addUserInterest(String email, String interest){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Long userId = user.getId();

        UserInterest existingInterest = userInterestRepository.findByUserIdAndInterest(userId,interest);

        if (existingInterest != null){
            throw new RuntimeException("Interest already exists for the user");
        }

        UserInterest userInterest = new UserInterest();
        userInterest.setUser(user);
        userInterest.setInterest(interest);

        return userInterestRepository.save(userInterest);

    }

    public boolean deleteInterest(String email, String interest){
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"))
                .getId();

        UserInterest userInterest = userInterestRepository.findByUserIdAndInterest(userId,interest);

        if(userInterest != null){
            userInterestRepository.deleteByUserIdAndInterest(userId,interest);
            return true;
        }else{
            return false;
        }
    }
}
