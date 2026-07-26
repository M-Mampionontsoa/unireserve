package com.unireserve.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.unireserve.dto.SigninDTO;
import com.unireserve.entity.Admin;
import com.unireserve.entity.Enseignant;
import com.unireserve.entity.Etudiant;
import com.unireserve.entity.Association;
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
        Role selectedRole = Role.valueOf(utilisateur.getRole().toUpperCase());

Utilisateur newUtilisateur;

        switch (selectedRole) {
        
            case ETUDIANT:
                newUtilisateur = new Etudiant();
                break;
        
            case ENSEIGNANT:
                newUtilisateur = new Enseignant();
                break;
        
            case ASSOCIATION:
                newUtilisateur = new Association();
                break;
        
            case ADMIN:
                newUtilisateur = new Admin();
                break;
        
            default:
                throw new IllegalArgumentException("Rôle inconnu");
        }
        newUtilisateur.setNom(utilisateur.getName());
        newUtilisateur.setPrenom(utilisateur.getFirstName());
        newUtilisateur.setUsername(utilisateur.getUsername());
        newUtilisateur.setMail(utilisateur.getEmail());
        newUtilisateur.setPassword(passwordEncoder.encode(utilisateur.getPassword()));
        newUtilisateur.setRole(selectedRole);
        newUtilisateur.setCreatedAt(LocalDateTime.now());
        newUtilisateur.setUpdatedAt(LocalDateTime.now());
            
        return userRepository.save(newUtilisateur);
    }
}   