import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import type { HeatmapPoint } from "@/types/api";

interface HeatmapLayerProps {
  points: HeatmapPoint[];
  radius?: number;
  blur?: number;
  maxZoom?: number;
}

export function HeatmapLayer({ points, radius = 25, blur = 15, maxZoom = 13 }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    // Format points for leaflet.heat: [lat, lng, intensity]
    const heatData = points.map(p => [p.lat, p.lng, p.intensity] as [number, number, number]);

    // @ts-ignore - leaflet.heat types don't officially extend L
    const heatLayer = L.heatLayer(heatData, {
      radius,
      blur,
      maxZoom,
      gradient: { 0.4: "blue", 0.6: "cyan", 0.7: "lime", 0.8: "yellow", 1.0: "red" }
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, radius, blur, maxZoom]);

  return null;
}
