package com.project.project.entity;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.util.concurrent.TimeUnit;

@RedisHash("black")
@Getter @Setter
@Accessors(chain = true, fluent = true)
@NoArgsConstructor
public class BlackList {
    @Id
    private String id; // 로그아웃된 Access Token

    private String accessToken;

    @TimeToLive(unit = TimeUnit.MILLISECONDS) // LogoutService가 남은 시간을 ms로 계산함
    private Long expiration;
}
