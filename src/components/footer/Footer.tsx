import { Link } from "react-router-dom";
import { Shield, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      {/* Emergency strip — always visible */}
      <div className="bg-red-600 px-4 py-2.5 text-center text-sm font-semibold text-white">
        <Phone className="mr-1.5 inline-block h-4 w-4" aria-hidden="true" />
        Emergency: <a href="tel:112" className="underline hover:no-underline">112</a>
        {" · "}
        Cyber Crime Helpline: <a href="tel:1930" className="underline hover:no-underline">1930</a>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold">
                Scam<span className="text-primary">Guard</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              AI-powered platform for scam detection and counterfeit currency identification, keeping citizens safe.
            </p>
          </div>

          {/* Citizen Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Citizen Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/citizen/report" className="hover:text-foreground">Report a Scam</Link></li>
              <li><Link to="/citizen/currency-check" className="hover:text-foreground">Check Currency</Link></li>
              <li><Link to="/citizen/scam-check" className="hover:text-foreground">Detect Scam Text</Link></li>
              <li><Link to="/citizen/alerts" className="hover:text-foreground">View Alerts Map</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="cursor-default">How to Identify Fake Currency</span></li>
              <li><span className="cursor-default">Common Scam Patterns</span></li>
              <li><span className="cursor-default">Digital Safety Guide</span></li>
              <li><Link to="/police/login" className="hover:text-foreground">Law Enforcement Portal</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms of Service</span></li>
              <li><span className="cursor-default">Data Protection</span></li>
              <li><span className="cursor-default">Contact Us</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ScamGuard. An AI-powered public safety initiative. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
