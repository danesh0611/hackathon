import { useState, useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  className?: string;
  iconColor?: string;
  isLoading?: boolean;
  children?: ReactNode;
}

function useAnimatedCount(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0);
  const animFrameRef = useRef<number>(undefined);

  useEffect(() => {
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [target, duration]);

  return count;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  trend = "neutral",
  trendValue,
  className,
  iconColor = "text-primary",
}: StatCardProps) {
  const animatedValue = useAnimatedCount(value);

  const trendConfig = {
    up: { icon: TrendingUp, color: "text-risk-low", label: "increase" },
    down: { icon: TrendingDown, color: "text-risk-high", label: "decrease" },
    neutral: { icon: Minus, color: "text-muted-foreground", label: "no change" },
  };

  const TrendIcon = trendConfig[trend].icon;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
        className
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className={cn("rounded-lg bg-primary/10 p-2.5", iconColor.replace("text-", "bg-").replace("primary", "primary/10"))}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
          {trend !== "neutral" && (
            <div className={cn("flex items-center gap-1 text-xs font-medium", trendConfig[trend].color)}>
              <TrendIcon className="h-3.5 w-3.5" />
              {trendValue && <span>{trendValue}%</span>}
              <span className="sr-only">{trendConfig[trend].label}</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold tracking-tight">{animatedValue.toLocaleString("en-IN")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
