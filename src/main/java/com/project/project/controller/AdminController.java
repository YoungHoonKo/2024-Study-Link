package com.project.project.controller;


import com.project.project.dto.BoardDTO;
import com.project.project.entity.User;
import com.project.project.service.AdminService;
import com.project.project.service.BoardService;
import com.project.project.service.UserService;
import com.project.project.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/admin")
@RestController
public class AdminController {

    private final BoardService boardService;
   // private final UserRepository userRepository;
    private final UserService userService;
    private final AdminService adminService;

    private final JWTUtil jwtUtil;
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

    @GetMapping("/admin")
    public ResponseEntity<Void> admin(@RequestHeader("access") String token) {
       String userRole = jwtUtil.getRole(token);
        System.out.println("userRole = " + userRole);
        HttpHeaders headers = new HttpHeaders();
        if ("ROLE_ADMIN".equals(userRole)) {
            System.out.println("you are an admin");

            return ResponseEntity.ok()
                    .build();
        }
        else {
            System.out.println("you are not an admin");
            return ResponseEntity.notFound().build();
        }
    }

}
