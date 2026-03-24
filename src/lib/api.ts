// API service layer for Hostinger backend
// Update API_BASE_URL to your deployed Node.js backend on Hostinger
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://srv2069.hstgr.io/api";
// To use a different URL during development, create a .env file with VITE_API_URL=http://localhost:3000/api

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("csm_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.message || json.error || "Request failed" };
    }
    return { success: true, data: json.data ?? json, message: json.message };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    return { success: false, error: message };
  }
}

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  register: (data: Record<string, unknown>) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  verifyEmail: (code: string, email: string) =>
    request("/auth/verify-email", { method: "POST", body: JSON.stringify({ code, email }) }),

  resendCode: (email: string) =>
    request("/auth/resend-code", { method: "POST", body: JSON.stringify({ email }) }),

  forgotPassword: (email: string) =>
    request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),

  resetPassword: (token: string, password: string) =>
    request("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) }),

  googleAuth: (googleToken: string) =>
    request("/auth/google", { method: "POST", body: JSON.stringify({ token: googleToken }) }),

  getProfile: () =>
    request("/auth/profile"),

  updateProfile: (data: Record<string, unknown>) =>
    request("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),

  logout: () =>
    request("/auth/logout", { method: "POST" }),
};

// Card verification endpoint (for ESP32 devices)
export const deviceApi = {
  verifyCard: (cardId: string) =>
    request(`/verify?card_id=${cardId}`),

  getDevices: (orgId: string) =>
    request(`/devices?org_id=${orgId}`),

  updateWifi: (deviceId: string, ssid: string, password: string, api: string) =>
    request("/devices/wifi", { method: "PUT", body: JSON.stringify({ deviceId, ssid, password, api }) }),
};

// Organization endpoints
export const orgApi = {
  getOrganization: (orgId: string) =>
    request(`/organizations/${orgId}`),

  updateOrganization: (orgId: string, data: Record<string, unknown>) =>
    request(`/organizations/${orgId}`, { method: "PUT", body: JSON.stringify(data) }),
};

// Attendance endpoints
export const attendanceApi = {
  getAttendance: (orgId: string, params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/attendance/${orgId}${query}`);
  },
};

// Users endpoints
export const usersApi = {
  getUsers: (orgId: string) =>
    request(`/users?org_id=${orgId}`),

  createUser: (data: Record<string, unknown>) =>
    request("/users", { method: "POST", body: JSON.stringify(data) }),

  updateUser: (userId: string, data: Record<string, unknown>) =>
    request(`/users/${userId}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteUser: (userId: string) =>
    request(`/users/${userId}`, { method: "DELETE" }),
};

export default request;
