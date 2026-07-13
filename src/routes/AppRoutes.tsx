import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

// Pages
import LandingPage from "@/pages/LandingPage";
import CitizenPortal from "@/pages/citizen/CitizenPortal";
import ReportScam from "@/pages/citizen/ReportScam";
import CurrencyCheck from "@/pages/citizen/CurrencyCheck";
import ScamCheck from "@/pages/citizen/ScamCheck";
import NearbyAlerts from "@/pages/citizen/NearbyAlerts";
import PoliceLogin from "@/pages/police/Login";
import PoliceDashboard from "@/pages/police/Dashboard";
import LiveMap from "@/pages/police/LiveMap";
import Analytics from "@/pages/police/Analytics";
import FraudNetwork from "@/pages/police/FraudNetwork";
import ComplaintsList from "@/pages/police/ComplaintsList";
import ComplaintDetails from "@/pages/police/ComplaintDetails";
import PoliceDashboardLayout from "@/pages/police/PoliceDashboardLayout";
import NotFound from "@/pages/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/citizen" element={<CitizenPortal />} />
        <Route path="/citizen/report" element={<ReportScam />} />
        <Route path="/citizen/currency-check" element={<CurrencyCheck />} />
        <Route path="/citizen/scam-check" element={<ScamCheck />} />
        <Route path="/citizen/alerts" element={<NearbyAlerts />} />

        {/* Police auth (unprotected) */}
        <Route path="/police/login" element={<PoliceLogin />} />

        {/* Police dashboard (protected) */}
        <Route
          path="/police"
          element={
            <ProtectedRoute>
              <PoliceDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<PoliceDashboard />} />
          <Route path="map" element={<LiveMap />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="network" element={<FraudNetwork />} />
          <Route path="complaints" element={<ComplaintsList />} />
          <Route path="complaints/:id" element={<ComplaintDetails />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
