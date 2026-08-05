import api from "./api";
import type {
  ReservationRequestPayload,
  ReservationResponse,
} from "../types/reservation";

export async function createReservation(
  payload: ReservationRequestPayload,
): Promise<ReservationResponse> {
  const { data } = await api.post<ReservationResponse>(
    "/reservations",
    payload,
  );
  return data;
}

export async function getReservationsForSalle(
  salleId: number,
): Promise<ReservationResponse[]> {
  const { data } = await api.get<ReservationResponse[]>(
    `/reservations/salle/${salleId}`,
  );
  return data;
}

// ---- Modération (ADMIN) ----

export async function getReservationsEnAttente(): Promise<
  ReservationResponse[]
> {
  const { data } = await api.get<ReservationResponse[]>(
    "/reservations/enAttente",
  );
  console.group(data);
  return data;
}

export async function getReservationsRefusees(): Promise<
  ReservationResponse[]
> {
  const { data } = await api.get<ReservationResponse[]>("/reservations/refuse");
  return data;
}

export async function getReservationsValidees(): Promise<
  ReservationResponse[]
> {
  const { data } = await api.get<ReservationResponse[]>("/reservations/valide");
  return data;
}

export async function validerReservation(
  id: number,
): Promise<ReservationResponse> {
  const { data } = await api.put<ReservationResponse>(
    `/reservations/${id}/valider`,
  );
  return data;
}

export async function refuserReservation(
  id: number,
  motif: string,
): Promise<ReservationResponse> {
  // Le backend attend @RequestBody String motif : une chaîne JSON brute
  // (donc entre guillemets), pas un objet { motif: ... }.
  const { data } = await api.put<ReservationResponse>(
    `/reservations/${id}/refuser`,
    JSON.stringify(motif),
    { headers: { "Content-Type": "application/json" } },
  );
  return data;
}

export async function blockSalle(
  payload: ReservationRequestPayload,
): Promise<ReservationResponse> {
  const { data } = await api.post<ReservationResponse>(
    "/reservations/block",
    payload,
  );
  return data;
}
