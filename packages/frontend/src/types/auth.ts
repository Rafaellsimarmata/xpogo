export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
}

export interface BackendUser {
  id: string;
  username: string;
  email: string;
  business_name?: string;
}

export interface AuthResponse {
  token: string;
  user: BackendUser;
}

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  email: string;
  username: string;
  business_name: string;
  password: string;
};

export interface SignUpResponse {
  message: string;
}

export type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  signIn: (payload: SignInPayload) => Promise<void>;
  signOut: () => void;
};
