import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@/lib/api";

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
  loginWithGoogle: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  verifyEmail: (code: string) => Promise<boolean>;
  resendCode: () => Promise<void>;
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

// Use mock mode when no real backend is available
const USE_MOCK = false; // Set to true for local testing without backend

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

  const persistAdmin = (a: Admin, token?: string) => {
    setAdmin(a);
    localStorage.setItem("csm_admin", JSON.stringify(a));
    if (token) localStorage.setItem("csm_token", token);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 1000));
        const mockAdmin: Admin = {
          id: "1", firstName: "Admin", lastName: "User", email, username: "admin",
          profile: "default.jpg", organizationId: "1", organizationName: "Demo Organization",
          organizationType: "school", isVerified: true, plan: "free_trial",
        };
        persistAdmin(mockAdmin);
      } else {
        const res = await authApi.login(email, password);
        if (!res.success) throw new Error(res.error);
        const { admin: a, token } = res.data as { admin: Admin; token: string };
        persistAdmin(a, token);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 1000));
        const mockAdmin: Admin = {
          id: "1", firstName: "Google", lastName: "User", email: "user@gmail.com",
          username: "googleuser", profile: "default.jpg", organizationId: "1",
          organizationName: "Demo Organization", organizationType: "school",
          isVerified: true, plan: "free_trial",
        };
        persistAdmin(mockAdmin);
      } else {
        // In production, use Google OAuth SDK to get token, then:
        // const googleToken = await getGoogleToken();
        // const res = await authApi.googleAuth(googleToken);
        // if (!res.success) throw new Error(res.error);
        // persistAdmin(res.data.admin, res.data.token);
        throw new Error("Google OAuth not configured yet");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 1500));
        const newAdmin: Admin = {
          id: "1", firstName: data.firstName, lastName: data.lastName, email: data.email,
          username: data.username, profile: "default.jpg", organizationId: "1",
          organizationName: data.orgName, organizationType: data.orgType,
          isVerified: false, plan: data.plan,
        };
        persistAdmin(newAdmin);
      } else {
        const res = await authApi.register(data as unknown as Record<string, unknown>);
        if (!res.success) throw new Error(res.error);
        const { admin: a, token } = res.data as { admin: Admin; token: string };
        persistAdmin(a, token);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (code: string) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1000));
      if (code.length === 6 && admin) {
        const verified = { ...admin, isVerified: true };
        persistAdmin(verified);
        return true;
      }
      return false;
    } else {
      const res = await authApi.verifyEmail(code, admin?.email || "");
      if (res.success && admin) {
        const verified = { ...admin, isVerified: true };
        persistAdmin(verified);
        return true;
      }
      return false;
    }
  };

  const resendCode = async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1000));
    } else {
      await authApi.resendCode(admin?.email || "");
    }
  };

  const resetPassword = async (email: string) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1000));
    } else {
      await authApi.forgotPassword(email);
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("csm_admin");
    localStorage.removeItem("csm_token");
    if (!USE_MOCK) authApi.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin && admin.isVerified,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        verifyEmail,
        resendCode,
        resetPassword,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
