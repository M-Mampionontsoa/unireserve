import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProfilePage from "./pages/ProfilePage";
import SallesPage from "./pages/SallesPage";
import ProtectedRoute from "./router/ProtectedRoute";
import GoogleCallback from "./pages/auth/GoogleCallback";
import CataloguePage from "./pages/CataloguePage";

function App() {
  return (
    // 1. BrowserRouter EN PREMIER pour activer le routage React
    <BrowserRouter>
      {/* 2. AuthProvider EN SECOND pour que useNavigate() fonctionne dans AuthContext */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/connexion" replace />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/callback" element={<GoogleCallback />} />
          <Route
            path="/profile/update"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salles"
            element={
              <ProtectedRoute rolesAutorises={["ADMIN"]}>
                <SallesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogue"
            element={
              <ProtectedRoute>
                <CataloguePage />
              </ProtectedRoute>
            }
          />

          {/* Prochaines routes : /reservations, /admin/* (protegees via ProtectedRoute) */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
