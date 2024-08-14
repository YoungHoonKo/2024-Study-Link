package com.project.project.config;

import com.project.project.repository.BlackListRepository;
import com.project.project.repository.UserRepository;
import com.project.project.service.LogoutService;
import com.project.project.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JWTUtil jwtUtil;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final BlackListRepository blackListRepository;


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationManager authenticationManager, UserRepository userRepository, LogoutService logoutService) throws Exception {
        http
                .httpBasic(basic -> basic.disable())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/start", "/", "/api/auth/register","/login","/admin",
                                "/register", "/css/**", "/js/**", "/images/**", "/reissue", "/board/**"
                        ,"/403","/404","/mypage","/api/auth/register","/api/auth/reissue","/profile").permitAll()

                        .requestMatchers("/user/**","/api/auth/validate-token","/api/auth/check-role","/api/user/**").hasRole("USER")
                        .requestMatchers("/api/auth/check-role").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception
                        .accessDeniedHandler(customAccessDeniedHandler)
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                )
                .addFilterBefore(new JWTFilter(jwtUtil,blackListRepository), LoginFilter.class)
                .addFilterAt(new LoginFilter(authenticationManager, jwtUtil), UsernamePasswordAuthenticationFilter.class)
                .formLogin(form -> form.disable())
                .logout(logout ->
                        logout.logoutUrl("/logout")
                                .addLogoutHandler(logoutService)
                                .logoutSuccessHandler(((request, response, authentication) -> SecurityContextHolder.clearContext())))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}