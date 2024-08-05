package com.project.project.repository;

import com.project.project.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.List;

@Transactional
@Primary
@Repository
public class AdminRepositoryImpl implements AdminRepository {

    @Autowired
    EntityManager entityManager;

    @Override
    public List<User> findByRole(String role) {
        System.out.println("role = " + role); //확인용 println
        String sqld ="SELECT u FROM User u WHERE u.role = 'ROLE_ADMIN'";

        //FIXME : generic methid 넣어야함.. unchecked assignment관련
        List<User> resultList = entityManager.createQuery(sqld).getResultList();
        return resultList;
    }
}

/*
@Repository
@Transactional
public class PostCustomRepositoryImpl implements PostCustomRepository {

    @Autowired
    EntityManager entityManager;

    @Override
    public List<Post> findMyPost() {
        System.out.println("===== Post Custom Repository ===="); // 확인하기 위해서 print
        List<Post> resultList = entityManager.createQuery("SELECT p FROM Post AS p", Post.class).getResultList();
        return resultList;
    }

}
 */