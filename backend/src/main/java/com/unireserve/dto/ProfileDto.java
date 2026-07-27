package com.unireserve.dto;



import com.unireserve.entity.Role;
import lombok.Data;

@Data
public class ProfileDto {

    private Long id;

    private String nom;

    private String prenom;

    private String username;

    private String mail;

    private Role role;
}