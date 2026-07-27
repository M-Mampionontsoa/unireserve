package com.unireserve.dto.Salle;
import java.util.List;
import lombok.Data;

@Data
public class SalleResponseDto {

    private Long id;

    private String nom;

    private String type;

    private int capacite;

    private List<MaterielRequestDto> materiels;
}
