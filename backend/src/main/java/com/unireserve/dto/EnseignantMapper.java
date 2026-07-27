package com.unireserve.dto;



import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;


import com.unireserve.entity.Enseignant;


@Mapper(componentModel = "spring")
public interface EnseignantMapper {


    EnseignantDto toProfileDto(Enseignant enseignant);



    @BeanMapping(
        nullValuePropertyMappingStrategy =
        NullValuePropertyMappingStrategy.IGNORE
    )
    void updateEnseignant(
            UpdateEnseignantDto dto,
            @MappingTarget Enseignant enseignant
    );

}
