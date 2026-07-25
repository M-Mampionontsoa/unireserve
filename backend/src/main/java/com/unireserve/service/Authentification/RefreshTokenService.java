package com.unireserve.service.Authentification;



import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.unireserve.entity.RefreshToken;
import com.unireserve.entity.Utilisateur;
import com.unireserve.repository.RefreshTokenRepository;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public String creerPour(Utilisateur user) {
        RefreshToken rt = new RefreshToken();
        rt.setToken(UUID.randomUUID().toString());
        rt.setUserMail(user.getMail());
        rt.setExpiration(LocalDateTime.now().plusDays(30));
        rt.setRevoked(false);
        refreshTokenRepository.save(rt);
        return rt.getToken();
    }

    public Optional<RefreshToken> valider(String token) {
        return refreshTokenRepository.findByToken(token)
            .filter(rt -> !rt.isRevoked())
            .filter(rt -> rt.getExpiration().isAfter(LocalDateTime.now()));
    }

    public void revoquer(String token) {
        refreshTokenRepository.findByToken(token)
            .ifPresent(rt -> { 
                rt.setRevoked(true); 
                refreshTokenRepository.save(rt); 
            });
    }
    
    public void revoquerTousPourUtilisateur(String userMail) {
        refreshTokenRepository.findByUserMail(userMail)
            .forEach(rt -> {
                rt.setRevoked(true);
                refreshTokenRepository.save(rt);
            });
    }
    
    public void supprimerExpires() {
        refreshTokenRepository.deleteByExpirationBefore(LocalDateTime.now());
    }
}
