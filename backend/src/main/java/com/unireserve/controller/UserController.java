package com.unireserve.controller;


import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.unireserve.dto.TokenResponse;
import com.unireserve.dto.AuthDTO;
import com.unireserve.dto.LoginResponseDTO;
import com.unireserve.dto.ProfileDto;
import com.unireserve.dto.RegisterResponseDTO;
import com.unireserve.dto.SigninDTO;
import com.unireserve.dto.UpdateProfileDto;
import com.unireserve.dto.UserInfoDTO;
import com.unireserve.entity.Utilisateur;
import com.unireserve.entity.Exception.UserAlreadyExistExpetion;
import com.unireserve.service.Authentification.AuthTokenService;
import com.unireserve.service.Authentification.CustumPrincipal;
import com.unireserve.service.Authentification.RefreshTokenService;
import org.springframework.http.HttpHeaders;   
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.PutMapping;
import com.unireserve.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
public class UserController {
    private UserService userService;
    private final AuthenticationManager authenticationManager;
    private final AuthTokenService authTokenService;
    private final RefreshTokenService refreshTokenService;
    
    //private final Authentication authentication;

    public UserController(
            UserService userService,
            AuthenticationManager authenticationManager,AuthTokenService authTokenService,RefreshTokenService refreshTokenService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.authTokenService=authTokenService;
        this.refreshTokenService=refreshTokenService;
    }

    @PostMapping("/signin")
    ResponseEntity<?> createUser(@RequestBody SigninDTO utilisateur) {
            RegisterResponseDTO response = new RegisterResponseDTO();
        
        try {
            Utilisateur newUser = userService.createUtilisateur(utilisateur);
            response.setSuccess(true);
            response.setMessage("Utilisateur créé avec succès");
            response.setId(newUser.getId());
            response.setNom(newUser.getNom());
            response.setPrenom(newUser.getPrenom());
            response.setUsername(newUser.getUsername());
            response.setEmail(newUser.getMail());
            response.setRole(newUser.getRole());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
            
            
        } catch (UserAlreadyExistExpetion e) {
            response.setSuccess(false);
            response.setMessage("email ou nom d'utilisateur déja existant");
            response.setId(null);
            response.setNom(null);
            response.setPrenom(null);
            response.setUsername(null);
            response.setEmail(null);
            response.setRole(null);
            
          return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            
        } catch (IllegalArgumentException e) {
            response.setSuccess(false);
            response.setMessage("Argument incompatible");
            response.setId(null);
            response.setNom(null);
            response.setPrenom(null);
            response.setUsername(null);
            response.setEmail(null);
            response.setRole(null);
            
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("email ou nom d'utilisateur déja existant" + e.getMessage());
            response.setId(null);
            response.setNom(null);
            response.setPrenom(null);
            response.setUsername(null);
            response.setEmail(null);
            response.setRole(null);
            
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
        userInfo.setProfileCompleted(user.isProfileCompleted());
        
        return userInfo;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDTO authdto, HttpServletResponse response)
    {
        try{
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authdto.getEmail(), authdto.getPassword()));
            
            CustumPrincipal principal = (CustumPrincipal) authentication.getPrincipal();

            Utilisateur user = principal.getUtilisateur();

            TokenResponse tokens = authTokenService.generateTokens(user);

            authTokenService.setRefreshTokenCookie(
                response,
                tokens.getRefreshToken()
            );

            LoginResponseDTO dto = new LoginResponseDTO();

            dto.setAccessToken(tokens.getToken());
            dto.setTokenType("Bearer");
            dto.setExpiresIn(3600000L);
            dto.setUser(mapToUserInfo(user));

            return ResponseEntity.ok(dto);
        }
        catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", e.getMessage()));
        }
    } 

    @GetMapping("/me")
    public ResponseEntity<UserInfoDTO> me(
            @AuthenticationPrincipal CustumPrincipal principal
    ) {

        Utilisateur user = principal.getUtilisateur();

        return ResponseEntity.ok(mapToUserInfo(user));
    }

    
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @CookieValue(name = "refreshToken", required = false) String refreshToken
    ) {
        if (refreshToken == null || refreshToken.isBlank()) {
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Refresh token absent"));
        }
    
        try {
            TokenResponse response = authTokenService.refresh(refreshToken);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token invalide"));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication)
    {
        
        CustumPrincipal principal =
            (CustumPrincipal) authentication.getPrincipal();


        Utilisateur utilisateur =
            principal.getUtilisateur();
        
        ProfileDto response = userService.getProfileInfo(utilisateur);

        return ResponseEntity.ok(response);
    } 

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileDto updateProfileDto ,Authentication authentication)
    {
        CustumPrincipal principal =
            (CustumPrincipal) authentication.getPrincipal();


        Utilisateur utilisateur =
            principal.getUtilisateur();
        
        utilisateur = userService.updateProfile(updateProfileDto, utilisateur);

        return ResponseEntity.ok(utilisateur);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {

        if (refreshToken != null) {
            refreshTokenService.revoquer(refreshToken); 
        }

        ResponseCookie expired = ResponseCookie.from("refreshToken", "")
            .httpOnly(true)
            .secure(false)
            .sameSite("Lax")
            .path("/")
            .maxAge(0)   // supprime le cookie côté navigateur
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, expired.toString());

        return ResponseEntity.ok().build();
    }
}