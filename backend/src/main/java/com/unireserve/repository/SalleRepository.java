package com.unireserve.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import com.unireserve.entity.Salle;
import org.springframework.data.repository.query.Param;



public interface SalleRepository extends JpaRepository<Salle, Long> {

    @Query("""
        SELECT s
        FROM Salle s
        WHERE s.capacite >= :capacityMin
    """)
    List<Salle> rechercherParCapacite(@Param("capacityMin") int capacityMin);

    @Query("""
        SELECT s
        FROM Salle s
        WHERE s.type LIKE CONCAT('%', :type, '%')
    """)
    List<Salle> rechercherParType(@Param("type") String type);

    @Query("""
        SELECT DISTINCT s
        FROM Salle s
        JOIN s.materiels m
        WHERE m.nom LIKE CONCAT('%', :equipement, '%')
    """)
    List<Salle> filterParEquipement(@Param("equipement") String equipement);

    @Query("""
        SELECT DISTINCT s
        FROM Salle s
        JOIN s.materiels m
        WHERE s.capacite >= :capacityMin
          AND s.type LIKE CONCAT('%', :type, '%')
          AND m.nom LIKE CONCAT('%', :equipement, '%')
    """)
    List<Salle> filtreCombinee(
            @Param("capacityMin") int capacityMin,
            @Param("type") String type,
            @Param("equipement") String equipement);
} 