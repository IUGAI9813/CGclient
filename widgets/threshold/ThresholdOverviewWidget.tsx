import React from "react";
import { ThresholdRule } from "@/entities/threshold/model/types";
import { useLanguage } from "@/app/components/LanguageContext";

interface ThresholdOverviewWidgetProps {
  rules: ThresholdRule[];
}

export const ThresholdOverviewWidget: React.FC<ThresholdOverviewWidgetProps> = ({ rules }) => {
  const { language } = useLanguage();
  const globalCount = rules.filter((r) => r.scope === "GLOBAL").length;
  const vehicleCount = rules.filter((r) => r.scope === "VEHICLE_TYPE").length;
  const policyCount = rules.filter((r) => r.scope === "POLICY").length;
  const activeCount = rules.filter((r) => r.isActive).length;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-1 font-sans">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-[var(--foreground)] tracking-tight">
          {language === "ko" ? "안전 임계값 관제" : "Safety Thresholds"}
        </h1>
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted-text)]">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--panel-header-bg)] border border-panel-border text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
            <span>{activeCount}/{rules.length} {language === "ko" ? "활성" : "Active"}</span>
          </span>
          <span className="hidden md:inline text-[11px] text-[var(--muted-text)]">
            &bull; {globalCount} {language === "ko" ? "글로벌" : "Global"} &bull; {vehicleCount} {language === "ko" ? "차종별" : "Vehicle"} &bull; {policyCount} {language === "ko" ? "지오펜스" : "Policy"}
          </span>
        </div>
      </div>
    </div>
  );
};

