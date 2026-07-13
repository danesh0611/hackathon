import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [badgeNumber, setBadgeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ username: badgeNumber, password });
      navigate("/police/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid badge number or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background dark:bg-sidebar">
      {/* Left side - Branding (Hidden on mobile) */}
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8" />
            <span className="text-2xl font-bold">ScamGuard Police Portal</span>
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold leading-tight">
            Protecting citizens through AI-powered intelligence.
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-md">
            Access real-time scam reports, counterfeit currency heatmaps, and fraud ring network graphs.
          </p>
        </div>
        <div className="relative z-10 text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} Cyber Crime Investigation Cell
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 sm:px-16 xl:px-32 relative">
        {/* Mobile branding */}
        <div className="absolute top-8 left-8 flex items-center gap-2 lg:hidden text-foreground">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">ScamGuard</span>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Sign In</h2>
            <p className="mt-2 text-muted-foreground">
              Enter your credentials to access the secure portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="badge">
                Badge Number
              </label>
              <div className="relative">
                <div className="absolute left-3 top-2.5 text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  id="badge"
                  placeholder="e.g. POL-12345"
                  className="pl-10"
                  value={badgeNumber}
                  onChange={(e: any) => setBadgeNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-2.5 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In securely"
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center text-xs text-muted-foreground">
            Warning: Unauthorized access to this system is strictly prohibited and subject to legal action.
          </div>
        </div>
      </div>
    </div>
  );
}
