package com.unireserve.dto;



import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UpdateEnseignantDto extends UpdateProfileDto {

    private String faculte;

    private String mention;

    private String parcours;

    private String numeroMatricule;

    private String matiereEnseignee;
}
 