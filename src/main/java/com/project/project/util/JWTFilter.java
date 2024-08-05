package com.project.project.util;

import com.project.project.dto.CustomUserDetails;
import com.project.project.entity.RefreshToken;
import com.project.project.entity.User;
import com.project.project.repository.RefreshTokenRepository;
import com.project.project.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.Optional;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    public JWTFilter(JWTUtil jwtUtil, RefreshTokenRepository refreshTokenRepository,UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String accessToken = request.getHeader("access");
        System.out.println(accessToken);
        if (accessToken == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            jwtUtil.isExpired(accessToken);
        } catch (ExpiredJwtException e) {
            System.out.println(e.getMessage());
            String refresh = null;
            Cookie[] cookies = request.getCookies();
            for (Cookie cookie : cookies) {

                if (cookie.getName().equals("refresh")) {
                    refresh = cookie.getValue();
                }
            }

            if (refresh == null) {

                //response status code
                PrintWriter writer = response.getWriter();
                writer.print("refresh token null");

                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }


            // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
            String category = jwtUtil.getCategory(refresh);

            if (!category.equals("refresh")) {

                //response status code
                PrintWriter writer = response.getWriter();
                writer.print("invalid refresh token");

                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }

            Boolean isExist = refreshTokenRepository.existsByRefresh(refresh);
            if (!isExist) {
                PrintWriter writer = response.getWriter();
                writer.print("invalid refresh token");

                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }

            String username = jwtUtil.getEmail(refresh);
            String role = jwtUtil.getRole(refresh);

            //make new JWT
            String newAccess = jwtUtil.createAccessJwt(username, role);
            String newRefresh = jwtUtil.createRefreshJwt(username, role);

            refreshTokenRepository.deleteByRefresh(refresh);
            addRefreshToken(username, newRefresh, 86400000L);
            //response
            response.setHeader("access", newAccess);
            response.addCookie(createCookie("refresh", newRefresh));

        }

        String category = jwtUtil.getCategory(accessToken);

        if (!category.equals("access")) {
            PrintWriter writer = response.getWriter();
            writer.print("invaild access token");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String username = jwtUtil.getEmail(accessToken);
        Optional<User> userOptional = userRepository.findByEmail(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setEmail(username);
            user.setRole(jwtUtil.getRole(accessToken));
            CustomUserDetails customUserDetails = new CustomUserDetails(user);

            Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authToken);
        } else {
            PrintWriter writer = response.getWriter();
            writer.print("user not found");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        filterChain.doFilter(request, response);
    }

    private void addRefreshToken(String username, String refresh, Long expriration) {
        Date date = new Date(System.currentTimeMillis() + expriration);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUsername(username);
        refreshToken.setRefresh(refresh);
        refreshToken.setExpiration(date.toString());

        refreshTokenRepository.save(refreshToken);
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24 * 60 * 60);
        cookie.setHttpOnly(true);
        return cookie;
    }
}
