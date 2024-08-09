package com.project.project.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {

    @GetMapping("/login")
    public String login(Authentication authentication){
        return "user/login";
    }


    @GetMapping("/register")
    public String register(){
        return "user/register";
    }

    @GetMapping("/start")
    public String start() {
        return "start";
    }

    @RequestMapping("/403")
    public String accessDenied() {
        return "403"; // /src/main/resources/templates/403.html
    }
    @GetMapping("/mypage")
    public String mypage(){
        return "user/mypage";
    }
    @GetMapping("/admin")
    public String admin(){
        return "Admin/admin";
    }

}
