package com.unireserve.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.unireserve.entity.Salle;



public interface  SalleRepository extends JpaRepository<Salle,Long> {
   
    
}
