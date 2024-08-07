package com.project.project.util;

import com.project.project.dto.CustomUserDetails;
import com.project.project.entity.UserRefreshToken;
import com.project.project.repository.UserRefreshTokenRepository;
import com.project.project.service.CustomUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JWTUtil {
    private final SecretKey secretKey;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;
    private final CustomUserDetailsService customUserDetailsService;
    private final UserRefreshTokenRepository userRefreshTokenRepository;

    public JWTUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.accessTokenExpiration}") Long accessTokenExpiration,
                   @Value("${jwt.refreshTokenExpiration}") Long refreshTokenExpiration,
                   CustomUserDetailsService customUserDetailsService,
                   UserRefreshTokenRepository userRefreshTokenRepository
    ) {
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
        this.customUserDetailsService = customUserDetailsService;
        this.userRefreshTokenRepository = userRefreshTokenRepository;
    }

    public Boolean validateToken(String token){
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        }catch (SignatureException e){
            log.error("Invalid JWT signature.");
        }catch (MalformedJwtException e){
            log.error("Invalid JWT token.");
        }catch (ExpiredJwtException e){
            log.error("Expireed JWT token.");
        }catch (UnsupportedJwtException e){
            log.error("Unsupported JWT token");
        }catch (IllegalArgumentException e){
            log.error("JWT claims string is empty");
        }catch (NullPointerException e){
            log.error("JWT Token is empty");
        }
        return false;
    }

    public String getEmail(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("email", String.class);
    }

    public String getRole(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
    }

    public String getCategory(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("category", String.class);
    }

    public Boolean isExpired(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }

    public Date getExpirationDate(String token){
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload().
                getExpiration();
    }

    public Authentication getAuthentication(String token){
        CustomUserDetails userDetails = customUserDetailsService.loadUserByUsername(getEmail(token));
        return new UsernamePasswordAuthenticationToken(userDetails,"",userDetails.getAuthorities());
    }

    public String createAccessJwt(String email, String role) {
        return Jwts.builder()
                .claim("category", "access")
                .claim("email", email)
                .claim("role", role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(secretKey)
                .compact();
    }
    public String createRefreshJwt(String email, String role) {
        String refreshToken = Jwts.builder()
                .claim("category", "refresh")
                .claim("email", email)
                .claim("role", role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(secretKey)
                .compact();

        UserRefreshToken userRefreshToken = new UserRefreshToken(email,refreshToken,refreshTokenExpiration);
        userRefreshTokenRepository.save(userRefreshToken);
        log.info("refreshtiem");
        return refreshToken;
    }
}
