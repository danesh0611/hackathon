import { useState } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { FileDropzone } from "@/components/upload/FileDropzone";
import { ResultBadge } from "@/components/alerts/RiskBadge";
import { Button } from "@/components/ui/button";
import { detectCurrency } from "@/services/citizen";
import type { CurrencyDetectionResult } from "@/types/api";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, ScanLine, XCircle } from "lucide-react";
import { toast } from "sonner";
import { EmergencyButton } from "@/components/EmergencyButton";

export default function CurrencyCheck() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CurrencyDetectionResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      const res = await detectCurrency(file);
      setResult(res);
      toast.success("Analysis complete");
    } catch (err) {
      toast.error("Failed to analyze currency image");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setShowExplanation(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Currency Verification</h1>
            <p className="text-muted-foreground mt-1">AI-powered detection of counterfeit banknotes.</p>
          </div>
          <EmergencyButton className="hidden sm:flex" />
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="p-6">
            {!result ? (
              <>
                <FileDropzone
                  onFileSelect={setFile}
                  accept="image/jpeg, image/png, image/webp"
                  type="image"
                  maxSizeMB={10}
                  label="Upload Banknote Image"
                />
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    size="lg" 
                    onClick={handleAnalyze} 
                    disabled={!file || isAnalyzing}
                    className="w-full sm:w-auto"
                  >
                    {isAnalyzing ? (
                      <>
                        <ScanLine className="mr-2 h-4 w-4 animate-pulse" />
                        Analyzing via AI...
                      </>
                    ) : (
                      "Verify Currency"
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 flex flex-col items-center justify-center text-center">
                  <ResultBadge result={result.result} size="lg" className="mb-4 text-lg px-6 py-3" />
                  
                  <div className="mt-2 text-sm text-muted-foreground">
                    AI Confidence Score
                  </div>
                  <div className="mt-1 flex items-center gap-3">
                    <div className="h-3 w-48 overflow-hidden rounded-full bg-muted">
                      <div 
                        className={`h-full ${result.result === 'Real' ? 'bg-emerald-500' : 'bg-red-500'}`} 
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                    <span className="font-bold">{result.confidence}%</span>
                  </div>
                </div>

                {result.result === "Fake" && result.missingSecurityFeatures.length > 0 && (
                  <div className="mb-6 rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-red-800 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                      Missing or Invalid Security Features
                    </h3>
                    <ul className="space-y-2">
                      {result.missingSecurityFeatures.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.result === "Real" && (
                  <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" />
                      Key Features Verified
                    </h3>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      The uploaded image contains the required security threads, micro-lettering, and intaglio printing characteristics of genuine currency.
                    </p>
                  </div>
                )}

                <div className="mb-6 rounded-lg border border-border">
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex w-full items-center justify-between p-4 font-medium hover:bg-muted/50 transition-colors"
                  >
                    <span>Detailed AI Explanation</span>
                    {showExplanation ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                  {showExplanation && (
                    <div className="border-t border-border p-4 text-sm leading-relaxed text-muted-foreground bg-muted/20">
                      {result.aiExplanation}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={handleReset}>
                    Check Another Note
                  </Button>
                  {result.result === "Fake" && (
                    <Button variant="destructive" asChild>
                      <a href="/citizen/report">Report to Police</a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
