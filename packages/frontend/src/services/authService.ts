import { apiFetch } from "@/src/services/apiClient";
import type {
  AuthResponse,
  SignInPayload,
  SignUpPayload,
  SignUpResponse,
} from "@/src/types/auth";

export const login = async (payload: SignInPayload) => {
  console.log("[authService] Login attempt for user:", payload.email);
  try {
    const response = await apiFetch<AuthResponse>("auth/login", {
      method: "POST",
      body: payload,
      skipAuth: true,
    });
    console.log("[authService] Login successful for user:", payload.email);
    return response;
  } catch (error) {
    console.error("[authService] Login failed:", error);
    throw error;
  }
};

export const register = (payload: SignUpPayload) =>
  apiFetch<SignUpResponse>("auth/register", {
    method: "POST",
    body: payload,
    skipAuth: true,
  });
