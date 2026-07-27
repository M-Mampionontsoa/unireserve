package com.unireserve.dto.Salle;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class MaterielRequestDto {
    private String nom;
    private String type;
    private int quantite;
    private String etat;
    private LocalDateTime date_acquisition;
}
