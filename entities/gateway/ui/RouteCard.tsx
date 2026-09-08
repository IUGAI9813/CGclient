import React from "react";
import { Server, Lock } from "lucide-react";
import { RouteDefinition } from "../model/types";
import { MethodBadge } from "./MethodBadge";
import { StatusBadge } from "./StatusBadge";

interface RouteCardProps {
  route: RouteDefinition;
  isSelected: boolean;
  onSelect: (route: RouteDefinition) => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({ route, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(route)}
      className={`route-list-item ${isSelected ? "selected" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MethodBadge method={route.method} />
          <span className="text-xs font-bold text-white tracking-wide">{route.path}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 font-mono">
            {route.rateLimit.toLocaleString()} RPM
          </span>
          <StatusBadge status={route.status} />
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-2 truncate max-w-sm">
          <Server className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <span className="truncate text-zinc-400 font-mono">{route.upstream}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-zinc-500">
          <Lock className="w-3 h-3 text-cyan-400" />
          <span>{route.authType}</span>
        </div>
      </div>
    </div>
  );
};
