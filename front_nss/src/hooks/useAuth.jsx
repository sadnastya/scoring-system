import { createContext, useContext, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Добавим логирование для отладки
  const login = (newToken) => {
    console.log("Logging in with token:", newToken);
    localStorage.setItem("token", newToken);
    setToken(newToken);
    navigate("/quoteOsago"); // Перенаправим пользователя на главную страницу после входа
  };

  const logout = async () => {
    try {
      if (localStorage.getItem("token")) {
        const response = await api.post("/auth/logout");
        if (response.status === 200) {
          console.log("Logout successful");
          localStorage.removeItem("token");
          setToken(null);
          localStorage.removeItem("__permifyUser");
        } else {
          console.log("Logout failed with status:", response.status);
        }
      } else {
        console.log("Token is missing in localStorage");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/signin");
    }
  };

  const isLoggedIn = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export const useAuth = () => {
  return useAuthContext();
};