import React from "react";
import { Network, Activity, AlertTriangle, Shield } from "lucide-react";
import { GatewayKpiStats } from "@/entities/gateway/model/types";

interface GatewayKpiGridProps {
  stats: GatewayKpiStats;
}

export const GatewayKpiGrid: React.FC<GatewayKpiGridProps> = ({ stats }) => {
  return (
    <div className="gateway-kpi-grid font-mono">
      {/* KPI 1: Gateway Core Engine */}
      <div className="cyber-panel gateway-kpi-card">
        <div className="flex justify-between items-start">
          <div>
            <span className="gateway-kpi-label">Gateway Core Engine</span>
            <span className="gateway-kpi-value flex items-center gap-2">
              {stats.engineName}
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </span>
          </div>
          <div className="gateway-kpi-icon-box border-cyan-500/40 text-cyan-400">
            <Network className="w-5 h-5" />
          </div>
        </div>
        <div className="gateway-kpi-footer">
          <span>Cluster Status:</span>
          <span className="text-emerald-400 font-bold">{stats.podsCount}</span>
        </div>
      </div>

      {/* KPI 2: Ingress Throughput */}
      <div className="cyber-panel gateway-kpi-card">
        <div className="flex justify-between items-start">
          <div>
            <span className="gateway-kpi-label">Ingress Throughput</span>
            <span className="gateway-kpi-value">
              {stats.ingressRps.toLocaleString()} <span className="text-xs text-zinc-500 font-normal">req/s</span>
            </span>
          </div>
          <div className="gateway-kpi-icon-box text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <div className="gateway-kpi-footer">
          <span>P99 Proxy Overhead:</span>
          <span className="text-cyan-400 font-bold">{stats.p99Latency}</span>
        </div>
      </div>

      {/* KPI 3: Error Rate */}
      <div className="cyber-panel gateway-kpi-card">
        <div className="flex justify-between items-start">
          <div>
            <span className="gateway-kpi-label">Gateway Error Rate</span>
            <span className="gateway-kpi-value">{stats.errorRate}%</span>
          </div>
          <div className="gateway-kpi-icon-box text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="gateway-kpi-footer">
          <span>{stats.errorBreakdown}</span>
          <span className="text-emerald-400 font-bold">Normal</span>
        </div>
      </div>

      {/* KPI 4: Platform SLA */}
      <div className="cyber-panel gateway-kpi-card">
        <div className="flex justify-between items-start">
          <div>
            <span className="gateway-kpi-label">API Platform SLA</span>
            <span className="gateway-kpi-value text-emerald-400">{stats.slaPercent}%</span>
          </div>
          <div className="gateway-kpi-icon-box text-cyan-400">
            <Shield className="w-5 h-5" />
          </div>
        </div>
        <div className="gateway-kpi-footer">
          <span>Global Monthly Budget:</span>
          <span className="text-zinc-300 font-bold">{stats.monthlyBudgetRemaining}</span>
        </div>
      </div>
    </div>
  );
};
