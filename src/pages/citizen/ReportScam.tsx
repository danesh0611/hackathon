import { useState } from "react"; // Not correct, I should use react-hook-form
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileDropzone } from "@/components/upload/FileDropzone";
import { EmergencyButton } from "@/components/EmergencyButton";
import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { submitReport } from "@/services/citizen";
import type { ReportPayload } from "@/types/api";

export default function ReportScam() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<ReportPayload>({
    phone: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.phone.match(/^\+91[0-9]{10}$/) && !formData.phone.match(/^[0-9]{10}$/)) {
      setError("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    const hasMedia = formData.screenshot || formData.currencyImage || formData.audio || formData.video;
    if (!hasMedia && formData.description.trim().length < 20) {
      setError("Please provide a detailed description (at least 20 characters) or upload evidence.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Auto format +91 if missing
      const payload = { ...formData };
      if (payload.phone.length === 10) {
        payload.phone = "+91" + payload.phone;
      }
      
      const res = await submitReport(payload);
      setComplaintId(res.complaintId);
      setIsSuccess(true);
    } catch (err) {
      setError("Failed to submit report. Please try again or use the emergency numbers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ phone: "", description: "" });
    setIsSuccess(false);
    setComplaintId("");
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/20">
        <Navbar />
        <main className="flex-1 container mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Report Submitted Successfully</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Thank you for helping keep our community safe. Law enforcement will review your evidence.
          </p>
          <div className="mx-auto mb-10 max-w-sm rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Your Complaint Reference ID</p>
            <p className="mt-2 text-3xl font-mono font-bold text-primary">{complaintId}</p>
          </div>
          <div className="flex justify-center gap-4">
            <Button onClick={handleReset} variant="outline">Report Another</Button>
            <Button asChild><a href="/citizen/alerts">View Nearby Alerts</a></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Report a Scam</h1>
            <p className="text-muted-foreground mt-1">Submit evidence securely to the Cyber Crime Cell.</p>
          </div>
          <EmergencyButton className="hidden sm:flex" />
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            
            <div className="mb-8 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
              <div className="flex gap-3">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <p>
                  Any information you provide is strictly confidential. Providing evidence like screenshots, audio recordings, or videos significantly increases the chances of tracking down the perpetrators.
                </p>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Incident Details</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Your Contact Number <span className="text-destructive">*</span></Label>
                      <Input 
                        id="phone" 
                        placeholder="e.g. 9876543210" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Describe what happened</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Provide as much detail as possible (who contacted you, what did they ask for, etc.)" 
                        className="min-h-[160px]"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="mb-4 text-lg font-semibold">Evidence Upload (Optional)</h3>
                <div className="grid gap-4">
                  <FileDropzone 
                    label="Screenshot / Document"
                    onFileSelect={(f) => setFormData({ ...formData, screenshot: f || undefined })}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FileDropzone 
                      label="Audio Recording"
                      type="audio"
                      accept="audio/*"
                      onFileSelect={(f) => setFormData({ ...formData, audio: f || undefined })}
                    />
                    <FileDropzone 
                      label="Video"
                      type="video"
                      accept="video/mp4, video/quicktime"
                      maxSizeMB={50}
                      onFileSelect={(f) => setFormData({ ...formData, video: f || undefined })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="mt-8 flex items-center gap-4 border-t border-border pt-6">
              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Securely...
                  </>
                ) : (
                  "Submit Report"
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                By submitting, you agree to share this information with law enforcement.
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
