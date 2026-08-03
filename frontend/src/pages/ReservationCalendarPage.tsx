import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getAllSalles } from "../services/salleApi";
import {
  createReservation,
  getReservationsForSalle,
} from "../services/reservationApi";
import type { SalleResponse } from "../types/salle";
import type { ReservationResponse } from "../types/reservation";
import styles from "./ReservationCalendarPage.module.css";

const SLOT_MINUTES = 30;
const DAY_START_HOUR = 7;
const DAY_END_HOUR = 20;

interface Slot {
  start: Date;
  end: Date;
  label: string;
  busy: boolean;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function toLocalDateTimeString(date: Date): string {
  // "yyyy-MM-ddTHH:mm:ss" attendu par le backend (LocalDateTime)
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
  );
}

function buildSlots(dateIso: string, reservations: ReservationResponse[]): Slot[] {
  const slots: Slot[] = [];
  const [year, month, day] = dateIso.split("-").map(Number);

  const intervals = reservations.map((r) => ({
    start: new Date(r.debut),
    end: new Date(r.fin),
  }));

  for (let h = DAY_START_HOUR; h < DAY_END_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      const start = new Date(year, month - 1, day, h, m, 0);
      const end = new Date(start.getTime() + SLOT_MINUTES * 60000);

      const busy = intervals.some((iv) => start < iv.end && end > iv.start);

      slots.push({
        start,
        end,
        label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
        busy,
      });
    }
  }

  return slots;
}

export default function ReservationCalendarPage() {
  const { user } = useAuth();

  const [salles, setSalles] = useState<SalleResponse[]>([]);
  const [selectedSalleId, setSelectedSalleId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(todayIso());

  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [durationSlots, setDurationSlots] = useState(2); // 2 * 30min = 1h par défaut
  const [submitting, setSubmitting] = useState(false);

  const instantConfirm = user?.role === "ENSEIGNANT" || user?.role === "ADMIN";

  useEffect(() => {
    getAllSalles()
      .then((data) => {
        setSalles(data);
        if (data.length > 0) setSelectedSalleId(data[0].id);
      })
      .catch(() => setError("Impossible de charger les salles."));
  }, []);

  useEffect(() => {
    if (selectedSalleId == null) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pattern légitime : on affiche le chargement avant le fetch
    setLoadingReservations(true);
    setError(null);
    setSelectedSlot(null);

    getReservationsForSalle(selectedSalleId)
      .then((data) => {
        if (!cancelled) setReservations(data);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger les réservations de cette salle.");
      })
      .finally(() => {
        if (!cancelled) setLoadingReservations(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSalleId]);

  const slots = useMemo(
    () => buildSlots(selectedDate, reservations),
    [selectedDate, reservations],
  );

  function handleSlotClick(slot: Slot) {
    if (slot.busy) return;
    setSelectedSlot(slot);
    setDurationSlots(2);
    setSuccess(null);
    setError(null);
  }

  function endOfBooking(): Date {
    if (!selectedSlot) return new Date();
    return new Date(
      selectedSlot.start.getTime() + durationSlots * SLOT_MINUTES * 60000,
    );
  }

  function bookingOverlapsBusy(): boolean {
    if (!selectedSlot) return false;
    const end = endOfBooking();
    return reservations.some((r) => {
      const rStart = new Date(r.debut);
      const rEnd = new Date(r.fin);
      return selectedSlot.start < rEnd && end > rStart;
    });
  }

  async function handleBook() {
    if (!selectedSlot || selectedSalleId == null) return;

    if (bookingOverlapsBusy()) {
      setError("La durée choisie chevauche un créneau déjà occupé.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await createReservation({
        id_salle: selectedSalleId,
        debut: toLocalDateTimeString(selectedSlot.start),
        fin: toLocalDateTimeString(endOfBooking()),
        type_reservation: "RESERVATION",
      });

      setSuccess(
        instantConfirm
          ? "Réservation confirmée instantanément."
          : "Demande envoyée, en attente de validation par le responsable logistique.",
      );
      setSelectedSlot(null);

      const fresh = await getReservationsForSalle(selectedSalleId);
      setReservations(fresh);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError(
          "Quelqu'un vient de réserver ce créneau à l'instant. Le planning a été mis à jour, choisis un autre horaire.",
        );
        setSelectedSlot(null);
        // Le créneau vient d'être pris par quelqu'un d'autre : on rafraîchit
        // la grille pour refléter l'état réel de la salle.
        try {
          const fresh = await getReservationsForSalle(selectedSalleId);
          setReservations(fresh);
        } catch {
          // tant pis, l'utilisateur verra l'ancien état jusqu'au prochain changement de salle/date
        }
      } else if (axios.isAxiosError(err) && err.response?.status === 400) {
        setError(
          err.response.data?.error ?? "Créneau invalide. Vérifie les horaires choisis.",
        );
      } else {
        setError("La réservation a échoué. Réessaie dans un instant.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Réserver une salle</h1>
        {instantConfirm && (
          <span className={styles.badgeInstant}>Confirmation immédiate</span>
        )}
        {!instantConfirm && (
          <span className={styles.badgePending}>Nécessite une validation</span>
        )}
      </header>

      <div className={styles.controls}>
        <label className={styles.field}>
          <span>Salle</span>
          <select
            value={selectedSalleId ?? ""}
            onChange={(e) => setSelectedSalleId(Number(e.target.value))}
          >
            {salles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nom} ({s.capacite} places)
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Date</span>
          <input
            type="date"
            value={selectedDate}
            min={todayIso()}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}
      {success && <div className={styles.successBox}>{success}</div>}

      {loadingReservations ? (
        <p className={styles.loading}>Chargement du planning…</p>
      ) : (
        <div className={styles.grid}>
          {slots.map((slot) => (
            <button
              key={slot.label}
              type="button"
              disabled={slot.busy}
              className={
                slot.busy
                  ? styles.slotBusy
                  : selectedSlot?.start.getTime() === slot.start.getTime()
                    ? styles.slotSelected
                    : styles.slotFree
              }
              onClick={() => handleSlotClick(slot)}
            >
              {slot.label}
            </button>
          ))}
        </div>
      )}

      {selectedSlot && (
        <div className={styles.bookingPanel}>
          <p className={styles.bookingSummary}>
            {selectedDate} — {selectedSlot.label} à{" "}
            {String(endOfBooking().getHours()).padStart(2, "0")}:
            {String(endOfBooking().getMinutes()).padStart(2, "0")}
          </p>

          <label className={styles.field}>
            <span>Durée</span>
            <select
              value={durationSlots}
              onChange={(e) => setDurationSlots(Number(e.target.value))}
            >
              <option value={1}>30 min</option>
              <option value={2}>1 h</option>
              <option value={3}>1 h 30</option>
              <option value={4}>2 h</option>
              <option value={6}>3 h</option>
            </select>
          </label>

          <div className={styles.bookingActions}>
            <button
              className={styles.secondaryButton}
              onClick={() => setSelectedSlot(null)}
              disabled={submitting}
            >
              Annuler
            </button>
            <button
              className={styles.primaryButton}
              onClick={handleBook}
              disabled={submitting}
            >
              {submitting
                ? "Réservation…"
                : instantConfirm
                  ? "Réserver (confirmation immédiate)"
                  : "Envoyer la demande"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
