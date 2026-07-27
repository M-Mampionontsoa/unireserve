package com.unireserve.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.unireserve.dto.AdminMapper;
import com.unireserve.dto.AdminProfileDto;
import com.unireserve.dto.ProfileDto;
import com.unireserve.dto.SigninDTO;
import com.unireserve.dto.UpdateAdminDto;
import com.unireserve.dto.UpdateAssociationDto;
import com.unireserve.dto.UpdateEnseignantDto;
import com.unireserve.dto.UpdateEtudiantDto;
import com.unireserve.dto.UpdateProfileDto;
import com.unireserve.dto.UserMapper;
import com.unireserve.entity.Admin;
import com.unireserve.entity.Enseignant;
import com.unireserve.entity.Etudiant;
import com.unireserve.entity.Association;
import com.unireserve.entity.Role;
import com.unireserve.entity.Utilisateur;
import com.unireserve.entity.Exception.UserAlreadyExistExpetion;
import com.unireserve.repository.UserRepository;
import jakarta.transaction.Transactional;
import com.unireserve.dto.EtudiantMapper;
import com.unireserve.dto.AssociationMapper;
import com.unireserve.dto.EnseignantMapper;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EtudiantMapper etudiantMapper;
    private final EnseignantMapper enseignantMapper;
    private final AdminMapper adminMapper;
    private final AssociationMapper associationMapper;
    
    


    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EtudiantMapper etudiantMapper,
            EnseignantMapper enseignantMapper,
            AdminMapper adminMapper,
            AssociationMapper associationMapper
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.etudiantMapper = etudiantMapper;
        this.enseignantMapper = enseignantMapper;
        this.adminMapper = adminMapper;
        this.associationMapper = associationMapper;
    }

    @Transactional
    public Utilisateur createUtilisateur(SigninDTO utilisateur) {


        Optional<Utilisateur> user = userRepository.findByMail(utilisateur.getEmail());
        if(user.isPresent())
        {
             throw new UserAlreadyExistExpetion("Un utilisateur avec l'email " + utilisateur.getEmail() + " existe déjà");
        }
        Role selectedRole = Role.valueOf(utilisateur.getRole().toUpperCase());

        Utilisateur newUtilisateur;

        switch (selectedRole) {
        
            case ETUDIANT:
                newUtilisateur = new Etudiant();
                break;
        
            case ENSEIGNANT:
                newUtilisateur = new Enseignant();
                break;
        
            case ASSOCIATION:
                newUtilisateur = new Association();
                break;
        
            case ADMIN:
                newUtilisateur = new Admin();
                break;
        
            default:
                throw new IllegalArgumentException("Rôle inconnu");
        }
        newUtilisateur.setNom(utilisateur.getName());
        newUtilisateur.setPrenom(utilisateur.getFirstName());
        newUtilisateur.setUsername(utilisateur.getUsername());
        newUtilisateur.setMail(utilisateur.getEmail());
        newUtilisateur.setPassword(passwordEncoder.encode(utilisateur.getPassword()));
        newUtilisateur.setRole(selectedRole);
        newUtilisateur.setCreatedAt(LocalDateTime.now());
        newUtilisateur.setUpdatedAt(LocalDateTime.now());
            
        return userRepository.save(newUtilisateur);
    }

    
    public ProfileDto getProfileInfo(Utilisateur utilisateur) {

        Utilisateur user = userRepository.findByMail(utilisateur.getMail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user instanceof Etudiant e) {

            return etudiantMapper.toProfileDto(e);
        }

        if (user instanceof Enseignant e) {

            return enseignantMapper.toProfileDto(e);

            
        }

        if (user instanceof Association a) {

            return associationMapper.toProfileDto(a);
        }

        if (user instanceof Admin a) {

            return adminMapper.toProfileDto(a);
        }

        throw new RuntimeException("Type d'utilisateur inconnu");
    }


    @Transactional
    public Utilisateur updateProfile(UpdateProfileDto dto, Utilisateur utilisateur)
    {

        Utilisateur user = userRepository.findByMail(utilisateur.getMail())
                .orElseThrow(() -> new RuntimeException("User not found"));


        /*
           Cas utilisateur Google qui n'a pas encore choisi son rôle
        */
        if(user.getRole() == Role.PENDING)
        {
        
            Utilisateur newUser;
        
        
            if(dto instanceof UpdateEtudiantDto)
            {
                newUser = new Etudiant();
                newUser.setRole(Role.ETUDIANT);
            }
            else if(dto instanceof UpdateEnseignantDto)
            {
                newUser = new Enseignant();
                newUser.setRole(Role.ENSEIGNANT);

            }
            else if(dto instanceof UpdateAssociationDto)
            {
                newUser = new Association();
                newUser.setRole(Role.ASSOCIATION);
            }
            else if(dto instanceof UpdateAdminDto)
            {
                newUser = new Admin();
                newUser.setRole(Role.ADMIN);

            }
            else
            {
                throw new RuntimeException("Type de profil invalide");
            }
        
        
            // récupération des informations Google
            newUser.setMail(user.getMail());
            newUser.setPassword(user.getPassword());
            newUser.setOauthId(user.getOauthId());
            newUser.setOauthProvider(user.getOauthProvider());
        
            newUser.setNom(user.getNom());
            newUser.setPrenom(user.getPrenom());
            newUser.setUsername(user.getUsername());
        
            newUser.setCreatedAt(user.getCreatedAt());
            newUser.setUpdatedAt(LocalDateTime.now());
        
        
            userRepository.delete(user);
        
        
            user = newUser;
        }


        /*
            Ici l'utilisateur possède maintenant son vrai type
        */


        if(user instanceof Etudiant e)
        {
            etudiantMapper.updateEtudiant(
                    (UpdateEtudiantDto) dto,
                    e
            );

            e.setRole(Role.ETUDIANT);

            return userRepository.save(e);
        }


        if(user instanceof Enseignant e)
        {
            enseignantMapper.updateEnseignant(
                    (UpdateEnseignantDto) dto,
                    e
            );

            e.setRole(Role.ENSEIGNANT);

            return userRepository.save(e);
        }


        if(user instanceof Association a)
        {
            associationMapper.updateAssociation(
                    (UpdateAssociationDto) dto,
                    a
            );

            a.setRole(Role.ASSOCIATION);

            return userRepository.save(a);
        }


        if(user instanceof Admin a)
        {
            adminMapper.updateAdmin(
                    (UpdateAdminDto) dto,
                    a
            );

            a.setRole(Role.ADMIN);

            return userRepository.save(a);
        }


        throw new RuntimeException("Type utilisateur inconnu");
    }

        
}
    


