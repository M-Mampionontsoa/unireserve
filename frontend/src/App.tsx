import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./router/ProtectedRoute";
import GoogleCallback from "./pages/auth/GoogleCallback";

function App() {
  return (
    <BrowserRouter>
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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
