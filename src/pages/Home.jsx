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
          setError(err.message || "Events konnten nicht geladen werden");
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
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Events</h1>

      {status === "loading" && <p>Loading events...</p>}

      {status === "error" && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {status === "success" && events.length === 0 && (
        <div className="alert">
          <span>Keine Events vorhanden.</span>
        </div>
      )}

      {status === "success" && events.length > 0 && (
       <ul className="grid gap-4 sm:grid-cols-2">
  {events.map((event) => (
    <li key={event.id} className="rounded-xl border p-4 hover:bg-base-200">
      <Link to={`/events/${event.id}`} className="block">
        <h2 className="font-semibold">{event.title}</h2>
        <p className="text-sm opacity-80">{formatDate(event.date)}</p>
      </Link>
    </li>
  ))}
</ul>

      )}
    </section>
  );
}
