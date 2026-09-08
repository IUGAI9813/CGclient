import React from "react";
import { CircuitState } from "../model/types";

interface CircuitStateBadgeProps {
  state: CircuitState;
  className?: string;
}

export const CircuitStateBadge: React.FC<CircuitStateBadgeProps> = ({ state, className = "" }) => {
  const stateClassMap: Record<CircuitState, string> = {
    CLOSED: "status-badge-closed",
    HALF_OPEN: "status-badge-half_open animate-pulse",
    OPEN: "status-badge-open",
  };

  const badgeClass = stateClassMap[state] || "text-zinc-400 bg-zinc-800 border-zinc-700";

  return (
    <span className={`status-badge ${badgeClass} ${className}`}>
      {state}
    </span>
  );
};
