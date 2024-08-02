package com.project.project.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
public class ViewController {

    @GetMapping("/login")
    public String login(Authentication authentication){
        System.out.println("123"+authentication);
        if (authentication != null && authentication.isAuthenticated()) {
            return "redirect:/";  // 인증된 사용자는 메인 페이지로 리디렉션
        }
        return "login";
    }

    @GetMapping("/")
    public String home(){
        return "index";
    }

    @RequestMapping("/redirect-to-test")
    public String redirectToTest(HttpServletRequest request) {
        // 리다이렉션 페이지로 이동
        return "redirect";
    }

    @GetMapping("/register")
    public String register(){
        return "register";
    }

    @GetMapping("/start")
    public String start() {
        return "start";
    }
    @GetMapping("/test")
    public String test(){
        System.out.println("test");
        return "test";
    }
    @RequestMapping("/403")
    public String accessDenied() {
        return "403"; // /src/main/resources/templates/403.html
    }

}
