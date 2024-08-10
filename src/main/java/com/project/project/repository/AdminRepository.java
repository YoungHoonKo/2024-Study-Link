package com.project.project.repository;

import com.project.project.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface AdminRepository extends JpaRepository<Admin, Integer> {

    //admin 저장
    Admin save(Admin admin);
    Optional<Admin> findById(Long id);
    List<Admin> findAll();
    //List<Admin> findByRole(Role role);
}
