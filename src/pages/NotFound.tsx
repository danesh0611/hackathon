import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <AlertCircle className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Link to="/" className={buttonVariants()}>
          Go Home
        </Link>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
}
