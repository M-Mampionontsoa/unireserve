package com.unireserve.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.unireserve.entity.Utilisateur;

@Repository
public interface UserRepository extends JpaRepository<Utilisateur,Long> {
    Optional<Utilisateur> findByMail(String email);
    
} 
