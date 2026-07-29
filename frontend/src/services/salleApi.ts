import api from "./api";
import type { SalleResponse, SalleRequestPayload } from "../types/salle";

export interface SalleFilters {
  capaciteMin?: number;
  type?: string;
  equipement?: string;
}

export async function getSalles(
  filters: SalleFilters = {},
): Promise<SalleResponse[]> {
  const params: Record<string, string | number> = {};
  if (filters.capaciteMin) params.capaciteMin = filters.capaciteMin;
  if (filters.type) params.type = filters.type;
  if (filters.equipement) params.equipement = filters.equipement;

  const { data } = await api.get<SalleResponse[]>("/salles/filter", { params });
  console.log(data);
  return data;
}

export async function getAllSalles(): Promise<SalleResponse[]> {
  const { data } = await api.get<SalleResponse[]>("/salles");
  console.log(data);
  return data;
}

export async function getSalle(id: number): Promise<SalleResponse> {
  const { data } = await api.get<SalleResponse>(`/salles/${id}`);

  return data;
}

export async function createSalle(
  payload: SalleRequestPayload,
): Promise<SalleResponse> {
  const { data } = await api.post<SalleResponse>("/salles", payload);
  return data;
}

export async function updateSalle(
  id: number,
  payload: SalleRequestPayload,
): Promise<SalleResponse> {
  const { data } = await api.put<SalleResponse>(`/salles/${id}`, payload);
  return data;
}

export async function deleteSalle(id: number): Promise<void> {
  await api.delete(`/salles/${id}`);
}
