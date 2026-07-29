package com.unireserve.controller;



import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.unireserve.dto.Salle.SalleRequestDto;
import com.unireserve.dto.Salle.SalleResponseDto;
import com.unireserve.service.SalleService;
import java.util.List;


@RestController
@RequestMapping("/salles")
public class SalleController {


    private final SalleService salleService;


    public SalleController(SalleService salleService)
    {
        this.salleService = salleService;
    }

 
    // Création d'une salle avec ses matériels
    @PostMapping
    public ResponseEntity<SalleResponseDto> createSalle(
            @RequestBody SalleRequestDto salleRequestDto)
    {
        SalleResponseDto salle = salleService.createSalle(salleRequestDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(salle);
    }



    // Récupérer toutes les salles
    @GetMapping
    public ResponseEntity<List<SalleResponseDto>> getAllSalle()
    {
        return ResponseEntity.ok(
                salleService.getAllSalle()
        );
    }



    // Récupérer une salle par id
    @GetMapping("/{id}")
    public ResponseEntity<SalleResponseDto> getSalle(
            @PathVariable Long id)
    {
        return ResponseEntity.ok(
                salleService.getSalle(id)
        );
    }



    // Modifier une salle
    @PutMapping("/{id}")
    public ResponseEntity<SalleResponseDto> updateSalle(
            @PathVariable Long id,
            @RequestBody SalleRequestDto dto)
    {
        SalleResponseDto salle =
                salleService.updateSalle(dto, id);

        return ResponseEntity.ok(salle);
    }



    // Supprimer une salle
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSalle(
            @PathVariable Long id)
    {
        salleService.deleteSalle(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filter")
    public ResponseEntity<List<SalleResponseDto>> rechercherSalles(
            @RequestParam(required = false) Integer capaciteMin,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String equipement) {

        List<SalleResponseDto> resultats;

        if (capaciteMin != null && type != null && equipement != null) {
            resultats = salleService.filterCombinee(capaciteMin, type, equipement);

        } else if (capaciteMin != null) {
            resultats = salleService.filterWithMinCapacity(capaciteMin);

        } else if (type != null) {
            resultats = salleService.filterPerType(type);

        } else if (equipement != null) {
            resultats = salleService.filterEquipement(equipement);

        } else {
            return getAllSalle();
        }

        return ResponseEntity.ok(resultats);
    }

}
