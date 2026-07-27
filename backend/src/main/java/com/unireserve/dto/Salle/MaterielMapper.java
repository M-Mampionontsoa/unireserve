package com.unireserve.dto.Salle;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.unireserve.entity.Materiel;


import java.util.List;

@Mapper(componentModel = "spring")
public interface MaterielMapper {

    Materiel toEntity(MaterielRequestDto dto);

    List<Materiel> toEntity(List<MaterielRequestDto> dtos);

    List<MaterielRequestDto> toDto(List<Materiel> materiels);

    @BeanMapping(
        nullValuePropertyMappingStrategy =
        NullValuePropertyMappingStrategy.IGNORE
    )
    void updateSalle(
            MaterielRequestDto dto,
            @MappingTarget Materiel materiel
    );

}
