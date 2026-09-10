import React from "react";
import { Activity } from "lucide-react";
import { useLanguage } from "@/app/components/LanguageContext";

interface LidarTelemetryChartWidgetProps {
  panicMode: boolean;
}

export function LidarTelemetryChartWidget({ panicMode }: LidarTelemetryChartWidgetProps) {
  const { t } = useLanguage();

  return (
    <div className="cyber-panel rounded flex flex-col h-[360px] font-mono">
      <div className="p-3 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-cyan" />
          <span className="text-xs font-bold text-[var(--foreground)] tracking-widest uppercase">
            {t("dashboard.lidar_header")}
          </span>
        </div>
        <span className="text-[9px] font-bold text-brand-cyan">{t("dashboard.trend_12h")}</span>
      </div>

      <div className="flex-1 p-4 bg-transparent flex flex-col justify-between">
        {/* Custom SVG Line Chart */}
        <div className="flex-1 relative min-h-[140px] w-full flex items-end">
          <svg className="w-full h-full text-zinc-800" viewBox="0 0 300 120" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line
              x1="0"
              y1="30"
              x2="300"
              y2="30"
              stroke="currentColor"
              className="text-zinc-200 dark:text-zinc-800"
              strokeDasharray="3,3"
            />
            <line
              x1="0"
              y1="60"
              x2="300"
              y2="60"
              stroke="currentColor"
              className="text-zinc-200 dark:text-zinc-800"
              strokeDasharray="3,3"
            />
            <line
              x1="0"
              y1="90"
              x2="300"
              y2="90"
              stroke="currentColor"
              className="text-zinc-200 dark:text-zinc-800"
              strokeDasharray="3,3"
            />

            {/* Threat Area Background */}
            <rect x="180" y="60" width="40" height="60" fill="rgba(244, 63, 94, 0.08)" />
            <text x="185" y="80" fill="#f43f5e" className="text-[7px]" fontFamily="monospace">
              {t("dashboard.anomalous_drop")}
            </text>

            {/* Ingestion Stream Path */}
            <path
              d={
                panicMode
                  ? "M0,90 L30,92 L60,88 L90,95 L120,98 L150,110 L180,115 L210,118 L240,118 L270,119 L300,119"
                  : "M0,35 L30,42 L60,32 L90,38 L120,25 L150,45 L180,82 L210,48 L240,30 L270,35 L300,28"
              }
              fill="none"
              stroke={panicMode ? "#f43f5e" : "#0284c7"}
              strokeWidth="2"
              className="transition-all duration-500"
            />

            {/* Ingestion Stream Dots */}
            <circle
              cx="180"
              cy={panicMode ? 115 : 82}
              r="4"
              fill={panicMode ? "#f43f5e" : "#f59e0b"}
              className="animate-pulse"
            />
          </svg>

          {/* Y-axis descriptors */}
          <div className="absolute left-1 top-2 text-[8px] text-zinc-500 flex flex-col justify-between h-[80%] pointer-events-none">
            <span>100k/s</span>
            <span>50k/s</span>
            <span>0k/s</span>
          </div>
        </div>

        {/* Data points summary breakdown */}
        <div className="border-t border-panel-border mt-4 pt-4 grid grid-cols-2 gap-2 text-[10px]">
          <div className="bg-[var(--panel-header-bg)] p-2 rounded border border-panel-border">
            <span className="text-zinc-500 block uppercase">{t("dashboard.packet_success")}</span>
            <span
              className={`font-bold text-sm ${panicMode ? "text-brand-rose" : "text-[var(--foreground)]"}`}
            >
              {panicMode ? "12.42%" : "99.97%"}
            </span>
          </div>
          <div className="bg-[var(--panel-header-bg)] p-2 rounded border border-panel-border">
            <span className="text-zinc-500 block uppercase">{t("dashboard.can_rate")}</span>
            <span className="text-[var(--foreground)] font-bold text-sm">4.8k / sec</span>
          </div>
        </div>
      </div>
    </div>
  );
}
