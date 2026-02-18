import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // ✅ SAFE LOAD USER
  const getUserFromStorage = () => {
    try {
      const data = localStorage.getItem("user");

      if (!data) return null; // nothing saved yet

      return JSON.parse(data);
    } catch (err) {
      console.error("Invalid user data in storage");
      localStorage.removeItem("user");
      return null;
    }
  };

  const [user, setUser] = useState(getUserFromStorage());

  /* LOGIN */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  /* LOGOUT */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* HOOK */
export const useAuth = () => useContext(AuthContext);
