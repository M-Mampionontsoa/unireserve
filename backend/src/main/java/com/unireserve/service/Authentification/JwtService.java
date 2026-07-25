package com.unireserve.service.Authentification;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.unireserve.entity.Utilisateur;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    private static final long EXPIRATION_MS = 3600000; // 1 heure

    public String genererToken(Utilisateur user) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

        return Jwts.builder()
            .subject(user.getMail())
            .claim("role", user.getRole())
            .claim("id", user.getId())
            .claim("nom", user.getNom())
            .claim("prenom", user.getPrenom())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
            .signWith(key)
            .compact();
    }

    public String extraireEmail(String token) {
        return extraireClaims(token).getSubject();
    }

    public String extraireRole(String token) {
        return extraireClaims(token).get("role", String.class);
    }

    public Long extraireId(String token) {
        return extraireClaims(token).get("id", Long.class);
    }

    public boolean estValide(String token) {
        try {
            return !extraireClaims(token).getExpiration().before(new Date());
        } catch (Exception e) {
            return false; // signature invalide, token corrompu, expiré, etc.
        }
    }

    private Claims extraireClaims(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public String genererRefreshToken() {
        return UUID.randomUUID().toString();
    }
}
