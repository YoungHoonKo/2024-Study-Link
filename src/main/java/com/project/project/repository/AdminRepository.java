package com.project.project.repository;

import com.project.project.entity.User;

import java.util.List;


public interface AdminRepository {

    public List<User> findByRole(String role);
}
