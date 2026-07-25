package com.unireserve.service.Authentification;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import com.unireserve.entity.Utilisateur;
import java.util.Collections;

public class CustumUserDetails implements UserDetails{
    private Utilisateur user;

    public CustumUserDetails(Utilisateur user)
    {
        this.user=user;
    }

    @Override
    public String getUsername()
    {
        return user.getMail();
    }

    
    public String getMail()
    {
        return user.getMail();
    }

    public Utilisateur getUtilisateur(){
        return user;
    }

    @Override
    public String getPassword()
    {
        return user.getPassword();
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities()
    {
        return Collections.singletonList(new SimpleGrantedAuthority( user.getRole().name()));
    }

   
}
