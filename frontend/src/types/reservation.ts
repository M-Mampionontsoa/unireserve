// Types alignés sur les DTOs réels du backend (com.unireserve.dto.Reservation)
// ⚠️ ReservationResponseDto ne renvoie ni "id" ni "statut" côté backend actuellement.
// On ne peut donc pas encore cibler une réservation précise (annulation, etc.)
// ni distinguer visuellement EN_ATTENTE de CONFIRMEE. À ajouter côté backend
// si besoin plus tard (voir ReservationMapperDto).

export type TypeReservation = "RESERVATION" | "BLOCAGE";

export interface ReservationRequestPayload {
  id_salle: number;
  debut: string; // "yyyy-MM-ddTHH:mm:ss"
  fin: string;
  type_reservation: TypeReservation;
}

export interface ReservationResponse {
  debut: string;
  fin: string;
  type_reservation: TypeReservation;
  salleNom: string;
}
