package com.unireserve.dto;





import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.unireserve.entity.Role;
import lombok.Data;

@Data
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes({
    @JsonSubTypes.Type(
        value = UpdateEtudiantDto.class,
        name = "ETUDIANT"
    ),
    @JsonSubTypes.Type(
        value = UpdateEnseignantDto.class,
        name = "ENSEIGNANT"
    ),
    @JsonSubTypes.Type(
        value = UpdateAdminDto.class,
        name = "ADMIN"
    ),
    @JsonSubTypes.Type(
        value = UpdateAssociationDto.class,
        name = "ASSOCIATION"
    )
})
public class UpdateProfileDto {

    private String nom;
    private String prenom;
    private String username;
    private String mail;
    private boolean profileCompleted;
    
}
 