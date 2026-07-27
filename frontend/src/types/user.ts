export type Role = "ETUDIANT" | "ENSEIGNANT" | "ADMIN" | "ASSOCIATION";

export interface BaseUser {
  id: number;
  nom: string;
  prenom: string;
  nomUtilisateur: string;
  email: string;
  role: Role;
}

export interface EtudiantProfile extends BaseUser {
  role: "ETUDIANT";
  faculte?: string;
  mention?: string;
  parcours?: string;
  niveau?: "L1" | "L2" | "L3" | "M1" | "M2";
  numeroInscription?: string;
}

export interface EnseignantProfile extends BaseUser {
  role: "ENSEIGNANT";
  faculte?: string;
  mention?: string;
  parcours?: string;
  matiereEnseignee?: string;
  numeroMatricule?: string;
}

export interface AdminProfile extends BaseUser {
  role: "ADMIN";
}

export type UserProfile = EtudiantProfile | EnseignantProfile | AdminProfile;

// Payload envoyé au PUT /api/users/me — id et role exclus (non modifiables ici)
export type UpdateProfilePayload = Partial<
  Omit<UserProfile, "id" | "role" | "email">
>;
