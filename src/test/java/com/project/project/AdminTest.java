package com.project.project;

import com.project.project.repository.custom.AdminRepositoryCustom;
import com.project.project.repository.custom.AdminRepositoryImpl;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class AdminTest {

    AdminRepositoryCustom adminRepositoryCustom = new AdminRepositoryImpl();
    @Test
    public void jpql_test(){

    }
}
