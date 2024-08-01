package com.project.project.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {
    @GetMapping("/register")
    public String register(){
        return "register";
    }
    @GetMapping("/login")
    public String login(){
        return "login";
    }
    @GetMapping("/")
    public String home(){
        return "index";
    }
    @GetMapping("/start")
    public String start(){
        return "start";
    }
    @GetMapping("/test")
    public String test(){
        return "test";
    }
}
