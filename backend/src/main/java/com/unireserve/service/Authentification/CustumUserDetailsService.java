package com.unireserve.service.Authentification;

import org.springframework.stereotype.Service;

import com.unireserve.entity.Utilisateur;
import com.unireserve.repository.UserRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

@Service 
public class CustumUserDetailsService implements UserDetailsService {
    private UserRepository userRepository;

    public CustumUserDetailsService(UserRepository userRepository)
    {
        this.userRepository=userRepository;
    }

    public UserDetails loadUserByUsername(String email)
    {
        Utilisateur user = userRepository.findByMail(email).orElseThrow(() -> new RuntimeException("User not found"));

        return (new CustumUserDetails(user));
    }
}
