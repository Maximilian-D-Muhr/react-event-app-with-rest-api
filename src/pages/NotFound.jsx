import { Link } from "react-router";

export function NotFound() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="opacity-80">Seite nicht gefunden.</p>
      <Link to="/" className="btn btn-primary btn-sm">
        Zurueck zur Startseite
      </Link>
    </section>
  );
}
