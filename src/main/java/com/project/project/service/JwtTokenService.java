package com.project.project.service;

import com.project.project.dto.TokenResponseDto;
import com.project.project.entity.UserRefreshToken;
import com.project.project.repository.UserRefreshTokenRepository;
import com.project.project.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtTokenService {
    private static final Logger log = LoggerFactory.getLogger(JwtTokenService.class);
    private final UserRefreshTokenRepository userRefreshTokenRepository;
    private final JWTUtil jwtUtil;

    public TokenResponseDto reissueAccessToken(String refreshToken, String email){
        if(!jwtUtil.validateToken(refreshToken)){
            log.error("jwtTokenService");
            throw new IllegalArgumentException("Invalid Refresh Token");
        }

        UserRefreshToken storedRefreshToken = userRefreshTokenRepository.findById(email)
                .orElseThrow(() -> new IllegalArgumentException("No Refresh Token found for email"));

        if(!storedRefreshToken.refreshToken().equals(refreshToken)){
            throw new SecurityException("Refresh Token mismatch");
        }

        String newAccessToken = jwtUtil.createAccessJwt(email,jwtUtil.getRole(refreshToken));
        String newRefreshToken = jwtUtil.createRefreshJwt(email,jwtUtil.getRole(refreshToken));

        storedRefreshToken.refreshToken(newRefreshToken);
        userRefreshTokenRepository.save(storedRefreshToken);

        return new TokenResponseDto(newAccessToken,newRefreshToken);
    }
}
