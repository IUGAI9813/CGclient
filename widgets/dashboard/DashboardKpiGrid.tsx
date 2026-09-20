import React from "react";
import { Shield, AlertTriangle, Radio, Car } from "lucide-react";
import { Incident } from "@/entities/incident/model/types";
import { useLanguage } from "@/app/components/LanguageContext";

interface DashboardKpiGridProps {
  incidents: Incident[];
  panicMode: boolean;
  onNavigateToTab: (tab: string) => void;
}

export function DashboardKpiGrid({ incidents, panicMode, onNavigateToTab }: DashboardKpiGridProps) {
  const { t, language } = useLanguage();
  const activeAlertsCount = incidents.filter((i) => i.status === "ACTIVE").length;
  const criticalCount = incidents.filter((i) => i.severity === "CRITICAL" && i.status === "ACTIVE").length;


  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-sans">
      {/* 1. Fleet Safety */}
      <div className="cyber-panel p-3.5 rounded-lg border border-panel-border flex flex-col justify-between">
        <div className="flex items-center justify-between text-[var(--muted-text)]">
          <span className="text-xs font-medium">{t("dashboard.score")}</span>
          <Shield className={`w-4 h-4 ${panicMode ? "text-brand-rose" : "text-brand-emerald"}`} />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold text-[var(--foreground)] tracking-tight">
            {panicMode ? "42.8%" : "98.4%"}
          </span>
          <span className={`text-[11px] font-medium ${panicMode ? "text-brand-rose" : "text-brand-emerald"}`}>
            {panicMode ? "-55.6%" : "+0.4%"}
          </span>
        </div>
      </div>

      {/* 2. Active Incidents */}
      <div
        onClick={() => onNavigateToTab("incidents")}
        className="cyber-panel p-3.5 rounded-lg border border-panel-border flex flex-col justify-between cursor-pointer hover:border-brand-cyan/40 transition-colors"
      >
        <div className="flex items-center justify-between text-[var(--muted-text)]">
          <span className="text-xs font-medium">{t("dashboard.alerts")}</span>
          <AlertTriangle className={`w-4 h-4 ${activeAlertsCount > 0 ? "text-brand-rose" : "text-[var(--muted-text)]"}`} />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className={`text-xl font-bold tracking-tight ${activeAlertsCount > 0 ? "text-brand-rose" : "text-[var(--foreground)]"}`}>
            {activeAlertsCount}
          </span>
          <span className="text-[11px] text-[var(--muted-text)]">
            {criticalCount} {t("dashboard.critical")}
          </span>
        </div>
      </div>

      {/* 3. V2X Latency */}
      <div className="cyber-panel p-3.5 rounded-lg border border-panel-border flex flex-col justify-between">
        <div className="flex items-center justify-between text-[var(--muted-text)]">
          <span className="text-xs font-medium">{t("dashboard.latency")}</span>
          <Radio className="w-4 h-4 text-brand-cyan" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold text-[var(--foreground)] tracking-tight">
            14.2 <span className="text-xs font-normal text-[var(--muted-text)]">ms</span>
          </span>
          <span className="text-[11px] text-brand-emerald font-medium">100 Hz</span>
        </div>
      </div>

      {/* 4. Active Fleet */}
      <div
        onClick={() => onNavigateToTab("fleet")}
        className="cyber-panel p-3.5 rounded-lg border border-panel-border flex flex-col justify-between cursor-pointer hover:border-brand-cyan/40 transition-colors"
      >
        <div className="flex items-center justify-between text-[var(--muted-text)]">
          <span className="text-xs font-medium">{t("dashboard.fleet_service")}</span>
          <Car className="w-4 h-4 text-[var(--muted-text)]" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold text-[var(--foreground)] tracking-tight">
            148 <span className="text-xs font-normal text-[var(--muted-text)]">/ 150</span>
          </span>
          <span className="text-[11px] text-[var(--muted-text)] font-medium">98.7% {language === "ko" ? "가동" : "active"}</span>
        </div>
      </div>
    </div>
  );
}

