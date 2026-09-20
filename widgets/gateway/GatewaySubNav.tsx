import React from "react";

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
  const tabs: { key: GatewaySubTab; label: string; count?: number }[] = [
    { key: "routes", label: "Routes", count: routesCount },
    { key: "ratelimit", label: "Rate Limits" },
    { key: "upstream", label: "Service Mesh" },
    { key: "tester", label: "Request Tester" },
  ];

  return (
    <div className="flex items-center gap-1 bg-[var(--panel-header-bg)] p-1 rounded-md border border-panel-border overflow-x-auto scrollbar-none font-sans">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === tab.key
              ? "bg-[var(--panel-bg)] text-brand-cyan font-semibold shadow-2xs"
              : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
          }`}
        >
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span className="text-[10px] text-[var(--muted-text)] font-mono">
              ({tab.count})
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

