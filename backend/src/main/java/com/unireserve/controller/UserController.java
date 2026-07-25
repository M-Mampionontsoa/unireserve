package com.unireserve.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.unireserve.dto.AuthDTO;
import com.unireserve.dto.LoginResponseDTO;
import com.unireserve.dto.SigninDTO;
import com.unireserve.dto.UserInfoDTO;
import com.unireserve.entity.Utilisateur;
import com.unireserve.entity.Exception.UserAlreadyExistExpetion;
import com.unireserve.repository.UserRepository;
import com.unireserve.service.Authentification.CustumUserDetails;
import com.unireserve.service.Authentification.JwtService;
import com.unireserve.service.Authentification.RefreshTokenService;
import java.time.Duration;
import java.net.http.HttpHeaders;
import jakarta.servlet.http.HttpServletResponse;

import com.unireserve.entity.RefreshToken;
import com.unireserve.service.UserService;

@RestController
public class UserController {
    private UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;  // ← AJOUTEZ CETTE LIGNE
    private final RefreshTokenService refreshTokenService; 

    public UserController(
            UserService userService,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            RefreshTokenService refreshTokenService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/signin")
    ResponseEntity<?> createUser(@RequestBody SigninDTO utilisateur) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Utilisateur newUser = userService.createUtilisateur(utilisateur);
            
            response.put("success", true);
            response.put("message", "Utilisateur créé avec succès");
            response.put("data", newUser);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (UserAlreadyExistExpetion e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Rôle invalide: " + e.getMessage());
            response.put("data", null);
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erreur lors de la création: " + e.getMessage());
            response.put("data", null);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private UserInfoDTO mapToUserInfo(Utilisateur user) {
        if (user == null) {
            return null;
        }
        
        UserInfoDTO userInfo = new UserInfoDTO();
        userInfo.setId(user.getId());
        userInfo.setNom(user.getNom());
        userInfo.setPrenom(user.getPrenom());
        userInfo.setUsername(user.getUsername());
        userInfo.setEmail(user.getMail());
        userInfo.setRole(user.getRole().name());
        
        return userInfo;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDTO authdto, HttpServletResponse response)
    {
        try{
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authdto.getEmail(), authdto.getPassword()));
            
            CustumUserDetails customUser = 
            (CustumUserDetails) authentication.getPrincipal();

            Utilisateur user = customUser.getUtilisateur();

            String token = jwtService.genererToken(user);
            String refreshToken = refreshTokenService.creerPour(user);

            LoginResponseDTO responses = new LoginResponseDTO();
            responses.setAccessToken(token);
            responses.setRefreshToken(refreshToken);
            responses.setTokenType("Bearer");
            responses.setExpiresIn(3600000L);
            
            
            responses.setUser(mapToUserInfo(user)); 
            

            return ResponseEntity.ok(responses);
        }
        catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", e.getMessage()));
}
    }
}