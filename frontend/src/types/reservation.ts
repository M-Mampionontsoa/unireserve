// Types alignés sur les DTOs réels du backend (com.unireserve.dto.Reservation)

export type TypeReservation = "RESERVATION" | "BLOCAGE";
export type StatutReservation = "EN_ATTENTE" | "CONFIRMEE" | "REFUSEE";

export interface ReservationRequestPayload {
  id_salle: number;
  debut: string; // "yyyy-MM-ddTHH:mm:ss"
  fin: string;
  type_reservation: TypeReservation;
}

export interface ReservationResponse {
  id: number;
  debut: string;
  fin: string;
  type_reservation: TypeReservation;
  salleNom: string;
  statut: StatutReservation;
}
