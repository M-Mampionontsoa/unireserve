package com.unireserve.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.EnumType;

@Entity
@Table(name = "etudiant")
@PrimaryKeyJoinColumn(name = "id_utilisateur")
@Data
@EqualsAndHashCode(callSuper = true)
public class Etudiant extends Utilisateur {

    private String faculte;

    private String mention;

    private String parcours;

    private String numeroInscription;

    @Enumerated(EnumType.STRING)
    private Niveau niveau;
}