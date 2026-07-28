// Types alignés sur les DTOs réels du backend (com.unireserve.dto)
// GET /profile -> ProfileDto (+ champs du sous-type selon "role")
// PUT /profile/update -> UpdateProfileDto (discriminé par le champ "type")

export type RoleActif = "ETUDIANT" | "ENSEIGNANT" | "ASSOCIATION" | "ADMIN";
// PENDING = compte Google fraîchement créé, rôle pas encore choisi
export type Role = RoleActif | "PENDING";

export type Niveau = "L1" | "L2" | "L3" | "M1" | "M2";

export interface ProfileResponse {
  id: number;
  nom: string;
  prenom: string;
  username: string;
  mail: string;
  role: Role;

  profile_completed: boolean;

  faculte?: string;
  mention?: string;
  parcours?: string;

  numeroInscription?: string;
  niveau?: Niveau;

  numeroMatricule?: string;
  matiereEnseignee?: string;

  typeActivite?: string;

  status?: string;
}

interface UpdateProfileBase {
  nom: string;
  prenom: string;
  username: string;
  mail: string;
  profileCompleted: boolean;
}

export interface UpdateEtudiantPayload extends UpdateProfileBase {
  type: "ETUDIANT";
  faculte: string;
  mention: string;
  parcours: string;
  numeroInscription: string;
  niveau: Niveau | "";
}

export interface UpdateEnseignantPayload extends UpdateProfileBase {
  type: "ENSEIGNANT";
  faculte: string;
  mention: string;
  parcours: string;
  numeroMatricule: string;
  matiereEnseignee: string;
}

export interface UpdateAssociationPayload extends UpdateProfileBase {
  type: "ASSOCIATION";
  typeActivite: string;
}

export interface UpdateAdminPayload extends UpdateProfileBase {
  type: "ADMIN";
  status: string;
}

export type UpdateProfilePayload =
  | UpdateEtudiantPayload
  | UpdateEnseignantPayload
  | UpdateAssociationPayload
  | UpdateAdminPayload;

export const ROLE_LABELS: Record<RoleActif, string> = {
  ETUDIANT: "Étudiant",
  ENSEIGNANT: "Enseignant",
  ASSOCIATION: "Association",
  ADMIN: "Responsable logistique",
};
