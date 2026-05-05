import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../../store";

export default function ProtectedRoute() {
  const token = useSelector((s: RootState) => s.auth.accessToken);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
