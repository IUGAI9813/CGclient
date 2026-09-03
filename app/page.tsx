"use client";

import React, { useState } from "react";
import ConsoleLayout from "./components/ConsoleLayout";
import DashboardView from "./components/views/DashboardView";
import IncidentsView from "./components/views/IncidentsView";
import FleetView from "./components/views/FleetView";
import AuditView from "./components/views/AuditView";
import SettingsView from "./components/views/SettingsView";
import GatewayView from "./components/views/GatewayView";
import IamAuthView from "./components/views/IamAuthView";

interface Incident {
  id: string;
  vehicleId: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
  status: "ACTIVE" | "TRIAGED" | "RESOLVED";
  timestamp: string;
  description: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [threatLevel, setThreatLevel] = useState<"NORMAL" | "ELEVATED" | "CRITICAL">("ELEVATED");
  const [panicMode, setPanicMode] = useState<boolean>(false);
  const [selectedIncidentFromDashboard, setSelectedIncidentFromDashboard] = useState<Incident | null>(null);

  // Initial Incidents State
  const [incidents, setIncidents] = useState<Incident[]>([
    { 
      id: "INC-2026-9812", 
      vehicleId: "VEH-42-012", 
      type: "CAN Bus Injection Suspected", 
      severity: "CRITICAL", 
      status: "ACTIVE", 
      timestamp: "2 min ago",
      description: "OB-CAN monitor logged anomalous frame ID 0x0A2 with speed data overrides while transmission state reported zero movement. Injection origin suspected: Telematics cell transmitter gateway."
    },
    { 
      id: "INC-2026-9811", 
      vehicleId: "VEH-42-089", 
      type: "LiDAR Blockage / Tamper Anomaly", 
      severity: "HIGH", 
      status: "ACTIVE", 
      timestamp: "4 min ago",
      description: "Optical feedback on front LiDAR transceiver reported sudden zero return signal strength, which contradicts LiDAR frame parity checks. Diagnostic code suggests physical obstruction or laser emitter fault."
    },
    { 
      id: "INC-2026-9810", 
      vehicleId: "VEH-42-005", 
      type: "Unauthorized Port Binding", 
      severity: "HIGH", 
      status: "TRIAGED", 
      timestamp: "20 min ago",
      description: "Security wrapper detected binding of port 8088 to external socket interface on central processor partition A. Connection terminated immediately by secure firewall ruleset."
    },
    { 
      id: "INC-2026-9809", 
      vehicleId: "VEH-42-104", 
      type: "GPS Spoofing Attempt Blocked", 
      severity: "MEDIUM", 
      status: "RESOLVED", 
      timestamp: "1 hour ago",
      description: "Pseudorange consistency check detected multi-path discrepancies indicating fake GPS signal broadcast. System fallback to Inertial Navigation System (INS) completed safely."
    }
  ]);

  const activeIncidentsCount = incidents.filter(i => i.status === "ACTIVE").length;

  const handleDashboardNavigate = (tab: string, itemData?: any) => {
    if (itemData) {
      setSelectedIncidentFromDashboard(itemData);
    }
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView 
            onNavigateToTab={handleDashboardNavigate} 
            incidents={incidents}
            panicMode={panicMode}
          />
        );
      case "gateway":
        return <GatewayView />;
      case "iam":
        return <IamAuthView />;
      case "incidents":
        return (
          <IncidentsView 
            incidents={incidents} 
            setIncidents={setIncidents}
            selectedIncidentFromDashboard={selectedIncidentFromDashboard}
            clearSelectedIncidentFromDashboard={() => setSelectedIncidentFromDashboard(null)}
            panicMode={panicMode}
          />
        );
      case "fleet":
        return <FleetView panicMode={panicMode} />;
      case "audit":
        return <AuditView />;
      case "settings":
        return <SettingsView />;
      default:
        return (
          <div className="flex items-center justify-center h-64 text-zinc-500 font-mono">
            UNDER CONSTRUCTION // SECTION NOT IMPLEMENTED
          </div>
        );
    }
  };

  return (
    <ConsoleLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      threatLevel={threatLevel}
      setThreatLevel={setThreatLevel}
      panicMode={panicMode}
      setPanicMode={setPanicMode}
      incidentCount={activeIncidentsCount}
    >
      {renderContent()}
    </ConsoleLayout>
  );
}
