package com.project.project.repository;

import com.project.project.entity.UserInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserInterestRepository extends JpaRepository<UserInterest,Long> {
    UserInterest findByUserId(Long userId);
    UserInterest findByUserIdAndInterest(Long userId, String Interest);
    void deleteByUserIdAndInterest(Long userId, String interest);
    void deleteByUserId(Long userId);
}
