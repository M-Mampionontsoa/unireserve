import api, { setAuthToken } from "./api";
import type {
  AuthResponse,
  AuthUser,
  UserInfo,
  LoginPayload,
  RegisterPayload,
  TokenResponse,
} from "../types/auth";

/**
 * Adapte les noms de champs envoyés ici à ceux de tes DTO backend
 * (RegisterRequest / LoginRequest) si tu les as nommés différemment.
 */

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const { data } = await api.post<AuthUser>("/signin", payload);
  return data;
}

export async function me(): Promise<UserInfo> {
  const { data } = await api.get<UserInfo>("/me");
  return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/login", payload);
  if (data?.accessToken) setAuthToken(data.accessToken);
  return data;
}

export async function refresh(): Promise<TokenResponse> {
  const { data } = await api.post("/refresh");

  return data;
}

export async function logout(): Promise<void> {
  try {
    // Révoque le refresh token côté serveur et efface le cookie httpOnly.
    // Best-effort : même si ça échoue (réseau down, cookie déjà absent...),
    // on veut quand même vider la session locale ensuite.
    await api.post("/logout");
  } catch {
    // rien à faire : on nettoie l'état local dans tous les cas (voir AuthContext.logout)
  } finally {
    setAuthToken(null);
  }
}
