import { useAppSelector, useAppDispatch } from "@/store/store";
import { login, logout, clearError } from "@/store/authSlice";
import type { LoginRequest } from "@/types/api";

/** Custom hook wrapping Redux auth state and actions */
export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  return {
    ...auth,
    login: async (payload: LoginRequest) => {
      const resultAction = await dispatch(login(payload));
      if (login.rejected.match(resultAction)) {
        throw new Error(resultAction.payload as string || "Login failed");
      }
      return resultAction.payload;
    },
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
  };
}
