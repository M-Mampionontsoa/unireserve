import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/auth";

interface ProtectedRouteProps {
  children: ReactElement;
  rolesAutorises?: Role[];
}

/**
 * Usage dans App.tsx :
 *
 *   <Route
 *     path="/admin/*"
 *     element={
 *       <ProtectedRoute rolesAutorises={["ADMIN"]}>
 *         <AdminDashboard />
 *       </ProtectedRoute>
 *     }
 *   />
 */
export default function ProtectedRoute({
  children,
  rolesAutorises,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (rolesAutorises && (!user || !rolesAutorises.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return children;
}
