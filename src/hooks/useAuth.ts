import { useAppSelector, useAppDispatch } from "@/store/store";
import { login, logout, clearError } from "@/store/authSlice";
import type { LoginRequest } from "@/types/api";

/** Custom hook wrapping Redux auth state and actions */
export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  return {
    ...auth,
    login: (payload: LoginRequest) => dispatch(login(payload)),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
  };
}
