-- =====================================================================
-- UniReserve — Schéma PostgreSQL
-- Généré à partir du MCD (mcd.drawio) fourni par MAMPIONONTSOA
-- =====================================================================
--
-- CORRECTIONS ET AJOUTS PAR RAPPORT AU MCD ORIGINAL (documentés ici,
-- à valider avec le prof / groupe si besoin) :
--
-- 1. [AJOUT] mot_de_passe, oauth_provider, oauth_id sur Utilisateurs
--    → Le MCD ne prévoyait pas de champ pour l'authentification, alors
--      que le calendrier (Jour 2-3) demande login classique + OAuth.
-- 2. [AJOUT] statut, motif_refus, type_reservation, id_admin_validateur,
--    valide_le sur Réservation
--    → Le cahier des charges (conception.md, §7.2/7.3) exige un workflow
--      de validation (en attente / validée / refusée) et le blocage de
--      créneaux par l'admin. Le MCD n'avait ni statut ni ces liens.
-- 3. [AJOUT] id_salle (FK) sur Réservation
--    → La relation "associer" Salle-Réservation existe dans le MCD mais
--      aucune FK vers Salle n'était modélisée côté Réservation.
-- 4. [CORRECTION] Matériel avait DEUX champs "Quantité" (String puis int)
--    → doublon manifeste, un seul champ quantite (int) est conservé.
-- 5. [AJOUT] table de jonction salle_materiel
--    → La relation "avoir" Salle↔Matériel est multiple des deux côtés
--      (1,* / 1,*) : une relation many-to-many a besoin d'une table de
--      jonction en relationnel, elle n'était pas explicite dans le MCD.
-- 6. [À CLARIFIER] Salle.quantite (int) — présent dans ton MCD original,
--    conservé tel quel, mais son sens métier n'est pas évident à côté de
--    Capacité (nombre de places assises ?). Je le garde en commentaire
--    de colonne ; à toi de confirmer sa signification avec le prof.
-- 7. [AJOUT] created_at / updated_at sur les tables principales
--    → Bonne pratique standard, absente du MCD.
--
-- Stratégie d'héritage Utilisateurs → {Étudiant, Enseignant, Association,
-- Admin} : traduite en "table par sous-classe" (clé primaire = clé
-- étrangère vers Utilisateurs), conforme aux règles Merise de traduction
-- d'une spécialisation.
-- =====================================================================

-- Nettoyage (utile en développement, à retirer en prod)
DROP TABLE IF EXISTS salle_materiel CASCADE;
DROP TABLE IF EXISTS reservation CASCADE;
DROP TABLE IF EXISTS salle CASCADE;
DROP TABLE IF EXISTS materiel CASCADE;
DROP TABLE IF EXISTS admin CASCADE;
DROP TABLE IF EXISTS association CASCADE;
DROP TABLE IF EXISTS enseignant CASCADE;
DROP TABLE IF EXISTS etudiant CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;

DROP TYPE IF EXISTS role_utilisateur;
DROP TYPE IF EXISTS niveau_etude;
DROP TYPE IF EXISTS statut_reservation;
DROP TYPE IF EXISTS type_reservation;

-- =====================================================================
-- ENUMS
-- =====================================================================
CREATE TYPE role_utilisateur AS ENUM ('ETUDIANT', 'ENSEIGNANT', 'ASSOCIATION', 'ADMIN');
CREATE TYPE niveau_etude AS ENUM ('L1', 'L2', 'L3', 'M1', 'M2');
CREATE TYPE statut_reservation AS ENUM ('EN_ATTENTE', 'CONFIRMEE', 'REFUSEE', 'ANNULEE');
CREATE TYPE type_reservation AS ENUM ('RESERVATION', 'BLOCAGE');

-- =====================================================================
-- UTILISATEURS (table mère)
-- =====================================================================
CREATE TABLE utilisateurs (
    id                SERIAL PRIMARY KEY,
    nom               VARCHAR(100)        NOT NULL,
    prenom            VARCHAR(100)        NOT NULL,
    nom_utilisateur   VARCHAR(50)         NOT NULL UNIQUE,
    adresse_email     VARCHAR(150)        NOT NULL UNIQUE,
    mot_de_passe      VARCHAR(255),                 -- NULL si connexion 100% OAuth
    oauth_provider    VARCHAR(20),                  -- 'GOOGLE', 'APPLE', NULL si mdp classique
    oauth_id          VARCHAR(255),                 -- identifiant renvoyé par le provider
    role              role_utilisateur    NOT NULL,
    created_at        TIMESTAMP           NOT NULL DEFAULT now(),
    updated_at        TIMESTAMP           NOT NULL DEFAULT now()
);

-- =====================================================================
-- ÉTUDIANT (spécialisation de Utilisateurs)
-- =====================================================================
CREATE TABLE etudiant (
    id_utilisateur      INTEGER PRIMARY KEY REFERENCES utilisateurs(id) ON DELETE CASCADE,
    faculte              VARCHAR(100) NOT NULL,
    mention              VARCHAR(100) NOT NULL,
    parcours             VARCHAR(100) NOT NULL,
    niveau               niveau_etude NOT NULL,
    numero_inscription   VARCHAR(50)  NOT NULL UNIQUE
);

-- =====================================================================
-- ENSEIGNANT (spécialisation de Utilisateurs)
-- =====================================================================
CREATE TABLE enseignant (
    id_utilisateur       INTEGER PRIMARY KEY REFERENCES utilisateurs(id) ON DELETE CASCADE,
    faculte               VARCHAR(100) NOT NULL,
    mention               VARCHAR(100) NOT NULL,
    parcours              VARCHAR(100) NOT NULL,
    matiere_enseignee     VARCHAR(150) NOT NULL,
    numero_matricule      VARCHAR(50)  NOT NULL UNIQUE
);

-- =====================================================================
-- ASSOCIATION (spécialisation de Utilisateurs)
-- =====================================================================
CREATE TABLE association (
    id_utilisateur   INTEGER PRIMARY KEY REFERENCES utilisateurs(id) ON DELETE CASCADE,
    type_activite     VARCHAR(150) NOT NULL
);

-- =====================================================================
-- ADMIN / RESPONSABLE LOGISTIQUE (spécialisation de Utilisateurs)
-- =====================================================================
CREATE TABLE admin (
    id_utilisateur  INTEGER PRIMARY KEY REFERENCES utilisateurs(id) ON DELETE CASCADE,
    status           VARCHAR(50) NOT NULL DEFAULT 'ACTIF'
);

-- =====================================================================
-- SALLE
-- =====================================================================
CREATE TABLE salle (
    id                SERIAL PRIMARY KEY,
    nom               VARCHAR(100) NOT NULL,
    type              VARCHAR(50)  NOT NULL,
    capacite          INTEGER      NOT NULL CHECK (capacite > 0),
    quantite          INTEGER,                       -- cf. correction #6 : sens à clarifier
    etat              VARCHAR(30)  NOT NULL DEFAULT 'DISPONIBLE',
    date_acquisition  DATE,
    id_admin          INTEGER REFERENCES admin(id_utilisateur),
    created_at        TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at        TIMESTAMP    NOT NULL DEFAULT now()
);
COMMENT ON COLUMN salle.quantite IS 'Champ présent dans le MCD original — signification à confirmer (ex: nb de sous-espaces ?). Ne pas confondre avec capacite.';

-- =====================================================================
-- MATÉRIEL  (correction #4 : un seul champ quantite conservé)
-- =====================================================================
CREATE TABLE materiel (
    id                SERIAL PRIMARY KEY,
    nom               VARCHAR(100) NOT NULL,
    type              VARCHAR(50)  NOT NULL,
    quantite          INTEGER      NOT NULL DEFAULT 0 CHECK (quantite >= 0),
    etat              VARCHAR(30)  NOT NULL DEFAULT 'BON_ETAT',
    date_acquisition  DATE,
    created_at        TIMESTAMP    NOT NULL DEFAULT now()
);

-- =====================================================================
-- SALLE_MATERIEL (table de jonction — correction #5, relation "avoir")
-- =====================================================================
CREATE TABLE salle_materiel (
    id_salle      INTEGER NOT NULL REFERENCES salle(id) ON DELETE CASCADE,
    id_materiel   INTEGER NOT NULL REFERENCES materiel(id) ON DELETE CASCADE,
    quantite      INTEGER NOT NULL DEFAULT 1 CHECK (quantite > 0),
    PRIMARY KEY (id_salle, id_materiel)
);

-- =====================================================================
-- RÉSERVATION  (corrections #2 et #3)
-- =====================================================================
CREATE TABLE reservation (
    id                     SERIAL PRIMARY KEY,
    debut                  TIMESTAMP           NOT NULL,
    fin                    TIMESTAMP           NOT NULL,
    type_reservation       type_reservation    NOT NULL DEFAULT 'RESERVATION',
    statut                 statut_reservation  NOT NULL DEFAULT 'EN_ATTENTE',
    motif_refus            TEXT,
    id_utilisateur         INTEGER REFERENCES utilisateurs(id),   -- NULL possible si type = BLOCAGE (créé par l'admin sans "demandeur")
    id_salle               INTEGER NOT NULL REFERENCES salle(id),
    id_admin_validateur    INTEGER REFERENCES admin(id_utilisateur),
    valide_le              TIMESTAMP,
    created_at             TIMESTAMP           NOT NULL DEFAULT now(),
    updated_at             TIMESTAMP           NOT NULL DEFAULT now(),
    CONSTRAINT chk_dates CHECK (fin > debut)
);

-- Index utiles pour la recherche de disponibilité (besoin non fonctionnel : <1s)
CREATE INDEX idx_reservation_salle_creneaux ON reservation (id_salle, debut, fin);
CREATE INDEX idx_reservation_utilisateur ON reservation (id_utilisateur);
CREATE INDEX idx_reservation_statut ON reservation (statut);

-- =====================================================================
-- Anti-conflit : empêche deux réservations actives sur le même créneau
-- et la même salle (nécessite l'extension btree_gist)
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE reservation
    ADD CONSTRAINT no_overlap_reservation
    EXCLUDE USING gist (
        id_salle WITH =,
        tsrange(debut, fin) WITH &&
    )
    WHERE (statut IN ('CONFIRMEE', 'EN_ATTENTE'));
