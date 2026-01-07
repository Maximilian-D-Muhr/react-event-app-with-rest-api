import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../auth/tokenStorage";

export function MainLayout() {
  const token = getToken();
  const isAuthed = Boolean(token);
  const navigate = useNavigate();

  function handleSignOut() {
    clearToken();
    navigate("/signin");
  }

  function getLinkClass({ isActive }) {
    return isActive
      ? "btn btn-primary btn-sm"
      : "btn btn-ghost btn-sm";
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <nav className="navbar bg-base-100 shadow-md sticky top-0 z-50">
        <div className="mx-auto w-full max-w-5xl px-4 flex items-center">
          <div className="flex-1">
            <NavLink to="/" className="text-xl font-bold text-primary">
              React Events
            </NavLink>
          </div>

          <div className="flex gap-2">
            <NavLink to="/" className={getLinkClass} end>
              Home
            </NavLink>

            {isAuthed && (
              <NavLink to="/create" className={getLinkClass}>
                Create
              </NavLink>
            )}

            {!isAuthed && (
              <>
                <NavLink to="/signin" className={getLinkClass}>
                  Sign In
                </NavLink>
                <NavLink to="/signup" className={getLinkClass}>
                  Sign Up
                </NavLink>
              </>
            )}

            {isAuthed && (
              <button
                type="button"
                className="btn btn-error btn-sm"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl p-4 flex-1">
        <Outlet />
      </main>

      <footer className="bg-base-100 border-t border-base-300 py-6">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-4">
            <NavLink to="/timeline" className="link link-hover opacity-70">
              Timeline View
            </NavLink>
          </div>
          <p className="opacity-70 text-center sm:text-right">
            Created by{" "}
            <a
              href="https://www.linkedin.com/in/maximilianmuhr/"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary"
            >
              Maximilian D. Muhr
            </a>{" "}
            as part of WBS Coding School
          </p>
        </div>
      </footer>
    </div>
  );
}
