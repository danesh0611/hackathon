import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchCases } from "@/services/police"; // we'll use API directly instead of Redux for cases to keep it simple, or fix Redux
import { StatCard } from "@/components/cards/StatCard";
import { LineChartCard, PieChartCard } from "@/components/charts/ChartCards";
import { DataTable } from "@/components/table/DataTable";
import { RiskBadge } from "@/components/alerts/RiskBadge";
import { formatDateTime, getCaseStatusConfig, getCaseTypeLabel } from "@/lib/utils";
import { ShieldAlert, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { CaseListItem } from "@/types/api";
import { loadDashboard } from "@/store/dashboardSlice";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { metrics, isLoading, error } = useAppSelector((state) => state.dashboard);
  const [recentCases, setRecentCases] = useState<CaseListItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    // load metrics
    dispatch(loadDashboard());
    
    // load cases directly
    fetchCases().then(res => setRecentCases(res.data)).catch(console.error);
    
    const interval = setInterval(() => {
      dispatch(loadDashboard());
      fetchCases().then(res => setRecentCases(res.data)).catch(console.error);
    }, 300000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const totalCases = metrics?.todayComplaints?.value || 0;
  const activeThreats = metrics?.activeFraudRings?.value || 0;
  const officersOnline = metrics?.officersOnline !== undefined ? metrics.officersOnline : 0;
  const resolutionRate = metrics?.resolutionRate !== undefined ? metrics.resolutionRate : 0;
  const trendData = { "2026-07-01": 10, "2026-07-02": 15, "2026-07-03": 12, "2026-07-04": 20, "2026-07-05": 18, "2026-07-06": 25, "2026-07-07": 47 };
  const caseTypeDistribution = { scam: 45, counterfeit: 30, fraud_call: 20, digital_arrest: 5 };

  // Transform data for charts
  const trendChartData = Object.entries(trendData).map(([date, count]) => ({
    date,
    cases: count
  }));

  const pieChartData = Object.entries(caseTypeDistribution).map(([type, count]) => {
    const colors: Record<string, string> = {
      scam: "hsl(var(--chart-1))",
      counterfeit: "hsl(var(--chart-2))",
      fraud_call: "hsl(var(--chart-3))",
      digital_arrest: "hsl(var(--chart-4))"
    };
    return {
      name: getCaseTypeLabel(type),
      value: count,
      color: colors[type] || "hsl(var(--chart-5))"
    };
  });

  const filteredCases = recentCases.filter(c => {
    if (statusFilter && c.status !== statusFilter) return false;
    return true;
  });

  const columns = [
    {
      header: "Case ID",
      accessorKey: "id" as keyof CaseListItem,
      cell: (item: CaseListItem) => <span className="font-mono font-medium text-xs">{item.id.split('-')[0]}...</span>
    },
    {
      header: "Date Reported",
      accessorKey: "createdAt" as keyof CaseListItem,
      cell: (item: CaseListItem) => <span className="text-sm text-muted-foreground">{formatDateTime(item.createdAt)}</span>
    },
    {
      header: "Type",
      accessorKey: "type" as keyof CaseListItem,
      cell: (item: CaseListItem) => <span className="font-medium">{getCaseTypeLabel(item.type)}</span>
    },
    {
      header: "Risk",
      accessorKey: "status" as keyof CaseListItem, // Risk is not in CaseListItem mock, mock it with status
      cell: (item: CaseListItem) => <RiskBadge risk={item.status === 'open' ? 'High' : 'Low'} />
    },
    {
      header: "Status",
      accessorKey: "status" as keyof CaseListItem,
      cell: (item: CaseListItem) => {
        const config = getCaseStatusConfig(item.status);
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
            {config.label}
          </span>
        );
      }
    },
    {
      header: "Action",
      accessorKey: "id" as keyof CaseListItem,
      cell: (item: CaseListItem) => (
        <Link to={`/police/complaints/${item.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
          View Details
        </Link>
      )
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time intelligence and threat monitoring.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Cases"
          value={totalCases}
          icon={ShieldAlert}
          isLoading={isLoading}
        />
        <StatCard
          label="Active Threats"
          value={activeThreats}
          icon={AlertTriangle}
          isLoading={isLoading}
          iconColor="text-destructive"
        />
        <StatCard
          label="Officers Online"
          value={officersOnline}
          icon={Users}
          isLoading={isLoading}
        />
        <StatCard
          label="Resolution Rate (%)"
          value={resolutionRate}
          icon={TrendingUp}
          isLoading={isLoading}
          iconColor="text-emerald-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <LineChartCard
          className="lg:col-span-2"
          title="Case Volume Trends (Last 7 Days)"
          data={trendChartData}
          xKey="date"
          yKeys={[{ key: "cases", name: "Reported Cases", color: "hsl(var(--primary))" }]}
          isLoading={isLoading}
          error={error}
        />
        <PieChartCard
          className="lg:col-span-1"
          title="Incident Breakdown"
          data={pieChartData}
          nameKey="name"
          dataKey="value"
          isLoading={isLoading}
          error={error}
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Recent Complaints</h2>
          <div className="flex items-center gap-2">
            <Link to="/police/complaints" className={buttonVariants({ variant: "outline", size: "sm" })}>
              View All
            </Link>
          </div>
        </div>
        
        {error ? (
          <div className="p-4 text-center text-destructive bg-destructive/10 rounded-lg">Failed to load recent cases.</div>
        ) : (
          <DataTable
            data={filteredCases}
            columns={columns}
            searchPlaceholder="Search cases..."
            onFilter={setStatusFilter}
            filterOptions={[
              { label: "Open", value: "open" },
              { label: "Investigating", value: "investigating" },
              { label: "Resolved", value: "resolved" }
            ]}
          />
        )}
      </div>
    </div>
  );
}
