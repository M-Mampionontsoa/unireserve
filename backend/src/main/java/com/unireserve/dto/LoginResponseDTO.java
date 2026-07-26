package com.unireserve.dto;



import lombok.Data;

@Data

public class LoginResponseDTO {
    private String accessToken;      // Token JWT pour l'authentification
    private String refreshToken;     // Token pour rafraîchir l'accessToken
    private String tokenType;        // "Bearer"
    private Long expiresIn;          // Durée de validité en millisecondes
    private UserInfoDTO user;        // Informations de l'utilisateur
}
