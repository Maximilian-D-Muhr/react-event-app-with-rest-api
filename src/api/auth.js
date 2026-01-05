import { apiFetch } from "./client";

export function signUp(userData) {
  return apiFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function signIn(credentials) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
