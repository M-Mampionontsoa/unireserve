package com.unireserve.dto.Reservation;

import lombok.Data;
import java.time.LocalDateTime;

import com.unireserve.entity.Statut_reservation;
import com.unireserve.entity.Type_reservation;

@Data
public class ReservationResponseDto {
    private Long id;
    private LocalDateTime debut;
    private LocalDateTime fin;
    private Type_reservation type_reservation;
    private String salleNom;
    private Statut_reservation statut;
    private String warning;
    

}


