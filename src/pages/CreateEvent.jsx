import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../api/events";

export function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const newEvent = await createEvent(formData);
      navigate(`/events/${newEvent.id}`);
    } catch (err) {
      setErrorMessage(err.message);
      setStatus("error");
    }
  }

  return (
    <section className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Create Event</h1>

      {errorMessage && (
        <div className="alert alert-error">
          <span className="break-words">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Date</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full sm:w-auto"
          disabled={status === "submitting"}
        >
          {status === "submitting" && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
          {status === "submitting" ? "Creating..." : "Create Event"}
        </button>
      </form>
    </section>
  );
}
