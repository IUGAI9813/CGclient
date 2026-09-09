import React from "react";
import { Sliders, Globe, Car, Shield, CheckCircle2 } from "lucide-react";
import { ThresholdRule } from "@/entities/threshold/model/types";

interface ThresholdOverviewWidgetProps {
  rules: ThresholdRule[];
}

export const ThresholdOverviewWidget: React.FC<ThresholdOverviewWidgetProps> = ({ rules }) => {
  const globalCount = rules.filter((r) => r.scope === "GLOBAL").length;
  const vehicleCount = rules.filter((r) => r.scope === "VEHICLE_TYPE").length;
  const policyCount = rules.filter((r) => r.scope === "POLICY").length;
  const activeCount = rules.filter((r) => r.isActive).length;

  return (
    <div className="gateway-kpi-grid font-mono">
      {/* Card 1: Active Rules Engine */}
      <div className="cyber-panel gateway-kpi-card">
        <div className="flex justify-between items-start">
          <div>
            <span className="gateway-kpi-label">Detection Rules Engine</span>
            <span className="gateway-kpi-value flex items-center gap-2">
              {activeCount} / {rules.length}
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </span>
          </div>
          <div className="gateway-kpi-icon-box border-cyan-500/40 text-cyan-400">
            <Sliders className="w-5 h-5" />
          </div>
        </div>
        <div className="gateway-kpi-footer">
          <span>Engine Status:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Realtime ADCU Active
          </span>
        </div>
      </div>

      {/* Card 2: Global Baseline */}
      <div className="cyber-panel gateway-kpi-card">
        <div className="flex justify-between items-start">
          <div>
            <span className="gateway-kpi-label">Global Baseline Status</span>
            <span className="gateway-kpi-value text-cyan-400">
              {globalCount > 0 ? "Default Active" : "Inactive"}
            </span>
          </div>
          <div className="gateway-kpi-icon-box text-cyan-400">
            <Globe className="w-5 h-5" />
          </div>
        </div>
        <div className="gateway-kpi-footer">
          <span>Target Scope:</span>
          <span className="text-zinc-300 font-bold">148 Fleet Vehicles</span>
        </div>
      </div>

      {/* Card 3: Vehicle Type Profiles */}
      <div className="cyber-panel gateway-kpi-card">
        <div className="flex justify-between items-start">
          <div>
            <span className="gateway-kpi-label">Vehicle Type Profiles</span>
            <span className="gateway-kpi-value text-purple-400">{vehicleCount} Types</span>
          </div>
          <div className="gateway-kpi-icon-box text-purple-400">
            <Car className="w-5 h-5" />
          </div>
        </div>
        <div className="gateway-kpi-footer">
          <span>Classes:</span>
          <span className="text-zinc-300 font-bold">Robotaxi, Shuttle, Pod</span>
        </div>
      </div>

      {/* Card 4: Geofence Overrides */}
      <div className="cyber-panel gateway-kpi-card">
        <div className="flex justify-between items-start">
          <div>
            <span className="gateway-kpi-label">Geofence Policy Overrides</span>
            <span className="gateway-kpi-value text-amber-400">{policyCount} Zones</span>
          </div>
          <div className="gateway-kpi-icon-box text-amber-400">
            <Shield className="w-5 h-5" />
          </div>
        </div>
        <div className="gateway-kpi-footer">
          <span>Resolution:</span>
          <span className="text-zinc-300 font-bold">High Priority Override</span>
        </div>
      </div>
    </div>
  );
};
