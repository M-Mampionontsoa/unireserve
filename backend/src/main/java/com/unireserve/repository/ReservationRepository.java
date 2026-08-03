package com.unireserve.repository;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import com.unireserve.entity.Reservation;
import com.unireserve.entity.Statut_reservation;



public interface ReservationRepository extends JpaRepository<Reservation,Long> {
    @Query("SELECT COUNT(r) > 0 FROM Reservation r " +
           "WHERE r.salle.id = :salleId " +
           "AND r.statut IN ('EN_ATTENTE', 'CONFIRMEE') " +
           "AND r.debut < :fin " +
           "AND r.fin > :debut")
    boolean existsOverlappingReservation(
        @Param("salleId") Long salleId,
        @Param("debut") LocalDateTime debut,
        @Param("fin") LocalDateTime fin
    );
    List<Reservation> findBySalleId(Long id);

    List<Reservation> findByStatut(Statut_reservation statut);
    
}
