import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { RegisterPage } from "../../components/auth/AuthPages";
import { useAuth } from "../../context/AuthContext";
import type { RegisterPayload } from "../../types/auth";

export default function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (formData: RegisterPayload) => {
    setApiError("");
    try {
      await registerUser(formData);
      navigate("/connexion");
    } catch (err) {
      const message =
        isAxiosError(err) && err.response?.status === 409
          ? "Cette adresse email est déjà utilisée."
          : "Une erreur est survenue, réessaie.";
      setApiError(message);
    }
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
      <RegisterPage
        onSubmit={handleSubmit}
        onSwitchToLogin={() => navigate("/connexion")}
      />
    </>
  );
}
