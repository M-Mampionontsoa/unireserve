package com.unireserve.service.Authentification;
import org.springframework.stereotype.Service;
import com.unireserve.dto.TokenResponse;
import com.unireserve.entity.Utilisateur;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import java.time.Duration;
import org.springframework.http.HttpHeaders;
import com.unireserve.entity.RefreshToken;
import com.unireserve.repository.UserRepository;

@Service
public class AuthTokenService {
    
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    
    public AuthTokenService(JwtService jwtService, RefreshTokenService refreshTokenService,UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository=userRepository;
        this.refreshTokenService = refreshTokenService;
    }
    
    public TokenResponse generateTokens(Utilisateur user) {
        String accessToken = jwtService.genererToken(user);
        String refreshToken = refreshTokenService.creerPour(user);
        
        return new TokenResponse(accessToken, refreshToken);
    }

    public TokenResponse refresh(String refreshToken){

        RefreshToken token =
                refreshTokenService.find(refreshToken).orElseThrow(() -> new RuntimeException("Refresh Token nt found"));

        Utilisateur user = userRepository.findByMail(token.getUserMail()).orElseThrow(() -> new RuntimeException("User not fund"));
                

        String accessToken =
                jwtService.genererToken(user);

        return new TokenResponse(accessToken,null);

    }
    
    public void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
            .httpOnly(true)
            .secure(false)
            .sameSite("Lax")
            .path("/")
            .maxAge(Duration.ofDays(30))
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}



