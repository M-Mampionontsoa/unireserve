import { useEffect, useState, type FormEvent } from "react";
import { getSalles } from "../services/salleApi";
import type { SalleResponse } from "../types/salle";
import styles from "./CataloguePage.module.css";

interface FilterState {
  capaciteMin: string;
  type: string;
  equipement: string;
}

const EMPTY_FILTERS: FilterState = {
  capaciteMin: "",
  type: "",
  equipement: "",
};

export default function CataloguePage() {
  const [salles, setSalles] = useState<SalleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  useEffect(() => {
    search(EMPTY_FILTERS);
  }, []);

  function search(f: FilterState) {
    setLoading(true);
    setError(null);
    getSalles({
      capaciteMin: f.capaciteMin ? Number(f.capaciteMin) : undefined,
      type: f.type || undefined,
      equipement: f.equipement || undefined,
    })
      .then(setSalles)
      .catch(() => setError("Impossible de charger les salles."))
      .finally(() => setLoading(false));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    search(filters);
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS);
    search(EMPTY_FILTERS);
  }

  function handleChange(field: keyof FilterState, value: string) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Catalogue des salles</h1>
      </header>

      <form className={styles.filters} onSubmit={handleSubmit}>
        <label className={styles.filterField}>
          <span>Capacité min.</span>
          <input
            type="number"
            min={0}
            placeholder="ex: 30"
            value={filters.capaciteMin}
            onChange={(e) => handleChange("capaciteMin", e.target.value)}
          />
        </label>

        <label className={styles.filterField}>
          <span>Type</span>
          <input
            placeholder="Amphithéâtre, salle TD…"
            value={filters.type}
            onChange={(e) => handleChange("type", e.target.value)}
          />
        </label>

        <label className={styles.filterField}>
          <span>Équipement</span>
          <input
            placeholder="Vidéoprojecteur…"
            value={filters.equipement}
            onChange={(e) => handleChange("equipement", e.target.value)}
          />
        </label>

        <div className={styles.filterActions}>
          <button type="submit" className={styles.primaryButton} disabled={loading}>
            Rechercher
          </button>
          <button type="button" className={styles.secondaryButton} onClick={handleReset}>
            Réinitialiser
          </button>
        </div>
      </form>

      {error && <div className={styles.errorBox}>{error}</div>}

      {loading ? (
        <p className={styles.loading}>Recherche en cours…</p>
      ) : salles.length === 0 ? (
        <p className={styles.empty}>Aucune salle ne correspond à ces critères.</p>
      ) : (
        <div className={styles.grid}>
          {salles.map((salle) => (
            <div key={salle.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{salle.nom}</h2>
                <span className={styles.typeBadge}>{salle.type}</span>
              </div>
              <p className={styles.capacite}>Capacité : {salle.capacite}</p>

              {salle.materiels?.length > 0 && (
                <ul className={styles.materielList}>
                  {salle.materiels.map((m, i) => (
                    <li key={i}>
                      {m.nom} {m.quantite ? `× ${m.quantite}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
