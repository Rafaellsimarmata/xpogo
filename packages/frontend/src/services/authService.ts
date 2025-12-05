import { apiFetch } from "@/src/services/apiClient";
import type {
  AuthResponse,
  SignInPayload,
  SignUpPayload,
  SignUpResponse,
} from "@/src/types/auth";

export const login = (payload: SignInPayload) =>
  apiFetch<AuthResponse>("auth/login", {
    method: "POST",
    body: payload,
    skipAuth: true,
  });

export const register = (payload: SignUpPayload) =>
  apiFetch<SignUpResponse>("auth/register", {
    method: "POST",
    body: payload,
    skipAuth: true,
  });
