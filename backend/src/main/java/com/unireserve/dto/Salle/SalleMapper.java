package com.unireserve.dto.Salle;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import com.unireserve.entity.Salle;

@Mapper(componentModel = "spring", uses = MaterielMapper.class)
public interface SalleMapper {

    Salle toEntity(SalleRequestDto dto);

    SalleRequestDto toSalleRequestDto(Salle salle);

    SalleResponseDto toResponseDto(Salle salle);

    @BeanMapping(
        nullValuePropertyMappingStrategy =
        NullValuePropertyMappingStrategy.IGNORE
    )
    void updateSalle(
            SalleRequestDto dto,
            @MappingTarget Salle salle
    );
}
