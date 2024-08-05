package com.project.project.controller;

import ch.qos.logback.core.model.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/Admin")
@Controller
public class AdminController {

    @GetMapping("/admin/member")
    public String admin_member(Model model) {
        return "user_list";
    }
}
