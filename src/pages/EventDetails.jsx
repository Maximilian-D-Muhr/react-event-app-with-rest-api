import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEventById } from "../api/events";

function formatDate(value) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

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
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Event Details</h1>
        <Link to="/" className="btn btn-ghost btn-sm">Back</Link>
      </div>

      {status === "loading" && <p>Loading...</p>}

      {status === "error" && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {status === "success" && event && (
        <div className="card bg-base-100 border">
          <div className="card-body space-y-3">
            <div>
              <h2 className="card-title">{event.title}</h2>
              <p className="text-sm opacity-80">
                {event.date && formatDate(event.date)}
              </p>
            </div>

            {event.description && <p>{event.description}</p>}

            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <span className="font-semibold">Location:</span>{" "}
                {event.location || "-"}
              </div>
              <div>
                <span className="font-semibold">Coordinates:</span>{" "}
                {event.latitude ?? "-"}, {event.longitude ?? "-"}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <span className="font-semibold">Event ID:</span> {event.id}
              </div>
              {event.organizerId != null && (
                <div>
                  <span className="font-semibold">Organizer ID:</span>{" "}
                  {event.organizerId}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {status === "success" && !event && (
        <div className="alert">
          <span>No event found.</span>
        </div>
      )}
    </section>
  );
}
