package com.unireserve.entity;

import jakarta.persistence.Id;
import lombok.Data;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.time.LocalDateTime;

@Data
@Entity
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;           // une chaîne aléatoire, pas forcément un JWT
    private String userMail;
    private LocalDateTime expiration;
    private boolean revoked;
}
