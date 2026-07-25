import api, { setAuthToken } from "./api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "../types/auth";

/**
 * Adapte les noms de champs envoyés ici à ceux de tes DTO backend
 * (RegisterRequest / LoginRequest) si tu les as nommés différemment.
 */

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/signin", payload);
  return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/login", payload);
  if (data?.token) setAuthToken(data.token);
  return data;
}

export function logout(): void {
  setAuthToken(null);
}
