import { apiFetch } from "./client";

export function getEvents() {
  return apiFetch("/api/events?limit=100");
}

export function getEventById(id) {
  return apiFetch(`/api/events/${id}`);
}

export function createEvent(eventData) {
  return apiFetch("/api/events", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
}
