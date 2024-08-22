package com.project.project.service;

import com.project.project.entity.Admin;
import com.project.project.entity.User;
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

    public Admin save(Admin admin) {
        return adminRepository.save(admin);
    }

    public Optional<Admin> findById(Long id) {
        return adminRepository.findById(id);
    }

    public List<Admin> findAll() {
        return adminRepository.findAll();
    }

    public Admin addAdmin(Admin admin) {
        return adminRepository.save(admin);  // 관리자 테이블에 추가
    }

    public void deleteAdmin(Admin admin) {
        adminRepository.delete(admin);
    }

    //FIXME: 서비스 리포지토리 코드 수정
//    public void removeAdmin(User user) {
//        adminRepository.deleteByUserId(userId);  // 관리자 테이블에서 삭제
//    }
}
