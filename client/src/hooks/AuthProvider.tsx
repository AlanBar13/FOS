import { useContext, createContext, useState, PropsWithChildren } from "react";
import { loginUser } from "../services/user.service";
import { LoginData } from "../models/Users";
import { PersistenceKeys } from "../utils/constants";
import { useAlert } from "./useAlert";

interface AuthContextType {
    role: string
    token: string
    loginAction: (username: string, password: string) => void
    logOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const { showAlert } = useAlert();
  const [role, setRole] = useState<string>(localStorage.getItem(PersistenceKeys.ROLE) || "");
  const [token, setToken] = useState(localStorage.getItem(PersistenceKeys.TOKEN) || "");

  const loginAction = async (username: string, password: string) => {
    try {
      const response = await loginUser(username, password);
      const data = response.data as LoginData;
      setRole(data.role);
      setToken(data.token);
      localStorage.setItem(PersistenceKeys.TOKEN, data.token);
      localStorage.setItem(PersistenceKeys.ROLE, data.role);
      return;
    } catch (error) {
      showAlert(`Usuario o Contraseña incorrectos`, 'error');
    }
  }

  const logOut = () => {
    setRole("");
    setToken("");
    localStorage.removeItem(PersistenceKeys.TOKEN);
    localStorage.removeItem(PersistenceKeys.ROLE);
  }


  return <AuthContext.Provider value={{ token, role, loginAction, logOut }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};