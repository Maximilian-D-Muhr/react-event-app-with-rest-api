import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <section className="text-center py-16 space-y-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-lg opacity-70">Page not found.</p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </section>
  );
}
