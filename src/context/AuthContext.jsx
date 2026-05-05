import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "@/services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await authAPI.checkAuth();
      if (res.data.success) {
        const user = res.data.user;
        setUser({
          id: user.id,
          name: user.userName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          city: user.city,
          province: user.province,
          bio: user.bio,
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      const loggedUser = res.data.user;
      setUser({
        id: loggedUser.id,
        name: loggedUser.userName,
        email: loggedUser.email,
        role: loggedUser.role,
        phone: loggedUser.phone || "",
        city: loggedUser.city || "",
        province: loggedUser.province || "",
        bio: loggedUser.bio || "",
      });
      setIsAuthenticated(true);
    }
    return res.data;
  };

  const register = async (userName, email, password) => {
    const res = await authAPI.register({ userName, email, password });
    return res.data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
