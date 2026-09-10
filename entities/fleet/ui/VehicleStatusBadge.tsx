import React from "react";
import { useLanguage } from "@/app/components/LanguageContext";

interface VehicleStatusBadgeProps {
  status: string;
  panicMode: boolean;
}

export function VehicleStatusBadge({ status, panicMode }: VehicleStatusBadgeProps) {
  const { t, language } = useLanguage();
  const isCrit = status === "critical" || panicMode;
  const isWarn = status === "warning" && !panicMode;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
        isCrit
          ? "text-brand-rose bg-brand-rose/10 border-brand-rose/30 animate-pulse"
          : isWarn
          ? "text-brand-amber bg-brand-amber/10 border-brand-amber/30"
          : "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isCrit ? "bg-brand-rose" : isWarn ? "bg-brand-amber" : "bg-brand-emerald"
        }`}
      />
      {isCrit
        ? t("incidents.active_stat")
        : isWarn
        ? language === "ko"
          ? "주의"
          : "WARN"
        : t("fleet.sensors_ok")}
    </span>
  );
}
