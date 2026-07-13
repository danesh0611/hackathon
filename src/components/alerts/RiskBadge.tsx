import { AlertTriangle, CheckCircle2, ShieldAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  risk: "Low" | "Medium" | "High";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const riskConfig: Record<string, { icon: LucideIcon; label: string; className: string }> = {
  High: {
    icon: ShieldAlert,
    label: "High Risk",
    className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900",
  },
  Medium: {
    icon: AlertTriangle,
    label: "Medium Risk",
    className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900",
  },
  Low: {
    icon: CheckCircle2,
    label: "Low Risk",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900",
  },
};

const sizeConfig = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-3 py-1 text-sm gap-1.5",
  lg: "px-4 py-2 text-base gap-2",
};

const iconSizeConfig = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function RiskBadge({ risk, size = "md", className }: RiskBadgeProps) {
  const config = riskConfig[risk];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold",
        config.className,
        sizeConfig[size],
        className
      )}
      role="status"
      aria-label={config.label}
    >
      <Icon className={iconSizeConfig[size]} aria-hidden="true" />
      {config.label}
    </span>
  );
}

interface ResultBadgeProps {
  result: "Real" | "Fake";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ResultBadge({ result, size = "lg", className }: ResultBadgeProps) {
  const isReal = result === "Real";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-bold",
        isReal
          ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900"
          : "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900",
        sizeConfig[size],
        className
      )}
      role="status"
      aria-label={`Currency is ${result}`}
    >
      {isReal ? (
        <CheckCircle2 className={iconSizeConfig[size]} aria-hidden="true" />
      ) : (
        <ShieldAlert className={iconSizeConfig[size]} aria-hidden="true" />
      )}
      {result === "Real" ? "✓ Genuine Currency" : "✗ Counterfeit Detected"}
    </span>
  );
}
