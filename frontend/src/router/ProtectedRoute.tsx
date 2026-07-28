import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/auth";

interface ProtectedRouteProps {
  children: ReactElement;
  rolesAutorises?: Role[];
}

export default function ProtectedRoute({
  children,
  rolesAutorises,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();

  // 1. Tant que le contexte charge la session, on affiche un spinner ou rien
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span>Chargement...</span>
      </div>
    );
  }

  // 2. Si après le chargement, on n'a toujours pas de token -> vers la connexion
  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }

  // 3. Si des rôles sont exigés mais que le profil `user` n'a pas encore fini
  // d'être chargé par /me, on attend encore au lieu de rediriger !
  if (rolesAutorises && !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span>Chargement du profil...</span>
      </div>
    );
  }

  // 4. Si le profil est chargé mais que l'utilisateur n'a pas le bon rôle
  if (rolesAutorises && user && !rolesAutorises.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 5. Tout est OK !
  return children;
}
