import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile } from "../services/userApi";
import { useAuth } from "../context/AuthContext";
import type {
  Niveau,
  ProfileResponse,
  RoleActif,
  UpdateProfilePayload,
} from "../types/user";
import { ROLE_LABELS } from "../types/user";
import styles from "../assets/ProfilePage.module.css";

const NIVEAUX: Niveau[] = ["L1", "L2", "L3", "M1", "M2"];
const ROLES: RoleActif[] = ["ETUDIANT", "ENSEIGNANT", "ASSOCIATION", "ADMIN"];

interface FormState {
  nom: string;
  prenom: string;
  username: string;
  mail: string;
  faculte: string;
  mention: string;
  parcours: string;
  numeroInscription: string;
  niveau: Niveau | "";
  numeroMatricule: string;
  matiereEnseignee: string;
  typeActivite: string;
  status: string;
}

const EMPTY_FORM: FormState = {
  nom: "",
  prenom: "",
  username: "",
  mail: "",
  faculte: "",
  mention: "",
  parcours: "",
  numeroInscription: "",
  niveau: "",
  numeroMatricule: "",
  matiereEnseignee: "",
  typeActivite: "",
  status: "",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<RoleActif | null>(null);
  const [roleLocked, setRoleLocked] = useState(false); // rôle déjà défini côté backend -> non modifiable
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/connexion", { replace: true });
      return;
    }

    getMyProfile()
      .then((data) => {
        if (data) {
          applyProfile(data);

          if (data.role !== "PENDING") {
            setRoleLocked(true);
          }
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  function applyProfile(data: ProfileResponse) {
    setRole(data.role as RoleActif);
    setForm({
      nom: data.nom ?? "",
      prenom: data.prenom ?? "",
      username: data.username ?? "",
      mail: data.mail ?? "",
      faculte: data.faculte ?? "",
      mention: data.mention ?? "",
      parcours: data.parcours ?? "",
      numeroInscription: data.numeroInscription ?? "",
      niveau: data.niveau ?? "",
      numeroMatricule: data.numeroMatricule ?? "",
      matiereEnseignee: data.matiereEnseignee ?? "",
      typeActivite: data.typeActivite ?? "",
      status: data.status ?? "",
    });
  }

  function handleChange<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildPayload(): UpdateProfilePayload | null {
    if (!role) return null;
    const base = {
      nom: form.nom,
      prenom: form.prenom,
      username: form.username,
      mail: form.mail,
    };

    switch (role) {
      case "ETUDIANT":
        return {
          type: "ETUDIANT",
          ...base,
          faculte: form.faculte,
          mention: form.mention,
          parcours: form.parcours,
          numeroInscription: form.numeroInscription,
          niveau: form.niveau,
          profileCompleted: true,
        };
      case "ENSEIGNANT":
        return {
          type: "ENSEIGNANT",
          ...base,
          faculte: form.faculte,
          mention: form.mention,
          parcours: form.parcours,
          numeroMatricule: form.numeroMatricule,
          matiereEnseignee: form.matiereEnseignee,
          profileCompleted: true,
        };
      case "ASSOCIATION":
        return {
          type: "ASSOCIATION",
          ...base,
          typeActivite: form.typeActivite,
          profileCompleted: true,
        };
      case "ADMIN":
        return {
          type: "ADMIN",
          ...base,
          status: form.status,
          profileCompleted: true,
        };
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!role) {
      setError("Sélectionne ton rôle avant d'enregistrer.");
      return;
    }

    const payload = buildPayload();
    if (!payload) return;

    setSaving(true);
    try {
      const updated = await updateMyProfile(payload);
      applyProfile(updated);
      setRoleLocked(true);
      setSuccess("Profil enregistré.");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("La mise à jour a échoué. Vérifie les champs et réessaie.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>Chargement du profil…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {roleLocked ? "Mon profil" : "Complète ton profil"}
        </h1>
        {role && <span className={styles.roleBadge}>{ROLE_LABELS[role]}</span>}
      </header>

      {!roleLocked && (
        <p className={styles.hint}>
          Aucune information trouvée pour ce compte. Choisis ton rôle et
          renseigne tes informations pour continuer.
        </p>
      )}

      {success && <div className={styles.successBox}>{success}</div>}
      {error && <div className={styles.errorBox}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        {!roleLocked && (
          <fieldset className={styles.fieldset}>
            <legend>Rôle</legend>
            <div className={styles.roleGrid}>
              {ROLES.map((r) => (
                <button
                  type="button"
                  key={r}
                  className={
                    role === r ? styles.roleOptionActive : styles.roleOption
                  }
                  onClick={() => setRole(r)}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset className={styles.fieldset}>
          <legend>Informations générales</legend>

          <Field label="Nom">
            <input
              value={form.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              required
            />
          </Field>

          <Field label="Prénom">
            <input
              value={form.prenom}
              onChange={(e) => handleChange("prenom", e.target.value)}
              required
            />
          </Field>

          <Field label="Nom d'utilisateur">
            <input
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              required
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={form.mail}
              onChange={(e) => handleChange("mail", e.target.value)}
              required
            />
          </Field>
        </fieldset>

        {(role === "ETUDIANT" || role === "ENSEIGNANT") && (
          <fieldset className={styles.fieldset}>
            <legend>Informations académiques</legend>

            <Field label="Faculté">
              <input
                value={form.faculte}
                onChange={(e) => handleChange("faculte", e.target.value)}
              />
            </Field>

            <Field label="Mention">
              <input
                value={form.mention}
                onChange={(e) => handleChange("mention", e.target.value)}
              />
            </Field>

            <Field label="Parcours">
              <input
                value={form.parcours}
                onChange={(e) => handleChange("parcours", e.target.value)}
              />
            </Field>

            {role === "ETUDIANT" && (
              <>
                <Field label="Niveau">
                  <select
                    value={form.niveau}
                    onChange={(e) =>
                      handleChange("niveau", e.target.value as Niveau | "")
                    }
                  >
                    <option value="">Sélectionner…</option>
                    {NIVEAUX.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Numéro d'inscription">
                  <input
                    value={form.numeroInscription}
                    onChange={(e) =>
                      handleChange("numeroInscription", e.target.value)
                    }
                  />
                </Field>
              </>
            )}

            {role === "ENSEIGNANT" && (
              <>
                <Field label="Matière enseignée">
                  <input
                    value={form.matiereEnseignee}
                    onChange={(e) =>
                      handleChange("matiereEnseignee", e.target.value)
                    }
                  />
                </Field>

                <Field label="Numéro matricule">
                  <input
                    value={form.numeroMatricule}
                    onChange={(e) =>
                      handleChange("numeroMatricule", e.target.value)
                    }
                  />
                </Field>
              </>
            )}
          </fieldset>
        )}

        {role === "ASSOCIATION" && (
          <fieldset className={styles.fieldset}>
            <legend>Informations association</legend>
            <Field label="Type d'activité">
              <input
                value={form.typeActivite}
                onChange={(e) => handleChange("typeActivite", e.target.value)}
              />
            </Field>
          </fieldset>
        )}

        {role === "ADMIN" && (
          <fieldset className={styles.fieldset}>
            <legend>Informations responsable logistique</legend>
            <Field label="Statut">
              <input
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              />
            </Field>
          </fieldset>
        )}

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={saving || !role}
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
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
