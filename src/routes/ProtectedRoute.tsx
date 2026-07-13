import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/store";

/**
 * Protected route wrapper for police dashboard pages.
 * Checks JWT validity via Redux auth slice.
 * Redirects to /police/login with the intended destination preserved
 * in route state for post-login redirect.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/police/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
