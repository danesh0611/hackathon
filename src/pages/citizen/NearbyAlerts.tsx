import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import MapView from "@/components/maps/MapView";
import { MarkerLayer } from "@/components/maps/MarkerLayer";
import { HeatmapLayer } from "@/components/maps/HeatmapLayer";
import { fetchAlerts, fetchHeatmapData } from "@/services/citizen";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { AlertItem, HeatmapPoint } from "@/types/api";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { EmergencyButton } from "@/components/EmergencyButton";

export default function NearbyAlerts() {
  const { latitude, longitude, isLoading: locationLoading } = useGeolocation();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [showScams, setShowScams] = useState(true);
  const [showCounterfeit, setShowCounterfeit] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [alertsData, heatmapData] = await Promise.all([
          fetchAlerts(latitude || undefined, longitude || undefined),
          fetchHeatmapData(),
        ]);
        setAlerts(alertsData);
        setHeatmap(heatmapData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!locationLoading) {
      loadData();
    }
  }, [latitude, longitude, locationLoading]);

  // Use location if available, otherwise default to Chennai
  const center: [number, number] = latitude && longitude ? [latitude, longitude] : [13.0827, 80.2707];

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      
      <main className="flex flex-1 flex-col lg:flex-row relative">
        {/* Sidebar Controls */}
        <div className="z-10 w-full shrink-0 border-r border-border bg-card p-4 shadow-xl lg:w-80 overflow-y-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-bold">Nearby Alerts</h1>
            <EmergencyButton className="lg:hidden" />
          </div>

          <p className="mb-6 text-sm text-muted-foreground">
            Real-time hotspots for scams and counterfeit currency reported in your area. Stay vigilant.
          </p>

          <Card className="p-4 mb-6">
            <h3 className="font-semibold mb-3">Map Layers</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="scams" 
                  checked={showScams} 
                  onCheckedChange={(c) => setShowScams(c as boolean)} 
                />
                <Label htmlFor="scams" className="cursor-pointer font-medium">Scam Hotspots</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="counterfeit" 
                  checked={showCounterfeit} 
                  onCheckedChange={(c) => setShowCounterfeit(c as boolean)} 
                />
                <Label htmlFor="counterfeit" className="cursor-pointer font-medium">Counterfeit Alerts</Label>
              </div>
              <div className="flex items-center space-x-2 pt-2 border-t border-border">
                <Checkbox 
                  id="heatmap" 
                  checked={showHeatmap} 
                  onCheckedChange={(c) => setShowHeatmap(c as boolean)} 
                />
                <Label htmlFor="heatmap" className="cursor-pointer font-medium text-primary">Crime Density Heatmap</Label>
              </div>
            </div>
          </Card>

          <div className="space-y-3 hidden lg:block">
            <h3 className="font-semibold px-1">Recent Activity</h3>
            {loading ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : (
              alerts.slice(0, 4).map(alert => (
                <div key={alert.id} className="p-3 border border-border rounded-lg text-sm bg-muted/30">
                  <div className="font-semibold">{alert.title}</div>
                  <div className="text-muted-foreground text-xs mt-1 truncate">{alert.description}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="relative flex-1 bg-muted">
          {(locationLoading || loading) && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2 rounded-xl bg-card p-6 shadow-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Loading map data...</p>
              </div>
            </div>
          )}
          
          <MapView center={center} zoom={13}>
            <MarkerLayer 
              markers={alerts.map(a => ({ ...a, summary: a.description, caseId: undefined } as any))} 
              showScam={showScams}
              showCounterfeit={showCounterfeit}
            />
            {showHeatmap && heatmap.length > 0 && <HeatmapLayer points={heatmap} />}
          </MapView>
        </div>
      </main>
    </div>
  );
}
