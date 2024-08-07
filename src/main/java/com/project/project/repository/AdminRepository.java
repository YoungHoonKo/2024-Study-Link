package com.project.project.repository;

import com.project.project.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface AdminRepository extends JpaRepository<Admin, Integer> {

    Admin save(Admin admin);
    Optional<Admin> findByName(String name);
    Optional<Admin> findById(Long id);
    List<Admin> findAll();
}
