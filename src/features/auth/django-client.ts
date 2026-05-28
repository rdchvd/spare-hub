// Typed Django API methods for Spare Hub auth + profile.

import { apiRequest, tokenStore } from "./client";
import type {
  LoginInput,
  RegisterInput,
  TokenPair,
  UserProfile,
} from "./types";

export async function login(input: LoginInput): Promise<TokenPair> {
  const pair = await apiRequest<TokenPair>("/api/auth/token/", {
    method: "POST",
    body: input,
    auth: false,
  });
  tokenStore.set(pair);
  return pair;
}

export async function register(input: RegisterInput): Promise<void> {
  await apiRequest("/api/auth/register/", {
    method: "POST",
    body: input,
    auth: false,
  });
}

export async function logout(): Promise<void> {
  try {
    await apiRequest("/api/auth/logout/", { method: "POST" });
  } catch {
    // Even if backend logout fails, clear local tokens.
  } finally {
    tokenStore.clear();
  }
}

// Expects a backend endpoint that returns the current user's profile.
// You confirmed you'll add `/api/auth/me/` returning a UserProfile.
export async function getMe(): Promise<UserProfile> {
  return apiRequest<UserProfile>("/api/auth/me/", { method: "GET" });
}

export async function updateProfile(
  id: number,
  patch: Partial<Pick<UserProfile, "first_name" | "last_name" | "role">>,
): Promise<UserProfile> {
  return apiRequest<UserProfile>(`/api/accounts/profiles/${id}/`, {
    method: "PATCH",
    body: patch,
  });
}
