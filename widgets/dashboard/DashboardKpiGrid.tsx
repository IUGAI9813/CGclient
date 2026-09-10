import React from "react";
import { Shield, TrendingUp, AlertTriangle, Radio, Zap, Compass } from "lucide-react";
import { Incident } from "@/entities/incident/model/types";
import { useLanguage } from "@/app/components/LanguageContext";

interface DashboardKpiGridProps {
  incidents: Incident[];
  panicMode: boolean;
  onNavigateToTab: (tab: string) => void;
}

export function DashboardKpiGrid({ incidents, panicMode, onNavigateToTab }: DashboardKpiGridProps) {
  const { t } = useLanguage();
  const activeAlertsCount = incidents.filter((i) => i.status === "ACTIVE").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
      {/* KPI 1: Fleet Safety Score */}
      <div className="cyber-panel p-4 rounded relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-1 text-[9px] bg-[var(--panel-header-bg)] border-l border-b border-panel-border text-zinc-500">
          SEC_INDEX_01
        </div>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              {t("dashboard.score")}
            </span>
            <span className="text-2xl font-bold text-[var(--foreground)] tracking-tight block mt-1">
              {panicMode ? "42.8%" : "98.4%"}
            </span>
          </div>
          <div
            className={`p-2 rounded bg-[var(--panel-header-bg)] border ${
              panicMode ? "border-brand-rose text-brand-rose" : "border-brand-emerald text-brand-emerald"
            }`}
          >
            <Shield className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <TrendingUp
            className={`w-3.5 h-3.5 ${panicMode ? "text-brand-rose rotate-180" : "text-brand-emerald"}`}
          />
          <span className={panicMode ? "text-brand-rose" : "text-brand-emerald"}>
            {panicMode ? `-55.6% (${t("dashboard.critical")})` : `+0.4% ${t("dashboard.vs_last_hour")}`}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-right from-brand-emerald to-transparent opacity-30" />
      </div>

      {/* KPI 2: Active Alerts */}
      <div
        onClick={() => onNavigateToTab("incidents")}
        className="cyber-panel p-4 rounded relative overflow-hidden group cursor-pointer hover:border-zinc-700 transition-all"
      >
        <div className="absolute top-0 right-0 p-1 text-[9px] bg-[var(--panel-header-bg)] border-l border-b border-panel-border text-zinc-500">
          ALERT_CTR_02
        </div>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              {t("dashboard.alerts")}
            </span>
            <span
              className={`text-2xl font-bold tracking-tight block mt-1 ${
                activeAlertsCount > 0 ? "text-brand-rose animate-pulse" : "text-[var(--foreground)]"
              }`}
            >
              {activeAlertsCount}
            </span>
          </div>
          <div
            className={`p-2 rounded bg-[var(--panel-header-bg)] border ${
              activeAlertsCount > 0
                ? "border-brand-rose text-brand-rose animate-pulse"
                : "border-panel-border text-zinc-400"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
          <span className="text-zinc-500">{t("dashboard.unresolved")}</span>
          <span className={`font-bold ${activeAlertsCount > 0 ? "text-brand-rose" : "text-zinc-300"}`}>
            {incidents.filter((i) => i.severity === "CRITICAL" && i.status === "ACTIVE").length}{" "}
            {t("dashboard.critical")}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-right from-brand-rose to-transparent opacity-30" />
      </div>

      {/* KPI 3: V2X Latency */}
      <div className="cyber-panel p-4 rounded relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-1 text-[9px] bg-[var(--panel-header-bg)] border-l border-b border-panel-border text-zinc-500">
          NET_PING_03
        </div>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              {t("dashboard.latency")}
            </span>
            <span className="text-2xl font-bold text-[var(--foreground)] tracking-tight block mt-1">
              14.2 ms
            </span>
          </div>
          <div className="p-2 rounded bg-[var(--panel-header-bg)] border border-panel-border text-brand-cyan">
            <Radio className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-brand-emerald">
          <Zap className="w-3.5 h-3.5" />
          <span>{t("dashboard.telemetry_rate")}</span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-right from-brand-cyan to-transparent opacity-30" />
      </div>

      {/* KPI 4: Active Fleet Status */}
      <div
        onClick={() => onNavigateToTab("fleet")}
        className="cyber-panel p-4 rounded relative overflow-hidden group cursor-pointer hover:border-panel-border-hover transition-all"
      >
        <div className="absolute top-0 right-0 p-1 text-[9px] bg-[var(--panel-header-bg)] border-l border-b border-panel-border text-zinc-500">
          FLT_STAT_04
        </div>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              {t("dashboard.fleet_service")}
            </span>
            <span className="text-2xl font-bold text-[var(--foreground)] tracking-tight block mt-1">
              148 / 150
            </span>
          </div>
          <div className="p-2 rounded bg-[var(--panel-header-bg)] border border-panel-border text-zinc-400 group-hover:text-[var(--foreground)]">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: "10s" }} />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
          <span className="text-zinc-500">{t("dashboard.standby")}</span>
          <span className="text-zinc-400 font-bold">{t("dashboard.hangar")}</span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-right from-zinc-500 to-transparent opacity-30" />
      </div>
    </div>
  );
}
