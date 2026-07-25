export type Role = "ETUDIANT" | "ENSEIGNANT" | "ASSOCIATION" | "ADMIN";

export interface AuthUser {
  name: string;
  firstName: string;
  role: Role;
}

export interface AuthResponse extends AuthUser {
  token: string;
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
