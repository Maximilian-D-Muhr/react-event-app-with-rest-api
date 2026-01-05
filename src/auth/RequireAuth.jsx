import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken } from "./tokenStorage";

export function RequireAuth() {
  const token = getToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
