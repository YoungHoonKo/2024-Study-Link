package com.project.project.service;

import com.project.project.entity.BlackList;
import com.project.project.repository.BlackListRepository;
import com.project.project.repository.UserRefreshTokenRepository;
import com.project.project.util.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class LogoutService implements LogoutHandler {
    private final UserRefreshTokenRepository userRefreshTokenRepository;
    private final JWTUtil jwtUtil;
    private final BlackListRepository blackListRepository;

    @Transactional
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String accessToken = request.getHeader("access");

        if (accessToken == null){
            log.error("Access Token 없음.");
            throw new RuntimeException("access token 없음.");
        }

        try {
            if(!jwtUtil.validateToken(accessToken)){
                log.error("유효하지 않은 토큰");
                throw new RuntimeException("유효하지 않은 Access token");
            }
            String email = jwtUtil.getEmail(accessToken);
            userRefreshTokenRepository.deleteById(email);

            long expiration = Duration.between(Instant.now(), jwtUtil.getExpirationDate(accessToken)
                    .toInstant()).toMillis();

            BlackList blackList = new BlackList()
                    .id(email)
                    .accessToken(accessToken)
                    .expiration(expiration);
            blackListRepository.save(blackList);

            log.info(" User {} successfully logged out", email);
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("Logout");
        } catch (Exception e) {
            log.error("로그아웃 중 오류 발생: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            try {
                response.getWriter().write("Logout failed");
            } catch (Exception ex) {
                log.error("응답 작성 중 오류 발생: {}", ex.getMessage());
            }
        }
    }
}
