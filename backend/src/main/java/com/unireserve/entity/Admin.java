package com.unireserve.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import jakarta.persistence.CascadeType;

@Entity
@Table(name = "admin")
@PrimaryKeyJoinColumn(name = "id_utilisateur")
@Data
@EqualsAndHashCode(callSuper = true)
public class Admin extends Utilisateur {

    private String status;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "id_admin")
    private List<Salle> salles;

    @OneToMany(mappedBy = "admin")
    private List<Reservation> reservationsValidees;
}

