import React from "react";
import { Layers, Sliders, Server, Play } from "lucide-react";

export type GatewaySubTab = "routes" | "ratelimit" | "upstream" | "tester";

interface GatewaySubNavProps {
  activeTab: GatewaySubTab;
  onTabChange: (tab: GatewaySubTab) => void;
  routesCount: number;
}

export const GatewaySubNav: React.FC<GatewaySubNavProps> = ({
  activeTab,
  onTabChange,
  routesCount,
}) => {
  return (
    <div className="gateway-tab-bar">
      <button
        onClick={() => onTabChange("routes")}
        className={`gateway-tab-btn ${activeTab === "routes" ? "active" : ""}`}
      >
        <Layers className="w-4 h-4 text-brand-cyan" />
        <span>Route Registry & Governance ({routesCount})</span>
      </button>

      <button
        onClick={() => onTabChange("ratelimit")}
        className={`gateway-tab-btn ${activeTab === "ratelimit" ? "active" : ""}`}
      >
        <Sliders className="w-4 h-4 text-brand-cyan" />
        <span>Rate Limiting & Traffic Policies</span>
      </button>

      <button
        onClick={() => onTabChange("upstream")}
        className={`gateway-tab-btn ${activeTab === "upstream" ? "active" : ""}`}
      >
        <Server className="w-4 h-4 text-brand-cyan" />
        <span>Service Mesh & Circuit Breakers</span>
      </button>

      <button
        onClick={() => onTabChange("tester")}
        className={`gateway-tab-btn ${activeTab === "tester" ? "active" : ""}`}
      >
        <Play className="w-4 h-4 text-brand-cyan" />
        <span>Interactive Gateway Request Tester</span>
      </button>
    </div>
  );
};
