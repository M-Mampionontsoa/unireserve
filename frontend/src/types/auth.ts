export type Role =
  | "ETUDIANT"
  | "ENSEIGNANT"
  | "ASSOCIATION"
  | "ADMIN"
  | "PENDING";

export interface AuthUser {
  success: boolean;
  message: String;
  id: number;
  nom: string;
  prenom: string;
  username: String;
  email: String;
  role: Role;
}

export interface UserInfo {
  id: number;
  nom: string;
  prenom: string;
  username: string;
  email: string;
  role: Role;
  profileCompleted: boolean;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserInfo;
}

export interface RegisterPayload {
  name: string;
  firstName: string;
  username: string;
  email: string;
  password: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
