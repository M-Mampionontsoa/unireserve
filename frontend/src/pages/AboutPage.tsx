import styles from "./AboutPage.module.css";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <p className={styles.eyebrow}>À propos</p>
      <h1 className={styles.title}>Pourquoi UniReserve</h1>
      <p className={styles.text}>
        UniReserve remplace le fichier Excel partagé utilisé jusqu'ici pour gérer
        les salles de l'établissement. Les doubles réservations, les demandes
        perdues et les créneaux mal communiqués disparaissent au profit d'un
        système centralisé, accessible depuis n'importe quel navigateur.
      </p>
      <p className={styles.text}>
        Chaque rôle — étudiant, enseignant, association, responsable logistique —
        dispose d'un parcours adapté : validation immédiate pour les enseignants,
        workflow de validation pour les étudiants et associations, et un espace de
        modération dédié pour le service logistique.
      </p>
    </div>
  );
}
