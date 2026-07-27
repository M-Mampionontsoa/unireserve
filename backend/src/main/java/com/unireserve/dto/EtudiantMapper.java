package com.unireserve.dto;



import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;


import com.unireserve.entity.Etudiant;


@Mapper(componentModel = "spring")
public interface EtudiantMapper {


    // Entity -> DTO

    EtudiantDto toProfileDto(Etudiant etudiant);



    // PATCH

    @BeanMapping(
        nullValuePropertyMappingStrategy =
        NullValuePropertyMappingStrategy.IGNORE
    )
    void updateEtudiant(
            UpdateEtudiantDto dto,
            @MappingTarget Etudiant etudiant
    );

}
