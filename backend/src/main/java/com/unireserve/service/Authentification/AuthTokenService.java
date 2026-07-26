package com.unireserve.service.Authentification;
import org.springframework.stereotype.Service;
import com.unireserve.dto.TokenResponse;
import com.unireserve.entity.Utilisateur;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import java.time.Duration;
import org.springframework.http.HttpHeaders;

@Service
public class AuthTokenService {
    
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    
    public AuthTokenService(JwtService jwtService, RefreshTokenService refreshTokenService) {
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }
    
    public TokenResponse generateTokens(Utilisateur user) {
        String accessToken = jwtService.genererToken(user);
        String refreshToken = refreshTokenService.creerPour(user);
        
        return new TokenResponse(accessToken, refreshToken);
    }
    
    public void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
            .httpOnly(true)
            .secure(true)
            .path("/auth/refresh")
            .maxAge(Duration.ofDays(30))
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}



