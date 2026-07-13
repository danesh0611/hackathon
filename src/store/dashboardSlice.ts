import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardMetrics } from "@/types/api";
import { fetchDashboard } from "@/services/police";

interface DashboardState {
  metrics: DashboardMetrics | null;
  dateRange: { start: string; end: string } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  metrics: null,
  dateRange: null,
  isLoading: false,
  error: null,
};

export const loadDashboard = createAsyncThunk("dashboard/load", async (_, { rejectWithValue }) => {
  try {
    return await fetchDashboard();
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Failed to load dashboard");
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDateRange(state, action: PayloadAction<{ start: string; end: string } | null>) {
      state.dateRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload;
      })
      .addCase(loadDashboard.rejected, (state, action: PayloadAction<unknown>) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? "Failed to load dashboard";
      });
  },
});

export const { setDateRange } = dashboardSlice.actions;
export default dashboardSlice.reducer;
