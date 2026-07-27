import { useEffect, useState, type FormEvent } from "react";
import { getMyProfile, updateMyProfile, ApiError } from "../api/userApi";
import type { UserProfile, UpdateProfilePayload } from "../types/user";
import styles from "./ProfilePage.module.css";

const ROLE_LABELS: Record<UserProfile["role"], string> = {
  ETUDIANT: "Étudiant",
  ENSEIGNANT: "Enseignant",
  ADMIN: "Responsable logistique",
};

const NIVEAUX = ["L1", "L2", "L3", "M1", "M2"] as const;

type Status = "loading" | "viewing" | "editing" | "saving" | "error";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<UpdateProfilePayload>({});
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getMyProfile()
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        setForm(stripReadOnlyFields(data));
        setStatus("viewing");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setErrorMessage(
          err instanceof ApiError ? err.message : "Une erreur est survenue."
        );
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function stripReadOnlyFields(data: UserProfile): UpdateProfilePayload {
    const { id: _id, role: _role, email: _email, ...rest } = data;
    return rest;
  }

  function handleChange(field: keyof UpdateProfilePayload, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleCancel() {
    if (profile) setForm(stripReadOnlyFields(profile));
    setStatus("viewing");
    setErrorMessage(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    try {
      const updated = await updateMyProfile(form);
      setProfile(updated);
      setForm(stripReadOnlyFields(updated));
      setStatus("viewing");
      setSuccessMessage("Profil mis à jour.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError ? err.message : "La mise à jour a échoué."
      );
      setStatus("editing");
    }
  }

  if (status === "loading") {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>Chargement du profil…</p>
      </div>
    );
  }

  if (status === "error" && !profile) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>
          <p>{errorMessage}</p>
          <button
            className={styles.secondaryButton}
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const isEditing = status === "editing" || status === "saving";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Mon profil</h1>
          <span className={styles.roleBadge}>{ROLE_LABELS[profile.role]}</span>
        </div>
        {!isEditing && (
          <button
            className={styles.primaryButton}
            onClick={() => setStatus("editing")}
          >
            Modifier
          </button>
        )}
      </header>

      {successMessage && <div className={styles.successBox}>{successMessage}</div>}
      {errorMessage && isEditing && (
        <div className={styles.errorBox}>{errorMessage}</div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles.fieldset} disabled={!isEditing}>
          <legend>Informations générales</legend>

          <Field label="Nom">
            <input
              value={form.nom ?? ""}
              onChange={(e) => handleChange("nom", e.target.value)}
              required
            />
          </Field>

          <Field label="Prénom">
            <input
              value={form.prenom ?? ""}
              onChange={(e) => handleChange("prenom", e.target.value)}
              required
            />
          </Field>

          <Field label="Nom d'utilisateur">
            <input
              value={form.nomUtilisateur ?? ""}
              onChange={(e) => handleChange("nomUtilisateur", e.target.value)}
              required
            />
          </Field>

          <Field label="Email">
            <input value={profile.email} disabled className={styles.readOnly} />
          </Field>
        </fieldset>

        {(profile.role === "ETUDIANT" || profile.role === "ENSEIGNANT") && (
          <fieldset className={styles.fieldset} disabled={!isEditing}>
            <legend>Informations académiques</legend>

            <Field label="Faculté">
              <input
                value={form.faculte ?? ""}
                onChange={(e) => handleChange("faculte", e.target.value)}
              />
            </Field>

            <Field label="Mention">
              <input
                value={form.mention ?? ""}
                onChange={(e) => handleChange("mention", e.target.value)}
              />
            </Field>

            <Field label="Parcours">
              <input
                value={form.parcours ?? ""}
                onChange={(e) => handleChange("parcours", e.target.value)}
              />
            </Field>

            {profile.role === "ETUDIANT" && (
              <>
                <Field label="Niveau">
                  <select
                    value={form.niveau ?? ""}
                    onChange={(e) => handleChange("niveau", e.target.value)}
                  >
                    <option value="" disabled>
                      Sélectionner…
                    </option>
                    {NIVEAUX.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Numéro d'inscription">
                  <input
                    value={form.numeroInscription ?? ""}
                    onChange={(e) =>
                      handleChange("numeroInscription", e.target.value)
                    }
                  />
                </Field>
              </>
            )}

            {profile.role === "ENSEIGNANT" && (
              <>
                <Field label="Matière enseignée">
                  <input
                    value={form.matiereEnseignee ?? ""}
                    onChange={(e) =>
                      handleChange("matiereEnseignee", e.target.value)
                    }
                  />
                </Field>

                <Field label="Numéro matricule">
                  <input
                    value={form.numeroMatricule ?? ""}
                    onChange={(e) =>
                      handleChange("numeroMatricule", e.target.value)
                    }
                  />
                </Field>
              </>
            )}
          </fieldset>
        )}

        {isEditing && (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleCancel}
              disabled={status === "saving"}
            >
              Annuler
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={status === "saving"}
            >
              {status === "saving" ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        )}
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
