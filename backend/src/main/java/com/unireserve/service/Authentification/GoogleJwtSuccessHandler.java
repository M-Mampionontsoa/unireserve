package com.unireserve.service.Authentification;
import org.springframework.stereotype.Component;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.unireserve.entity.Utilisateur;
import com.unireserve.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import com.unireserve.dto.TokenResponse;
@Component
public class GoogleJwtSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final AuthTokenService authTokenService;

    public GoogleJwtSuccessHandler(UserRepository userRepository, AuthTokenService authTokenService) {
        this.userRepository = userRepository;
        this.authTokenService = authTokenService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                         Authentication authentication) throws IOException {

        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
        Utilisateur user = userRepository.findByMail(oidcUser.getEmail()).orElseThrow();

        // Utiliser le même service unifié
        TokenResponse tokens = authTokenService.generateTokens(user);
        authTokenService.setRefreshTokenCookie(response, tokens.getRefreshToken());

        // Rediriger avec l'access token en paramètre
        response.sendRedirect("http://localhost:5173/callback?token=" + tokens.getToken());
    }
}
