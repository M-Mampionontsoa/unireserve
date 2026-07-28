import { useEffect, useState, type FormEvent } from "react";
import {
  getAllSalles,
  createSalle,
  updateSalle,
  deleteSalle,
} from "../services/salleApi";
import type {
  Materiel,
  SalleRequestPayload,
  SalleResponse,
} from "../types/salle";
import styles from "./SallesPage.module.css";

const EMPTY_MATERIEL: Materiel = {
  nom: "",
  type: "",
  quantite: 1,
  etat: "",
  date_acquisition: "",
};

interface SalleFormState {
  nom: string;
  type: string;
  capacite: string;
  quantite: string;
  etat: string;
  date_acquisition: string;
  materiels: Materiel[];
}

const EMPTY_FORM: SalleFormState = {
  nom: "",
  type: "",
  capacite: "",
  quantite: "",
  etat: "",
  date_acquisition: "",
  materiels: [],
};

export default function SallesPage() {
  const [salles, setSalles] = useState<SalleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SalleFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadSalles();
  }, []);

  function loadSalles() {
    setLoading(true);
    setListError(null);
    getAllSalles()
      .then(setSalles)
      .catch(() => setListError("Impossible de charger les salles."))
      .finally(() => setLoading(false));
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setFormOpen(true);
  }

  function openEditForm(salle: SalleResponse) {
    setEditingId(salle.id);
    setForm({
      nom: salle.nom ?? "",
      type: salle.type ?? "",
      capacite: String(salle.capacite ?? ""),
      // Non fournis par GET /salles (voir note) : on repart de vide.
      quantite: String(salle.quantite ?? ""),
      etat: salle.etat ?? "",
      date_acquisition: "",
      materiels: salle.materiels ?? [],
    });
    setFormError(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
  }

  function handleField<K extends keyof SalleFormState>(
    field: K,
    value: SalleFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addMateriel() {
    setForm((prev) => ({
      ...prev,
      materiels: [...prev.materiels, { ...EMPTY_MATERIEL }],
    }));
  }

  function removeMateriel(index: number) {
    setForm((prev) => ({
      ...prev,
      materiels: prev.materiels.filter((_, i) => i !== index),
    }));
  }

  function handleMaterielField(
    index: number,
    field: keyof Materiel,
    value: string | number,
  ) {
    setForm((prev) => ({
      ...prev,
      materiels: prev.materiels.map((m, i) =>
        i === index ? { ...m, [field]: value } : m,
      ),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const capacite = Number(form.capacite);
    const quantite = Number(form.quantite);

    if (!form.nom.trim() || !form.type.trim()) {
      setFormError("Le nom et le type de la salle sont obligatoires.");
      return;
    }
    if (Number.isNaN(capacite) || capacite <= 0) {
      setFormError("La capacité doit être un nombre positif.");
      return;
    }
    if (Number.isNaN(quantite) || quantite < 0) {
      setFormError("La quantité doit être un nombre valide.");
      return;
    }

    const payload: SalleRequestPayload = {
      nom: form.nom,
      type: form.type,
      capacite,
      quantite,
      etat: form.etat,
      date_acquisition: form.date_acquisition || null,
      materiels: form.materiels,
    };

    setSaving(true);
    try {
      if (editingId != null) {
        await updateSalle(editingId, payload);
      } else {
        await createSalle(payload);
      }
      closeForm();
      loadSalles();
    } catch {
      setFormError(
        "Échec de l'enregistrement. Vérifie les champs et réessaie.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Supprimer cette salle définitivement ?")) return;
    setDeletingId(id);
    try {
      await deleteSalle(id);
      setSalles((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setListError("La suppression a échoué.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gestion des salles</h1>
        <button className={styles.primaryButton} onClick={openCreateForm}>
          + Ajouter une salle
        </button>
      </header>

      {listError && <div className={styles.errorBox}>{listError}</div>}

      {loading ? (
        <p className={styles.loading}>Chargement des salles…</p>
      ) : salles.length === 0 ? (
        <p className={styles.empty}>Aucune salle enregistrée pour l'instant.</p>
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

              <div className={styles.cardActions}>
                <button
                  className={styles.secondaryButton}
                  onClick={() => openEditForm(salle)}
                >
                  Modifier
                </button>
                <button
                  className={styles.dangerButton}
                  onClick={() => handleDelete(salle.id)}
                  disabled={deletingId === salle.id}
                >
                  {deletingId === salle.id ? "Suppression…" : "Supprimer"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div className={styles.overlay} onClick={closeForm}>
          <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>
                {editingId != null ? "Modifier la salle" : "Nouvelle salle"}
              </h2>
              <button className={styles.closeButton} onClick={closeForm}>
                ×
              </button>
            </div>

            {editingId != null && (
              <p className={styles.hint}>
                Quantité, état et date d'acquisition ne sont pas renvoyés par
                l'API pour l'instant : renseigne-les à nouveau si besoin, sinon
                ils seront enregistrés vides.
              </p>
            )}

            {formError && <div className={styles.errorBox}>{formError}</div>}

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <Field label="Nom">
                  <input
                    value={form.nom}
                    onChange={(e) => handleField("nom", e.target.value)}
                    required
                  />
                </Field>
                <Field label="Type">
                  <input
                    value={form.type}
                    onChange={(e) => handleField("type", e.target.value)}
                    placeholder="Amphithéâtre, salle TD…"
                    required
                  />
                </Field>
              </div>

              <div className={styles.row}>
                <Field label="Capacité">
                  <input
                    type="number"
                    min={1}
                    value={form.capacite}
                    onChange={(e) => handleField("capacite", e.target.value)}
                    required
                  />
                </Field>
                <Field label="Quantité">
                  <input
                    type="number"
                    min={0}
                    value={form.quantite}
                    onChange={(e) => handleField("quantite", e.target.value)}
                  />
                </Field>
              </div>

              <div className={styles.row}>
                <Field label="État">
                  <input
                    value={form.etat}
                    onChange={(e) => handleField("etat", e.target.value)}
                    placeholder="Bon, à rénover…"
                  />
                </Field>
                <Field label="Date d'acquisition">
                  <input
                    type="datetime-local"
                    value={form.date_acquisition}
                    onChange={(e) =>
                      handleField("date_acquisition", e.target.value)
                    }
                  />
                </Field>
              </div>

              <div className={styles.materielsSection}>
                <div className={styles.materielsHeader}>
                  <span>Équipements</span>
                  <button
                    type="button"
                    className={styles.addMaterielButton}
                    onClick={addMateriel}
                  >
                    + Ajouter un équipement
                  </button>
                </div>

                {form.materiels.map((m, i) => (
                  <div key={i} className={styles.materielRow}>
                    <input
                      placeholder="Nom"
                      value={m.nom}
                      onChange={(e) =>
                        handleMaterielField(i, "nom", e.target.value)
                      }
                    />
                    <input
                      placeholder="Type"
                      value={m.type}
                      onChange={(e) =>
                        handleMaterielField(i, "type", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      min={0}
                      placeholder="Qté"
                      value={m.quantite}
                      onChange={(e) =>
                        handleMaterielField(
                          i,
                          "quantite",
                          Number(e.target.value),
                        )
                      }
                    />
                    <input
                      placeholder="État"
                      value={m.etat}
                      onChange={(e) =>
                        handleMaterielField(i, "etat", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className={styles.removeMaterielButton}
                      onClick={() => removeMateriel(i)}
                      aria-label="Retirer cet équipement"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={closeForm}
                  disabled={saving}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={saving}
                >
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
    </label>
  );
}
