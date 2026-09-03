"use client";

import React, { useState, useEffect } from "react";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Compass, 
  FileText, 
  Settings, 
  Search, 
  Bell, 
  Clock, 
  Power, 
  Wifi, 
  ChevronRight, 
  MapPin, 
  Lock,
  Database,
  Network,
  KeyRound
} from "lucide-react";

interface ConsoleLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  threatLevel: "NORMAL" | "ELEVATED" | "CRITICAL";
  setThreatLevel: (level: "NORMAL" | "ELEVATED" | "CRITICAL") => void;
  panicMode: boolean;
  setPanicMode: (panic: boolean) => void;
  children: React.ReactNode;
  incidentCount: number;
}

export default function ConsoleLayout({
  activeTab,
  setActiveTab,
  threatLevel,
  setThreatLevel,
  panicMode,
  setPanicMode,
  children,
  incidentCount
}: ConsoleLayoutProps) {
  const [currentTime, setCurrentTime] = useState("");
  const [utcTime, setUtcTime] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Seoul - Gangnam SOC");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("ko-KR", { hour12: false }) + `.${String(now.getMilliseconds()).padStart(3, "0")}`);
      setUtcTime(now.toUTCString().replace("GMT", "UTC"));
    };

    updateTime();
    const interval = setInterval(updateTime, 45);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity, badge: null },
    { id: "gateway", label: "API Gateway (Tyk)", icon: Network, badge: "6/6 UP", badgeColor: "bg-brand-emerald" },
    { id: "iam", label: "IAM & OAuth 2.0", icon: KeyRound, badge: "OIDC", badgeColor: "bg-brand-cyan" },
    { id: "incidents", label: "Incidents & Alerts", icon: AlertTriangle, badge: incidentCount > 0 ? incidentCount : null, badgeColor: "bg-brand-rose" },
    { id: "fleet", label: "Fleet & Devices", icon: Compass, badge: "148/150", badgeColor: "bg-brand-cyan" },
    { id: "audit", label: "Audit Trail", icon: FileText, badge: null },
    { id: "settings", label: "System & ABAC", icon: Settings, badge: null },
  ];

  return (
    <div className={`min-h-screen flex flex-col select-none bg-black text-zinc-100 ${panicMode ? "border-2 border-brand-rose animate-pulse-glow" : ""}`}>
      {/* Panic Mode Top Warning Banner */}
      {panicMode && (
        <div className="bg-brand-rose text-black py-1.5 px-4 font-mono text-xs font-bold tracking-widest text-center flex items-center justify-center gap-2 animate-pulse">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span>CRITICAL SYSTEM EMERGENCY OVERRIDE: GLOBAL SAFE-STOP PROTOCOLS ENGAGED</span>
          <AlertTriangle className="w-4 h-4 animate-bounce" />
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-1 flex-row overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`cyber-panel border-y-0 border-l-0 flex flex-col justify-between transition-all duration-300 ${
            sidebarCollapsed ? "w-16" : "w-64"
          } bg-zinc-950/90 z-20`}
        >
          {/* Logo Section */}
          <div>
            <div className="p-4 border-b border-panel-border flex items-center gap-3">
              <div className={`p-1.5 rounded bg-zinc-900 border ${panicMode ? "border-brand-rose text-brand-rose" : "border-brand-cyan text-brand-cyan"}`}>
                <Shield className={`w-5 h-5 ${panicMode ? "animate-pulse" : ""}`} />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-mono font-bold text-xs tracking-wider text-white">COREGUARD SOC</span>
                  <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">42dot Safety Unit</span>
                </div>
              )}
            </div>

            {/* Quick Status Stats (only when expanded) */}
            {!sidebarCollapsed && (
              <div className="p-4 border-b border-panel-border bg-zinc-900/30 font-mono text-[11px] space-y-2">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>THREAT STATUS:</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                    threatLevel === "CRITICAL" || panicMode
                      ? "text-brand-rose bg-brand-rose/10 border border-brand-rose/20 animate-pulse"
                      : threatLevel === "ELEVATED"
                      ? "text-brand-amber bg-brand-amber/10 border border-brand-amber/20"
                      : "text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/20"
                  }`}>
                    {panicMode ? "CRITICAL" : threatLevel}
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>V2X LATENCY:</span>
                  <span className="text-brand-cyan font-bold">14 ms</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>GPS LINK:</span>
                  <span className="text-brand-emerald font-bold flex items-center gap-1">
                    <Wifi className="w-3 h-3" /> ACTIVE
                  </span>
                </div>
              </div>
            )}

            {/* Navigation links */}
            <nav className="p-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded font-mono text-xs tracking-wide transition-all group ${
                      isActive 
                        ? "bg-zinc-900 text-white border-l-2 border-brand-cyan shadow-[inset_4px_0_0_rgba(6,182,212,0.2)] font-bold" 
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-brand-cyan" : "text-zinc-500 group-hover:text-zinc-300"
                      }`} />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && item.badge && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white ${item.badgeColor || "bg-zinc-800"}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Profile & Footer Collapser */}
          <div className="border-t border-panel-border bg-zinc-900/10">
            {/* User section */}
            {!sidebarCollapsed && (
              <div className="p-4 border-b border-panel-border flex items-center gap-3 font-mono">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-brand-cyan shadow-inner">
                  AS
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-zinc-300 truncate">Alex S.</span>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Lead Dispatcher</span>
                </div>
              </div>
            )}

            {/* Sidebar toggle and emergency state buttons */}
            <div className="flex items-center justify-between p-2">
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5 rounded hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors"
                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? "" : "rotate-180"}`} />
              </button>

              {!sidebarCollapsed && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      if (panicMode) {
                        setPanicMode(false);
                        setThreatLevel("NORMAL");
                      } else {
                        setPanicMode(true);
                        setThreatLevel("CRITICAL");
                      }
                    }}
                    className={`p-1 px-2 rounded border font-mono text-[9px] font-bold tracking-tighter uppercase transition-all ${
                      panicMode 
                        ? "bg-brand-emerald text-black border-brand-emerald hover:bg-brand-emerald/80"
                        : "bg-brand-rose/10 text-brand-rose border-brand-rose/30 hover:bg-brand-rose/20"
                    }`}
                  >
                    {panicMode ? "RESET SOC" : "TEST PANIC"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-black relative">
          {/* Top Header */}
          <header className="h-14 border-b border-panel-border bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
            {/* Breadcrumbs and Path */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
                <span>SOC</span>
                <span>/</span>
                <span>REG_KST</span>
                <span>/</span>
                <span className="text-zinc-400 font-bold">{selectedRegion.split(" ")[0]}</span>
                <span>/</span>
                <span className="text-brand-cyan font-bold">{activeTab}</span>
              </div>
            </div>

            {/* Central Live Ticker (when alert is active) */}
            <div className="flex-1 max-w-lg mx-6 hidden lg:block">
              <div className="border border-panel-border bg-zinc-900/30 rounded px-3 py-1 flex items-center gap-2.5 font-mono text-[11px] overflow-hidden">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse"></span>
                <span className="text-zinc-400 uppercase tracking-wider font-bold">SYSTEM TIMELINE:</span>
                <span className="text-zinc-300 truncate tracking-wide animate-pulse-slow">
                  {panicMode 
                    ? "!!! ALERT: EMER EMERGENCY SHUTDOWN SENT TO ALL VEHS !!!" 
                    : "Telemetry check complete: 148 vehicles responding, 2 in hangar sleep state."}
                </span>
              </div>
            </div>

            {/* Header Right Stats and Actions */}
            <div className="flex items-center gap-4 font-mono">
              {/* Region Select */}
              <div className="relative flex items-center bg-zinc-900 border border-panel-border rounded px-2.5 py-1 text-xs">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 mr-1.5" />
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-transparent border-none outline-none font-mono text-zinc-300 pr-4 appearance-none cursor-pointer text-[11px]"
                >
                  <option value="Seoul - Gangnam SOC">Seoul - Gangnam</option>
                  <option value="Seoul - Pangyo Valley">Seoul - Pangyo</option>
                  <option value="California - Cupertino Dev">California - Cupertino</option>
                </select>
                <ChevronRight className="w-3 h-3 text-zinc-500 pointer-events-none absolute right-2.5 rotate-90" />
              </div>

              {/* Precise Time indicators */}
              <div className="hidden sm:flex flex-col text-right pr-2">
                <span className="text-xs font-bold text-white tracking-wider tabular-nums">{currentTime}</span>
                <span className="text-[9px] text-zinc-500 tabular-nums">{utcTime}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-l border-panel-border pl-4">
                <button className="p-1.5 rounded bg-zinc-900 border border-panel-border hover:border-zinc-700 text-zinc-400 hover:text-white transition-all relative">
                  <Bell className="w-4 h-4" />
                  {incidentCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-rose rounded-full animate-pulse"></span>
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Main Subview Content Scrollable */}
          <main className="flex-1 overflow-y-auto p-6 relative map-grid">
            {/* Scanline premium retro monitor effect overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5 z-10">
              <div className="w-full h-0.5 bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)] animate-scanline"></div>
            </div>
            {children}
          </main>

          {/* Footer Bar */}
          <footer className="h-8 border-t border-panel-border bg-zinc-950/95 flex items-center justify-between px-6 font-mono text-[10px] text-zinc-500 z-10">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span className={`w-1.5 h-1.5 rounded-full ${panicMode ? "bg-brand-rose animate-ping" : "bg-brand-emerald"}`}></span>
                COREGUARD CLOUD LINK: <span className="font-bold text-white">SECURE</span>
              </span>
              <span className="hidden md:inline">|</span>
              <span className="hidden md:inline">
                API SERVICE STATUS: <span className="text-brand-emerald font-bold">100% UP</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span>DB CLUSTER: <span className="text-zinc-400 font-bold">REPLICATED</span></span>
              <span>|</span>
              <span>VER: <span className="text-zinc-400 font-bold">v3.4.12-PROD</span></span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
