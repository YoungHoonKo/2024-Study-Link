package com.project.project;

import com.project.project.entity.User;
import com.project.project.repository.AdminRepository;
import com.project.project.repository.AdminRepositoryImpl;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
public class AdminTest {
    AdminRepository adminRepository = new AdminRepositoryImpl();


    List<User> users = adminRepository.findByRole(role);
    //리포지토리 _ findbyuserrole 테스트
    @Test
    public void test_repository_role() {
    }
}
