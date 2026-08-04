package com.unireserve.service.Mail;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.unireserve.dto.Reservation.ReservationResponseDto;

@Service
public class MailService {
    private final JavaMailSender javamailSender;

    public MailService(JavaMailSender javaMailSender)
    {
        this.javamailSender = javaMailSender;
    }

    public void SendMailConfirmation(String destinataire,ReservationResponseDto reservationResponseDto)
    {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinataire);
        message.setSubject("Confirmation de réservation");
        message.setText("Votre reservation du " + reservationResponseDto.getDebut() + " à " + reservationResponseDto.getFin() + "de la salle " + reservationResponseDto.getSalleNom() + " a été " + reservationResponseDto.getStatut());
        
        javamailSender.send(message);
    }

    public void SendMailRefuse(String destinataire,ReservationResponseDto reservationResponseDto,String motif)
    {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinataire);
        message.setSubject("Confirmation de réservation");
        message.setText("Votre reservation du " + reservationResponseDto.getDebut() + " à " + reservationResponseDto.getFin() + "de la salle " + reservationResponseDto.getSalleNom() + " a été " + reservationResponseDto.getStatut() + " Pour cause de " + motif);
        
        javamailSender.send(message);
    }
}
