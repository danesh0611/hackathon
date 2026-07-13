import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { AIAlert } from "@/types/api";
import { fetchAIAlerts } from "@/services/police";

interface AlertsState {
  alerts: AIAlert[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: AlertsState = {
  alerts: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const loadAlerts = createAsyncThunk("alerts/load", async (_, { rejectWithValue }) => {
  try {
    return await fetchAIAlerts();
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Failed to load alerts");
  }
});

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    markAsRead(state, action: PayloadAction<string>) {
      const alert = state.alerts.find((a) => a.id === action.payload);
      if (alert && !alert.isRead) {
        alert.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead(state) {
      state.alerts.forEach((a) => (a.isRead = true));
      state.unreadCount = 0;
    },
    addAlert(state, action: PayloadAction<AIAlert>) {
      state.alerts.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAlerts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAlerts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alerts = action.payload;
        state.unreadCount = action.payload.filter((a) => !a.isRead).length;
      })
      .addCase(loadAlerts.rejected, (state, action: PayloadAction<unknown>) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? "Failed to load alerts";
      });
  },
});

export const { markAsRead, markAllAsRead, addAlert } = alertsSlice.actions;
export default alertsSlice.reducer;
