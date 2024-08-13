package com.project.project.repository;

import com.project.project.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill,Long> {
    List<UserSkill> findByUserId(Long userId);
    UserSkill findByUserIdAndSkill(Long userId, String skill);
    void deleteByUserIdAndSkill(Long userId, String skill);
}
