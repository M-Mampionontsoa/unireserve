package com.unireserve.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "association")
@PrimaryKeyJoinColumn(name = "id_utilisateur") 
@Data
@EqualsAndHashCode(callSuper = true)
public class Association extends Utilisateur {

    private String typeActivite;
}