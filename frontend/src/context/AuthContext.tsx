import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { setAuthToken } from "../services/api";
import * as authService from "../services/authService";

import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  UserInfo,
  AuthUser,
} from "../types/auth";
import { useNavigate } from "react-router-dom";

interface AuthContextValue {
  user: UserInfo | null;
  loading: boolean;
  // true dès qu'on a un token valide, même si `user` est encore null
  // (cas d'un compte Google fraîchement créé, rôle pas encore choisi)
  isAuthenticated: boolean;
  loginUser: (credentials: LoginPayload) => Promise<AuthResponse>;
  registerUser: (payload: RegisterPayload) => Promise<AuthUser>;
  /** À appeler depuis la page /callback après un retour Google OAuth réussi */
  completeOAuthLogin: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // 💡 TRÈS IMPORTANT : On initialise 'loading' à true au démarrage
  // pour éviter la redirection prématurée vers /login pendant le F5.
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loginUser = useCallback(
    async (credentials: LoginPayload) => {
      setLoading(true);
      try {
        const data = await authService.login(credentials);
        setUser({
          id: data.user.id,
          nom: data.user.nom,
          prenom: data.user.prenom,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
          profileCompleted: data.user.profileCompleted,
        });
        setAuthToken(data.accessToken);
        setToken(data.accessToken);

        data.user != null && !data.user.profileCompleted
          ? navigate("/profile")
          : navigate("/dashboard");

        return data;
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  const registerUser = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);

    try {
      return await authService.register(payload);
    } finally {
      setLoading(false);
    }
  }, []);

  // Retour de /oauth2/authorization/google
  const completeOAuthLogin = useCallback(
    async (accessToken: string) => {
      setLoading(true);

      try {
        // 1 - enregistrer le JWT dans Axios
        setAuthToken(accessToken);

        // 2 - dire au contexte qu'on possède maintenant un token
        setToken(accessToken);

        // 3 - demander au backend qui est connecté
        const user = await authService.me();

        // 4 - mettre l'utilisateur dans React
        setUser(user);

        user.profileCompleted ? navigate("/profile") : navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    setToken(null);
  }, []);

  const restoreSession = useCallback(async () => {
    setLoading(true); // On s'assure que le loading reste actif pendant la vérification
    try {
      // 1. Récupérer le nouveau JWT via le cookie HTTP-Only
      const tokens = await authService.refresh();

      // Récupération souple (couvre 'accessToken' ou 'token')
      const newAccessToken = tokens.accessToken || (tokens as any).token;

      if (!newAccessToken) {
        console.warn("Aucun token trouvé dans la réponse /refresh");
        logout();
        return;
      }

      // 2. Mettre à jour Axios et le state local React
      setAuthToken(newAccessToken);
      setToken(newAccessToken);

      // 3. Charger les données utilisateur avec le nouveau token
      const user = await authService.me();
      setUser(user);
    } catch (error) {
      console.warn("Session expirée ou non existante :", error);
      logout();
    } finally {
      // 💡 Crucial : On termine le chargement SEULEMENT quand tout est résolu (succès ou échec)
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        registerUser,
        completeOAuthLogin,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un <AuthProvider>");
  return ctx;
}
