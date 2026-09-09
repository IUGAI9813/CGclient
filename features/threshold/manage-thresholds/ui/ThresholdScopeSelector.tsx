import React from "react";
import { Globe, Car, Shield, Sliders, CheckCircle, Calendar, Archive } from "lucide-react";
import { ThresholdScope, TemporalStatus } from "@/entities/threshold/model/types";

interface ThresholdScopeSelectorProps {
  selectedScope: ThresholdScope | "ALL";
  onSelectScope: (scope: ThresholdScope | "ALL") => void;
  selectedTimeline: TemporalStatus | "ALL";
  onSelectTimeline: (timeline: TemporalStatus | "ALL") => void;
  scopeCounts: {
    all: number;
    global: number;
    vehicleType: number;
    policy: number;
  };
  timelineCounts: {
    all: number;
    current: number;
    future: number;
    historical: number;
  };
}

export const ThresholdScopeSelector: React.FC<ThresholdScopeSelectorProps> = ({
  selectedScope,
  onSelectScope,
  selectedTimeline,
  onSelectTimeline,
  scopeCounts,
  timelineCounts,
}) => {
  return (
    <div className="space-y-3 font-mono">
      {/* 1. Timeline Status (Current / Future / Historical) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mr-1">
          Timeline State:
        </span>

        <button
          onClick={() => onSelectTimeline("ALL")}
          className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
            selectedTimeline === "ALL"
              ? "bg-zinc-800 text-white border-zinc-500"
              : "bg-zinc-950 text-zinc-400 border-panel-border hover:text-white"
          }`}
        >
          <span>All States ({timelineCounts.all})</span>
        </button>

        <button
          onClick={() => onSelectTimeline("CURRENT")}
          className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
            selectedTimeline === "CURRENT"
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
              : "bg-zinc-950 text-zinc-400 border-panel-border hover:text-white"
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          <span>Текущие / Current ({timelineCounts.current})</span>
        </button>

        <button
          onClick={() => onSelectTimeline("FUTURE")}
          className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
            selectedTimeline === "FUTURE"
              ? "bg-sky-500/20 text-sky-400 border-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.2)]"
              : "bg-zinc-950 text-zinc-400 border-panel-border hover:text-white"
          }`}
        >
          <Calendar className="w-3 h-3" />
          <span>Будущие / Future ({timelineCounts.future})</span>
        </button>

        <button
          onClick={() => onSelectTimeline("HISTORICAL")}
          className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
            selectedTimeline === "HISTORICAL"
              ? "bg-zinc-700/50 text-zinc-200 border-zinc-500"
              : "bg-zinc-950 text-zinc-400 border-panel-border hover:text-white"
          }`}
        >
          <Archive className="w-3 h-3" />
          <span>Исторические / Archive ({timelineCounts.historical})</span>
        </button>
      </div>

      {/* 2. Scope Filter (Global / Vehicle Types / Policies) */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-panel-border/40">
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mr-1">
          Scope Target:
        </span>

        <button
          onClick={() => onSelectScope("ALL")}
          className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
            selectedScope === "ALL"
              ? "bg-brand-cyan/20 text-brand-cyan border-brand-cyan"
              : "bg-zinc-900 text-zinc-400 border-panel-border hover:text-white"
          }`}
        >
          <Sliders className="w-3 h-3" />
          <span>All Scopes ({scopeCounts.all})</span>
        </button>

        <button
          onClick={() => onSelectScope("GLOBAL")}
          className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
            selectedScope === "GLOBAL"
              ? "bg-cyan-500/20 text-cyan-400 border-cyan-400"
              : "bg-zinc-900 text-zinc-400 border-panel-border hover:text-white"
          }`}
        >
          <Globe className="w-3 h-3" />
          <span>Global Baseline ({scopeCounts.global})</span>
        </button>

        <button
          onClick={() => onSelectScope("VEHICLE_TYPE")}
          className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
            selectedScope === "VEHICLE_TYPE"
              ? "bg-purple-500/20 text-purple-400 border-purple-400"
              : "bg-zinc-900 text-zinc-400 border-panel-border hover:text-white"
          }`}
        >
          <Car className="w-3 h-3" />
          <span>Vehicle Types ({scopeCounts.vehicleType})</span>
        </button>

        <button
          onClick={() => onSelectScope("POLICY")}
          className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
            selectedScope === "POLICY"
              ? "bg-amber-500/20 text-amber-400 border-amber-400"
              : "bg-zinc-900 text-zinc-400 border-panel-border hover:text-white"
          }`}
        >
          <Shield className="w-3 h-3" />
          <span>Geofence Policies ({scopeCounts.policy})</span>
        </button>
      </div>
    </div>
  );
};
