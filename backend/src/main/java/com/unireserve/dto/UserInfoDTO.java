package com.unireserve.dto;



import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String username;
    private String email;
    private String role;
    private boolean profileCompleted;
}