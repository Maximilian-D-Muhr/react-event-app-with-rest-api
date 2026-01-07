import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEventById } from "../api/events";
import { formatDate } from "../utils/formatDate";

export function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadEvent() {
      setStatus("loading");
      setError("");

      try {
        const data = await getEventById(id);
        const item = data?.result ?? data;

        if (!cancelled) {
          setEvent(item);
          setStatus("success");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Failed to load event");
          setStatus("error");
        }
      }
    }

    loadEvent();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold">Event Details</h1>
        <Link to="/" className="btn btn-ghost btn-sm">Back</Link>
      </div>

      {status === "loading" && (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {status === "error" && (
        <div className="alert alert-error">
          <span className="break-words">{error}</span>
        </div>
      )}

      {status === "success" && event && (
        <div className="card bg-base-100 shadow-sm border">
          <div className="card-body space-y-4">
            <div>
              <h2 className="card-title text-lg sm:text-xl break-words">
                {event.title}
              </h2>
              <p className="text-sm opacity-70">
                {event.date && formatDate(event.date)}
              </p>
            </div>

            {event.description && (
              <p className="leading-relaxed whitespace-pre-line break-words">
                {event.description}
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-3 bg-base-200 rounded-lg">
                <span className="text-sm font-semibold block mb-1">Location</span>
                <span className="break-words">{event.location || "-"}</span>
              </div>
              <div className="p-3 bg-base-200 rounded-lg">
                <span className="text-sm font-semibold block mb-1">Coordinates</span>
                <span>{event.latitude ?? "-"}, {event.longitude ?? "-"}</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-sm opacity-70">
              <div>
                <span className="font-semibold">Event ID:</span> {event.id}
              </div>
              {event.organizerId != null && (
                <div>
                  <span className="font-semibold">Organizer ID:</span> {event.organizerId}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {status === "success" && !event && (
        <div className="text-center py-12 space-y-4">
          <p className="text-lg opacity-70">Event not found.</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      )}
    </section>
  );
}
