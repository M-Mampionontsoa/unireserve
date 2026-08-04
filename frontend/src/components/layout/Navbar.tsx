import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";

const ROLE_LABELS: Record<string, string> = {
  ETUDIANT: "Étudiant",
  ENSEIGNANT: "Enseignant",
  ASSOCIATION: "Association",
  ADMIN: "Responsable logistique",
};

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.logo}>
          <span className={styles.logoMark}>UR</span>
          UniReserve
        </NavLink>

        <nav className={styles.links}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
          >
            Accueil
          </NavLink>
          <NavLink
            to="/a-propos"
            className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
          >
            À propos
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/catalogue"
                className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
              >
                Catalogue
              </NavLink>
              <NavLink
                to="/reservations"
                className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
              >
                Réserver
              </NavLink>
              {user?.role === "ADMIN" && (
                <>
                  <NavLink
                    to="/moderation"
                    className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
                  >
                    Modération
                  </NavLink>
                  <NavLink
                    to="/salles"
                    className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
                  >
                    Salles
                  </NavLink>
                </>
              )}
            </>
          )}
        </nav>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              {user && (
                <NavLink to="/profile/update" className={styles.userPill}>
                  <span className={styles.userName}>
                    {user.prenom} {user.nom}
                  </span>
                  <span className={styles.userRole}>{ROLE_LABELS[user.role] ?? user.role}</span>
                </NavLink>
              )}
              <button className={styles.logoutButton} onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/connexion" className={styles.linkGhost}>
                Connexion
              </NavLink>
              <NavLink to="/inscription" className={styles.ctaButton}>
                Inscription
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
