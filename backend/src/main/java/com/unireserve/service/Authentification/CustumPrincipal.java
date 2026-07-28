package com.unireserve.service.Authentification;


import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import java.util.Collections;
import com.unireserve.entity.Utilisateur;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;

public class CustumPrincipal implements UserDetails,OidcUser {


    private final Utilisateur utilisateur;
    private final OidcIdToken idToken;
    private final OidcUserInfo userInfo;

    public CustumPrincipal(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
        this.idToken = null;
        this.userInfo = null;
    }


    public CustumPrincipal(Utilisateur utilisateur,OidcIdToken idToken,OidcUserInfo userInfo) 
    {
        this.utilisateur = utilisateur;
        this.idToken = idToken;
        this.userInfo = userInfo;
    }



    public Utilisateur getUtilisateur() {
        return utilisateur;
    }


    
    // Partie OAuth2
   

    @Override
    public Map<String, Object> getAttributes() {

        return Map.of(
            "email", utilisateur.getMail(),
            "name", utilisateur.getNom()
        );
    }



    
    // Partie UserDetails
   

    @Override
    public String getUsername() {
        return utilisateur.getMail();
    }


    @Override
    public String getPassword() {
        return utilisateur.getPassword();
    }

    @Override
    public String getName()
    {
        return utilisateur.getNom();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

      
    return Collections.singletonList(
            new SimpleGrantedAuthority(
                    "ROLE_" + utilisateur.getRole().name()
            )
    ); 
    }


    @Override
    public boolean isAccountNonExpired() {
        return true;
    }


    @Override
    public boolean isAccountNonLocked() {
        return true;
    }


    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }


    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public OidcIdToken getIdToken() {
        return idToken;
    }


    @Override
    public OidcUserInfo getUserInfo() {
        return userInfo;
    }

    @Override
    public Map<String, Object> getClaims() {
        return getAttributes();
    }

    
}
