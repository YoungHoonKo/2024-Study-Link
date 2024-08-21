package com.project.project.controller;


import com.project.project.dto.Admin_user.AdminDTO;
import com.project.project.dto.Admin_user.UserDTO;
import com.project.project.dto.Admin_user.BoardDTO;
import com.project.project.entity.Admin;
import com.project.project.entity.BoardEntity;
import com.project.project.entity.User;
import com.project.project.service.AdminService;
import com.project.project.service.BoardService;
import com.project.project.service.UserService;
import com.project.project.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/admin")
@RestController
public class AdminController {

    private final BoardService boardService;
    private final UserService userService;
    private final AdminService adminService;
    private final JWTUtil jwtUtil;


//member-list
@GetMapping("/member")
public ResponseEntity<List<UserDTO>> admin_member() {
    // 모든 User 엔티티를 가져옴
    List<User> users = userService.findAll();

    // User 엔티티를 UserDTO로 변환
    List<UserDTO> userDTOS = users.stream()
            .map(user -> {
                UserDTO userDTO = new UserDTO();
                userDTO.setId(user.getId());
                userDTO.setUsername(user.getUsername());
                userDTO.setPassword(user.getPassword());
                userDTO.setRole(user.getRole());
                userDTO.setStatus(user.getStatus());
                userDTO.setEmail(user.getEmail());
                //프로필 모달창을 위해..
                userDTO.setProfilePictureUrl(user.getProfilePictureUrl());
                userDTO.setBio(user.getBio());
                userDTO.setAdress(user.getAddress());
                //userDTO.setUserInterests(user.getUserInterests());
                //userDTO.setUserSkills(user.getUserSkills());

                userDTO.setOrganization(user.getOrganization());
                userDTO.setPostcode(user.getPostcode());
                userDTO.setPosition(user.getPosition());
                // 필요한 경우 다른 필드도 설정
                return userDTO;
            })
            .collect(Collectors.toList());

    return ResponseEntity.ok().body(userDTOS);
}

    @GetMapping("/board")
    public ResponseEntity<List<BoardDTO>> admin_board() {
        List<BoardEntity> boardList = boardService.findAllBoard();

        List<BoardDTO> boardDTOS = boardList.stream()
                .map(board -> {
                    BoardDTO boardDTO = new BoardDTO();
                    boardDTO.setId(board.getId());
                    boardDTO.setBoardContent(board.getBoardContents());
                    boardDTO.setBoardTitle(board.getBoardTitle());
                    boardDTO.setBoardPass(board.getBoardPass());
                    boardDTO.setBoardWriter(board.getBoardWriter());
                    return boardDTO;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(boardDTOS); // 변환된 DTO 리스트를 반환
    }
    @GetMapping("/admin")
    public ResponseEntity<List<AdminDTO>> admin_admin() {
        List<Admin> admins = adminService.findAll();

        List<AdminDTO> adminDTOS = admins.stream()
                .map(admin ->{
                    AdminDTO adminDTO = new AdminDTO();
                    adminDTO.setId(admin.getId());
                    adminDTO.setUsername(admin.getUsername());
                    adminDTO.setPassword(admin.getPassword());
                    adminDTO.setRole(admin.getRole());
                    adminDTO.setStatus(admin.getStatus());
                    return adminDTO;
                }) //collectors대신 to list 씀
                .toList();

        return ResponseEntity.ok().body(adminDTOS);
    }

    //이거 나중에 수정
    @GetMapping("/upper/admin")
    public String upper_admin() {
        return "upper admin";
    }


    @PutMapping("/member/{userId}")
    public ResponseEntity<String> updateRole(@PathVariable String userId, @RequestBody String role) {
        // 유효한 역할인지 확인
        if (!"User".equals(role) && !"Admin".equals(role)) {
            return ResponseEntity.badRequest().body("유효하지 않은 역할 값");
        }

        // 사용자 역할 업데이트
        User updatedUser = userService.updateUserRole(userId, role);
        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("역할이 성공적으로 업데이트되었습니다.");
    }


}
