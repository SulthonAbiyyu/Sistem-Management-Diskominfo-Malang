import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check localStorage for login status during initialization
    const savedLoginStatus = localStorage.getItem("isLoggedIn");
    return savedLoginStatus === "true";
  });

  const navigate = useNavigate();

  const login = useCallback(() => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true"); // Save login status in localStorage
    navigate("/"); // Redirect to dashboard after login
  }, [navigate]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false"); // Remove login status from localStorage

    // Update user's status to offline on the server
    const savedUser = localStorage.getItem("currentUser");
    const userId = savedUser ? JSON.parse(savedUser).id : null;
    if (userId) {
      fetch(`http://localhost:4000/users/logout/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    navigate("/login"); // Redirect to login page after logout
  }, [navigate]);

  useEffect(() => {
    const savedLoginStatus = localStorage.getItem("isLoggedIn");
  
    // Jika pengguna tidak login, jangan redirect ke halaman login jika mereka mengakses halaman tertentu
    if (savedLoginStatus !== "true") {
      if (window.location.pathname !== "/tambahresetsandi") {
        navigate("/login");
      }
    } else {
      setIsLoggedIn(true);
    }
  
    const handleBeforeUnload = (event) => {
      sessionStorage.setItem("isPageBeingClosed", "true");
    };
  
    const handleUnload = () => {
      if (sessionStorage.getItem("isPageBeingClosed")) {
        logout(); // Log out the user
      }
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [navigate, logout]);
  

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
