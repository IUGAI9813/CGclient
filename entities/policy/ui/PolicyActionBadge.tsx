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
          label: language === "ko" ? "비상 정지" : "FORCE STOP",
          classes: "border-brand-rose/30 text-brand-rose bg-brand-rose/10"
        };
      case "ACT_LIMIT_SPEED":
        return {
          label: language === "ko" ? "속도 제한" : "LIMIT SPEED",
          classes: "border-brand-amber/30 text-brand-amber bg-brand-amber/10"
        };
      case "ACT_WARN_DRIVER":
        return {
          label: language === "ko" ? "운전자 경고" : "WARN DRIVER",
          classes: "border-brand-cyan/30 text-brand-cyan bg-brand-cyan/10"
        };
      default:
        return {
          label: language === "ko" ? "인시던트 등록" : "RAISE INCIDENT",
          classes: "border-zinc-500/30 text-zinc-400 bg-zinc-500/10"
        };
    }
  };

  const badge = getBadgeStyle();

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${badge.classes}`}>
      {badge.label}
    </span>
  );
}
