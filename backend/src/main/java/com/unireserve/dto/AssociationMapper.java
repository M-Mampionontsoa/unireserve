package com.unireserve.dto;



import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;


import com.unireserve.entity.Association;


@Mapper(componentModel = "spring")
public interface AssociationMapper {


    AssociationDto toProfileDto(Association association);



    @BeanMapping(
        nullValuePropertyMappingStrategy =
        NullValuePropertyMappingStrategy.IGNORE
    )
    void updateAssociation(
            UpdateAssociationDto dto,
            @MappingTarget Association association
    );

}
