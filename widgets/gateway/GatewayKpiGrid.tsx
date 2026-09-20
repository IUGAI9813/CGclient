import React from "react";
import { GatewayKpiStats } from "@/entities/gateway/model/types";

interface GatewayKpiGridProps {
  stats: GatewayKpiStats;
}

export const GatewayKpiGrid: React.FC<GatewayKpiGridProps> = ({ stats }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-1 font-sans">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-[var(--foreground)] tracking-tight">
          API 게이트웨이 관제
        </h1>
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted-text)]">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--panel-header-bg)] border border-panel-border text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
            <span>{stats.engineName} ({stats.podsCount})</span>
          </span>
          <span className="hidden md:inline text-[11px] text-[var(--muted-text)]">
            &bull; {stats.ingressRps.toLocaleString()} req/s &bull; SLA {stats.slaPercent}% &bull; P99 {stats.p99Latency}
          </span>
        </div>
      </div>
    </div>
  );
};


