"use client";

import React, { useState } from "react";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Compass, 
  TrendingUp, 
  Cpu, 
  Radio, 
  Zap, 
  MapPin, 
  ArrowUpRight, 
  CheckCircle2,
  AlertCircle,
  Network,
  KeyRound,
  Lock
} from "lucide-react";

interface Incident {
  id: string;
  vehicleId: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
  status: "ACTIVE" | "TRIAGED" | "RESOLVED";
  timestamp: string;
  description: string;
}

interface DashboardViewProps {
  onNavigateToTab: (tab: string, itemData?: any) => void;
  incidents: Incident[];
  panicMode: boolean;
}

export default function DashboardView({ onNavigateToTab, incidents, panicMode }: DashboardViewProps) {
  const [hoveredVehicle, setHoveredVehicle] = useState<string | null>(null);

  // Active vehicles data for the mock interactive map
  const mockVehiclesOnMap = [
    { id: "VEH-42-012", x: 120, y: 150, status: "warning", type: "Robotaxi" },
    { id: "VEH-42-089", x: 280, y: 90, status: "critical", type: "Shuttle" },
    { id: "VEH-42-005", x: 90, y: 80, status: "secure", type: "Robotaxi" },
    { id: "VEH-42-104", x: 210, y: 220, status: "secure", type: "Delivery Pod" },
    { id: "VEH-42-067", x: 340, y: 180, status: "secure", type: "Robotaxi" },
    { id: "VEH-42-132", x: 170, y: 110, status: "secure", type: "Shuttle" },
  ];

  const activeAlertsCount = incidents.filter(i => i.status === "ACTIVE").length;

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Fleet Safety Score */}
        <div className="cyber-panel p-4 rounded relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-1 text-[9px] bg-zinc-900 border-l border-b border-panel-border text-zinc-500">
            SEC_INDEX_01
          </div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Fleet Safety Score</span>
              <span className="text-2xl font-bold text-white tracking-tight block mt-1">
                {panicMode ? "42.8%" : "98.4%"}
              </span>
            </div>
            <div className={`p-2 rounded bg-zinc-900 border ${panicMode ? "border-brand-rose text-brand-rose" : "border-brand-emerald text-brand-emerald"}`}>
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            <TrendingUp className={`w-3.5 h-3.5 ${panicMode ? "text-brand-rose rotate-180" : "text-brand-emerald"}`} />
            <span className={panicMode ? "text-brand-rose" : "text-brand-emerald"}>
              {panicMode ? "-55.6% (CRITICAL)" : "+0.4% vs last hour"}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-right from-brand-emerald to-transparent opacity-30"></div>
        </div>

        {/* KPI 2: Active Alerts */}
        <div 
          onClick={() => onNavigateToTab("incidents")}
          className="cyber-panel p-4 rounded relative overflow-hidden group cursor-pointer hover:border-zinc-700 transition-all"
        >
          <div className="absolute top-0 right-0 p-1 text-[9px] bg-zinc-900 border-l border-b border-panel-border text-zinc-500">
            ALERT_CTR_02
          </div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Active Alerts</span>
              <span className={`text-2xl font-bold tracking-tight block mt-1 ${activeAlertsCount > 0 ? "text-brand-rose animate-pulse" : "text-white"}`}>
                {activeAlertsCount}
              </span>
            </div>
            <div className={`p-2 rounded bg-zinc-900 border ${activeAlertsCount > 0 ? "border-brand-rose text-brand-rose animate-pulse" : "border-panel-border text-zinc-400"}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="text-zinc-500">Unresolved anomalies:</span>
            <span className={`font-bold ${activeAlertsCount > 0 ? "text-brand-rose" : "text-zinc-300"}`}>
              {incidents.filter(i => i.severity === "CRITICAL" && i.status === "ACTIVE").length} Critical
            </span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-right from-brand-rose to-transparent opacity-30"></div>
        </div>

        {/* KPI 3: V2X Latency */}
        <div className="cyber-panel p-4 rounded relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-1 text-[9px] bg-zinc-900 border-l border-b border-panel-border text-zinc-500">
            NET_PING_03
          </div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">V2X Core Latency</span>
              <span className="text-2xl font-bold text-white tracking-tight block mt-1">14.2 ms</span>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-panel-border text-brand-cyan">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-brand-emerald">
            <Zap className="w-3.5 h-3.5" />
            <span>99.98% telemetry frame rate</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-right from-brand-cyan to-transparent opacity-30"></div>
        </div>

        {/* KPI 4: Active Fleet Status */}
        <div 
          onClick={() => onNavigateToTab("fleet")}
          className="cyber-panel p-4 rounded relative overflow-hidden group cursor-pointer hover:border-zinc-700 transition-all"
        >
          <div className="absolute top-0 right-0 p-1 text-[9px] bg-zinc-900 border-l border-b border-panel-border text-zinc-500">
            FLT_STAT_04
          </div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Fleet In Service</span>
              <span className="text-2xl font-bold text-white tracking-tight block mt-1">148 / 150</span>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-panel-border text-zinc-400 group-hover:text-white">
              <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: "10s" }} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="text-zinc-500">Standby:</span>
            <span className="text-zinc-300 font-bold">2 in hangar depot</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-right from-zinc-500 to-transparent opacity-30"></div>
        </div>
      </div>

      {/* Row 2: Live Map and Telemetry Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Map & Telemetry Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Vehicle Locator Map Widget */}
          <div className="cyber-panel rounded overflow-hidden flex flex-col relative h-[360px]">
            <div className="p-3 border-b border-panel-border bg-zinc-950 flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
                <span className="text-xs font-bold text-white tracking-widest uppercase">GANGNAM REGION AUTOMATED GEOLOCATOR</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-bold">GRID SCALE: 1:500m</span>
            </div>

            {/* Simulated Vector Grid Map */}
            <div className="flex-1 bg-zinc-950 relative overflow-hidden flex items-center justify-center p-4">
              {/* Grid map overlay */}
              <div className="absolute inset-0 map-grid opacity-75"></div>
              
              {/* Simulated Roads/Sectors layout using styled divs */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-[80%] h-[1px] bg-zinc-700 transform rotate-12"></div>
                <div className="w-[80%] h-[1px] bg-zinc-700 transform -rotate-45"></div>
                <div className="w-[1px] h-[80%] bg-zinc-700 transform translate-x-20"></div>
                <div className="w-[1px] h-[80%] bg-zinc-700 transform -translate-x-32"></div>
                <div className="w-[160px] h-[160px] rounded-full border border-dashed border-zinc-500 animate-pulse-slow"></div>
              </div>

              {/* Central base station */}
              <div className="absolute top-[48%] left-[48%] flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-zinc-900 border-2 border-brand-cyan flex items-center justify-center relative">
                  <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-ping"></div>
                </div>
                <span className="text-[8px] text-zinc-500 font-bold mt-1 tracking-tighter">BASE_SOC</span>
              </div>

              {/* Dynamic Vehicle Dots */}
              {mockVehiclesOnMap.map((veh) => {
                const isCritical = veh.status === "critical" || panicMode;
                const isWarning = veh.status === "warning" && !panicMode;
                const colorClass = isCritical 
                  ? "text-brand-rose bg-brand-rose" 
                  : isWarning 
                  ? "text-brand-amber bg-brand-amber" 
                  : "text-brand-emerald bg-brand-emerald";

                return (
                  <div 
                    key={veh.id}
                    className="absolute cursor-pointer transition-all duration-300 transform hover:scale-125 z-10"
                    style={{ left: `${veh.x}px`, top: `${veh.y}px` }}
                    onMouseEnter={() => setHoveredVehicle(veh.id)}
                    onMouseLeave={() => setHoveredVehicle(null)}
                    onClick={() => {
                      if (isCritical || isWarning) {
                        onNavigateToTab("incidents");
                      } else {
                        onNavigateToTab("fleet");
                      }
                    }}
                  >
                    {/* Ping Animation Layer */}
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${colorClass} bg-opacity-20`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${colorClass} border border-black relative ping-dot`}></span>
                    </span>

                    {/* Popover overlay on hover */}
                    {hoveredVehicle === veh.id && (
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-zinc-900/95 border border-zinc-700 rounded p-2 text-[9px] w-36 shadow-xl z-30 font-mono text-zinc-300">
                        <div className="font-bold text-white border-b border-panel-border pb-1 flex justify-between">
                          <span>{veh.id}</span>
                          <span className={isCritical ? "text-brand-rose" : isWarning ? "text-brand-amber" : "text-brand-emerald"}>
                            {isCritical ? "ALERT" : isWarning ? "WARN" : "SECURE"}
                          </span>
                        </div>
                        <div className="mt-1 space-y-0.5">
                          <div>TYPE: {veh.type}</div>
                          <div>SPEED: {isCritical ? "0 km/h" : "48 km/h"}</div>
                          <div>GPS: 37.517, 127.047</div>
                          <div className="text-brand-cyan underline cursor-pointer mt-1">Click to analyze</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Map Info Box */}
              <div className="absolute bottom-4 left-4 p-2 bg-zinc-950/95 border border-panel-border rounded text-[9px] space-y-1 z-15">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald"></span>
                  <span className="text-zinc-400">144 SECURE OBJECTS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-amber"></span>
                  <span className="text-zinc-400">3 WARNING OVERRIDES</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-pulse"></span>
                  <span className="text-zinc-400">{panicMode ? "148 EMERGENCY TRIPPED" : "1 CRITICAL TAMPER"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Telemetry Analytics Chart & Diagnostics Info */}
        <div className="space-y-6">
          <div className="cyber-panel rounded flex flex-col h-[360px]">
            <div className="p-3 border-b border-panel-border bg-zinc-950 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-cyan" />
                <span className="text-xs font-bold text-white tracking-widest uppercase">LIDAR TELEMETRY FRAMERATE</span>
              </div>
              <span className="text-[9px] font-bold text-brand-cyan">12H TREND</span>
            </div>

            <div className="flex-1 p-4 bg-zinc-950/30 flex flex-col justify-between">
              {/* Custom SVG Line Chart */}
              <div className="flex-1 relative min-h-[140px] w-full flex items-end">
                {/* SVG Render */}
                <svg className="w-full h-full text-zinc-800" viewBox="0 0 300 120" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="300" y2="30" stroke="#1f1f23" strokeDasharray="3,3" />
                  <line x1="0" y1="60" x2="300" y2="60" stroke="#1f1f23" strokeDasharray="3,3" />
                  <line x1="0" y1="90" x2="300" y2="90" stroke="#1f1f23" strokeDasharray="3,3" />

                  {/* Threat Area Background (Mock Red Alert region) */}
                  <rect x="180" y="60" width="40" height="60" fill="rgba(244, 63, 94, 0.08)" />
                  <text x="185" y="80" fill="#f43f5e" className="text-[7px]" fontFamily="monospace">Anomalous Drop</text>

                  {/* Ingestion Stream Path */}
                  <path 
                    d={panicMode 
                      ? "M0,90 L30,92 L60,88 L90,95 L120,98 L150,110 L180,115 L210,118 L240,118 L270,119 L300,119" 
                      : "M0,35 L30,42 L60,32 L90,38 L120,25 L150,45 L180,82 L210,48 L240,30 L270,35 L300,28"
                    } 
                    fill="none" 
                    stroke={panicMode ? "#f43f5e" : "#06b6d4"} 
                    strokeWidth="2" 
                    className="transition-all duration-500"
                  />

                  {/* Ingestion Stream Dots */}
                  <circle cx="180" cy={panicMode ? 115 : 82} r="4" fill={panicMode ? "#f43f5e" : "#f59e0b"} className="animate-pulse" />
                </svg>

                {/* Y-axis metrics descriptors */}
                <div className="absolute left-1 top-2 text-[8px] text-zinc-600 flex flex-col justify-between h-[80%] pointer-events-none">
                  <span>100k/s</span>
                  <span>50k/s</span>
                  <span>0k/s</span>
                </div>
              </div>

              {/* Data points summary breakdown */}
              <div className="border-t border-panel-border mt-4 pt-4 grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-zinc-900/50 p-2 rounded border border-panel-border">
                  <span className="text-zinc-500 block uppercase">Packet Success</span>
                  <span className={`font-bold text-sm ${panicMode ? "text-brand-rose" : "text-white"}`}>
                    {panicMode ? "12.42%" : "99.97%"}
                  </span>
                </div>
                <div className="bg-zinc-900/50 p-2 rounded border border-panel-border">
                  <span className="text-zinc-500 block uppercase">CAN Message Rate</span>
                  <span className="text-white font-bold text-sm">4.8k / sec</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2.5: Open Platform & Gateway Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          onClick={() => onNavigateToTab("gateway")}
          className="cyber-panel p-3.5 rounded cursor-pointer hover:border-brand-cyan/60 transition-all flex items-center justify-between bg-zinc-950/40 group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-zinc-900 border border-panel-border text-brand-cyan group-hover:border-brand-cyan">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">Tyk Ingress Control Plane</span>
              <div className="text-xs font-bold text-white flex items-center gap-2 mt-0.5">
                <span>3,420 req/s Ingress</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30">
                  SLA 99.995%
                </span>
              </div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-brand-cyan transition-colors" />
        </div>

        <div 
          onClick={() => onNavigateToTab("iam")}
          className="cyber-panel p-3.5 rounded cursor-pointer hover:border-brand-cyan/60 transition-all flex items-center justify-between bg-zinc-950/40 group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-zinc-900 border border-panel-border text-brand-emerald group-hover:border-brand-emerald">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">OIDC / PKI Identity State</span>
              <div className="text-xs font-bold text-white flex items-center gap-2 mt-0.5">
                <span>148 Vehicles mTLS Active</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
                  RS256 KMS Validated
                </span>
              </div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-brand-emerald transition-colors" />
        </div>
      </div>

      {/* Row 3: Incidents Center and Logs Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Incidents Dashboard Summary */}
        <div className="cyber-panel rounded flex flex-col min-h-[220px]">
          <div className="p-3 border-b border-panel-border bg-zinc-950 flex justify-between items-center">
            <span className="text-xs font-bold text-white tracking-widest uppercase">Active Incidents Queue</span>
            <button 
              onClick={() => onNavigateToTab("incidents")}
              className="text-[9px] text-brand-cyan hover:underline flex items-center gap-1 font-bold"
            >
              INVESTIGATE ALL <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 p-3 divide-y divide-panel-border">
            {incidents.filter(i => i.status === "ACTIVE").length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-xs py-8 gap-2">
                <CheckCircle2 className="w-8 h-8 text-brand-emerald" />
                <span>Zero active safety incidents reported.</span>
              </div>
            ) : (
              incidents.filter(i => i.status === "ACTIVE").slice(0, 3).map((incident) => (
                <div 
                  key={incident.id} 
                  onClick={() => onNavigateToTab("incidents", incident)}
                  className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-zinc-900/50 px-2 rounded transition-colors group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className={`p-1.5 rounded-full ${
                      incident.severity === "CRITICAL"
                        ? "bg-brand-rose/10 text-brand-rose border border-brand-rose/20"
                        : "bg-brand-amber/10 text-brand-amber border border-brand-amber/20"
                    }`}>
                      <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
                    </span>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                        {incident.type}
                      </span>
                      <span className="text-[9px] text-zinc-500">
                        {incident.vehicleId} &bull; {incident.timestamp}
                      </span>
                    </div>
                  </div>

                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    incident.severity === "CRITICAL"
                      ? "text-brand-rose bg-brand-rose/10"
                      : "text-brand-amber bg-brand-amber/10"
                  }`}>
                    {incident.severity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Real-time Audit Trail Ticker */}
        <div className="cyber-panel rounded flex flex-col min-h-[220px]">
          <div className="p-3 border-b border-panel-border bg-zinc-950 flex justify-between items-center">
            <span className="text-xs font-bold text-white tracking-widest uppercase">Live Audit Ticker</span>
            <button 
              onClick={() => onNavigateToTab("audit")}
              className="text-[9px] text-zinc-500 hover:text-white flex items-center gap-1 font-bold"
            >
              EXPLORE LOGS <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 p-4 font-mono text-[9px] text-zinc-400 space-y-2 max-h-[180px] overflow-y-auto">
            <div className="flex gap-2 text-zinc-500">
              <span>[22:58:14]</span>
              <span className="text-brand-emerald">INFO</span>
              <span className="text-zinc-300">RBAC: Dispatcher Alex S. logged in from IP 10.42.9.11</span>
            </div>
            <div className="flex gap-2 text-zinc-500">
              <span>[22:57:42]</span>
              <span className="text-brand-cyan">SYS</span>
              <span className="text-zinc-300">OTA: Ingress telemetry signed cryptographically for seoul-sub-04</span>
            </div>
            <div className="flex gap-2 text-zinc-500">
              <span>[22:56:01]</span>
              <span className="text-brand-amber">WARN</span>
              <span className="text-brand-amber">ANOMALY: High jitter rate detected on sensor port LIDAR_3 (VEH-42-012)</span>
            </div>
            <div className="flex gap-2 text-zinc-500">
              <span>[22:54:19]</span>
              <span className="text-zinc-500">DEBUG</span>
              <span className="text-zinc-400">Heartbeat confirmation: DB cluster synchronised (latency: 1.2ms)</span>
            </div>
            {panicMode && (
              <div className="flex gap-2 text-brand-rose animate-pulse font-bold">
                <span>[SYSTEM EVENT]</span>
                <span>OVERRIDE</span>
                <span>FAILSAFE TRIGGERED: Broadcast Emergency Stop signal sent to 148 vehicles.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
