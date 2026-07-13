import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/table/DataTable";
import { fetchCases } from "@/services/police";
import { RiskBadge } from "@/components/alerts/RiskBadge";
import { formatDateTime, getCaseStatusConfig, getCaseTypeLabel } from "@/lib/utils";
import type { CaseListItem } from "@/types/api";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

export default function ComplaintsList() {
  const [recentCases, setRecentCases] = useState<CaseListItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCases().then(res => setRecentCases(res.data)).catch(console.error);
  }, []);

  const filteredCases = recentCases.filter(c => {
    if (statusFilter && c.status !== statusFilter) return false;
    if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !c.summary.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const columns = [
    {
      header: "Case ID",
      accessorKey: "id" as keyof CaseListItem,
      cell: (item: CaseListItem) => <span className="font-mono font-medium text-xs">{item.id.split('-')[0]}</span>
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
      accessorKey: "status" as keyof CaseListItem,
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
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/police/complaints/${item.id}`}>View Case</Link>
        </Button>
      )
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Complaints Register
          </h1>
          <p className="text-muted-foreground mt-1">Browse, filter, and manage all citizen complaints.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <DataTable
          data={filteredCases}
          columns={columns}
          searchPlaceholder="Search by ID or description..."
          onSearch={setSearch}
          onFilter={setStatusFilter}
          filterOptions={[
            { label: "Open", value: "open" },
            { label: "Investigating", value: "investigating" },
            { label: "Resolved", value: "resolved" },
            { label: "Closed", value: "closed" },
          ]}
        />
      </div>
    </div>
  );
}
