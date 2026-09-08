import React from "react";
import { RouteStatus } from "../model/types";

interface StatusBadgeProps {
  status: RouteStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const statusClassMap: Record<RouteStatus, string> = {
    ACTIVE: "status-badge-active",
    DEGRADED: "status-badge-degraded",
    MAINTENANCE: "status-badge-maintenance",
  };

  const badgeClass = statusClassMap[status] || "text-zinc-400 bg-zinc-800 border-zinc-700";

  return (
    <span className={`status-badge ${badgeClass} ${className}`}>
      {status}
    </span>
  );
};
