import { AlertTriangle, MapPin, Clock } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { AlertItem } from "@/types/api";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  alert: AlertItem;
  className?: string;
  onClick?: () => void;
}

export function AlertCard({ alert, className, onClick }: AlertCardProps) {
  const isHighSeverity = alert.severity === "high";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl border bg-card p-4 transition-all hover:shadow-md",
        isHighSeverity ? "border-red-500/30" : "border-border",
        className
      )}
    >
      {isHighSeverity && (
        <div className="absolute left-0 top-0 h-full w-1 bg-red-500" />
      )}
      
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={cn("mt-0.5 rounded-full p-1.5", 
            alert.severity === "high" ? "bg-red-500/10 text-red-500" :
            alert.severity === "medium" ? "bg-amber-500/10 text-amber-500" :
            "bg-emerald-500/10 text-emerald-500"
          )}>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold leading-none tracking-tight">{alert.title}</h4>
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
              {alert.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          <span>Nearby location</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDateTime(alert.date)}</span>
        </div>
      </div>
    </div>
  );
}
