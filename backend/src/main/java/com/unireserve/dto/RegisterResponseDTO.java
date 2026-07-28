package com.unireserve.dto;

import lombok.Data;
import com.unireserve.entity.Role;

@Data
public class RegisterResponseDTO {

    private boolean success;
    private String message;
    private Long id;
    private String nom;
    private String prenom;
    private String username;
    private String email;
    private Role role;

    
}
