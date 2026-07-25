package com.unireserve.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.unireserve.dto.SigninDTO;
import com.unireserve.entity.Role;
import com.unireserve.entity.Utilisateur;
import com.unireserve.entity.Exception.UserAlreadyExistExpetion;
import com.unireserve.repository.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; 

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Utilisateur createUtilisateur(SigninDTO utilisateur) {

        Optional<Utilisateur> user = userRepository.findByMail(utilisateur.getEmail());
        if(user.isPresent())
        {
             throw new UserAlreadyExistExpetion("Un utilisateur avec l'email " + utilisateur.getEmail() + " existe déjà");
        }
        Utilisateur newUtilisateur = new Utilisateur();
        String encodedPassword = passwordEncoder.encode(utilisateur.getPassword());
        newUtilisateur.setPassword(encodedPassword);
        newUtilisateur.setNom(utilisateur.getName());
        newUtilisateur.setPrenom(utilisateur.getFirstName());
        newUtilisateur.setMail(utilisateur.getEmail());
        newUtilisateur.setUsername(utilisateur.getUsername());
        newUtilisateur.setCreatedAt(LocalDateTime.now());
        newUtilisateur.setUpdatedAt(LocalDateTime.now());
        Role selectedRole = Role.valueOf(utilisateur.getRole().toUpperCase());
        newUtilisateur.setRole(selectedRole);



        return userRepository.save(newUtilisateur);
    }
}   