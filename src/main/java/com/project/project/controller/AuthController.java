package com.project.project.controller;

import com.project.project.dto.TokenResponseDto;
import com.project.project.dto.UserRegistrationDto;
import com.project.project.exception.EmailAlreadyInUseException;
import com.project.project.exception.PasswordMismatchException;
import com.project.project.service.AuthenticationService;
import com.project.project.service.JwtTokenService;
import com.project.project.util.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthenticationService authenticationService;
    private final JWTUtil jwtUtil;
    private final JwtTokenService jwtTokenService;


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

    @PostMapping("/reissue")
    public ResponseEntity<Void> reissueToken(
            @CookieValue("refresh") String refreshTokenCookie,
            HttpServletResponse response){
        String email = jwtUtil.getEmail(refreshTokenCookie);
        TokenResponseDto tokenResponseDto = jwtTokenService.reissueAccessToken(refreshTokenCookie,email);

        response.setHeader("access",tokenResponseDto.getAccessToken());
        Cookie cookie = new Cookie("refreshToken", tokenResponseDto.getRefreshToken());
        cookie.setMaxAge(24*60*60);
        cookie.setHttpOnly(true);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/validate-token")
    public ResponseEntity<HttpStatus> validateToken(){
            return ResponseEntity.ok(HttpStatus.OK);
        }


//public ResponseEntity<Void> admin(@RequestHeader("access") String token) {
@PostMapping("/check-role")
public ResponseEntity<Map<String, String>> checkRole(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestHeader("access") String token,
        HttpServletResponse httpResponse,
        @RequestHeader(value = "refreshTokenCookie", required = false) String refreshTokenCookie) {

    // 사용자 권한 가져오기
    Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
    String roles = authorities.stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.joining(", "));

    // JWT 역할 확인
    String checkRole = jwtUtil.getRole(token);

    // 이메일 및 새 액세스 토큰 발급
    String email = jwtUtil.getEmail(refreshTokenCookie);
    TokenResponseDto tokenResponseDto = jwtTokenService.reissueAccessToken(refreshTokenCookie, email);

    // 응답 헤더에 액세스 토큰 설정
    httpResponse.setHeader("access", tokenResponseDto.getAccessToken());

    // 응답 맵 생성 및 데이터 추가
    Map<String, String> response = new HashMap<>();
    response.put("roles", roles);
    response.put("checkRole", checkRole);

    // JSON 응답 반환
    return ResponseEntity.ok(response);
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