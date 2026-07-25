import { useState, type ChangeEvent, type FormEvent } from "react";
import type { LoginPayload, RegisterPayload } from "../../types/auth";

const styles = `
  .ur-root {
    --ink: #16233d;
    --ink-soft: #5b6478;
    --paper: #f6f7fa;
    --card: #ffffff;
    --line: #e3e6ee;
    --primary: #2954e0;
    --primary-deep: #1b3aa8;
    --primary-wash: #eef1fd;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: var(--ink);
    background: var(--paper);
    min-height: 100%;
    width: 100%;
  }
  .ur-display {
    font-family: Georgia, "Iowan Old Style", "Palatino Linotype", serif;
  }
  .ur-shell {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.86fr);
    min-height: 100vh;
  }
  @media (max-width: 860px) {
    .ur-shell { grid-template-columns: 1fr; }
    .ur-illustration { display: none; }
  }
  .ur-form-col {
    display: flex;
    flex-direction: column;
    padding: 28px clamp(24px, 6vw, 88px);
  }
  .ur-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: clamp(24px, 6vh, 64px);
  }
  .ur-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .ur-nav-links {
    display: flex;
    gap: 28px;
    font-size: 14px;
    color: var(--ink-soft);
  }
  .ur-nav-links a {
    color: inherit;
    text-decoration: none;
  }
  .ur-nav-links a:hover { color: var(--ink); }
  .ur-nav-links button {
    background: none;
    border: none;
    font: inherit;
    color: var(--primary);
    cursor: pointer;
    padding: 0;
  }
  .ur-form-wrap {
    max-width: 380px;
    width: 100%;
    margin: 0 auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .ur-eyebrow {
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--primary);
    margin-bottom: 10px;
  }
  .ur-title {
    font-size: clamp(28px, 3.4vw, 34px);
    line-height: 1.15;
    margin: 0 0 8px;
  }
  .ur-subtitle {
    font-size: 14.5px;
    color: var(--ink-soft);
    margin: 0 0 32px;
    line-height: 1.5;
  }
  .ur-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .ur-field {
    margin-bottom: 18px;
  }
  .ur-field label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 7px;
    color: var(--ink);
  }
  .ur-field input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--line);
    background: var(--card);
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 14.5px;
    color: var(--ink);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .ur-field input::placeholder { color: #a7adbd; }
  .ur-field input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-wash);
  }
  .ur-field-error input {
    border-color: #d1435b;
  }
  .ur-error-text {
    font-size: 12.5px;
    color: #d1435b;
    margin-top: 6px;
  }
  .ur-submit {
    width: 100%;
    border: none;
    border-radius: 999px;
    background: var(--primary);
    color: white;
    font-size: 15px;
    font-weight: 600;
    padding: 13px 18px;
    cursor: pointer;
    margin-top: 6px;
    transition: background 0.15s ease, transform 0.05s ease;
  }
  .ur-submit:hover { background: var(--primary-deep); }
  .ur-submit:active { transform: scale(0.99); }
  .ur-submit:focus-visible {
    outline: 3px solid var(--primary-wash);
    outline-offset: 2px;
  }
  .ur-submit[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .ur-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 22px 0;
    color: var(--ink-soft);
    font-size: 12.5px;
  }
  .ur-divider::before, .ur-divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--line);
  }
  .ur-google {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 1px solid var(--line);
    background: var(--card);
    border-radius: 999px;
    padding: 11px 16px;
    font-size: 14.5px;
    font-weight: 500;
    color: var(--ink);
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease;
  }
  .ur-google:hover { border-color: #c4cadb; background: #fafbfc; }
  .ur-google:focus-visible {
    outline: 3px solid var(--primary-wash);
    outline-offset: 2px;
  }
  .ur-switch {
    text-align: center;
    font-size: 13.5px;
    color: var(--ink-soft);
    margin-top: 26px;
  }
  .ur-switch button {
    background: none;
    border: none;
    font: inherit;
    font-weight: 600;
    color: var(--primary);
    cursor: pointer;
    padding: 0;
  }
  .ur-switch button:hover { text-decoration: underline; }

  /* --- Illustration panel --- */
  .ur-illustration {
    position: relative;
    overflow: hidden;
    background: linear-gradient(160deg, #17285c 0%, #1b3aa8 55%, #2954e0 100%);
    display: flex;
    align-items: flex-end;
  }
  .ur-illustration-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 34px 34px;
  }
  .ur-illustration-content {
    position: relative;
    padding: 56px;
    color: white;
  }
  .ur-illustration-eyebrow {
    font-size: 12.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.7;
    margin-bottom: 12px;
  }
  .ur-illustration-quote {
    font-family: Georgia, "Iowan Old Style", "Palatino Linotype", serif;
    font-size: 22px;
    line-height: 1.4;
    max-width: 360px;
    margin: 0 0 20px;
  }
  .ur-illustration-meta {
    font-size: 13px;
    opacity: 0.75;
  }
`;

function LogoMark() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden="true"
    >
      <path d="M13 4L24 9.2L13 14.4L2 9.2L13 4Z" fill="#2954E0" />
      <path
        d="M7 11.4V16.4C7 16.4 9.2 18.6 13 18.6C16.8 18.6 19 16.4 19 16.4V11.4"
        stroke="#2954E0"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AmphiBlueprint() {
  const rows = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 420 260" width="100%" height="auto" aria-hidden="true">
      {rows.map((r) => {
        const radius = 60 + r * 26;
        const cy = 250;
        return (
          <path
            key={r}
            d={`M ${210 - radius} ${cy} A ${radius} ${radius * 0.62} 0 0 1 ${210 + radius} ${cy}`}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.2"
          />
        );
      })}
      <rect
        x="170"
        y="205"
        width="80"
        height="14"
        rx="3"
        fill="rgba(255,255,255,0.55)"
      />
      <circle cx="210" cy="212" r="3" fill="#2954E0" />
    </svg>
  );
}

function GoogleGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9C16.66 14.2 17.64 11.9 17.64 9.2z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}

function IllustrationPanel({ mode }: { mode: "register" | "login" }) {
  return (
    <div className="ur-illustration">
      <div className="ur-illustration-grid" />
      <div className="ur-illustration-content">
        <div style={{ marginBottom: 40, opacity: 0.9 }}>
          <AmphiBlueprint />
        </div>
        <div className="ur-illustration-eyebrow">Grand Amphi · 732 places</div>
        <p className="ur-illustration-quote">
          {mode === "register"
            ? "Chaque salle de l'université, réservable en quelques clics — sans fichier partagé, sans conflit de créneau."
            : "Reprends là où tu t'es arrêté : tes réservations, en un coup d'œil."}
        </p>
        <div className="ur-illustration-meta">
          UniReserve — Système de réservation de salles
        </div>
      </div>
    </div>
  );
}

function TopNav({
  mode,
  onSwitch,
}: {
  mode: "register" | "login";
  onSwitch: () => void;
}) {
  return (
    <div className="ur-nav">
      <div className="ur-logo ur-display">
        <LogoMark />
        UniReserve
      </div>
      <div className="ur-nav-links">
        <a href="#contact">Contact</a>
        <a href="#apropos">À propos</a>
        <button onClick={onSwitch}>
          {mode === "register" ? "Se connecter" : "S'inscrire"}
        </button>
      </div>
    </div>
  );
}

interface RegisterPageProps {
  onSubmit: (data: RegisterPayload) => Promise<void>;
  onSwitchToLogin: () => void;
}

type RegisterErrors = Partial<Record<keyof RegisterPayload, string>>;

export function RegisterPage({ onSubmit, onSwitchToLogin }: RegisterPageProps) {
  const [form, setForm] = useState<RegisterPayload>({
    name: "",
    firstName: "",
    username: "",
    email: "",
    password: "",
    role: "ETUDIANT",
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const update =
    (field: keyof RegisterPayload) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): boolean => {
    const next: RegisterErrors = {};
    if (!form.name.trim()) next.name = "Requis";
    if (!form.firstName.trim()) next.firstName = "Requis";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Adresse email invalide";
    if (form.password.length < 8) next.password = "8 caractères minimum";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ur-root">
      <style>{styles}</style>
      <div className="ur-shell">
        <div className="ur-form-col">
          <TopNav mode="register" onSwitch={onSwitchToLogin} />
          <div className="ur-form-wrap">
            <div className="ur-eyebrow">Nouveau compte</div>
            <h1 className="ur-title ur-display">S'inscrire</h1>
            <p className="ur-subtitle">
              Crée ton compte pour réserver une salle ou soumettre une demande.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="ur-row">
                <div
                  className={`ur-field ${errors.name ? "ur-field-error" : ""}`}
                >
                  <label htmlFor="nom">Nom</label>
                  <input
                    id="nom"
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Rakoto"
                    autoComplete="family-name"
                  />
                  {errors.name && (
                    <div className="ur-error-text">{errors.name}</div>
                  )}
                </div>
                <div
                  className={`ur-field ${errors.firstName ? "ur-field-error" : ""}`}
                >
                  <label htmlFor="prenom">Prénom</label>
                  <input
                    id="prenom"
                    value={form.firstName}
                    onChange={update("firstName")}
                    placeholder="Mario"
                    autoComplete="given-name"
                  />
                  {errors.firstName && (
                    <div className="ur-error-text">{errors.firstName}</div>
                  )}
                </div>
              </div>

              <div
                className={`ur-field ${errors.email ? "ur-field-error" : ""}`}
              >
                <label htmlFor="email">Adresse email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="nom@domaine.mg"
                  autoComplete="email"
                />
                {errors.email && (
                  <div className="ur-error-text">{errors.email}</div>
                )}
              </div>

              <div
                className={`ur-field ${errors.password ? "ur-field-error" : ""}`}
              >
                <label htmlFor="motDePasse">Mot de passe</label>
                <input
                  id="motDePasse"
                  type="password"
                  value={form.password}
                  onChange={update("password")}
                  placeholder="8 caractères minimum"
                  autoComplete="new-password"
                />
                {errors.password && (
                  <div className="ur-error-text">{errors.password}</div>
                )}
              </div>
              <div
                className={`ur-field ${errors.role ? "ur-field-error" : ""}`}
              >
                <label htmlFor="role">Rôle</label>
                <select
                  id="role"
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      role: e.target.value as
                        | "ETUDIANT"
                        | "ENSEIGNANT"
                        | "ASSOCIATION"
                        | "ADMIN", // Ajoutez le cast vers le type Role
                    }))
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid var(--line)",
                    background: "var(--card)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    fontSize: "14.5px",
                    color: "var(--ink)",
                    transition:
                      "border-color 0.15s ease, box-shadow 0.15s ease",
                    appearance: "auto",
                    cursor: "pointer",
                  }}
                  className={errors.role ? "ur-field-error" : ""}
                >
                  <option value="ETUDIANT">Étudiant</option>
                  <option value="ASSOCIATION">Association</option>
                  <option value="ADMIN">Admin</option>
                  <option value="ENSEIGNANT">Enseignant</option>
                </select>
                {errors.role && (
                  <div className="ur-error-text">{errors.role}</div>
                )}
              </div>

              <button className="ur-submit" type="submit" disabled={submitting}>
                {submitting ? "Création du compte…" : "S'inscrire"}
              </button>
            </form>

            <div className="ur-switch">
              Déjà un compte ?{" "}
              <button type="button" onClick={onSwitchToLogin}>
                Se connecter
              </button>
            </div>
          </div>
        </div>
        <IllustrationPanel mode="register" />
      </div>
    </div>
  );
}

interface LoginPageProps {
  onSubmit: (data: LoginPayload) => Promise<void>;
  onSwitchToRegister: () => void;
  onGoogleLogin: () => void;
}

type LoginErrors = Partial<Record<keyof LoginPayload, string>>;

export function LoginPage({
  onSubmit,
  onSwitchToRegister,
  onGoogleLogin,
}: LoginPageProps) {
  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const update =
    (field: keyof LoginPayload) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): boolean => {
    const next: LoginErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Adresse email invalide";
    if (!form.password) next.password = "Requis";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ur-root">
      <style>{styles}</style>
      <div className="ur-shell">
        <div className="ur-form-col">
          <TopNav mode="login" onSwitch={onSwitchToRegister} />
          <div className="ur-form-wrap">
            <div className="ur-eyebrow">Bon retour</div>
            <h1 className="ur-title ur-display">Se connecter</h1>
            <p className="ur-subtitle">
              Accède à tes réservations et aux salles disponibles.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div
                className={`ur-field ${errors.email ? "ur-field-error" : ""}`}
              >
                <label htmlFor="login-email">Adresse email</label>
                <input
                  id="login-email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="nom@domaine.mg"
                  autoComplete="email"
                />
                {errors.email && (
                  <div className="ur-error-text">{errors.email}</div>
                )}
              </div>

              <div
                className={`ur-field ${errors.password ? "ur-field-error" : ""}`}
              >
                <label htmlFor="login-password">Mot de passe</label>
                <input
                  id="login-password"
                  type="password"
                  value={form.password}
                  onChange={update("password")}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                {errors.password && (
                  <div className="ur-error-text">{errors.password}</div>
                )}
              </div>

              <button className="ur-submit" type="submit" disabled={submitting}>
                {submitting ? "Connexion…" : "Se connecter"}
              </button>
            </form>

            <div className="ur-divider">ou</div>

            <button type="button" className="ur-google" onClick={onGoogleLogin}>
              <GoogleGlyph />
              Continuer avec Google
            </button>

            <div className="ur-switch">
              Pas encore de compte ?{" "}
              <button type="button" onClick={onSwitchToRegister}>
                S'inscrire
              </button>
            </div>
          </div>
        </div>
        <IllustrationPanel mode="login" />
      </div>
    </div>
  );
}

/* --- Styles injectés une fois : à monter en haut de l'app (voir App.tsx) --- */
export function AuthStyles() {
  return <style>{styles}</style>;
}
