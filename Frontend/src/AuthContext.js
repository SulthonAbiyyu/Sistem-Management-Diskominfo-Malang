import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLoginStatus = sessionStorage.getItem("isLoggedIn");
    return savedLoginStatus === "true";
  });

  const navigate = useNavigate();

  const login = useCallback(() => {
    setIsLoggedIn(true);
    sessionStorage.setItem("isLoggedIn", "true");
    navigate("/"); 
  }, [navigate]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    sessionStorage.setItem("isLoggedIn", "false");

    const savedUser = sessionStorage.getItem("currentUser");
    const userId = savedUser ? JSON.parse(savedUser).id : null;
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/users/logout/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    }

    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    localStorage.clear();
    const savedLoginStatus = sessionStorage.getItem("isLoggedIn");

    if (savedLoginStatus === "true") {
      setIsLoggedIn(true);
    } else {
      if (window.location.pathname !== "/tambahresetsandi") {
        navigate("/login");
      }
    }

    // ✅ kalau tab ditutup / browser ditutup → user jadi offline
    const handleUnload = () => {
      const savedUser = sessionStorage.getItem("currentUser");
      const userId = savedUser ? JSON.parse(savedUser).id : null;

      if (userId) {
        navigator.sendBeacon(
          `${process.env.REACT_APP_API_URL}/users/logout/${userId}`,
          JSON.stringify({})
        );
      }
    };

    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
