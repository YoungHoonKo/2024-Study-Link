package com.project.project.config;

import com.project.project.repository.RefreshTokenRepository;
import com.project.project.util.CustomLogoutFilter;
import com.project.project.util.JWTFilter;
import com.project.project.util.JWTUtil;
import com.project.project.util.LoginFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;


@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JWTUtil JWTUtil
    ,RefreshTokenRepository refreshTokenRepository){
        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = JWTUtil;
        this.refreshTokenRepository = refreshTokenRepository;
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception{
        return configuration.getAuthenticationManager();
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .httpBasic( basic -> basic.disable())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/start","/","/api/auth/login","/api/auth/register","/login",
                                "/register","/css/**","/js/**","/images/**","/reissue")
                        .permitAll()
                        .requestMatchers("/user/**","/test").hasRole("USER")
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()

                )
                .addFilterBefore(new JWTFilter(jwtUtil),LoginFilter.class)
                .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil,refreshTokenRepository), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new CustomLogoutFilter(jwtUtil,refreshTokenRepository), LogoutFilter.class)
                .formLogin(form -> form.disable()
                )
                .logout(logout ->
                        logout.permitAll()
                ).sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


}
