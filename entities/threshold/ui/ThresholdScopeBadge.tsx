import React from "react";
import { Globe, Car, Shield } from "lucide-react";
import { ThresholdScope } from "../model/types";

interface ThresholdScopeBadgeProps {
  scope: ThresholdScope;
}

export const ThresholdScopeBadge: React.FC<ThresholdScopeBadgeProps> = ({ scope }) => {
  switch (scope) {
    case "GLOBAL":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono uppercase">
          <Globe className="w-3 h-3" />
          GLOBAL BASELINE
        </span>
      );
    case "VEHICLE_TYPE":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 text-purple-400 font-mono uppercase">
          <Car className="w-3 h-3" />
          BY VEHICLE TYPE
        </span>
      );
    case "POLICY":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono uppercase">
          <Shield className="w-3 h-3" />
          BY GEOFENCE POLICY
        </span>
      );
  }
};
