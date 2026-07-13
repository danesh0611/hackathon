import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  ShieldAlert, 
  ScanLine, 
  Map, 
  MessageSquareWarning, 
  ArrowRight,
  Siren
} from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { buttonVariants } from "@/components/ui/button";
import { fetchStatistics } from "@/services/police";
import { formatNumber } from "@/lib/utils";

export default function LandingPage() {
  const [stats, setStats] = useState({
    reports: 0,
    fakeCurrency: 0,
    officers: 0
  });

  useEffect(() => {
    fetchStatistics().then((data) => {
      setStats({
        reports: data.totalReportsAnalyzed,
        fakeCurrency: data.totalFakeCurrencyDetected,
        officers: data.totalActiveOfficers
      });
    }).catch(console.error);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-20 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldAlert className="h-8 w-8" />
            </div>
            
            <h1 className="text-balance text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              AI-Powered <span className="text-primary">Scam Detection</span>
              <br className="hidden sm:block" /> & Public Safety Platform
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Report scams, detect counterfeit currency instantly using AI, and help law enforcement track down fraud rings in real-time.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/citizen" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto" })}>
                Citizen Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/police/login" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto" })}>
                Police Login
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Platform Features</h2>
              <p className="mt-4 text-lg text-muted-foreground">Cutting-edge AI tools to protect citizens and empower police.</p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard 
                icon={ScanLine} 
                title="Currency Detection" 
                description="Upload an image of a banknote to instantly verify its authenticity using YOLO computer vision." 
              />
              <FeatureCard 
                icon={MessageSquareWarning} 
                title="Scam Text Analysis" 
                description="Paste suspicious SMS, WhatsApp, or emails. Our LLM detects digital arrest and phishing patterns." 
              />
              <FeatureCard 
                icon={Map} 
                title="Real-Time Hotspots" 
                description="View live maps of scam and counterfeit currency hotspots in your area to stay alert." 
              />
              <FeatureCard 
                icon={Siren} 
                title="Emergency SOS" 
                description="One-tap access to National Emergency (112) and Cyber Crime Helpline (1930)." 
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
            </div>
            
            <div className="grid gap-12 lg:grid-cols-3">
              <StepCard 
                number="1" 
                title="Citizen Reports" 
                description="Citizens report scams or upload images of suspicious currency and texts through the public portal." 
              />
              <StepCard 
                number="2" 
                title="AI Analyzes" 
                description="Our multimodal AI engine analyzes the evidence, extracts text/patterns, and assigns a risk score." 
              />
              <StepCard 
                number="3" 
                title="Police Acts" 
                description="Law enforcement receives real-time alerts and investigates fraud rings using network graphing tools." 
              />
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="border-t border-border bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 sm:grid-cols-3 text-center">
              <StatCard value={formatNumber(stats.reports)} label="Reports Analyzed" />
              <StatCard value={formatNumber(stats.fakeCurrency)} label="Fake Currency Detected" />
              <StatCard value={formatNumber(stats.officers)} label="Active Officers" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({ value, label, className }: { value: string, label: string, className?: string }) {
  return (
    <div className={className}>
      <div className="text-5xl font-extrabold">{value}</div>
      <div className="mt-2 text-lg font-medium text-primary-foreground/80">{label}</div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:border-primary/50 group">
      <div className="mb-6 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="relative text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
        {number}
      </div>
      <h3 className="mt-6 text-xl font-bold">{title}</h3>
      <p className="mt-3 text-muted-foreground">{description}</p>
      
      {/* Connector line (hidden on mobile) */}
      {number !== "3" && (
        <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-border border-dashed" />
      )}
    </div>
  );
}
