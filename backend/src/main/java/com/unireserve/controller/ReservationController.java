package com.unireserve.controller;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.unireserve.dto.Reservation.ReservationRequest;
import com.unireserve.dto.Reservation.ReservationResponseDto;
import com.unireserve.entity.Utilisateur;
import com.unireserve.service.ReservationService;
import com.unireserve.service.Authentification.CustumPrincipal;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {
    private ReservationService reservationService;
    private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);

    public ReservationController(ReservationService reservationService)
    {
        this.reservationService=reservationService;
    }

    @PostMapping
    public ResponseEntity<?> reserve(@RequestBody ReservationRequest reservationRequest,Authentication authentication)
    {
        CustumPrincipal custumPrincipal = (CustumPrincipal) authentication.getPrincipal();

        Utilisateur utilisateur = custumPrincipal.getUtilisateur();

        try
        {
            ReservationResponseDto reservationResponseDto = reservationService.reserve(reservationRequest, utilisateur);
            return ResponseEntity.status(HttpStatus.CREATED).body(reservationResponseDto);
        }
        catch(RuntimeException e)
        {
            logger.error("Erreur lors de la réservation: {}", e.getMessage(), e);
            
            
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage(),
                "timestamp", LocalDateTime.now()
            ));
        }
        

    }

    @GetMapping("/salle/{id}")
    public ResponseEntity<?> getReservation(@PathVariable Long id)
    {
        List<ReservationResponseDto> reservationList =  reservationService.getReservation(id);
        
        return ResponseEntity.ok(reservationList);


    }
}
