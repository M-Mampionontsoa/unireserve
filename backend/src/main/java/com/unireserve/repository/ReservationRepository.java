package com.unireserve.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.unireserve.dto.interfaces.OccupationProjection;
import com.unireserve.entity.Reservation;
import com.unireserve.entity.Statut_reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("""
        SELECT COUNT(r) > 0 
        FROM Reservation r
        WHERE r.salle.id = :salleId
        AND r.statut IN ('EN_ATTENTE', 'CONFIRMEE')
        AND r.debut < :fin
        AND r.fin > :debut
    """)
    boolean existsOverlappingReservation(
        @Param("salleId") Long salleId,
        @Param("debut") LocalDateTime debut,
        @Param("fin") LocalDateTime fin
    );


    List<Reservation> findBySalleId(Long id);


    List<Reservation> findByStatut(Statut_reservation statut);


    @Query(value = """
        SELECT 
            r.id_salle AS salleId,
            SUM(EXTRACT(EPOCH FROM (r.fin - r.debut)) / 3600.0) AS heuresReservees
        FROM reservation r
        WHERE r.statut = 'CONFIRMEE'
        AND r.debut >= :debut
        AND r.fin <= :fin
        AND (:salleId IS NULL OR r.id_salle = :salleId)
        GROUP BY r.id_salle
        """, nativeQuery = true)
    List<OccupationProjection> getOccupation(
        @Param("debut") LocalDateTime debut,
        @Param("fin") LocalDateTime fin,
        @Param("salleId") Long salleId
    );

}