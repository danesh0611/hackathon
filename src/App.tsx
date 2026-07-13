import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import { useAppDispatch } from "./store/store";
import { loadAlerts } from "./store/alertsSlice";

function App() {
  const dispatch = useAppDispatch();

  // Load initial AI alerts globally so the notification bell works across the app
  useEffect(() => {
    dispatch(loadAlerts());
    
    // Simulate real-time polling every 30s
    const interval = setInterval(() => {
      dispatch(loadAlerts());
    }, 30000);
    
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}

export default App;
