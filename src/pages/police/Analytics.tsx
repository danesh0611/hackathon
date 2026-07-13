import { useEffect, useState } from "react";
import { fetchDashboard } from "@/services/police";
import { BarChartCard, PieChartCard } from "@/components/charts/ChartCards";
import { Card } from "@/components/ui/card";
import { Activity, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Analytics() {
  const [_dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Mock bar chart data since it's not in the API yet
  const weeklyResolution = [
    { day: "Mon", resolved: 12 },
    { day: "Tue", resolved: 19 },
    { day: "Wed", resolved: 15 },
    { day: "Thu", resolved: 22 },
    { day: "Fri", resolved: 28 },
    { day: "Sat", resolved: 14 },
    { day: "Sun", resolved: 8 },
  ];

  const cityDistribution = [
    { city: "Chennai", cases: 342 },
    { city: "Coimbatore", cases: 210 },
    { city: "Madurai", cases: 150 },
    { city: "Trichy", cases: 90 },
    { city: "Salem", cases: 60 },
  ];

  const casePie = [
    { name: "Scam", value: 450, color: "hsl(var(--chart-1))" },
    { name: "Counterfeit", value: 120, color: "hsl(var(--chart-2))" },
    { name: "Fraud Call", value: 310, color: "hsl(var(--chart-3))" },
    { name: "Digital Arrest", value: 80, color: "hsl(var(--chart-4))" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1">Deep dive into crime patterns and police performance metrics.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="p-4 flex items-center gap-4 border-l-4 border-l-primary">
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Avg Resolution Time</div>
            <div className="text-2xl font-bold">4.2 days</div>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Top Hotspot</div>
            <div className="text-2xl font-bold">T. Nagar</div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <BarChartCard
          title="Weekly Resolution Rate"
          data={weeklyResolution}
          xKey="day"
          yKeys={[{ key: "resolved", name: "Cases Resolved", color: "hsl(var(--primary))" }]}
          layout="horizontal"
          isLoading={loading}
        />
        
        <PieChartCard
          title="Case Category Distribution"
          data={casePie}
          nameKey="name"
          dataKey="value"
          isLoading={loading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <BarChartCard
          title="Incident Distribution by Region"
          data={cityDistribution}
          xKey="city"
          yKeys={[{ key: "cases", name: "Reported Cases", color: "hsl(var(--chart-2))" }]}
          layout="vertical"
          isLoading={loading}
        />
      </div>
    </div>
  );
}
