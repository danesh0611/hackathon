import { useState } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trackStatus } from "@/services/citizen";
import { Loader2, Search, CheckCircle2, AlertCircle, Clock, Search as SearchIcon } from "lucide-react";

export default function TrackStatus() {
  const [caseId, setCaseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [caseData, setCaseData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId.trim()) return;

    setLoading(true);
    setError("");
    setCaseData(null);

    try {
      const data = await trackStatus(caseId.trim());
      setCaseData(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Case not found. Please check your Complaint ID and try again.");
      } else {
        setError("Failed to fetch case status. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return <CheckCircle2 className="h-6 w-6 text-emerald-500" />;
      case "investigating":
        return <SearchIcon className="h-6 w-6 text-amber-500" />;
      case "open":
      default:
        return <Clock className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Track Complaint Status</h1>
          <p className="text-muted-foreground">
            Enter your Complaint ID to view the current status of your report.
          </p>
        </div>

        <Card className="p-6 mb-8 shadow-md">
          <form onSubmit={handleTrack} className="flex gap-3">
            <Input
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="e.g. CMP-2026-0001"
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !caseId.trim()}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Track
            </Button>
          </form>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </Card>

        {caseData && (
          <Card className="p-8 shadow-md overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-primary/10 px-4 py-2 rounded-bl-xl font-medium text-primary text-sm flex items-center gap-2">
              {getStatusIcon(caseData.status)}
              <span className="capitalize">{caseData.status}</span>
            </div>

            <h2 className="text-2xl font-bold mb-6">Complaint Details</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Complaint ID</h3>
                  <p className="font-semibold">{caseData.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Date Reported</h3>
                  <p className="font-semibold">{new Date(caseData.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Type</h3>
                  <p className="font-semibold capitalize">{caseData.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Assigned Officer</h3>
                  <p className="font-semibold">{caseData.officerAssigned || "Pending Assignment"}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Summary</h3>
                <p className="text-foreground leading-relaxed">{caseData.summary || caseData.description}</p>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
