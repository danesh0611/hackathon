import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./authSlice";
import alertsReducer from "./alertsSlice";
import dashboardReducer from "./dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    alerts: alertsReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/** Typed dispatch hook — use instead of plain `useDispatch` */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
/** Typed selector hook — use instead of plain `useSelector` */
export const useAppSelector = useSelector.withTypes<RootState>();
