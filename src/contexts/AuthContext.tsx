import React, { createContext, useContext, useState, useEffect } from "react";

interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profile: string;
  organizationId: string;
  organizationName: string;
  organizationType: "school" | "company";
  isVerified: boolean;
  plan: string;
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  verifyEmail: (code: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  orgName: string;
  orgType: "school" | "company";
  orgAddress: string;
  orgEmail: string;
  orgPhone: string;
  plan: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("csm_admin");
    if (stored) {
      setAdmin(JSON.parse(stored));
    }
    const dm = localStorage.getItem("csm_darkmode") === "true";
    setDarkMode(dm);
    if (dm) document.documentElement.classList.add("dark");
    setIsLoading(false);
  }, []);

  const toggleDarkMode = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    localStorage.setItem("csm_darkmode", String(newVal));
    document.documentElement.classList.toggle("dark", newVal);
  };

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const mockAdmin: Admin = {
      id: "1",
      firstName: "Admin",
      lastName: "User",
      email,
      username: "admin",
      profile: "default.jpg",
      organizationId: "1",
      organizationName: "Demo Organization",
      organizationType: "school",
      isVerified: true,
      plan: "free_trial",
    };
    setAdmin(mockAdmin);
    localStorage.setItem("csm_admin", JSON.stringify(mockAdmin));
    setIsLoading(false);
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const newAdmin: Admin = {
      id: "1",
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
      profile: "default.jpg",
      organizationId: "1",
      organizationName: data.orgName,
      organizationType: data.orgType,
      isVerified: false,
      plan: data.plan,
    };
    setAdmin(newAdmin);
    localStorage.setItem("csm_admin", JSON.stringify(newAdmin));
    setIsLoading(false);
  };

  const verifyEmail = async (code: string) => {
    await new Promise(r => setTimeout(r, 1000));
    if (code.length === 6 && admin) {
      const verified = { ...admin, isVerified: true };
      setAdmin(verified);
      localStorage.setItem("csm_admin", JSON.stringify(verified));
      return true;
    }
    return false;
  };

  const resetPassword = async (_email: string) => {
    await new Promise(r => setTimeout(r, 1000));
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("csm_admin");
  };

  return (
    <AuthContext.Provider value={{
      admin,
      isAuthenticated: !!admin && admin.isVerified,
      isLoading,
      login, register, logout, verifyEmail, resetPassword,
      darkMode, toggleDarkMode,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
