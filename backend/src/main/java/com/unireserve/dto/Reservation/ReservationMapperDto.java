package com.unireserve.dto.Reservation;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.unireserve.entity.Reservation;
@Mapper(componentModel = "spring")
public interface  ReservationMapperDto {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "motif_refus", ignore = true)
    @Mapping(target = "valide_le", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "utilisateur", ignore = true)
    @Mapping(target = "admin", ignore = true)
    @Mapping(target = "salle", ignore = true)
    @Mapping(target = "type_reservation", source = "type_reservation")
    Reservation toEntity(ReservationRequest request);

    @Mapping(target = "salleNom",ignore = true)
    ReservationResponseDto toResponseDto(Reservation reservation);
}
 