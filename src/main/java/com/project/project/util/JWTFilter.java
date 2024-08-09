package com.project.project.util;

import com.project.project.repository.BlackListRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;
    private final BlackListRepository blackListRepository;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String accessToken = request.getHeader("access");

        try {
            if(accessToken != null && jwtUtil.validateToken(accessToken)){
                if(blackListRepository.existsById(accessToken)){
                    log.warn("Access token is blacklisted: {}", accessToken);
                    SecurityContextHolder.clearContext();
                }else{
                    Authentication authentication = jwtUtil.getAuthentication(accessToken);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.info("Save authentication in SecurityContextHolder.");
                }
            }
        }catch (ExpiredJwtException e){
            log.warn("Access token expired: {}", accessToken);
            SecurityContextHolder.clearContext();
        }catch (Exception e){
            log.error("An error occurred during token processing", e);
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "An error occurred during token processing");
            return;
        }

        filterChain.doFilter(request,response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request){
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/**");
    }
}
