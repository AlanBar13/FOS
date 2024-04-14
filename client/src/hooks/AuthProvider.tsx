import { useContext, createContext, useState, PropsWithChildren } from "react";
import { PersistenceKeys } from "../utils/constants";
import { useAlert } from "./useAlert";
import { useApi } from "./ApiProvider";

interface AuthContextType {
  role: string;
  token: string;
  loginAction: (username: string, password: string) => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const { showAlert } = useAlert();
  const api = useApi();
  const [role, setRole] = useState<string>(
    localStorage.getItem(PersistenceKeys.ROLE) || "",
  );
  const [token, setToken] = useState(
    localStorage.getItem(PersistenceKeys.TOKEN) || "",
  );

  const loginAction = async (username: string, password: string) => {
    try {
      const data = await api.user.loginUser(username, password);
      setRole(data.role);
      setToken(data.token);
      localStorage.setItem(PersistenceKeys.TOKEN, data.token);
      localStorage.setItem(PersistenceKeys.ROLE, data.role);
      return;
    } catch (error) {
      showAlert(`Usuario o Contraseña incorrectos`, "error");
    }
  };

  const logOut = () => {
    setRole("");
    setToken("");
    localStorage.removeItem(PersistenceKeys.TOKEN);
    localStorage.removeItem(PersistenceKeys.ROLE);
  };

  return (
    <AuthContext.Provider value={{ token, role, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth has to be used within <AuthProvider>");
  }
  return authContext;
};
