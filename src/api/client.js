import { clearToken, getToken } from "../auth/tokenStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers,
      ...options,
    });
  } catch (networkError) {
    const err = new Error("Network error. Please check your connection.");
    err.status = 0;
    err.isNetworkError = true;
    throw err;
  }

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) {
      clearToken();
      window.location.href = "/signin";
      throw new Error("Session expired. Please sign in again.");
    }

    if (res.status === 404) {
      const err = new Error(data?.message || "Resource not found");
      err.status = 404;
      err.data = data;
      throw err;
    }

    if (res.status === 400) {
      const err = new Error(data?.message || "Invalid request");
      err.status = 400;
      err.data = data;
      throw err;
    }

    const err = new Error(data?.message || `Error: ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
