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
  Filter,
  Shield,
  Gauge,
  Sliders,
  Trash2,
  MapPin,
  ShieldAlert
} from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface FleetViewProps {
  panicMode: boolean;
}

export default function FleetView({ panicMode }: FleetViewProps) {
  const { t, language } = useLanguage();
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // State-driven Fleet list to support active updates and deletion
  const [fleetList, setFleetList] = useState([
    { id: "VEH-42-012", type: "Robotaxi", status: "warning", battery: 74, speed: 42, lidar: "DEGRADED", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Gangnam 3rd Ave", speedLimit: 60 },
    { id: "VEH-42-089", type: "Shuttle", status: "critical", battery: 18, speed: 0, lidar: "OFFLINE", radar: "DEGRADED", camera: "OFFLINE", ota: "v2.3.9", location: "Hangar Standby", speedLimit: 40 },
    { id: "VEH-42-005", type: "Robotaxi", status: "secure", battery: 92, speed: 55, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Gangnam Station", speedLimit: 80 },
    { id: "VEH-42-104", type: "Delivery Pod", status: "secure", battery: 85, speed: 12, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Teheran-ro Street", speedLimit: 30 },
    { id: "VEH-42-067", type: "Robotaxi", status: "secure", battery: 59, speed: 48, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Pangyo Blvd", speedLimit: 60 },
    { id: "VEH-42-132", type: "Shuttle", status: "secure", battery: 64, speed: 38, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.0", location: "Yeoksam Subway", speedLimit: 50 },
    { id: "VEH-42-111", type: "Robotaxi", status: "secure", battery: 41, speed: 45, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Samseong Center", speedLimit: 70 },
    { id: "VEH-42-150", type: "Delivery Pod", status: "secure", battery: 89, speed: 14, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Pangyo Valley Depot", speedLimit: 30 },
  ]);

  // Handle speed limit modification (Update operation)
  const handleSpeedLimitChange = (id: string, limit: number) => {
    setFleetList(prev => prev.map(veh => veh.id === id ? { ...veh, speedLimit: limit } : veh));
    if (selectedVehicle && selectedVehicle.id === id) {
      setSelectedVehicle({ ...selectedVehicle, speedLimit: limit });
    }
  };

  // Handle location/route modification (Update operation)
  const handleLocationChange = (id: string, location: string) => {
    setFleetList(prev => prev.map(veh => veh.id === id ? { ...veh, location } : veh));
    if (selectedVehicle && selectedVehicle.id === id) {
      setSelectedVehicle({ ...selectedVehicle, location });
    }
  };

  // Handle vehicle decommissioning (Delete operation)
  const handleDecommission = (id: string) => {
    const checkMsg = language === "ko" 
      ? `경고: ${id} 차량을 폐기하고 보안 키를 철회하시겠습니까? 이 차량은 클라우드 연결에서 분리됩니다.`
      : `WARNING: Are you sure you want to decommission and revoke security keys for ${id}? This vehicle will disconnect from cloud links.`;
    if (confirm(checkMsg)) {
      setFleetList(prev => prev.filter(veh => veh.id !== id));
      setSelectedVehicle(null);
    }
  };

  const filteredFleet = fleetList.filter(veh => {
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
                placeholder={t("fleet.search")}
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
                  {type === "ALL" ? t("fleet.type_all") : language === "ko" ? (type === "Robotaxi" ? "로보택시" : type === "Shuttle" ? "셔틀" : "배달 포드") : type}
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
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">
                      {language === "ko" ? (veh.type === "Robotaxi" ? "로보택시" : veh.type === "Shuttle" ? "셔틀" : "배달 포드") : veh.type}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{veh.id}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    isCrit 
                      ? "text-brand-rose bg-brand-rose/10 border border-brand-rose/25 animate-pulse" 
                      : isWarn 
                      ? "text-brand-amber bg-brand-amber/10 border border-brand-amber/25" 
                      : "text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/25"
                  }`}>
                    {isCrit ? t("incidents.active_stat") : isWarn ? (language === "ko" ? "주의" : "WARN") : t("fleet.sensors_ok")}
                  </span>
                </div>

                 {/* Progress bar battery info */}
                <div className="my-3 space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Battery className={`w-3.5 h-3.5 ${veh.battery < 20 ? "text-brand-rose" : "text-zinc-500"}`} /> 
                      {language === "ko" ? "배터리 잔량" : "BATTERY CHARGE"}
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
                  <span>{language === "ko" ? "위치:" : "LOC:"} <strong className="text-zinc-300">
                    {language === "ko" ? (veh.location === "Gangnam Station" ? "강남역 (Zone A)" : veh.location === "Gangnam 3rd Ave" ? "강남 3대로 (Zone B)" : veh.location === "Teheran-ro Street" ? "테헤란로 (Zone C)" : veh.location === "Yeoksam Subway" ? "역삼역 (Zone D)" : veh.location === "Samseong Center" ? "삼성 센터 (Zone E)" : veh.location === "Pangyo Blvd" ? "판교대로 (판교 지역)" : veh.location === "Pangyo Valley Depot" ? "판교 밸리 기지 (정비고)" : "정비고 대기") : veh.location}
                  </strong></span>
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3 h-3" />
                    <strong className="text-zinc-300">{isCrit ? 0 : veh.speed} / {veh.speedLimit} km/h</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hardware Diagnostics & Controls panel (Right 1 Column) */}
      <div className="flex flex-col">
        {selectedVehicle ? (
          <div className="cyber-panel rounded flex flex-col p-4 space-y-4 bg-zinc-950/40 relative overflow-hidden flex-1">
            {/* Header info */}
            <div className="border-b border-panel-border pb-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">{language === "ko" ? "진단 및 제어" : "Diagnostics & Control"}</span>
              <h2 className="text-sm font-bold text-white mt-1 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-cyan" />
                {selectedVehicle.id} {language === "ko" ? "텔레메트리 링크" : "Telemetry Link"}
              </h2>
            </div>

            {/* In-depth hardware telemetry indicators */}
            <div className="space-y-3">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">{language === "ko" ? "센서 스택 진단" : "Sensor Stack Diagnostics"}</span>
              
              {/* LIDAR */}
              <div className="flex justify-between items-center bg-zinc-900/50 p-2.5 rounded border border-panel-border text-xs">
                <span className="text-zinc-400">{language === "ko" ? "LiDAR 어레이" : "LiDAR Arrays"}</span>
                <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${
                  selectedVehicle.lidar === "SECURE" ? "text-brand-emerald bg-brand-emerald/10" : "text-brand-rose bg-brand-rose/10 animate-pulse"
                }`}>
                  {selectedVehicle.lidar === "SECURE" ? t("fleet.sensors_ok") : t("fleet.sensors_deg")}
                </span>
              </div>

              {/* RADAR */}
              <div className="flex justify-between items-center bg-zinc-900/50 p-2.5 rounded border border-panel-border text-xs">
                <span className="text-zinc-400">{language === "ko" ? "Radar 수신" : "Radar Ingress"}</span>
                <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${
                  selectedVehicle.radar === "SECURE" ? "text-brand-emerald bg-brand-emerald/10" : "text-brand-amber bg-brand-amber/10"
                }`}>
                  {selectedVehicle.radar === "SECURE" ? t("fleet.sensors_ok") : t("fleet.sensors_deg")}
                </span>
              </div>

              {/* CAMERAS */}
              <div className="flex justify-between items-center bg-zinc-900/50 p-2.5 rounded border border-panel-border text-xs">
                <span className="text-zinc-400">{language === "ko" ? "카메라 어레이" : "Camera Arrays"}</span>
                <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${
                  selectedVehicle.camera === "SECURE" ? "text-brand-emerald bg-brand-emerald/10" : "text-brand-rose bg-brand-rose/10"
                }`}>
                  {selectedVehicle.camera === "SECURE" ? t("fleet.sensors_ok") : t("fleet.sensors_off")}
                </span>
              </div>
            </div>

            {/* Configuration Limits - Update Operations */}
            <div className="space-y-3 border-t border-panel-border pt-3">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">{language === "ko" ? "운영 설정 오버라이드" : "Operational Configuration"}</span>

              {/* Speed Limit Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-zinc-500" /> {language === "ko" ? "최대 속도 제어" : "MAX SPEED LIMIT GOVERNOR"}
                  </span>
                  <span className="text-white font-bold">{selectedVehicle.speedLimit} km/h</span>
                </div>
                <input 
                  type="range"
                  min="20"
                  max="100"
                  value={selectedVehicle.speedLimit}
                  onChange={(e) => handleSpeedLimitChange(selectedVehicle.id, parseInt(e.target.value))}
                  className="w-full accent-brand-cyan cursor-pointer bg-zinc-900"
                />
              </div>

              {/* Assigned Location Route Dropdown */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" /> {language === "ko" ? "할당된 배치 지역" : "ASSIGNED DEPLOYMENT ZONE"}
                  </span>
                </div>
                <select
                  value={selectedVehicle.location}
                  onChange={(e) => handleLocationChange(selectedVehicle.id, e.target.value)}
                  className="w-full bg-zinc-900 border border-panel-border rounded p-1.5 text-xs text-zinc-300 font-mono focus:border-zinc-700 outline-none"
                >
                  <option value="Gangnam Station">{language === "ko" ? "강남역 (Zone A)" : "Gangnam Station (Zone A)"}</option>
                  <option value="Gangnam 3rd Ave">{language === "ko" ? "강남 3대로 (Zone B)" : "Gangnam 3rd Ave (Zone B)"}</option>
                  <option value="Teheran-ro Street">{language === "ko" ? "테헤란로 (Zone C)" : "Teheran-ro Street (Zone C)"}</option>
                  <option value="Yeoksam Subway">{language === "ko" ? "역삼역 (Zone D)" : "Yeoksam Subway (Zone D)"}</option>
                  <option value="Samseong Center">{language === "ko" ? "삼성 센터 (Zone E)" : "Samseong Center (Zone E)"}</option>
                  <option value="Pangyo Blvd">{language === "ko" ? "판교대로 (판교 지역)" : "Pangyo Blvd (Pangyo Area)"}</option>
                  <option value="Pangyo Valley Depot">{language === "ko" ? "판교 밸리 기지 (정비고)" : "Pangyo Valley Depot (Service Hangar)"}</option>
                  <option value="Hangar Standby">{language === "ko" ? "정비고 대기 (유지보수)" : "Hangar Standby (Maintenance)"}</option>
                </select>
              </div>
            </div>

            {/* Sparkline representation of vehicle V2X connection strength */}
            <div className="bg-zinc-900/30 border border-panel-border rounded p-3 text-[10px] space-y-2">
              <div className="flex justify-between text-zinc-500 font-bold">
                <span>{language === "ko" ? "V2X 지연 시간 (최근 5분)" : "V2X LATENCY (LAST 5 MINS)"}</span>
                <span className="text-brand-cyan">{language === "ko" ? "평균 14.1ms" : "14.1ms Mean"}</span>
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

            {/* Actions: Firmware OTA & Decommission (Delete & Update triggers) */}
            <div className="border-t border-panel-border pt-3 mt-auto space-y-2">
              <div className="flex justify-between text-[10px] text-zinc-500 font-bold">
                <span>{language === "ko" ? "펌웨어 상태" : "FIRMWARE STATE"}</span>
                <span className="text-white">{selectedVehicle.ota}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button 
                  onClick={() => alert(language === "ko" ? `${selectedVehicle.id}에 대한 강제 OTA 업데이트 사이클 가동.` : `Forcing OTA update cycle for ${selectedVehicle.id}`)}
                  className="flex items-center justify-center gap-1.5 p-2 rounded bg-zinc-900 border border-panel-border hover:border-zinc-700 text-zinc-300 hover:text-white text-[10px] font-bold uppercase transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {language === "ko" ? "OTA 강제 업데이트" : "FORCE OTA"}
                </button>

                <button 
                  onClick={() => handleDecommission(selectedVehicle.id)}
                  className="flex items-center justify-center gap-1.5 p-2 rounded bg-brand-rose/10 border border-brand-rose/30 text-brand-rose hover:bg-brand-rose/25 text-[10px] font-bold uppercase transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {language === "ko" ? "폐기 처리" : "DECOMMISSION"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="cyber-panel rounded flex-1 flex flex-col items-center justify-center p-8 text-zinc-500 text-xs text-center border-dashed">
            <Compass className="w-8 h-8 text-zinc-600 mb-2 animate-spin" style={{ animationDuration: "20s" }} />
            <span>{language === "ko" ? "플릿 차량을 선택하여 텔레메트리를 수신하고 센서 컴포넌트를 진단하십시오." : "Select a vehicle instance to stream telematics and diagnose sensor components."}</span>
          </div>
        )}
      </div>
    </div>
  );
}
