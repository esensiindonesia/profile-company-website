import { authClient } from "@/lib/auth-client";

/** Admin API calls authenticate with the Better Auth session cookie. */
export function adminFetch(input: string, init?: RequestInit) {
  return fetch(input, { ...init, credentials: "include" });
}

export async function logout() {
  await authClient.signOut();
  window.location.assign("/admin/login");
}
