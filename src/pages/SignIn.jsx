import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signIn } from "../api/auth";
import { setToken } from "../auth/tokenStorage";

export function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [formData, setFormData] = useState({
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
      const response = await signIn(formData);
      setToken(response.token);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message);
      setStatus("error");
    }
  }

  return (
    <section className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Sign In</h1>

      {errorMessage && (
        <div className="alert alert-error">
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          {status === "submitting" ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="link link-primary">
          Sign Up
        </Link>
      </p>
    </section>
  );
}
