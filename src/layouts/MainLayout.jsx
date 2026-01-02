import { NavLink, Outlet } from "react-router";
import { clearToken, getToken } from "../auth/tokenStorage";

export function MainLayout() {
  const token = getToken();
  const isAuthed = Boolean(token);

  function handleSignOut() {
    clearToken();
    window.location.href = "/signin";
  }

  return (
    <div className="min-h-screen">
      <div className="navbar bg-base-100 border-b">
        <div className="mx-auto w-full max-w-5xl px-4 flex items-center">
          <div className="flex-1">
            <NavLink to="/" className="text-lg font-semibold">
              React Events
            </NavLink>
          </div>

          <div className="flex gap-2">
            <NavLink to="/" className="btn btn-ghost btn-sm">
              Home
            </NavLink>

            <NavLink to="/create" className="btn btn-ghost btn-sm">
              Create
            </NavLink>

            {!isAuthed && (
              <>
                <NavLink to="/signin" className="btn btn-ghost btn-sm">
                  Sign In
                </NavLink>
                <NavLink to="/signup" className="btn btn-ghost btn-sm">
                  Sign Up
                </NavLink>
              </>
            )}

            {isAuthed && (
              <button type="button" className="btn btn-outline btn-sm" onClick={handleSignOut}>
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
