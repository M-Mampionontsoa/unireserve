package com.unireserve.service;

import com.unireserve.dto.Reservation.ReservationResponseDto;
import com.unireserve.repository.ReservationRepository;
import com.unireserve.repository.SalleRepository;
import com.unireserve.service.Mail.MailService;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;

import com.unireserve.dto.Reservation.OccupationStat;
import com.unireserve.dto.Reservation.ReservationMapperDto;
import com.unireserve.dto.Reservation.ReservationRequest;
import com.unireserve.entity.Admin;
import com.unireserve.entity.Reservation;
import com.unireserve.entity.Role;
import com.unireserve.entity.Salle;
import com.unireserve.entity.Statut_reservation;
import com.unireserve.entity.Type_reservation;
import com.unireserve.entity.Utilisateur;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ReservationService {
    private ReservationRepository reservationRepository;
    private ReservationMapperDto reservationMapperDto;
    private SalleRepository salleRepository;
    private MailService mailService;
    private static final Logger logger = LoggerFactory.getLogger(ReservationService.class);

    public ReservationService(ReservationRepository reservationRepository,ReservationMapperDto reservationMapperDto,SalleRepository salleRepository,MailService mailService)
    {
        this.reservationRepository = reservationRepository;
        this.reservationMapperDto = reservationMapperDto;
        this.salleRepository = salleRepository;
        this.mailService = mailService;
        
    }

    @Transactional
    public ReservationResponseDto reserve(ReservationRequest reservation,Utilisateur utilisateur)
    {
        
        if (utilisateur == null) {
            throw new RuntimeException("Utilisateur non authentifié");
        }
        
        
        Salle salle = salleRepository.trouverAvecVerrou(reservation.getId_salle())
            .orElseThrow(() -> new RuntimeException("Salle non trouvée avec l'ID: " + reservation.getId_salle()));
        
        if (reservation.getDebut().isBefore(LocalDateTime.now().minusMinutes(1))) {
            throw new RuntimeException("Impossible de réserver dans le passé");
        }

        
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
            ReservationResponseDto response = reservationMapperDto.toResponseDto(reservationAFaire);
            response.setSalleNom(reservationAFaire.getSalle().getNom());
            if(response.getStatut() == Statut_reservation.CONFIRMEE)
            {
                try
                {
                    mailService.SendMailConfirmation(utilisateur.getMail(),response);
                }
                catch(Exception e)
                {
                    logger.error("Erreur lors de l'envoi du mail", e);
                    response.setWarning("Réservation validée mais echec de l'envoie du mail");
                    
                }
            }

            return response;

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

    public List<ReservationResponseDto> getReservationByStatus(Statut_reservation statut_reservation)
    {
        List<ReservationResponseDto> reservationList = new ArrayList<>();

        List<Reservation> reservations = reservationRepository.findByStatut(statut_reservation);

        for (Reservation  reservation : reservations) {
            
            ReservationResponseDto dto = reservationMapperDto.toResponseDto(reservation);
            dto.setSalleNom(reservation.getSalle().getNom());   
            reservationList.add(dto);
            
        }

        return reservationList;
    }

    @Transactional
    public ReservationResponseDto validateReservation(Long id,Statut_reservation status,String motif)
    {
        Reservation reservation = reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatut(status);
        if(status == Statut_reservation.REFUSEE)
        {
            reservation.setMotif_refus(motif);
        }

        

        reservationRepository.save(reservation);
        ReservationResponseDto response=reservationMapperDto.toResponseDto(reservation);
        response.setSalleNom(reservation.getSalle().getNom());
        if(response.getStatut() == Statut_reservation.CONFIRMEE)
        {
            try
            {
                mailService.SendMailConfirmation(reservation.getUtilisateur().getMail(),response);
            }
            catch(Exception e)
            {
                logger.error("Erreur lors de l'envoi du mail", e);
                response.setWarning("Réservation validée mais echec de l'envoie du mail");
                
            }
        }
        else
        {
            try
            {
                mailService.SendMailRefuse(reservation.getUtilisateur().getMail(),response,motif);
            }
            catch(Exception e)
            {
                logger.error("Erreur lors de l'envoi du mail", e);
                response.setWarning("Réservation refusée mais echec de l'envoie du mail");
                
            }
        }
        

        return response;

    }

    @Transactional
    public ReservationResponseDto blocking(ReservationRequest request,Admin admin)
    {
        Salle salle = salleRepository.trouverAvecVerrou(request.getId_salle())
            .orElseThrow(() -> new RuntimeException("Salle non trouvée avec l'ID: " + request.getId_salle()));
        
        
        if (request.getFin().isBefore(request.getDebut()) || request.getFin().equals(request.getDebut())) {
            throw new RuntimeException("La date de fin doit être après la date de début");
        }

        Reservation reservation = reservationMapperDto.toEntity(request);
        reservation.setDebut(request.getDebut());
        reservation.setFin(request.getFin());
        reservation.setType_reservation(Type_reservation.BLOCAGE);
        reservation.setStatut(Statut_reservation.CONFIRMEE);
        reservation.setAdmin(admin);
        reservation.setUtilisateur(admin);
        reservation.setSalle(salle);

        reservationRepository.save(reservation);

        return reservationMapperDto.toResponseDto(reservation);

    }

    



}
