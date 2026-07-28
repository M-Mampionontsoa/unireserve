import api from "./api";
import type { ProfileResponse, UpdateProfilePayload } from "../types/user";

/**
 * GET /profile
 * Peut échouer (500) pour un compte Google fraîchement créé, en rôle PENDING :
 * le backend (UserService.getProfileInfo) ne sait pas mapper ce cas.
 * On renvoie null plutôt que de propager l'erreur : l'appelant doit alors
 * afficher un formulaire vide avec sélection du rôle.
 */
export async function getMyProfile(): Promise<ProfileResponse | null> {
  try {
    const { data } = await api.get<ProfileResponse>("/profile");
    return data;
  } catch {
    return null;
  }
}

export async function updateMyProfile(
  payload: UpdateProfilePayload,
): Promise<ProfileResponse> {
  const { data } = await api.put<ProfileResponse>("/profile/update", payload);
  return data;
}
