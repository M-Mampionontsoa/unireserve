package com.unireserve.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "admin")
@PrimaryKeyJoinColumn(name = "id_utilisateur") 
@Data
@EqualsAndHashCode(callSuper = true)
public class Admin extends Utilisateur {

    private String status;
}