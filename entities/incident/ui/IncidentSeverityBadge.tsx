import React from "react";
import { IncidentSeverity } from "../model/types";
import { useLanguage } from "@/app/components/LanguageContext";

interface IncidentSeverityBadgeProps {
  severity: IncidentSeverity;
}

export function IncidentSeverityBadge({ severity }: IncidentSeverityBadgeProps) {
  const { language } = useLanguage();

  const getStyle = () => {
    switch (severity) {
      case "CRITICAL":
        return {
          label: language === "ko" ? "치명적 (CRITICAL)" : "CRITICAL",
          classes: "text-brand-rose bg-brand-rose/10 border-brand-rose/30"
        };
      case "HIGH":
        return {
          label: language === "ko" ? "높음 (HIGH)" : "HIGH",
          classes: "text-brand-amber bg-brand-amber/10 border-brand-amber/30"
        };
      case "MEDIUM":
        return {
          label: language === "ko" ? "중간 (MED)" : "MEDIUM",
          classes: "text-brand-cyan bg-brand-cyan/10 border-brand-cyan/30"
        };
      default:
        return {
          label: language === "ko" ? "정보 (INFO)" : "INFO",
          classes: "text-zinc-400 bg-zinc-500/10 border-panel-border"
        };
    }
  };

  const badge = getStyle();

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${badge.classes}`}>
      {badge.label}
    </span>
  );
}
