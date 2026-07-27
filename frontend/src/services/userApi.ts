import type { UserProfile, UpdateProfilePayload } from "../types/user";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getMyProfile(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/api/users/me`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new ApiError("Impossible de charger le profil.", res.status);
  }
  return res.json();
}

export async function updateMyProfile(
  payload: UpdateProfilePayload
): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/api/users/me`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    if (res.status === 400) {
      const data = await res.json().catch(() => null);
      throw new ApiError(data?.message ?? "Données invalides.", res.status);
    }
    throw new ApiError("La mise à jour a échoué.", res.status);
  }
  return res.json();
}

export { ApiError };
