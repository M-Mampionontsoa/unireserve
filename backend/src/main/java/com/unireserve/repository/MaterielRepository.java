package com.unireserve.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.unireserve.entity.Materiel;

public interface  MaterielRepository extends JpaRepository<Materiel,Long> {
    
}
