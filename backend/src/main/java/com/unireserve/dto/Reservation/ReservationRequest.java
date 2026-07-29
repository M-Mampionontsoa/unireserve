package com.unireserve.dto.Reservation;

import java.time.LocalDateTime;

import com.unireserve.entity.Type_reservation;
import lombok.Data;

@Data
public class ReservationRequest {
    LocalDateTime debut;
    LocalDateTime fin;
    Type_reservation type_reservation;
    Long id_salle;


}
