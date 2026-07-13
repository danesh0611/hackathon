import { useEffect, useState } from "react";
import MapView from "@/components/maps/MapView";
import { MarkerLayer } from "@/components/maps/MarkerLayer";
import { HeatmapLayer } from "@/components/maps/HeatmapLayer";
import { fetchAlerts, fetchHeatmapData } from "@/services/citizen";
import type { AlertItem, HeatmapPoint } from "@/types/api";
import { Loader2, Filter, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LiveMap() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [showScams, setShowScams] = useState(true);
  const [showCounterfeit, setShowCounterfeit] = useState(true);
  const [showFraudCalls, setShowFraudCalls] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  
  // Default to central Chennai for demo
  const center: [number, number] = [13.0827, 80.2707];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [alertsData, heatmapData] = await Promise.all([
          fetchAlerts(center[0], center[1]),
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
    loadData();
  }, []);

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col overflow-hidden relative">
      {/* Map Controls Floating overlay */}
      <div className="absolute top-4 left-4 z-[1000] max-w-sm w-full space-y-4 pointer-events-none">
        
        {/* Header */}
        <Card className="p-4 shadow-lg pointer-events-auto bg-card/95 backdrop-blur-md border-border/50">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Live Threat Map
            </h1>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Monitoring active scam hotspots and intelligence feeds.</p>
        </Card>

        {/* Filters */}
        <Card className="p-4 shadow-lg pointer-events-auto bg-card/95 backdrop-blur-md border-border/50">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold">
            <Filter className="h-4 w-4" />
            <span>Map Layers</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="scams" checked={showScams} onCheckedChange={(c: any) => setShowScams(c as boolean)} />
              <Label htmlFor="scams" className="cursor-pointer">Scam Hotspots</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="counterfeit" checked={showCounterfeit} onCheckedChange={(c: any) => setShowCounterfeit(c as boolean)} />
              <Label htmlFor="counterfeit" className="cursor-pointer">Counterfeit Currency</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="fraud" checked={showFraudCalls} onCheckedChange={(c: any) => setShowFraudCalls(c as boolean)} />
              <Label htmlFor="fraud" className="cursor-pointer">Fraud Calls / Digital Arrest</Label>
            </div>
            <div className="flex items-center space-x-2 pt-2 border-t border-border/50">
              <Checkbox id="heatmap" checked={showHeatmap} onCheckedChange={(c: any) => setShowHeatmap(c as boolean)} />
              <Label htmlFor="heatmap" className="cursor-pointer font-medium text-primary">Predictive Crime Heatmap</Label>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Map */}
      <div className="relative flex-1 bg-muted w-full h-full">
        {loading && (
          <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 rounded-xl bg-card p-6 shadow-lg">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Syncing Intelligence Feeds...</p>
            </div>
          </div>
        )}
        
        <MapView center={center} zoom={13} className="w-full h-full">
          <MarkerLayer 
            markers={alerts.map(a => ({ ...a, summary: a.description, caseId: undefined } as any))} 
            showScam={showScams}
            showCounterfeit={showCounterfeit}
            showFraudCall={showFraudCalls}
          />
          {showHeatmap && heatmap.length > 0 && <HeatmapLayer points={heatmap} />}
        </MapView>
      </div>
    </div>
  );
}
