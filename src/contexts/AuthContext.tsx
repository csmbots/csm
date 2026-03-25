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
  login: (email: string, password: string) => Promise<Admin>;
  loginWithGoogle: () => Promise<Admin>;
  register: (data: RegisterData) => Promise<Admin>;
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

type ApiAuthPayload = {
  admin?: Record<string, unknown>;
  token?: string;
} & Record<string, unknown>;

// Development-first: keep auth working even before backend deployment.
// Set VITE_USE_MOCK=false in .env to force real API mode.
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

const mapOrgType = (value: unknown): "school" | "company" => {
  const normalized = String(value ?? "school").toLowerCase();
  if (normalized === "company" || normalized === "business") return "company";
  return "school";
};

const normalizeAdmin = (raw: Record<string, unknown>): Admin => {
  const org = (raw.organization as Record<string, unknown> | undefined) ?? {};

  return {
    id: String(raw.id ?? raw.admin_id ?? ""),
    firstName: String(raw.firstName ?? raw.first_name ?? "Admin"),
    lastName: String(raw.lastName ?? raw.last_name ?? "User"),
    email: String(raw.email ?? ""),
    username: String(raw.username ?? raw.user_name ?? ""),
    profile: String(raw.profile ?? "default.jpg"),
    organizationId: String(raw.organizationId ?? raw.organization_id ?? org.id ?? ""),
    organizationName: String(raw.organizationName ?? raw.organization_name ?? org.name ?? "Organization"),
    organizationType: mapOrgType(raw.organizationType ?? raw.organization_type ?? org.type),
    isVerified: Boolean(raw.isVerified ?? raw.is_verified ?? true),
    plan: String(raw.plan ?? raw.plan_name ?? "free_trial"),
  };
};

const extractAuthPayload = (data: unknown): { admin: Admin; token?: string } => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid auth response from server");
  }

  const payload = data as ApiAuthPayload;
  const adminRaw = (payload.admin as Record<string, unknown> | undefined) ?? payload;

  if (!adminRaw.email) {
    throw new Error("Missing admin details in auth response");
  }

  return {
    admin: normalizeAdmin(adminRaw),
    token: typeof payload.token === "string" ? payload.token : undefined,
  };
};

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
        return mockAdmin;
      } else {
        const res = await authApi.login(email, password);
        if (!res.success) throw new Error(res.error || "Login failed");
        const { admin: parsedAdmin, token } = extractAuthPayload(res.data);
        persistAdmin(parsedAdmin, token);
        return parsedAdmin;
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
        return mockAdmin;
      } else {
        throw new Error("Google sign-in is in development mode. Set VITE_USE_MOCK=true while backend OAuth is being finalized.");
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
        return newAdmin;
      } else {
        const res = await authApi.register(data as unknown as Record<string, unknown>);
        if (!res.success) throw new Error(res.error || "Registration failed");
        const { admin: parsedAdmin, token } = extractAuthPayload(res.data);
        persistAdmin(parsedAdmin, token);
        return parsedAdmin;
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
      if (!res.success) throw new Error(res.error || "Verification failed");
      return false;
    }
  };

  const resendCode = async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1000));
    } else {
      const res = await authApi.resendCode(admin?.email || "");
      if (!res.success) throw new Error(res.error || "Failed to resend code");
    }
  };

  const resetPassword = async (email: string) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1000));
    } else {
      const res = await authApi.forgotPassword(email);
      if (!res.success) throw new Error(res.error || "Failed to send password reset link");
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("csm_admin");
    localStorage.removeItem("csm_token");
    if (!USE_MOCK) void authApi.logout();
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
