import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../api/auth";

export function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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
      await signUp(formData);
      navigate("/signin");
    } catch (err) {
      setErrorMessage(err.message);
      setStatus("error");
    }
  }

  return (
    <section className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Create Account</h1>

      {errorMessage && (
        <div className="alert alert-error">
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input input-bordered"
            minLength={6}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={status === "submitting"}
        >
          {status === "submitting" && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
          {status === "submitting" ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center">
        Already have an account?{" "}
        <Link to="/signin" className="link link-primary">
          Sign In
        </Link>
      </p>
    </section>
  );
}
