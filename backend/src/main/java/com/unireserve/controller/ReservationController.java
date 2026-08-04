package com.unireserve.controller;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.unireserve.dto.Reservation.ReservationRequest;
import com.unireserve.dto.Reservation.ReservationResponseDto;
import com.unireserve.entity.Admin;
import com.unireserve.entity.Statut_reservation;
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

    @GetMapping("/enAttente")
    public ResponseEntity<?> getReservationEnAttente()
    {
        List<ReservationResponseDto> reservationList = reservationService.getReservationByStatus(Statut_reservation.EN_ATTENTE);

        return ResponseEntity.ok(reservationList);
    }

    @GetMapping("/refuse")
    public ResponseEntity<?> getReservationRefuse()
    {
        List<ReservationResponseDto> reservationList = reservationService.getReservationByStatus(Statut_reservation.REFUSEE);

        return ResponseEntity.ok(reservationList);
    }

    @GetMapping("/valide")
    public ResponseEntity<?> getReservationValide()
    {
        List<ReservationResponseDto> reservationList = reservationService.getReservationByStatus(Statut_reservation.CONFIRMEE);

        return ResponseEntity.ok(reservationList);
    }

    @PutMapping("/{id}/refuser")
    public ResponseEntity<?> refuserReservation(@PathVariable Long id,@RequestBody String motif)
    {   
        ReservationResponseDto responseDto = reservationService.validateReservation(id,Statut_reservation.REFUSEE, motif);

        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<?> validerReservation(@PathVariable Long id)
    {   
        ReservationResponseDto responseDto = reservationService.validateReservation(id,Statut_reservation.CONFIRMEE,null);

        return ResponseEntity.ok(responseDto);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/block")
    public ResponseEntity<?> block(@RequestBody ReservationRequest request,Authentication authentication)
    {
        CustumPrincipal custumPrincipal = (CustumPrincipal) authentication.getPrincipal();

        Utilisateur utilisateur = custumPrincipal.getUtilisateur();
        if(utilisateur instanceof Admin)
        {
            Admin admin = (Admin) utilisateur;
            ReservationResponseDto responseDto = reservationService.blocking(request, admin);

            return ResponseEntity.ok(responseDto);
        }
        else
        {
            throw new IllegalStateException("L'utilisateur authentifié n'est pas un administrateur.");
        }
        
    }
}
