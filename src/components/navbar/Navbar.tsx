import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  Shield,
  Menu,
  X,
  Sun,
  Moon,
  Phone,
} from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isLanding = location.pathname === "/";
  const isCitizen = location.pathname.startsWith("/citizen");

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl",
        "bg-background/80"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Scam<span className="text-primary">Guard</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {(isLanding || isCitizen) && (
              <>
                <NavLink to="/citizen/report">Report Scam</NavLink>
                <NavLink to="/citizen/track">Track Status</NavLink>
                <NavLink to="/citizen/currency-check">Check Currency</NavLink>
                <NavLink to="/citizen/scam-check">Detect Scam</NavLink>
                <NavLink to="/citizen/alerts">Alerts Map</NavLink>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Emergency button (desktop) */}
            {(isLanding || isCitizen) && (
              <a
                href="tel:112"
                className="hidden items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 md:flex"
                aria-label="Emergency: Call 112"
              >
                <Phone className="h-3.5 w-3.5" />
                Emergency
              </a>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>

            {/* CTA Buttons */}
            <div className="hidden items-center gap-2 md:flex">
              {isLanding && (
                <>
                  <Link
                    to="/citizen"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Citizen Portal
                  </Link>
                  <Link
                    to="/police/login"
                    className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    Police Login
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <MobileNavLink to="/citizen" onClick={() => setIsOpen(false)}>Citizen Portal</MobileNavLink>
            <MobileNavLink to="/citizen/report" onClick={() => setIsOpen(false)}>Report Scam</MobileNavLink>
            <MobileNavLink to="/citizen/track" onClick={() => setIsOpen(false)}>Track Status</MobileNavLink>
            <MobileNavLink to="/citizen/currency-check" onClick={() => setIsOpen(false)}>Check Currency</MobileNavLink>
            <MobileNavLink to="/citizen/scam-check" onClick={() => setIsOpen(false)}>Detect Scam</MobileNavLink>
            <MobileNavLink to="/citizen/alerts" onClick={() => setIsOpen(false)}>Alerts Map</MobileNavLink>
            <hr className="my-2 border-border" />
            <MobileNavLink to="/police/login" onClick={() => setIsOpen(false)}>Police Login</MobileNavLink>
            <a
              href="tel:112"
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Phone className="h-4 w-4" />
              Emergency: Call 112
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      {children}
    </Link>
  );
}
