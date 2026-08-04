import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProfilePage from "./pages/ProfilePage";
import SallesPage from "./pages/SallesPage";
import ProtectedRoute from "./router/ProtectedRoute";
import GoogleCallback from "./pages/auth/GoogleCallback";
import CataloguePage from "./pages/CataloguePage";
import ReservationCalendarPage from "./pages/ReservationCalendarPage";
import ModerationPage from "./pages/ModerationPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Layout from "./components/layout/Layout";

function App() {
  return (
    // 1. BrowserRouter EN PREMIER pour activer le routage React
    <BrowserRouter>
      {/* 2. AuthProvider EN SECOND pour que useNavigate() fonctionne dans AuthContext */}
      <AuthProvider>
        <Routes>
          {/* Pages d'authentification : mise en page pleine hauteur dédiée,
              avec leur propre navigation intégrée (voir AuthPages.tsx) */}
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/callback" element={<GoogleCallback />} />

          {/* Toutes les autres pages partagent la navbar persistante */}
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/a-propos"
            element={
              <Layout>
                <AboutPage />
              </Layout>
            }
          />
          <Route
            path="/profile/update"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/salles"
            element={
              <ProtectedRoute rolesAutorises={["ADMIN"]}>
                <Layout>
                  <SallesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogue"
            element={
              <ProtectedRoute>
                <Layout>
                  <CataloguePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReservationCalendarPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/moderation"
            element={
              <ProtectedRoute rolesAutorises={["ADMIN"]}>
                <Layout>
                  <ModerationPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
