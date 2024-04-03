import { useContext, createContext, useState, PropsWithChildren } from "react";
import { loginUser } from "../services/user.service";
import { LoginData } from "../models/Users";


interface AuthContextType {
    role: string | null
    token: string
    loginAction: (username: string, password: string) => void
    logOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState(localStorage.getItem("fos:user") || "");

  const loginAction = async (username: string, password: string) => {
    try {
      const response = await loginUser(username, password);
      const data = response.data as LoginData;
      setRole(data.role);
      setToken(data.token);
      return;
    } catch (error) {
      console.log(error);
    }
  }

  const logOut = () => {
    setRole(null);
    setToken("");
    localStorage.removeItem("fos:user");
  }


  return <AuthContext.Provider value={{ token, role, loginAction, logOut }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};