package com.unireserve.entity;

import java.time.LocalDateTime;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;

import java.util.List;


@Entity
@Table(name = "materiel")
@Data
public class Materiel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    String nom;

    String type;

    int quantite;

    String etat;

    LocalDateTime date_acquisition;

    @Column(name="created_at", nullable=false, updatable=false)
    private LocalDateTime createdAt;

    @ManyToMany(mappedBy = "materiels")
    List<Salle> salles;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        
    }

    

    


}
