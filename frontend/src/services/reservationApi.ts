import api from "./api";
import type {
  ReservationRequestPayload,
  ReservationResponse,
} from "../types/reservation";

export async function createReservation(
  payload: ReservationRequestPayload,
): Promise<ReservationResponse> {
  const { data } = await api.post<ReservationResponse>("/reservations", payload);
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
