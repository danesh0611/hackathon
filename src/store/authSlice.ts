import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { OfficerProfile, LoginRequest } from "@/types/api";
import { loginOfficer } from "@/services/auth";
import { isTokenExpired } from "@/lib/utils";

interface AuthState {
  token: string | null;
  officer: OfficerProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * JWT storage tradeoff:
 * Using localStorage for JWT storage. This is vulnerable to XSS attacks.
 * A more secure approach would be httpOnly cookies set by the backend,
 * but that requires backend support for cookie-based auth flow.
 * TODO: Migrate to httpOnly cookies when backend supports it.
 */
const storedToken = localStorage.getItem("jwt_token");
const storedOfficer = localStorage.getItem("officer_profile");

const initialState: AuthState = {
  token: storedToken && !isTokenExpired(storedToken) ? storedToken : null,
  officer: storedOfficer ? JSON.parse(storedOfficer) as OfficerProfile : null,
  isAuthenticated: storedToken != null && !isTokenExpired(storedToken),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (payload: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await loginOfficer(payload);
      // Persist to localStorage
      localStorage.setItem("jwt_token", response.token);
      localStorage.setItem("officer_profile", JSON.stringify(response.officer));
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.officer = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("officer_profile");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.officer = action.payload.officer;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action: PayloadAction<unknown>) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? "Login failed";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
