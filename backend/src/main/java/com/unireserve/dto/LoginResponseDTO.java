package com.unireserve.dto;

import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
public class LoginResponseDTO {
    private String accessToken;      // Token JWT pour l'authentification
    private String refreshToken;     // Token pour rafraîchir l'accessToken
    private String tokenType;        // "Bearer"
    private Long expiresIn;          // Durée de validité en millisecondes
    private UserInfoDTO user;        // Informations de l'utilisateur
}
