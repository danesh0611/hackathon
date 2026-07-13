import { Link } from "react-router-dom";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { EmergencyButton } from "@/components/EmergencyButton";
import { ShieldAlert, ScanLine, MessageSquareWarning, Map } from "lucide-react";

export default function CitizenPortal() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Citizen Portal</h1>
            <p className="text-muted-foreground mt-1">Access AI-powered tools to protect yourself from fraud.</p>
          </div>
          <EmergencyButton />
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          <PortalCard
            to="/citizen/report"
            icon={ShieldAlert}
            title="Report a Scam"
            description="Submit details, screenshots, and audio/video evidence of a scam to the Cyber Crime Cell."
            color="text-blue-500"
            bgColor="bg-blue-500/10"
          />
          <PortalCard
            to="/citizen/currency-check"
            icon={ScanLine}
            title="Check Fake Currency"
            description="Upload a photo of a banknote. Our AI will instantly verify if it's genuine or counterfeit."
            color="text-emerald-500"
            bgColor="bg-emerald-500/10"
          />
          <PortalCard
            to="/citizen/scam-check"
            icon={MessageSquareWarning}
            title="Detect Scam Text"
            description="Paste a suspicious SMS, WhatsApp message, or email to check if it matches known scam patterns."
            color="text-amber-500"
            bgColor="bg-amber-500/10"
          />
          <PortalCard
            to="/citizen/alerts"
            icon={Map}
            title="Nearby Alerts Map"
            description="View real-time hotspots for reported scams and counterfeit currency in your area."
            color="text-purple-500"
            bgColor="bg-purple-500/10"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PortalCard({ to, icon: Icon, title, description, color, bgColor }: any) {
  return (
    <Link 
      to={to}
      className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-md hover:border-primary/40"
    >
      <div className={`mb-4 inline-flex w-fit rounded-lg ${bgColor} p-3 ${color} transition-transform group-hover:scale-110`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Link>
  );
}
