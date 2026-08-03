package com.unireserve.service;

import com.unireserve.dto.Reservation.ReservationResponseDto;
import com.unireserve.repository.ReservationRepository;
import com.unireserve.repository.SalleRepository;

import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.unireserve.dto.Reservation.ReservationMapperDto;
import com.unireserve.dto.Reservation.ReservationRequest;
import com.unireserve.entity.Reservation;
import com.unireserve.entity.Role;
import com.unireserve.entity.Salle;
import com.unireserve.entity.Statut_reservation;
import com.unireserve.entity.Utilisateur;

@Service
public class ReservationService {
    private ReservationRepository reservationRepository;
    private ReservationMapperDto reservationMapperDto;
    private SalleRepository salleRepository;

    public ReservationService(ReservationRepository reservationRepository,ReservationMapperDto reservationMapperDto,SalleRepository salleRepository)
    {
        this.reservationRepository = reservationRepository;
        this.reservationMapperDto = reservationMapperDto;
        this.salleRepository = salleRepository;
        
    }

    @Transactional
    public ReservationResponseDto reserve(ReservationRequest reservation,Utilisateur utilisateur)
    {
        
        if (utilisateur == null) {
            throw new RuntimeException("Utilisateur non authentifié");
        }
        
        
        Salle salle = salleRepository.trouverAvecVerrou(reservation.getId_salle())
            .orElseThrow(() -> new RuntimeException("Salle non trouvée avec l'ID: " + reservation.getId_salle()));
        
        
        if (reservation.getFin().isBefore(reservation.getDebut()) || reservation.getFin().equals(reservation.getDebut())) {
            throw new RuntimeException("La date de fin doit être après la date de début");
        }
        if(!reservationRepository.existsOverlappingReservation(reservation.getId_salle(),reservation.getDebut(),reservation.getFin()))
        {
           Reservation reservationAFaire = reservationMapperDto.toEntity(reservation);
            if(utilisateur.getRole() == Role.ENSEIGNANT || utilisateur.getRole() == Role.ADMIN )
            {
                reservationAFaire.setStatut(Statut_reservation.CONFIRMEE);
            }
            else if(utilisateur.getRole() == Role.ASSOCIATION || utilisateur.getRole() == Role.ETUDIANT)
            {
                reservationAFaire.setStatut(Statut_reservation.EN_ATTENTE);
            }

            
            
            reservationAFaire.setUtilisateur(utilisateur);
            reservationAFaire.setSalle(salle);

            reservationRepository.save(reservationAFaire);

            return reservationMapperDto.toResponseDto(reservationAFaire);

        }
        else
        {
            throw new RuntimeException("La salle n'est pas disponible sur ce créneau");
        }
    

    }
    public List<ReservationResponseDto> getReservation(Long id)
    {
        List<ReservationResponseDto> reservationList = new ArrayList<>();
        Salle salle = salleRepository.findById(id).orElseThrow(() -> new RuntimeException("Salle introuvable"));
        List<Reservation> lists = reservationRepository.findBySalleId(salle.getId());
        
        for (Reservation reservation : lists) {
            
            ReservationResponseDto reservationResponseDto = reservationMapperDto.toResponseDto(reservation);
            reservationResponseDto.setSalleNom(reservation.getSalle().getNom());
            
            reservationList.add(reservationResponseDto);
            
        }

        return reservationList;
    }


}
