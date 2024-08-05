package com.project.project.repository;

import com.project.project.entity.Admin;
import com.project.project.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface AdminRepository extends JpaRepository<Admin, Integer> {

    public List<User> findByRole(String role);
}
