import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { LoginPage } from "../../components/auth/AuthPages";
import { useAuth } from "../../context/AuthContext";
import type { LoginPayload } from "../../types/auth";

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (formData: LoginPayload) => {
    setApiError("");
    try {
      await loginUser(formData);
      navigate("/salles"); // adapte vers ta route "Liste des salles"
    } catch (err) {
      const message =
        isAxiosError(err) && err.response?.status === 401
          ? "Email ou mot de passe incorrect."
          : "Une erreur est survenue, réessaie.";
      setApiError(message);
    }
  };

  const handleGoogleLogin = () => {
    const base =
      import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
      "http://localhost:8081";
    window.location.href = `${base}/oauth2/authorization/google`;
  };

  return (
    <>
      {apiError && (
        <div
          role="alert"
          style={{
            background: "#fdecee",
            color: "#b3273f",
            padding: "10px 16px",
            fontSize: 13.5,
            textAlign: "center",
          }}
        >
          {apiError}
        </div>
      )}
      <LoginPage
        onSubmit={handleSubmit}
        onSwitchToRegister={() => navigate("/inscription")}
        onGoogleLogin={handleGoogleLogin}
      />
    </>
  );
}
