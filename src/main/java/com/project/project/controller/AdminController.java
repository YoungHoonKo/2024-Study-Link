package com.project.project.controller;


import com.project.project.dto.BoardDTO;
import com.project.project.entity.User;
import com.project.project.repository.UserRepository;
import com.project.project.service.BoardService;
import com.project.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequestMapping("/admin")
@Controller
public class AdminController {

    @Autowired
    BoardService boardService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;
//member-list
    @GetMapping("/member")
    public String admin_member(Model model) {
        List<User> users = userService.findAll();
        model.addAttribute("users", users);
        return "/Admin/user_list";
    }
    //board - list

    @GetMapping("/board")
    public String admin_board(Model model) {
        List<BoardDTO> boards = boardService.findAll();
        model.addAttribute("boards", boards);
        return "/Admin/board_list";
    }
}
