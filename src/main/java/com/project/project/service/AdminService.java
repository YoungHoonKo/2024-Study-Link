package com.project.project.service;

import com.project.project.entity.Admin;
import com.project.project.repository.AdminRepository;
import com.project.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    public Admin save(Admin admin){
        return adminRepository.save(admin);
    }

    public Optional<Admin> findById(Long id){
        return adminRepository.findById(id);
    }

    public List<Admin> findAll(){
        return adminRepository.findAll();
    }
}
