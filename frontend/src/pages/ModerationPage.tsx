import { useEffect, useState } from "react";
import {
  getReservationsEnAttente,
  validerReservation,
  refuserReservation,
} from "../services/reservationApi";
import type { ReservationResponse } from "../types/reservation";
import styles from "./ModerationPage.module.css";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ModerationPage() {
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [processingId, setProcessingId] = useState<number | null>(null);
  const [refusalTarget, setRefusalTarget] = useState<ReservationResponse | null>(null);
  const [motif, setMotif] = useState("");

  function load() {
    setLoading(true);
    setError(null);
    getReservationsEnAttente()
      .then(setReservations)
      .catch(() => setError("Impossible de charger les demandes en attente."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pattern légitime : chargement initial de la liste
    load();
  }, []);

  async function handleValider(reservation: ReservationResponse) {
    setProcessingId(reservation.id);
    setError(null);
    try {
      await validerReservation(reservation.id);
      setReservations((prev) => prev.filter((r) => r.id !== reservation.id));
      setSuccess(`Réservation de "${reservation.salleNom}" validée.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("La validation a échoué. Réessaie.");
    } finally {
      setProcessingId(null);
    }
  }

  function openRefusal(reservation: ReservationResponse) {
    setRefusalTarget(reservation);
    setMotif("");
    setError(null);
  }

  async function confirmRefusal() {
    if (!refusalTarget) return;
    if (!motif.trim()) {
      setError("Le motif de refus est obligatoire.");
      return;
    }

    setProcessingId(refusalTarget.id);
    setError(null);
    try {
      await refuserReservation(refusalTarget.id, motif.trim());
      setReservations((prev) => prev.filter((r) => r.id !== refusalTarget.id));
      setSuccess(`Réservation de "${refusalTarget.salleNom}" refusée.`);
      setTimeout(() => setSuccess(null), 3000);
      setRefusalTarget(null);
    } catch {
      setError("Le refus a échoué. Réessaie.");
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Demandes en attente</h1>
        <span className={styles.countBadge}>{reservations.length}</span>
      </header>

      {success && <div className={styles.successBox}>{success}</div>}
      {error && !refusalTarget && <div className={styles.errorBox}>{error}</div>}

      {loading ? (
        <p className={styles.loading}>Chargement…</p>
      ) : reservations.length === 0 ? (
        <p className={styles.empty}>Aucune demande en attente pour l'instant.</p>
      ) : (
        <div className={styles.list}>
          {reservations.map((r) => (
            <div key={r.id} className={styles.card}>
              <div className={styles.cardInfo}>
                <p className={styles.salleNom}>{r.salleNom}</p>
                <p className={styles.periode}>
                  {formatDateTime(r.debut)} → {formatDateTime(r.fin)}
                </p>
              </div>
              <div className={styles.cardActions}>
                <button
                  className={styles.refuseButton}
                  onClick={() => openRefusal(r)}
                  disabled={processingId === r.id}
                >
                  Refuser
                </button>
                <button
                  className={styles.validateButton}
                  onClick={() => handleValider(r)}
                  disabled={processingId === r.id}
                >
                  {processingId === r.id ? "…" : "Valider"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {refusalTarget && (
        <div className={styles.overlay} onClick={() => setRefusalTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Refuser la demande</h2>
            <p className={styles.modalSubtitle}>
              {refusalTarget.salleNom} — {formatDateTime(refusalTarget.debut)}
            </p>

            {error && <div className={styles.errorBox}>{error}</div>}

            <label className={styles.field}>
              <span>Motif du refus</span>
              <textarea
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                rows={3}
                placeholder="Explique brièvement pourquoi cette demande est refusée…"
                autoFocus
              />
            </label>

            <div className={styles.modalActions}>
              <button
                className={styles.secondaryButton}
                onClick={() => setRefusalTarget(null)}
                disabled={processingId === refusalTarget.id}
              >
                Annuler
              </button>
              <button
                className={styles.refuseButton}
                onClick={confirmRefusal}
                disabled={processingId === refusalTarget.id}
              >
                {processingId === refusalTarget.id ? "Envoi…" : "Confirmer le refus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
