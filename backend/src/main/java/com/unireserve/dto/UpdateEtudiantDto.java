package com.unireserve.dto;



import com.unireserve.entity.Niveau;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UpdateEtudiantDto extends UpdateProfileDto {

    private String faculte;

    private String mention;

    private String parcours;

    private String numeroInscription;

    private Niveau niveau;
}
