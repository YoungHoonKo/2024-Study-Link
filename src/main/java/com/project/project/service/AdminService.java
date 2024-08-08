package com.project.project.service;

import com.project.project.entity.Admin;
import com.project.project.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    //dependency injection
    @Autowired
    private BoardService boardService;
    Admin save(Admin admin){
        return adminRepository.save(admin);
    }

    Optional<Admin> findById(Long id){
        return adminRepository.findById(id);
    }

    List<Admin> findAll(){
        return adminRepository.findAll();
    }
}
