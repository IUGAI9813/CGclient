"use client";

import React, { useState } from "react";
import { 
  Compass, 
  Search, 
  Battery, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  RefreshCw, 
  HardDrive,
  Filter,
  Shield,
  Gauge
} from "lucide-react";

interface FleetViewProps {
  panicMode: boolean;
}

export default function FleetView({ panicMode }: FleetViewProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Mock fleet data
  const initialFleet = [
    { id: "VEH-42-012", type: "Robotaxi", status: "warning", battery: 74, speed: 42, lidar: "DEGRADED", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Gangnam 3rd Ave" },
    { id: "VEH-42-089", type: "Shuttle", status: "critical", battery: 18, speed: 0, lidar: "OFFLINE", radar: "DEGRADED", camera: "OFFLINE", ota: "v2.3.9", location: "Hangar Standby" },
    { id: "VEH-42-005", type: "Robotaxi", status: "secure", battery: 92, speed: 55, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Gangnam Station" },
    { id: "VEH-42-104", type: "Delivery Pod", status: "secure", battery: 85, speed: 12, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Teheran-ro Street" },
    { id: "VEH-42-067", type: "Robotaxi", status: "secure", battery: 59, speed: 48, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Pangyo Blvd" },
    { id: "VEH-42-132", type: "Shuttle", status: "secure", battery: 64, speed: 38, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.0", location: "Yeoksam Subway" },
    { id: "VEH-42-111", type: "Robotaxi", status: "secure", battery: 41, speed: 45, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Samseong Center" },
    { id: "VEH-42-150", type: "Delivery Pod", status: "secure", battery: 89, speed: 14, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Pangyo Valley Depot" },
  ];

  const filteredFleet = initialFleet.filter(veh => {
    const matchesSearch = veh.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          veh.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "ALL" || veh.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in font-mono">
      {/* Fleet Listing Section */}
      <div className="lg:col-span-2 space-y-4">
        {/* Statistics & Filters */}
        <div className="cyber-panel p-4 rounded space-y-3 bg-zinc-950/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search fleet by ID or coordinates/location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-panel-border rounded pl-9 pr-4 py-2 text-xs text-zinc-200 outline-none focus:border-zinc-600 transition-colors"
              />
            </div>
            
            <div className="flex gap-2">
              {["ALL", "Robotaxi", "Shuttle", "Delivery Pod"].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-colors ${
                    typeFilter === type
                      ? "bg-brand-cyan/20 text-brand-cyan border-brand-cyan"
                      : "bg-zinc-900 text-zinc-400 border-panel-border hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredFleet.map((veh) => {
            const isCrit = veh.status === "critical" || panicMode;
            const isWarn = veh.status === "warning" && !panicMode;
            
            return (
              <div
                key={veh.id}
                onClick={() => setSelectedVehicle(veh)}
                className={`cyber-panel p-4 rounded cursor-pointer transition-all hover:translate-y-[-2px] relative flex flex-col justify-between ${
                  selectedVehicle?.id === veh.id
                    ? "border-brand-cyan bg-zinc-900/60 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    : isCrit
                    ? "border-brand-rose bg-brand-rose/5"
                    : isWarn
                    ? "border-brand-amber bg-brand-amber/5"
                    : "bg-zinc-950/40"
                }`}
              >
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">{veh.type}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{veh.id}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    isCrit 
                      ? "text-brand-rose bg-brand-rose/10 border border-brand-rose/25 animate-pulse" 
                      : isWarn 
                      ? "text-brand-amber bg-brand-amber/10 border border-brand-amber/25" 
                      : "text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/25"
                  }`}>
                    {isCrit ? "ALERT" : isWarn ? "WARN" : "SECURE"}
                  </span>
                </div>

                {/* Progress bar battery info */}
                <div className="my-3 space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Battery className={`w-3.5 h-3.5 ${veh.battery < 20 ? "text-brand-rose" : "text-zinc-500"}`} /> 
                      BATTERY CHARGE
                    </span>
                    <span className="font-bold text-white">{veh.battery}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        veh.battery < 20 ? "bg-brand-rose" : veh.battery < 50 ? "bg-brand-amber" : "bg-brand-emerald"
                      }`}
                      style={{ width: `${veh.battery}%` }}
                    ></div>
                  </div>
                </div>

                {/* Hardware indicators status */}
                <div className="flex justify-between items-center text-[9px] text-zinc-500 border-t border-panel-border/50 pt-2.5 mt-2.5">
                  <span>LOC: <strong className="text-zinc-300">{veh.location}</strong></span>
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3 h-3" />
                    <strong className="text-zinc-300">{isCrit ? 0 : veh.speed} km/h</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hardware Diagnostics panel (Right 1 Column) */}
      <div className="flex flex-col">
        {selectedVehicle ? (
          <div className="cyber-panel rounded flex flex-col p-4 space-y-4 bg-zinc-950/40 relative overflow-hidden flex-1">
            {/* Header info */}
            <div className="border-b border-panel-border pb-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Diagnostics Console</span>
              <h2 className="text-sm font-bold text-white mt-1 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-cyan" />
                {selectedVehicle.id} Active Ingress
              </h2>
            </div>

            {/* In-depth hardware telemetry indicators */}
            <div className="space-y-3">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Sensor Stack Diagnostics</span>
              
              {/* LIDAR */}
              <div className="flex justify-between items-center bg-zinc-900/50 p-2.5 rounded border border-panel-border text-xs">
                <span className="text-zinc-400">LiDAR Arrays</span>
                <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${
                  selectedVehicle.lidar === "SECURE" ? "text-brand-emerald bg-brand-emerald/10" : "text-brand-rose bg-brand-rose/10 animate-pulse"
                }`}>
                  {selectedVehicle.lidar}
                </span>
              </div>

              {/* RADAR */}
              <div className="flex justify-between items-center bg-zinc-900/50 p-2.5 rounded border border-panel-border text-xs">
                <span className="text-zinc-400">Radar Ingress</span>
                <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${
                  selectedVehicle.radar === "SECURE" ? "text-brand-emerald bg-brand-emerald/10" : "text-brand-amber bg-brand-amber/10"
                }`}>
                  {selectedVehicle.radar}
                </span>
              </div>

              {/* CAMERAS */}
              <div className="flex justify-between items-center bg-zinc-900/50 p-2.5 rounded border border-panel-border text-xs">
                <span className="text-zinc-400">Camera Arrays</span>
                <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${
                  selectedVehicle.camera === "SECURE" ? "text-brand-emerald bg-brand-emerald/10" : "text-brand-rose bg-brand-rose/10"
                }`}>
                  {selectedVehicle.camera}
                </span>
              </div>
            </div>

            {/* Sparkline representation of vehicle V2X connection strength */}
            <div className="bg-zinc-900/30 border border-panel-border rounded p-3 text-[10px] space-y-2">
              <div className="flex justify-between text-zinc-500 font-bold">
                <span>V2X LATENCY (LAST 5 MINS)</span>
                <span className="text-brand-cyan">14.1ms Mean</span>
              </div>
              <div className="h-12 w-full flex items-end">
                <svg className="w-full h-full text-zinc-800" viewBox="0 0 160 40" preserveAspectRatio="none">
                  <path 
                    d="M0,20 L20,18 L40,25 L60,12 L80,15 L100,32 L120,10 L140,15 L160,18" 
                    fill="none" 
                    stroke="#06b6d4" 
                    strokeWidth="1.5"
                  />
                  <circle cx="160" cy="18" r="3" fill="#06b6d4" />
                </svg>
              </div>
            </div>

            {/* Quick Action Firmware Management */}
            <div className="border-t border-panel-border pt-4 mt-auto space-y-2">
              <div className="flex justify-between text-[10px] text-zinc-500 font-bold">
                <span>FIRMWARE STATE</span>
                <span className="text-white">{selectedVehicle.ota}</span>
              </div>
              <button 
                onClick={() => alert(`Forcing OTA update cycle for ${selectedVehicle.id}`)}
                className="w-full flex items-center justify-center gap-1.5 p-2 rounded bg-zinc-900 border border-panel-border hover:border-zinc-700 text-zinc-300 hover:text-white text-[10px] font-bold uppercase transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                FORCE OTA HARD-REFRESH
              </button>
            </div>
          </div>
        ) : (
          <div className="cyber-panel rounded flex-1 flex flex-col items-center justify-center p-8 text-zinc-500 text-xs text-center border-dashed">
            <Compass className="w-8 h-8 text-zinc-600 mb-2 animate-spin" style={{ animationDuration: "20s" }} />
            <span>Select a vehicle instance to stream telematics and diagnose sensor components.</span>
          </div>
        )}
      </div>
    </div>
  );
}
