import React from "react";
import { PolicyAction } from "../model/types";
import { useLanguage } from "@/app/components/LanguageContext";

interface PolicyActionBadgeProps {
  action: PolicyAction;
}

export function PolicyActionBadge({ action }: PolicyActionBadgeProps) {
  const { language } = useLanguage();

  const getBadgeStyle = () => {
    switch (action) {
      case "ACT_FORCE_STOP":
        return {
          label: language === "ko" ? "비상 정지" : "Stop",
          classes: "border-brand-rose/30 text-brand-rose bg-brand-rose/5"
        };
      case "ACT_LIMIT_SPEED":
        return {
          label: language === "ko" ? "속도 제한" : "Speed Limit",
          classes: "border-brand-amber/30 text-brand-amber bg-brand-amber/5"
        };
      case "ACT_WARN_DRIVER":
        return {
          label: language === "ko" ? "경고 발령" : "Warning",
          classes: "border-brand-cyan/30 text-brand-cyan bg-brand-cyan/5"
        };
      default:
        return {
          label: language === "ko" ? "인시던트 등록" : "Incident",
          classes: "border-panel-border text-[var(--muted-text)] bg-[var(--panel-header-bg)]"
        };
    }
  };

  const badge = getBadgeStyle();

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${badge.classes}`}>
      {badge.label}
    </span>
  );
}

