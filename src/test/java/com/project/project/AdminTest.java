package com.project.project;


import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@SpringBootTest
public class AdminTest {

    @Test
    @DisplayName("admin_js checkrole")
    void admin_js_checkrole() {

    }
    //테스트 코드 작성하기 위해서 코드 일부 가져옴.
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
