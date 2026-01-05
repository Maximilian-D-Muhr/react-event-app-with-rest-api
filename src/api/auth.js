import { apiFetch } from "./client";

export function signUp(userData) {
  return apiFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}
