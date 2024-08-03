package com.project.project.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {

    @GetMapping("/login")
    public String login(Authentication authentication){
        return "login";
    }

    @GetMapping("/")
    public String home(){
        return "index";
    }


    @GetMapping("/register")
    public String register(){
        return "register";
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
        return "mypage";
    }
    @GetMapping("/admin")
    public String admin(){
        return "Admin/admin";
    }

}
