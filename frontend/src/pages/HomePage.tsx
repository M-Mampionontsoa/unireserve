import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className={styles.page}>
        <section className={styles.dashHero}>
          <p className={styles.eyebrow}>UniReserve</p>
          <h1 className={styles.dashTitle}>
            Bonjour {user?.prenom ?? ""}
            {user?.prenom ? "," : ""} bienvenue.
          </h1>
          <p className={styles.dashSubtitle}>
            Trouve une salle disponible et réserve en quelques clics.
          </p>
        </section>

        <section className={styles.cardGrid}>
          <Link to="/catalogue" className={styles.dashCard}>
            <span className={styles.dashCardTitle}>Catalogue des salles</span>
            <span className={styles.dashCardText}>
              Consulte les salles disponibles, leur capacité et leurs équipements.
            </span>
          </Link>

          <Link to="/reservations" className={styles.dashCard}>
            <span className={styles.dashCardTitle}>Réserver une salle</span>
            <span className={styles.dashCardText}>
              Choisis un créneau libre et réserve — confirmation immédiate si tu es
              enseignant.
            </span>
          </Link>

          {user?.role === "ADMIN" && (
            <>
              <Link to="/moderation" className={styles.dashCard}>
                <span className={styles.dashCardTitle}>Modération</span>
                <span className={styles.dashCardText}>
                  Valide ou refuse les demandes de réservation en attente.
                </span>
              </Link>
              <Link to="/salles" className={styles.dashCard}>
                <span className={styles.dashCardTitle}>Gestion des salles</span>
                <span className={styles.dashCardText}>
                  Ajoute, modifie ou supprime des salles et leurs équipements.
                </span>
              </Link>
            </>
          )}

          <Link to="/profile/update" className={styles.dashCard}>
            <span className={styles.dashCardTitle}>Mon profil</span>
            <span className={styles.dashCardText}>
              Vérifie ou modifie tes informations personnelles.
            </span>
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Système de réservation de salles</p>
        <h1 className={styles.heroTitle}>
          Réserver une salle ne devrait pas être un fichier Excel partagé.
        </h1>
        <p className={styles.heroSubtitle}>
          UniReserve centralise les salles, les créneaux et les validations pour
          éliminer les doubles réservations, en un endroit accessible à tous.
        </p>
        <div className={styles.heroActions}>
          <Link to="/inscription" className={styles.primaryCta}>
            Créer un compte
          </Link>
          <Link to="/connexion" className={styles.secondaryCta}>
            Se connecter
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <span className={styles.featureLabel}>Disponibilité en temps réel</span>
          <p className={styles.featureText}>
            Consulte le planning de chaque salle et repère un créneau libre en un
            coup d'œil.
          </p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureLabel}>Validation adaptée au rôle</span>
          <p className={styles.featureText}>
            Confirmation immédiate pour les enseignants, validation par le
            responsable logistique pour les étudiants et associations.
          </p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureLabel}>Zéro conflit</span>
          <p className={styles.featureText}>
            Deux personnes ne peuvent jamais se retrouver sur le même créneau, dans
            la même salle.
          </p>
        </div>
      </section>
    </div>
  );
}
