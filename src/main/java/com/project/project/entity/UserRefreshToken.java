package com.project.project.entity;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.util.concurrent.TimeUnit;

@RedisHash(value = "refresh")
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true, fluent = true)
public class UserRefreshToken {
    @Id
    private String id;

    private String refreshToken;

    @TimeToLive(unit = TimeUnit.MILLISECONDS)
    private Long expiration;

    public UserRefreshToken(String email, String refreshToken, Long expiration){
        this.id = email;
        this.refreshToken = refreshToken;
        this.expiration = expiration;
    }
}
