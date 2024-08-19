package com.project.project.controller;


import com.project.project.dto.Admin_user.UserDTO;
import com.project.project.dto.BoardDTO;
import com.project.project.dto.CustomUserDetails;
import com.project.project.entity.User;
import com.project.project.repository.UserRepository;
import com.project.project.service.AdminService;
import com.project.project.service.BoardService;
import com.project.project.service.UserService;
import com.project.project.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
public ResponseEntity<List<UserDTO>> admin_member() {
    // 모든 User 엔티티를 가져옴
    List<User> users = userService.findAll();

    // User 엔티티를 UserDTO로 변환
    List<UserDTO> userDTOS = users.stream()
            .map(user -> {
                UserDTO userDTO = new UserDTO();
                userDTO.setUsername(user.getUsername());
                // 필요한 경우 다른 필드도 설정
                return userDTO;
            })
            .collect(Collectors.toList());

    // DTO 리스트를 ResponseEntity로 반환
    return ResponseEntity.ok().body(userDTOS);
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
