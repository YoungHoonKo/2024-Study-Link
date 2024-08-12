package com.project.project.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {
    @GetMapping("/index")
    public String index(){
        return "index";
    }

    @GetMapping("/login")
    public String login(Authentication authentication){
        return "user/login";
    }


    @GetMapping("/register")
    public String register(){ return "user/register";}

    @GetMapping("/start")
    public String start() {
        return "start";
    }
    @GetMapping("/401")
    public String unauthorized() {return "error/401";}
    @RequestMapping("/403")
    public String accessDenied() {
        return "error/403"; // /src/main/resources/templates/403.html
    }
    @GetMapping("/404")
    public String notfound(){
        return "error/404";
    }
    @GetMapping("/mypage")
    public String mypage(){
        return "user/mypage";
    }
    @GetMapping("/profile")
    public String profile() {return "user/profile";}
    @GetMapping("/admin")
    public String admin(){
        return "Admin/admin";
    }
}
