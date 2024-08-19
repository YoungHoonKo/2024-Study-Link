package com.project.project.controller;


import com.project.project.dto.BoardDTO;
import com.project.project.dto.CustomUserDetails;
import com.project.project.entity.User;
import com.project.project.repository.UserRepository;
import com.project.project.service.AdminService;
import com.project.project.service.BoardService;
import com.project.project.service.UserService;
import com.project.project.util.JWTUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/admin")
@RestController
public class AdminController {

    private final BoardService boardService;
    private final UserRepository userRepository;
    private final UserService userService;
    private final AdminService adminService;
    private final JWTUtil jwtUtil;


    private String getUser() {
        CustomUserDetails customUserDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return customUserDetails.getUsername();
    }

//member-list
    @GetMapping("/member")
    public ResponseEntity<List<User>> admin_member(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        List<User> users = userService.findAll();
        return ResponseEntity.ok().body(users);

    }


    @GetMapping("/board")
    public ResponseEntity<Map<String, Object>> admin_board(Model model) {
        Map<String, Object> response = new HashMap<>();
        List<BoardDTO> boards = boardService.findAll();
        model.addAttribute("boards", boards);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin")
    public String admin_admin(Model model) {
        return "/Admin/admin_list";
    }






}
