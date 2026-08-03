package com.unireserve.service.Mail;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import com.unireserve.dto.Reservation.ReservationResponseDto;

public class MailService {
    private final JavaMailSender javamailSender;

    public MailService(JavaMailSender javaMailSender)
    {
        this.javamailSender = javaMailSender;
    }

    private void SendMailConfirmation(String destinataire,ReservationResponseDto reservationResponseDto)
    {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinataire);
        message.setSubject("Confirmation de réservation");
        message.setText("Votre reservation du " + reservationResponseDto.getDebut() + " à " + reservationResponseDto.getFin() + "de la salle " + reservationResponseDto.getSalleNom() + " a été " + reservationResponseDto.getStatut());
        
        javamailSender.send(message);
    }
}
