package com.unireserve.dto;



import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;


import com.unireserve.entity.Utilisateur;

@Mapper(componentModel = "spring")
public interface UserMapper {


    // Entity -> DTO
    ProfileDto toProfileDto(Utilisateur utilisateur);


    // PATCH : DTO -> Entity
    @BeanMapping(
        nullValuePropertyMappingStrategy = 
        NullValuePropertyMappingStrategy.IGNORE
    )
    void updateUser(
            UpdateProfileDto dto,
            @MappingTarget Utilisateur utilisateur
    );
}
