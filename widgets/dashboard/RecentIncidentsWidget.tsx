import React from "react";
import { ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Incident } from "@/entities/incident/model/types";
import { useLanguage } from "@/app/components/LanguageContext";

interface RecentIncidentsWidgetProps {
  incidents: Incident[];
  onNavigateToTab: (tab: string, itemData?: Incident) => void;
}

export function RecentIncidentsWidget({ incidents, onNavigateToTab }: RecentIncidentsWidgetProps) {
  const { t } = useLanguage();
  const activeIncidents = incidents.filter((i) => i.status === "ACTIVE");

  return (
    <div className="cyber-panel rounded flex flex-col min-h-[220px] font-mono">
      <div className="p-3 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-center">
        <span className="text-xs font-bold text-[var(--foreground)] tracking-widest uppercase">
          {t("dashboard.incidents_queue")}
        </span>
        <button
          onClick={() => onNavigateToTab("incidents")}
          className="text-[9px] text-brand-cyan hover:underline flex items-center gap-1 font-bold cursor-pointer"
        >
          {t("dashboard.investigate_all")} <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 p-3 divide-y divide-panel-border">
        {activeIncidents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-xs py-8 gap-2">
            <CheckCircle2 className="w-8 h-8 text-brand-emerald" />
            <span>{t("dashboard.zero_active")}</span>
          </div>
        ) : (
          activeIncidents.slice(0, 3).map((incident) => (
            <div
              key={incident.id}
              onClick={() => onNavigateToTab("incidents", incident)}
              className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-[var(--panel-header-bg)] px-2 rounded transition-colors group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span
                  className={`p-1.5 rounded-full ${
                    incident.severity === "CRITICAL"
                      ? "bg-brand-rose/10 text-brand-rose border border-brand-rose/20"
                      : "bg-brand-amber/10 text-brand-amber border border-brand-amber/20"
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
                </span>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-[var(--foreground)] truncate">
                    {incident.type}
                  </span>
                  <span className="text-[9px] text-zinc-500">
                    {incident.vehicleId} &bull; {incident.timestamp}
                  </span>
                </div>
              </div>

              <span
                className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                  incident.severity === "CRITICAL"
                    ? "text-brand-rose bg-brand-rose/10"
                    : "text-brand-amber bg-brand-amber/10"
                }`}
              >
                {incident.severity}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
