import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../api/events";
import { formatDate } from "../utils/formatDate";

export function Home() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      setStatus("loading");
      setError("");

      try {
        const data = await getEvents();

      const list = Array.isArray(data)
  ? data
  : Array.isArray(data?.results)
  ? data.results
  : [];


        const sorted = list.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        if (!cancelled) {
          setEvents(sorted);
          setStatus("success");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load events");
          setStatus("error");
        }
      }
    }

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Events</h1>

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

      {status === "success" && events.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <p className="text-lg opacity-70">No events found.</p>
          <Link to="/create" className="btn btn-primary">
            Create first event
          </Link>
        </div>
      )}

      {status === "success" && events.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li
              key={event.id}
              className="card bg-base-100 shadow-sm border hover:shadow-md transition-shadow"
            >
              <Link to={`/events/${event.id}`} className="card-body p-4">
                <h2 className="card-title text-base break-words">{event.title}</h2>
                <p className="text-sm opacity-70">{formatDate(event.date)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
