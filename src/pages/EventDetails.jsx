import { useParams } from "react-router";

export function EventDetails() {
  const { id } = useParams();

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Event Details</h1>
      <p className="opacity-80">Event ID: {id}</p>
      <p className="opacity-80">Hier kommt das Event Detail (FR010).</p>
    </section>
  );
}
