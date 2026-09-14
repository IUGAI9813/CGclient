import React from "react";
import { ThresholdScope } from "../model/types";

interface ThresholdScopeBadgeProps {
  scope: ThresholdScope;
}

export const ThresholdScopeBadge: React.FC<ThresholdScopeBadgeProps> = ({ scope }) => {
  switch (scope) {
    case "GLOBAL":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border border-cyan-500/30 bg-cyan-500/5 text-cyan-400">
          Global
        </span>
      );
    case "VEHICLE_TYPE":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border border-purple-500/30 bg-purple-500/5 text-purple-400">
          Vehicle
        </span>
      );
    case "POLICY":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border border-amber-500/30 bg-amber-500/5 text-amber-400">
          Policy
        </span>
      );
  }
};

