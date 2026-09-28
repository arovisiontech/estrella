import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  count: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
}

export default function DashboardCard({
  title,
  count,
  icon: Icon,
  description,
  trend = "neutral",
}: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 hover:border-[#00AEF0] transition shadow-xs">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{count}</p>
          {description && (
            <p className="mt-1 text-xs text-slate-400">{description}</p>
          )}
        </div>
        <div className="rounded-xl bg-sky-50 p-3 text-[#00AEF0] border border-sky-100">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
