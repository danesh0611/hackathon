import { useState } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RiskBadge } from "@/components/alerts/RiskBadge";
import { detectScam } from "@/services/citizen";
import type { ScamDetectionResult, ScamSource } from "@/types/api";
import { Loader2, MessageSquareWarning, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ScamCheck() {
  const [text, setText] = useState("");
  const [source, setSource] = useState<ScamSource>("sms");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScamDetectionResult | null>(null);

  const placeholders = {
    sms: "Paste the SMS text here... e.g. 'Dear Customer, your electricity will be disconnected tonight by 9:30 PM...'",
    whatsapp: "Paste the WhatsApp message here... e.g. 'Hello sir, we are calling from CBI regarding a parcel...'",
    email: "Paste the Email content here... e.g. 'Your account has been suspended due to unusual activity. Click here to verify...'",
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      const res = await detectScam({ text, source });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MessageSquareWarning className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Scam Text Analyzer</h1>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Not sure if a message is genuine? Paste it below and our AI will analyze it for known phishing and social engineering patterns.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm p-6">
          <Tabs defaultValue="sms" onValueChange={(v) => setSource(v as ScamSource)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="sms">SMS</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>
            
            <TabsContent value={source} className="mt-0">
              <Textarea 
                placeholder={placeholders[source]}
                className="min-h-[160px] text-base resize-y mb-4"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Button 
                size="lg" 
                className="w-full"
                disabled={!text.trim() || isAnalyzing}
                onClick={handleAnalyze}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Text...
                  </>
                ) : (
                  "Analyze Message"
                )}
              </Button>
            </TabsContent>
          </Tabs>

          {result && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 border-t border-border pt-8">
              <h3 className="text-lg font-semibold mb-4 text-center">Analysis Result</h3>
              
              <div className="flex flex-col items-center justify-center p-6 rounded-xl border bg-muted/30">
                <RiskBadge risk={result.risk} size="lg" className="mb-4" />
                
                <p className="text-center text-foreground font-medium max-w-md mb-2">
                  {result.reason}
                </p>
                
                {result.confidence && (
                  <p className="text-xs text-muted-foreground">
                    AI Confidence Score: {result.confidence}%
                  </p>
                )}
              </div>

              {result.risk === "High" && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
                  <div className="text-red-800 dark:text-red-300 text-sm font-medium">
                    This appears to be a dangerous scam attempt. Do not click any links or share personal information.
                  </div>
                  <Button asChild variant="destructive" size="sm" className="shrink-0">
                    <Link to="/citizen/report">
                      Report to Police
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
