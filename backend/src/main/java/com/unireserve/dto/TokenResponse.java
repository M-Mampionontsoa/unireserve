package com.unireserve.dto;



import lombok.Data;

@Data
public class TokenResponse {
    private String token;
    private String refreshToken;
    
    public TokenResponse(String token, String refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
    }
    
    
}
