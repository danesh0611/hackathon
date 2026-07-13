"use client";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  center: [number, number];
  zoom: number;
  className?: string;
  children?: React.ReactNode;
}

export default function MapView({ center, zoom, className = "", children }: MapViewProps) {
  // Leaflet needs to run on client side only, which is fine in a pure SPA.
  // However, Next.js or React 18 strict mode can sometimes double-mount.
  // We just return the MapContainer.

  return (
    <div className={`relative z-0 overflow-hidden h-full w-full ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false} // We add it manually for positioning
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          // We use a cleaner map tile (Carto Voyager) which looks better for dashboards
        />
        <ZoomControl position="bottomright" />
        {children}
      </MapContainer>
    </div>
  );
}
