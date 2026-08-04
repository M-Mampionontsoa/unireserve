package com.unireserve.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;
import com.unireserve.service.Authentification.JwtAuthenticationFilter;
import com.unireserve.service.Authentification.CustomUserInfoService;
import com.unireserve.service.Authentification.GoogleJwtSuccessHandler;
import java.time.Duration;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserInfoService customUserInfoService;
    private final GoogleJwtSuccessHandler googleJwtSuccessHandler;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CustomUserInfoService customUserInfoService,
            GoogleJwtSuccessHandler googleJwtSuccessHandler
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customUserInfoService = customUserInfoService;
        this.googleJwtSuccessHandler = googleJwtSuccessHandler;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/signin", "/refresh").permitAll()
                // Protège /salles ET tous ses sous-dossiers (/salles/1, /salles/create...)
                .requestMatchers(HttpMethod.GET, "/salles/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/salles/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/salles/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/salles/**").hasRole("ADMIN")
                .requestMatchers("/reservations/enAttente","/reservations/refuse","/reservations/valide","/reservations/*/refuser","/reservations/*/valider","/reservations/block").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .exceptionHandling(exception -> exception
                // Renvoie un vrai 401 Unauthorized en REST au lieu de rediriger vers Google
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo.oidcUserService(this.customUserInfoService))
                .successHandler(googleJwtSuccessHandler)
            );

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder
                .withJwkSetUri("https://www.googleapis.com/oauth2/v3/certs")
                .build();

        // Ajoute une tolérance de 60 secondes sur la vérification de l'heure (iat / exp)
        JwtTimestampValidator timestampValidator = new JwtTimestampValidator(Duration.ofSeconds(60));
        
        jwtDecoder.setJwtValidator(timestampValidator);
        return jwtDecoder;
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