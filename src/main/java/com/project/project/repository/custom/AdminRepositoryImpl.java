package com.project.project.repository.custom;


import com.project.project.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.List;

@Transactional
@Repository
@Primary
@RequiredArgsConstructor
public class AdminRepositoryImpl implements AdminRepositoryCustom {

    @PersistenceContext
    private final EntityManager entityManager;


    //role = admin인 user만 admin에 넣는 메서드
    @Override
    public List<User> findByRole(String role){
        // JPQL로 사용자 조회
        String jpql = "SELECT u FROM User u WHERE u.Role = :role";
        List<User> users = entityManager.createQuery(jpql, User.class)
                .setParameter("role", role)
                .getResultList();

        // 네이티브 SQL로 admin 테이블에 삽입
        String sql = "INSERT INTO admin (user_id, email, pass_word, username) " +
                "SELECT u.id, u.email, u.password, u.username FROM users u WHERE u.Role = :role";
        entityManager.createNativeQuery(sql)
                //.setParameter("role", role)
                .getResultList();
        //FIXME : parmeter이름 문제

        return users;
    }

    @Override
    public List<User> fineByName(String name) {
        return List.of();
    }
}
