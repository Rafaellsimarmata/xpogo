import { apiFetch } from "@/src/services/apiClient";
import type {
  AuthResponse,
  SignInPayload,
  SignUpPayload,
  SignUpResponse,
} from "@/src/types/auth";

export const login = async (payload: SignInPayload) => {
  try {
    const response = await apiFetch<AuthResponse>("auth/login", {
      method: "POST",
      body: payload,
      skipAuth: true,
    });
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
