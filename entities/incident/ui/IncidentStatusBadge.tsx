import React from "react";
import { IncidentStatus } from "../model/types";
import { useLanguage } from "@/app/components/LanguageContext";

interface IncidentStatusBadgeProps {
  status: IncidentStatus;
}

export function IncidentStatusBadge({ status }: IncidentStatusBadgeProps) {
  const { t } = useLanguage();

  const getStyle = () => {
    switch (status) {
      case "ACTIVE":
        return {
          wrapper: "text-brand-rose bg-brand-rose/10 border-brand-rose/30",
          dot: "bg-brand-rose animate-pulse"
        };
      case "TRIAGED":
        return {
          wrapper: "text-brand-amber bg-brand-amber/10 border-brand-amber/30",
          dot: "bg-brand-amber"
        };
      default:
        return {
          wrapper: "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30",
          dot: "bg-brand-emerald"
        };
    }
  };

  const style = getStyle();

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${style.wrapper}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {t("incidents." + status.toLowerCase() + "_stat")}
    </span>
  );
}
