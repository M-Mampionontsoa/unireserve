package com.unireserve.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;
import com.unireserve.service.Authentification.JwtAuthenticationFilter;
import com.unireserve.service.Authentification.CustomUserInfoService;
import com.unireserve.service.Authentification.GoogleJwtSuccessHandler;


@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    private CustomUserInfoService customUserInfoService;
    private GoogleJwtSuccessHandler googleJwtSuccessHandler;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,CustomUserInfoService customUserInfoService,GoogleJwtSuccessHandler googleJwtSuccessHandler)
    {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customUserInfoService = customUserInfoService;
        this.googleJwtSuccessHandler =googleJwtSuccessHandler;
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        
        http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/login","/signin").permitAll()
            .anyRequest().authenticated()    
        )
        .csrf(csrf -> csrf.disable())
        .cors(Customizer.withDefaults())
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
        .oauth2Login(oauth2 -> oauth2
            .userInfoEndpoint(userInfo ->userInfo.oidcUserService(this.customUserInfoService) )
            .successHandler(googleJwtSuccessHandler)
        );

        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        
        return new BCryptPasswordEncoder(); 
        
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
