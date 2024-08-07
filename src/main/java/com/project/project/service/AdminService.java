package com.project.project.service;

import com.project.project.entity.Admin;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    Admin save(Admin admin){
        return admin;
    }
    Optional<Admin> findById(Long id){
        return null;
    }
    List<Admin> findAll(){
        return null;
    }
}
