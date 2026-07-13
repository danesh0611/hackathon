import { Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import type { MapMarker } from "@/types/api";
import { formatDateTime } from "@/lib/utils";
import { Link } from "react-router-dom";
import { AlertTriangle, MapPin, Banknote, PhoneCall } from "lucide-react";
import { renderToString } from "react-dom/server";

interface MarkerLayerProps {
  markers: MapMarker[];
  showScam?: boolean;
  showCounterfeit?: boolean;
  showFraudCall?: boolean;
}

// Map severity to Tailwind colors for our custom SVG icons
const severityColors = {
  high: "#EF4444",   // text-red-500
  medium: "#F59E0B", // text-amber-500
  low: "#10B981",    // text-emerald-500
};

// Create a custom SVG icon using Leaflet's divIcon
function createCustomIcon(type: string, severity: "low" | "medium" | "high") {
  const color = severityColors[severity];
  let IconComponent = MapPin;
  
  if (type === "scam_report") IconComponent = AlertTriangle;
  else if (type === "fake_currency") IconComponent = Banknote;
  else if (type === "fraud_call") IconComponent = PhoneCall;

  const html = renderToString(
    <div style={{
      backgroundColor: "white",
      borderRadius: "50%",
      padding: "6px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      border: `2px solid ${color}`,
      color: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "32px",
      height: "32px"
    }}>
      <IconComponent size={18} />
    </div>
  );

  return divIcon({
    html,
    className: "custom-leaflet-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
}

export function MarkerLayer({ markers, showScam = true, showCounterfeit = true, showFraudCall = true }: MarkerLayerProps) {
  const filteredMarkers = markers.filter(m => {
    if (m.type === "scam_report" && !showScam) return false;
    if (m.type === "fake_currency" && !showCounterfeit) return false;
    if (m.type === "fraud_call" && !showFraudCall) return false;
    return true;
  });

  return (
    <>
      {filteredMarkers.map((marker) => (
        <Marker 
          key={marker.id} 
          position={[marker.lat, marker.lng]}
          icon={createCustomIcon(marker.type, marker.severity)}
        >
          <Popup className="custom-popup">
            <div className="p-1 min-w-[200px]">
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: severityColors[marker.severity] }} />
                {marker.title}
              </div>
              <p className="text-xs text-muted-foreground mb-2">{marker.summary}</p>
              <div className="text-[10px] text-muted-foreground/80 mb-3">
                {formatDateTime(marker.date)}
              </div>
              {marker.caseId && (
                <Link 
                  to={`/police/complaints/${marker.caseId}`}
                  className="block w-full text-center bg-primary text-primary-foreground text-xs font-semibold py-1.5 rounded-md hover:bg-primary/90 transition-colors"
                >
                  View Case
                </Link>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
