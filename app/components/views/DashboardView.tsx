"use client";

import React from "react";
import { Incident } from "@/entities/incident/model/types";
import { DashboardKpiGrid } from "@/widgets/dashboard/DashboardKpiGrid";
import { InteractiveFleetMapWidget } from "@/widgets/dashboard/InteractiveFleetMapWidget";
import { LidarTelemetryChartWidget } from "@/widgets/dashboard/LidarTelemetryChartWidget";
import { GatewayIdentityLinksWidget } from "@/widgets/dashboard/GatewayIdentityLinksWidget";
import { RecentIncidentsWidget } from "@/widgets/dashboard/RecentIncidentsWidget";
import { LiveAuditTickerWidget } from "@/widgets/dashboard/LiveAuditTickerWidget";

interface DashboardViewProps {
  onNavigateToTab: (tab: string, itemData?: Incident) => void;
  incidents: Incident[];
  panicMode: boolean;
}

export default function DashboardView({
  onNavigateToTab,
  incidents,
  panicMode,
}: DashboardViewProps) {
  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* 1. Overview KPI Cards */}
      <DashboardKpiGrid
        incidents={incidents}
        panicMode={panicMode}
        onNavigateToTab={onNavigateToTab}
      />

      {/* 2. Interactive Map & Telemetry Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InteractiveFleetMapWidget
            panicMode={panicMode}
            onNavigateToTab={onNavigateToTab}
          />
        </div>
        <div className="lg:col-span-1">
          <LidarTelemetryChartWidget panicMode={panicMode} />
        </div>
      </div>

      {/* 3. Open Platform & Gateway Telemetry */}
      <GatewayIdentityLinksWidget onNavigateToTab={onNavigateToTab} />

      {/* 4. Incidents Queue and Logs Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentIncidentsWidget
          incidents={incidents}
          onNavigateToTab={onNavigateToTab}
        />
        <LiveAuditTickerWidget
          panicMode={panicMode}
          onNavigateToTab={onNavigateToTab}
        />
      </div>
    </div>
  );
}
