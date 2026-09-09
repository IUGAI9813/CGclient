import React from "react";
import { UpstreamService } from "@/entities/gateway/model/types";
import { CircuitStateBadge } from "@/entities/gateway/ui/CircuitStateBadge";

interface UpstreamMeshWidgetProps {
  upstreams: UpstreamService[];
  onToggleCircuit: (upstreamId: string) => void;
}

export const UpstreamMeshWidget: React.FC<UpstreamMeshWidgetProps> = ({
  upstreams,
  onToggleCircuit,
}) => {
  return (
    <div className="space-y-4">
      <div className="cyber-panel p-4 rounded space-y-4">
        <div className="flex justify-between items-center border-b border-panel-border pb-3">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Service Mesh Resilience</span>
            <h2 className="text-sm font-bold text-white mt-1">Upstream Microservices & Circuit Breaker Triggers</h2>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            Envoy Outlier Detection: Enabled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="upstream-table">
            <thead>
              <tr>
                <th>Upstream Service</th>
                <th>k8s Cluster Address</th>
                <th className="text-center">Pods</th>
                <th className="text-center">P95 Latency</th>
                <th className="text-center">Error Rate</th>
                <th className="text-center">Circuit State</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-panel-border bg-transparent">
              {upstreams.map((up) => (
                <tr key={up.id} className="hover:bg-[var(--panel-header-bg)] transition-colors">
                  <td className="font-bold text-[var(--foreground)]">{up.name}</td>
                  <td className="text-zinc-500 font-mono text-[11px]">{up.k8sService}</td>
                  <td className="text-center font-bold text-[var(--foreground)]">{up.pods}</td>
                  <td className="text-center text-cyan-500 font-bold">{up.latencyP95}</td>
                  <td
                    className={`text-center font-bold ${
                      parseFloat(up.errorRate) > 5 ? "text-rose-500" : "text-emerald-500"
                    }`}
                  >
                    {up.errorRate}
                  </td>
                  <td className="text-center">
                    <CircuitStateBadge state={up.circuitState} />
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => onToggleCircuit(up.id)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded border transition-colors cursor-pointer ${
                        up.circuitState === "CLOSED"
                          ? "bg-[var(--panel-header-bg)] border-panel-border text-zinc-500 hover:text-[var(--foreground)] hover:border-panel-border-hover"
                          : "bg-emerald-500/20 border-emerald-500 text-emerald-500 hover:bg-emerald-500/30"
                      }`}
                    >
                      {up.circuitState === "CLOSED" ? "Force Trip" : "Reset Breaker"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
