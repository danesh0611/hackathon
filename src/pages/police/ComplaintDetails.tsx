import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCaseDetail, updateCase } from "@/services/police";
import type { CaseDetail } from "@/types/api";
import { formatDateTime, getCaseStatusConfig, getCaseTypeLabel } from "@/lib/utils";
import { RiskBadge, ResultBadge } from "@/components/alerts/RiskBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, MapPin, User, Phone, CheckCircle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/modal/ConfirmDialog";
import MapView from "@/components/maps/MapView";
import { MarkerLayer } from "@/components/maps/MarkerLayer";

export default function ComplaintDetails() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await fetchCaseDetail(id);
        setComplaint(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load case details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleStatusChange = async () => {
    if (!complaint || !pendingStatus) return;
    setStatusUpdating(true);
    try {
      await updateCase(complaint.id, { status: pendingStatus as any });
      setComplaint({ ...complaint, status: pendingStatus as any });
      toast.success("Status updated successfully.");
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      setStatusUpdating(false);
      setShowStatusDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Case not found.
      </div>
    );
  }

  const statusConfig = getCaseStatusConfig(complaint.status);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/police/complaints"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight flex items-center gap-3">
            Case {complaint.id.split('-')[0]}
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-sans ${statusConfig.className}`}>
              {statusConfig.label}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">Reported on {formatDateTime(complaint.createdAt)}</p>
        </div>
        
        <div className="ml-auto flex items-center gap-3">
          <div className="text-sm font-medium mr-2">Update Status:</div>
          <Select 
            value={complaint.status} 
            onValueChange={(val) => {
              setPendingStatus(val as any);
              setShowStatusDialog(true);
            }}
            disabled={statusUpdating}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Incident Details</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{getCaseTypeLabel(complaint.type)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reporter Details</p>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{complaint.citizenName || "Anonymous"}</span>
                </div>
                {complaint.citizenPhone && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {complaint.citizenPhone}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <div className="bg-muted/30 p-4 rounded-lg text-sm leading-relaxed border border-border">
                {complaint.description}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              AI Analysis Report
            </h2>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-primary/10">
                <div>
                  <p className="text-sm text-muted-foreground">Risk Assessment</p>
                  <RiskBadge risk={complaint.status === 'open' ? 'High' : 'Low'} size="lg" className="mt-1" />
                </div>
                {complaint.type === 'counterfeit' && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Detection Result</p>
                    <ResultBadge result="Fake" size="lg" className="mt-1" />
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">AI Insights</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {"Multimodal AI detected patterns matching known fraud rings."}
                </p>
              </div>

              {complaint.attachments && complaint.attachments.length > 0 && (
                <div className="mt-6 pt-4 border-t border-primary/10">
                  <p className="text-sm font-medium mb-3">Attached Evidence</p>
                  <div className="flex flex-wrap gap-3">
                    {complaint.attachments.map((att: any, i: number) => (
                      <div key={i} className="relative group overflow-hidden rounded-md border border-border h-24 w-24 bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground p-2 text-center break-words">{att.name}</div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="sm" variant="secondary" className="h-7 text-xs">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Location & Meta */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              Location
            </h2>
            {complaint.location ? (
              <>
                <p className="text-sm mb-4">{"Chennai, Tamil Nadu"}</p>
                <div className="h-[200px] rounded-lg overflow-hidden border border-border">
                  <MapView center={[complaint.location.lat, complaint.location.lng]} zoom={15}>
                    <MarkerLayer 
                      markers={[{
                        id: complaint.id,
                        lat: complaint.location.lat,
                        lng: complaint.location.lng,
                        type: complaint.type as any,
                        severity: complaint.status === 'open' ? 'high' : 'low',
                        title: "Incident Location",
                        summary: "Exact coordinates of the reported incident.",
                        date: complaint.createdAt
                      }]} 
                    />
                  </MapView>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No precise location provided.</p>
            )}
          </Card>
          
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Case Timeline</h2>
            <div className="relative border-l-2 border-muted ml-3 space-y-6">
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-card" />
                <p className="text-sm font-medium">Case Reported</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(complaint.createdAt)}</p>
              </div>
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-blue-500 ring-4 ring-card" />
                <p className="text-sm font-medium">AI Analysis Completed</p>
                <p className="text-xs text-muted-foreground">Instantly</p>
              </div>
              {complaint.status !== 'open' && (
                <div className="relative pl-6">
                  <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-amber-500 ring-4 ring-card" />
                  <p className="text-sm font-medium">Investigation Started</p>
                  <p className="text-xs text-muted-foreground">Pending officer assignment</p>
                </div>
              )}
              {complaint.status === 'resolved' && (
                <div className="relative pl-6">
                  <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-card flex items-center justify-center">
                    <CheckCircle className="h-2 w-2 text-white" />
                  </span>
                  <p className="text-sm font-medium text-emerald-600">Case Resolved</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog 
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        title="Update Case Status"
        description={`Are you sure you want to change the status of this case to ${pendingStatus}?`}
        onConfirm={handleStatusChange}
      />
    </div>
  );
}
