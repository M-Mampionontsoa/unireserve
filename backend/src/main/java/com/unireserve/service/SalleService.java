package com.unireserve.service;

import org.springframework.stereotype.Service;

import com.unireserve.dto.Salle.MaterielMapper;
import com.unireserve.dto.Salle.SalleMapper;
import com.unireserve.dto.Salle.SalleRequestDto;
import com.unireserve.dto.Salle.SalleResponseDto;
import com.unireserve.entity.Materiel;
import com.unireserve.repository.MaterielRepository;
import com.unireserve.repository.SalleRepository;

import jakarta.transaction.Transactional;

import com.unireserve.entity.Salle;


import java.util.ArrayList;
import java.util.List;


@Service
public class SalleService {
    private SalleRepository salleRepository;
    private MaterielRepository materielRepository;
    private SalleMapper salleMapper;
    private MaterielMapper materielMapper;
    

    public SalleService(SalleRepository salleRepository,MaterielRepository materielRepository,SalleMapper salleMapper,MaterielMapper materielMapper)
    {
        this.salleRepository=salleRepository;
        this.materielRepository =materielRepository;
        this.salleMapper=salleMapper;
        this.materielMapper=materielMapper;
    }

    @Transactional
    public SalleResponseDto createSalle(SalleRequestDto salleRequestDto)
    {
        Salle salle = salleMapper.toEntity(salleRequestDto);

        for (Materiel materiel : salle.getMateriels()) {
            materiel.setSalles(List.of(salle));
        }

        Salle savedSalle = salleRepository.save(salle);

        return salleMapper.toResponseDto(savedSalle);

    }

    @Transactional
    public List<SalleResponseDto> getAllSalle()
    {
        List<Salle> salles = salleRepository.findAll();
        List<SalleResponseDto> sallesRequest= new ArrayList<>();

        for (Salle salle : salles) {
            sallesRequest.add(salleMapper.toResponseDto(salle));
        }
        return sallesRequest;


    }

    @Transactional
    public SalleResponseDto getSalle(Long id)
    {
        Salle salle = salleRepository.findById(id).orElseThrow(() -> new RuntimeException("Salle introuvable"));

        return salleMapper.toResponseDto(salle);
    }

    @Transactional
    public SalleResponseDto updateSalle(SalleRequestDto dto, Long id)
    {
        Salle salle = salleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Salle introuvable"));


        salleMapper.updateSalle(dto, salle);


        List<Materiel> anciensMateriels = salle.getMateriels();

        salle.getMateriels().clear();

        materielRepository.deleteAll(anciensMateriels);


        List<Materiel> nouveauxMateriels =
                materielMapper.toEntity(dto.getMateriels());


        for(Materiel materiel : nouveauxMateriels)
        {
            materiel.setSalles(List.of(salle));
        }


        salle.setMateriels(nouveauxMateriels);


        Salle updated = salleRepository.save(salle);


        return salleMapper.toResponseDto(updated);
    }

    @Transactional
    public void deleteSalle(Long id)
    {
        Salle salle = salleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Salle not found"));

        List<Materiel> materiels = salle.getMateriels();

        salle.getMateriels().clear();

        materielRepository.deleteAll(materiels);

        salleRepository.delete(salle);
    }

    
}
