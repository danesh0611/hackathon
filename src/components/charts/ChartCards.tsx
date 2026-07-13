import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartSkeleton } from "@/components/loader/Spinner";
import { AlertTriangle } from "lucide-react";

interface BaseChartProps {
  title: string;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

interface LineChartCardProps extends BaseChartProps {
  data: any[];
  xKey: string;
  yKeys: { key: string; color: string; name: string }[];
}

export function LineChartCard({ title, isLoading, error, className = "", data, xKey, yKeys }: LineChartCardProps) {
  if (isLoading) return <ChartSkeleton />;
  if (error) return <ChartError message={error} />;

  return (
    <div className={`rounded-xl border border-border bg-card p-6 ${className}`}>
      <h3 className="mb-4 text-base font-semibold">{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            {yKeys.map((y) => (
              <Line key={y.key} type="monotone" dataKey={y.key} name={y.name} stroke={y.color} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface BarChartCardProps extends BaseChartProps {
  data: any[];
  xKey: string;
  yKeys: { key: string; color: string; name: string }[];
  layout?: "horizontal" | "vertical";
}

export function BarChartCard({ title, isLoading, error, className = "", data, xKey, yKeys, layout = "horizontal" }: BarChartCardProps) {
  if (isLoading) return <ChartSkeleton />;
  if (error) return <ChartError message={error} />;

  return (
    <div className={`rounded-xl border border-border bg-card p-6 ${className}`}>
      <h3 className="mb-4 text-base font-semibold">{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout={layout} margin={{ top: 5, right: 20, bottom: 5, left: layout === "vertical" ? 40 : 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={layout === "horizontal"} horizontal={layout === "vertical"} />
            {layout === "horizontal" ? (
              <>
                <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              </>
            ) : (
              <>
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey={xKey} type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={80} />
              </>
            )}
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
            />
            {yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: "12px" }} />}
            {yKeys.map((y) => (
              <Bar key={y.key} dataKey={y.key} name={y.name} fill={y.color} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface PieChartCardProps extends BaseChartProps {
  data: any[];
  nameKey: string;
  dataKey: string;
}

export function PieChartCard({ title, isLoading, error, className = "", data, nameKey, dataKey }: PieChartCardProps) {
  if (isLoading) return <ChartSkeleton />;
  if (error) return <ChartError message={error} />;

  return (
    <div className={`rounded-xl border border-border bg-card p-6 ${className}`}>
      <h3 className="mb-4 text-base font-semibold">{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey={dataKey}
              nameKey={nameKey}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || `hsl(var(--primary))`} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChartError({ message }: { message: string }) {
  return (
    <div className="flex h-[320px] w-full flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
      <AlertTriangle className="mb-2 h-8 w-8 opacity-50" />
      <p>{message}</p>
    </div>
  );
}
