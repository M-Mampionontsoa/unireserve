package com.unireserve.dto;



import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;


import com.unireserve.entity.Admin;


@Mapper(componentModel = "spring")
public interface AdminMapper {


    AdminProfileDto toProfileDto(Admin admin);



    @BeanMapping(
        nullValuePropertyMappingStrategy =
        NullValuePropertyMappingStrategy.IGNORE
    )
    void updateAdmin(
            UpdateAdminDto dto,
            @MappingTarget Admin admin
    );

}
