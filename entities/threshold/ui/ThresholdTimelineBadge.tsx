import React from "react";
import { Clock, CheckCircle, Calendar, Archive } from "lucide-react";
import { TemporalStatus } from "../model/types";

interface ThresholdTimelineBadgeProps {
  temporalStatus?: TemporalStatus;
  startTime: string | null;
  endTime: string | null;
  effectiveDate?: string;
}

export const ThresholdTimelineBadge: React.FC<ThresholdTimelineBadgeProps> = ({
  temporalStatus = "CURRENT",
  startTime,
  endTime,
  effectiveDate,
}) => {
  if (temporalStatus === "HISTORICAL") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 font-mono bg-zinc-900 border border-zinc-700 px-1.5 py-0.5 rounded">
        <Archive className="w-3 h-3 text-zinc-500" />
        <span>ARCHIVED {effectiveDate ? `(${effectiveDate})` : ""}</span>
      </span>
    );
  }

  if (temporalStatus === "FUTURE") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-sky-400 font-mono bg-sky-500/10 border border-sky-500/20 px-1.5 py-0.5 rounded">
        <Calendar className="w-3 h-3" />
        <span>SCHEDULED {startTime ? `(${startTime}-${endTime})` : effectiveDate || ""}</span>
      </span>
    );
  }

  // CURRENT
  if (!startTime && !endTime) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
        <CheckCircle className="w-3 h-3 animate-pulse" />
        <span>ACTIVE 24/7</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
      <Clock className="w-3 h-3" />
      <span>ACTIVE ({startTime} - {endTime} KST)</span>
    </span>
  );
};
