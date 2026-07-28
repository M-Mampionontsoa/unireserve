import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { completeOAuthLogin } = useAuth();

  useEffect(() => {
    async function handleCallback() {
      const token = searchParams.get("token");

      if (!token) {
        navigate("/connexion");
        return;
      }

      try {
        await completeOAuthLogin(token);
      } catch (error) {
        console.error(error);
        navigate("/connexion");
      }
    }

    handleCallback();
  }, []);

  return <div>Connexion Google en cours...</div>;
}
