package com.unireserve.dto.Salle;

import java.time.LocalDateTime;

import lombok.Data;
import java.util.List;

@Data
public class SalleRequestDto {
    String nom;

    String type;

    int capacite;

    int quantite;

    String etat;

    LocalDateTime date_acquisition;
    
    private List<MaterielRequestDto> materiels;
   
}
 