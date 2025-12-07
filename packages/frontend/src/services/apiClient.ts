import { BACKEND_URL } from "@/src/constants";

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: Record<string, unknown> | string;
  skipAuth?: boolean;
  tokenOverride?: string | null;
};

const getStoredToken = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("auth_token");
};

const buildHeaders = (
  headers: HeadersInit | undefined,
  hasBody: boolean,
): Headers => {
  const normalizedHeaders = new Headers(headers);
  if (hasBody && !normalizedHeaders.has("Content-Type")) {
    normalizedHeaders.set("Content-Type", "application/json");
  }
  return normalizedHeaders;
};

const resolveBody = (body?: Record<string, unknown> | string) => {
  if (!body) {
    return undefined;
  }
  if (typeof body === "string") {
    return body;
  }
  return JSON.stringify(body);
};

export const apiFetch = async <TResponse>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> => {
  if (!BACKEND_URL) {
    console.error("[apiFetch] BACKEND_URL not configured");
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured");
  }

  const url = `${BACKEND_URL}${endpoint.replace(/^\/+/, "")}`;
  const body = resolveBody(options.body);
  const headers = buildHeaders(options.headers, Boolean(body));

  if (!options.skipAuth) {
    const token = options.tokenOverride ?? getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string; error?: string }
      | null;
    const errorMessage =
      payload?.message ??
      payload?.error ??
      `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as TResponse;
  }

  const data = (await response.json()) as TResponse;
  return data;
};
