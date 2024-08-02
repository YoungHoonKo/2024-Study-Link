package com.project.project.controller;

import com.project.project.dto.UserRegistrationDto;
import com.project.project.exception.EmailAlreadyInUseException;
import com.project.project.exception.PasswordMismatchException;
import com.project.project.service.AuthenticationService;
import com.project.project.util.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationService authenticationService;
    @Autowired
    private JWTUtil jwtUtil;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody UserRegistrationDto userRegistrationDto) {
        try {
            authenticationService.signup(userRegistrationDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse(true, "회원가입 성공!"));
        } catch (EmailAlreadyInUseException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse(false, "이미 사용 중인 이메일입니다."));
        } catch (PasswordMismatchException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, "비밀번호가 일치하지 않습니다."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "서버 오류가 발생했습니다."));
        }
    }

    @PostMapping("/validate-token")
    public ResponseEntity<HttpStatus> validateToken(@RequestBody String token){
            return ResponseEntity.ok(HttpStatus.OK);
        }



    static class ApiResponse {
        private boolean success;
        private String message;

        public ApiResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }
    }

    @PostMapping("/check-role")
    public Map<String, String> checkRole(@AuthenticationPrincipal UserDetails userDetails){
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        String roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(", "));

        System.out.println("User roles: " + roles);
        Map<String, String> response = new HashMap<>();
        response.put("roles", roles);
        return response;
    }
}