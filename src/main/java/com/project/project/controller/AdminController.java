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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

        System.out.println(boardDTOS);
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






}
