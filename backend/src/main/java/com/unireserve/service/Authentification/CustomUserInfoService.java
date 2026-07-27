package com.unireserve.service.Authentification;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import java.util.Optional;
import com.unireserve.entity.Utilisateur;
import java.util.List;

import com.unireserve.repository.UserRepository;

@Service
public class CustomUserInfoService extends OidcUserService{
    
    private UserRepository userRepository;
    

    public CustomUserInfoService(UserRepository userRepository)
    {
        this.userRepository=userRepository;
        
    }
    @Override 
    public OidcUser loadUser(OidcUserRequest oidcUserRequest) throws OAuth2AuthenticationException
    {
       OidcUser oidcUser = super.loadUser(oidcUserRequest);
       String nom = oidcUser.getFamilyName();
       
       String prenom = oidcUser.getGivenName();
       String email = oidcUser.getEmail();
       String username= (oidcUser.getFullName() == null ) ?  email.split("@")[0] : oidcUser.getFullName();
       
       String id= oidcUser.getSubject();
       if(nom == null)
            nom = username;
       if(prenom == null)
            prenom = "nan";
       Optional<Utilisateur> user = userRepository.findByMail(oidcUser.getEmail());
       Utilisateur userFinal = null;

       if(!user.isPresent())
       {
            Utilisateur newUser = new Utilisateur();
            newUser.setOauthId(id);
            newUser.setOauthProvider("Google");
            newUser.setNom(nom);
            newUser.setPrenom(prenom);
            newUser.setUsername(username);
            newUser.setMail(email);
            newUser.setPassword(null);
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setUpdatedAt(LocalDateTime.now());
            newUser.setRole(com.unireserve.entity.Role.PENDING);

            userFinal=userRepository.save(newUser);
            
            

       }
       else
       {
          Utilisateur userReel = user.get();
          userFinal=userReel;
       }
       

      return new CustumPrincipal(
        userFinal,
        oidcUser.getIdToken(),
        oidcUser.getUserInfo()
          );
    }


}
