package com.project.project.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {

    @GetMapping("/login")
    public String login(){
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
