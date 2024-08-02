package com.project.project.controller;

import com.project.project.dto.UserRegistrationDto;
import com.project.project.exception.EmailAlreadyInUseException;
import com.project.project.exception.PasswordMismatchException;
import com.project.project.service.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationService authenticationService;

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
}