package com.project.project.repository.custom;


import com.project.project.entity.User;
import java.util.List;

public interface AdminRepositoryCustom  {
    //커스텀 로직 구현 부분
    //user 관리 부분
    List<User> findByRole(String role);
    List<User> fineByName(String name);
}
