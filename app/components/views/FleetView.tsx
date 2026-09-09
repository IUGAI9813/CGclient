"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Search,
  Battery,
  Cpu,
  RefreshCw,
  Gauge,
  Sliders,
  Trash2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  X,
  LayoutGrid,
  List,
  ShieldCheck,
  Activity
} from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface FleetVehicle {
  id: string;
  type: string;
  status: string;
  battery: number;
  speed: number;
  lidar: string;
  radar: string;
  camera: string;
  ota: string;
  location: string;
  speedLimit: number;
}

interface FleetViewProps {
  panicMode: boolean;
}

export default function FleetView({ panicMode }: FleetViewProps) {
  const { t, language } = useLanguage();
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [isSpeedModalOpen, setIsSpeedModalOpen] = useState(false);
  const [pendingSpeedLimit, setPendingSpeedLimit] = useState<number>(60);
  const [isApplyingSpeed, setIsApplyingSpeed] = useState(false);
  const [speedApplyFeedback, setSpeedApplyFeedback] = useState<string | null>(null);

  // Filters & View Mode
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // State-driven Fleet list
  const [fleetList, setFleetList] = useState<FleetVehicle[]>([
    { id: "VEH-42-012", type: "Robotaxi", status: "warning", battery: 74, speed: 42, lidar: "DEGRADED", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Gangnam 3rd Ave", speedLimit: 60 },
    { id: "VEH-42-089", type: "Shuttle", status: "critical", battery: 18, speed: 0, lidar: "OFFLINE", radar: "DEGRADED", camera: "OFFLINE", ota: "v2.3.9", location: "Hangar Standby", speedLimit: 40 },
    { id: "VEH-42-005", type: "Robotaxi", status: "secure", battery: 92, speed: 55, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Gangnam Station", speedLimit: 80 },
    { id: "VEH-42-104", type: "Delivery Pod", status: "secure", battery: 85, speed: 12, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Teheran-ro Street", speedLimit: 30 },
    { id: "VEH-42-067", type: "Robotaxi", status: "secure", battery: 59, speed: 48, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Pangyo Blvd", speedLimit: 60 },
    { id: "VEH-42-132", type: "Shuttle", status: "secure", battery: 64, speed: 38, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.0", location: "Yeoksam Subway", speedLimit: 50 },
    { id: "VEH-42-111", type: "Robotaxi", status: "secure", battery: 41, speed: 45, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Samseong Center", speedLimit: 70 },
    { id: "VEH-42-150", type: "Delivery Pod", status: "secure", battery: 89, speed: 14, lidar: "SECURE", radar: "SECURE", camera: "SECURE", ota: "v2.4.1", location: "Pangyo Valley Depot", speedLimit: 30 },
  ]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isSpeedModalOpen) {
          setIsSpeedModalOpen(false);
        } else if (selectedVehicle) {
          setSelectedVehicle(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSpeedModalOpen, selectedVehicle]);

  const handleSelectVehicle = (veh: FleetVehicle) => {
    setSelectedVehicle(veh);
    setPendingSpeedLimit(veh.speedLimit);
    setSpeedApplyFeedback(null);
  };

  const handleOpenSpeedModal = (veh: FleetVehicle) => {
    setSelectedVehicle(veh);
    setPendingSpeedLimit(veh.speedLimit);
    setIsSpeedModalOpen(true);
  };

  // Apply speed limit modification to ECU via V2X
  const handleApplySpeedLimit = async () => {
    if (!selectedVehicle) return;
    setIsApplyingSpeed(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setFleetList((prev) =>
      prev.map((veh) =>
        veh.id === selectedVehicle.id ? { ...veh, speedLimit: pendingSpeedLimit } : veh
      )
    );
    setSelectedVehicle((prev) =>
      prev ? { ...prev, speedLimit: pendingSpeedLimit } : null
    );
    setIsApplyingSpeed(false);
    setIsSpeedModalOpen(false);
    setSpeedApplyFeedback(
      language === "ko"
        ? `${selectedVehicle.id} 속도 제한이 ${pendingSpeedLimit} km/h로 적용되었습니다 (ECU 동기화 완료).`
        : `Speed limit for ${selectedVehicle.id} applied at ${pendingSpeedLimit} km/h (ECU Synced).`
    );
    setTimeout(() => setSpeedApplyFeedback(null), 4000);
  };

  // Handle location/route modification
  const handleLocationChange = (id: string, location: string) => {
    setFleetList((prev) => prev.map((veh) => (veh.id === id ? { ...veh, location } : veh)));
    if (selectedVehicle && selectedVehicle.id === id) {
      setSelectedVehicle({ ...selectedVehicle, location });
    }
  };

  // Handle vehicle decommissioning
  const handleDecommission = (id: string) => {
    const checkMsg =
      language === "ko"
        ? `경고: ${id} 차량을 폐기하고 보안 키를 철회하시겠습니까? 이 차량은 클라우드 연결에서 분리됩니다.`
        : `WARNING: Are you sure you want to decommission and revoke security keys for ${id}? This vehicle will disconnect from cloud links.`;
    if (confirm(checkMsg)) {
      setFleetList((prev) => prev.filter((veh) => veh.id !== id));
      setSelectedVehicle(null);
    }
  };

  // Filtered fleet
  const filteredFleet = fleetList.filter((veh) => {
    const matchesSearch =
      veh.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      veh.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "ALL" || veh.type === typeFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "CRITICAL" && (veh.status === "critical" || panicMode)) ||
      (statusFilter === "WARNING" && veh.status === "warning" && !panicMode) ||
      (statusFilter === "SECURE" && veh.status === "secure" && !panicMode);

    return matchesSearch && matchesType && matchesStatus;
  });

  // KPI Metrics
  const totalCount = fleetList.length;
  const criticalCount = fleetList.filter((v) => v.status === "critical" || panicMode).length;
  const warningCount = fleetList.filter((v) => v.status === "warning" && !panicMode).length;
  const secureCount = fleetList.filter((v) => v.status === "secure" && !panicMode).length;
  const avgBattery = Math.round(
    fleetList.reduce((acc, v) => acc + v.battery, 0) / (fleetList.length || 1)
  );

  const getTypeLabel = (type: string) => {
    if (language !== "ko") return type;
    if (type === "Robotaxi") return "로보택시";
    if (type === "Shuttle") return "셔틀";
    if (type === "Delivery Pod") return "배달 포드";
    return type;
  };

  const getLocationLabel = (loc: string) => {
    if (language !== "ko") return loc;
    switch (loc) {
      case "Gangnam Station":
        return "강남역 (Zone A)";
      case "Gangnam 3rd Ave":
        return "강남 3대로 (Zone B)";
      case "Teheran-ro Street":
        return "테헤란로 (Zone C)";
      case "Yeoksam Subway":
        return "역삼역 (Zone D)";
      case "Samseong Center":
        return "삼성 센터 (Zone E)";
      case "Pangyo Blvd":
        return "판교대로 (판교 지역)";
      case "Pangyo Valley Depot":
        return "판교 밸리 기지 (정비고)";
      case "Hangar Standby":
        return "정비고 대기 (유지보수)";
      default:
        return loc;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & TELEMETRY FLEET KPI STATS                                 */}
      {/* ========================================================================= */}
      <div className="cyber-panel p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-cyan" />
            <span className="text-[11px] text-[var(--muted-text)] font-bold uppercase tracking-wider">
              {language === "ko" ? "자율주행 플릿 관제 시스템" : "AUTONOMOUS FLEET TELEMATICS COMMAND"}
            </span>
          </div>
          <h1 className="text-lg font-bold text-[var(--foreground)] mt-0.5">
            {language === "ko" ? "플릿 디바이스 및 ECU 관제 (Fleet Management)" : "Fleet Devices & ECU Telematics Control"}
          </h1>
          <p className="text-xs text-[var(--muted-text)] mt-1">
            {language === "ko"
              ? "V2X 무선 통신망을 통해 에지 차량의 센서 스택(LiDAR, Radar, Camera) 상태를 실시간 진단하고 제어합니다."
              : "Monitor edge vehicle sensor stacks, battery status, and remote speed limit governors in real-time over V2X."}
          </p>
        </div>

        {/* Fleet KPI Metric Badges */}
        <div className="bg-[var(--panel-header-bg)] border border-panel-border px-3.5 py-2 rounded-md flex items-center gap-4 text-xs">
          <div>
            <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "총 운용 차량" : "Total Fleet"}</span>
            <span className="text-[var(--foreground)] font-bold tabular-nums">{totalCount}대</span>
          </div>
          <div className="w-[1px] h-6 bg-panel-border"></div>
          <div>
            <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "정상 작동" : "Secure"}</span>
            <span className="text-brand-emerald font-bold tabular-nums">{secureCount}대</span>
          </div>
          <div className="w-[1px] h-6 bg-panel-border"></div>
          <div>
            <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "이상 감지" : "Warning/Crit"}</span>
            <span className={`${criticalCount > 0 ? "text-brand-rose" : "text-brand-amber"} font-bold tabular-nums`}>
              {criticalCount + warningCount}대
            </span>
          </div>
          <div className="w-[1px] h-6 bg-panel-border"></div>
          <div>
            <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "평균 배터리" : "Avg Battery"}</span>
            <span className="text-brand-cyan font-bold tabular-nums">{avgBattery}%</span>
          </div>
        </div>
      </div>

      {/* Speed Apply Success Notification */}
      {speedApplyFeedback && (
        <div className="flex items-center gap-2 p-3 bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald text-xs rounded-lg animate-fade-in font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-emerald" />
          <span>{speedApplyFeedback}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SEARCH, FILTER & VIEW MODE TOOLBAR                                     */}
      {/* ========================================================================= */}
      <div className="cyber-panel p-3 rounded-lg flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[var(--muted-text)] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t("fleet.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md pl-9 pr-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-brand-cyan transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {/* Type Filter Pills */}
          <div className="flex gap-1">
            {["ALL", "Robotaxi", "Shuttle", "Delivery Pod"].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded text-[11px] font-semibold whitespace-nowrap border transition-all ${
                  typeFilter === type
                    ? "bg-brand-cyan/15 border-brand-cyan text-brand-cyan font-bold"
                    : "bg-[var(--panel-header-bg)] border-panel-border text-[var(--muted-text)] hover:text-[var(--foreground)]"
                }`}
              >
                {type === "ALL" ? t("fleet.type_all") : getTypeLabel(type)}
              </button>
            ))}
          </div>

          <div className="w-[1px] h-5 bg-panel-border"></div>

          {/* Status Filter Pills */}
          <div className="flex gap-1">
            {[
              { key: "ALL", label: language === "ko" ? "전체 상태" : "All Status" },
              { key: "SECURE", label: language === "ko" ? "정상" : "Secure" },
              { key: "WARNING", label: language === "ko" ? "주의" : "Warning" },
              { key: "CRITICAL", label: language === "ko" ? "위험" : "Critical" },
            ].map((st) => (
              <button
                key={st.key}
                onClick={() => setStatusFilter(st.key)}
                className={`px-2.5 py-1.5 rounded text-[11px] font-semibold whitespace-nowrap border transition-all ${
                  statusFilter === st.key
                    ? "bg-brand-cyan/15 border-brand-cyan text-brand-cyan font-bold"
                    : "bg-[var(--panel-header-bg)] border-panel-border text-[var(--muted-text)] hover:text-[var(--foreground)]"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle: Table / Grid */}
          <div className="flex border border-panel-border rounded-md bg-[var(--panel-header-bg)] p-0.5">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === "table" ? "bg-[var(--panel-bg)] text-brand-cyan shadow-xs" : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
              }`}
              title={language === "ko" ? "테이블 뷰" : "Table View"}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === "grid" ? "bg-[var(--panel-bg)] text-brand-cyan shadow-xs" : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
              }`}
              title={language === "ko" ? "카드 그리드 뷰" : "Grid View"}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN FLEET CONTENT: TABLE VIEW OR GRID VIEW                            */}
      {/* ========================================================================= */}
      {viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="cyber-panel rounded-lg overflow-hidden border border-panel-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-panel-border bg-[var(--panel-header-bg)] text-[11px] font-bold text-[var(--muted-text)] uppercase tracking-wider">
                  <th className="py-3 px-4">{language === "ko" ? "차량 식별자 (ID)" : "Vehicle ID"}</th>
                  <th className="py-3 px-4">{language === "ko" ? "차종" : "Type"}</th>
                  <th className="py-3 px-4">{language === "ko" ? "상태" : "Status"}</th>
                  <th className="py-3 px-4">{language === "ko" ? "배치 지역 (Zone)" : "Deployment Zone"}</th>
                  <th className="py-3 px-4">{language === "ko" ? "배터리" : "Battery"}</th>
                  <th className="py-3 px-4">{language === "ko" ? "주행 속도 / 제한" : "Speed / Limit"}</th>
                  <th className="py-3 px-4">{language === "ko" ? "센서 스택 진단" : "Sensor Diagnostics"}</th>
                  <th className="py-3 px-4 text-right">{language === "ko" ? "제어 및 분석" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panel-border text-[var(--foreground)]">
                {filteredFleet.map((veh) => {
                  const isCrit = veh.status === "critical" || panicMode;
                  const isWarn = veh.status === "warning" && !panicMode;
                  const isSelected = selectedVehicle?.id === veh.id;

                  return (
                    <tr
                      key={veh.id}
                      onClick={() => handleSelectVehicle(veh)}
                      className={`cursor-pointer transition-colors group ${
                        isSelected
                          ? "bg-brand-cyan/10 hover:bg-brand-cyan/15"
                          : "hover:bg-[var(--panel-header-bg)]"
                      }`}
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-sm text-[var(--foreground)] group-hover:text-brand-cyan">
                        {veh.id}
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4 font-medium text-[var(--foreground)]">
                        {getTypeLabel(veh.type)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            isCrit
                              ? "text-brand-rose bg-brand-rose/10 border-brand-rose/30 animate-pulse"
                              : isWarn
                              ? "text-brand-amber bg-brand-amber/10 border-brand-amber/30"
                              : "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isCrit ? "bg-brand-rose" : isWarn ? "bg-brand-amber" : "bg-brand-emerald"
                            }`}
                          ></span>
                          {isCrit
                            ? t("incidents.active_stat")
                            : isWarn
                            ? language === "ko"
                              ? "주의"
                              : "WARN"
                            : t("fleet.sensors_ok")}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <span className="flex items-center gap-1.5 font-medium text-xs">
                          <MapPin className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                          <span>{getLocationLabel(veh.location)}</span>
                        </span>
                      </td>

                      {/* Battery */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 max-w-[120px]">
                          <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                veh.battery < 20 ? "bg-brand-rose" : veh.battery < 50 ? "bg-brand-amber" : "bg-brand-emerald"
                              }`}
                              style={{ width: `${veh.battery}%` }}
                            ></div>
                          </div>
                          <span className="font-mono text-xs font-bold tabular-nums shrink-0">{veh.battery}%</span>
                        </div>
                      </td>

                      {/* Speed & Limit */}
                      <td className="py-3.5 px-4 font-mono tabular-nums">
                        <div className="flex items-center gap-1">
                          <Gauge className="w-3.5 h-3.5 text-[var(--muted-text)]" />
                          <span className="font-bold">{isCrit ? 0 : veh.speed}</span>
                          <span className="text-[var(--muted-text)] text-[11px]">/ {veh.speedLimit} km/h</span>
                        </div>
                      </td>

                      {/* Sensor Stack Pills */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-[9px] font-mono">
                          <span
                            className={`px-1.5 py-0.5 rounded border ${
                              veh.lidar === "SECURE"
                                ? "border-brand-emerald/30 text-brand-emerald bg-brand-emerald/5"
                                : "border-brand-rose/30 text-brand-rose bg-brand-rose/10 font-bold"
                            }`}
                          >
                            LiDAR
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded border ${
                              veh.radar === "SECURE"
                                ? "border-brand-emerald/30 text-brand-emerald bg-brand-emerald/5"
                                : "border-brand-amber/30 text-brand-amber bg-brand-amber/10 font-bold"
                            }`}
                          >
                            Radar
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded border ${
                              veh.camera === "SECURE"
                                ? "border-brand-emerald/30 text-brand-emerald bg-brand-emerald/5"
                                : "border-brand-rose/30 text-brand-rose bg-brand-rose/10 font-bold"
                            }`}
                          >
                            Cam
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenSpeedModal(veh)}
                            className="px-2.5 py-1 rounded bg-[var(--panel-header-bg)] hover:bg-brand-cyan/15 hover:text-brand-cyan border border-panel-border text-[11px] font-semibold transition-colors flex items-center gap-1"
                            title={language === "ko" ? "속도 제한 제어기" : "Speed Limit Governor"}
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>{veh.speedLimit}km/h</span>
                          </button>
                          <button
                            onClick={() => handleSelectVehicle(veh)}
                            className="p-1.5 rounded text-[var(--muted-text)] hover:text-brand-cyan hover:bg-brand-cyan/10 border border-panel-border transition-colors"
                            title={language === "ko" ? "상세 텔레메트리 (Drawer)" : "Inspect Telematics"}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredFleet.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-xs text-[var(--muted-text)]">
                      {language === "ko" ? "검색 조건에 해당하는 차량이 없습니다." : "No fleet vehicles match search criteria."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredFleet.map((veh) => {
            const isCrit = veh.status === "critical" || panicMode;
            const isWarn = veh.status === "warning" && !panicMode;
            const isSelected = selectedVehicle?.id === veh.id;

            return (
              <div
                key={veh.id}
                onClick={() => handleSelectVehicle(veh)}
                className={`cyber-panel p-4 rounded-lg cursor-pointer transition-all hover:translate-y-[-2px] relative flex flex-col justify-between border ${
                  isSelected
                    ? "border-brand-cyan bg-brand-cyan/10 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    : isCrit
                    ? "border-brand-rose/50 bg-brand-rose/5"
                    : isWarn
                    ? "border-brand-amber/50 bg-brand-amber/5"
                    : "border-panel-border bg-[var(--panel-bg)] hover:bg-[var(--panel-header-bg)]"
                }`}
              >
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase">
                      {getTypeLabel(veh.type)}
                    </span>
                    <h3 className="text-base font-bold text-[var(--foreground)] mt-0.5">{veh.id}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                      isCrit
                        ? "text-brand-rose bg-brand-rose/10 border-brand-rose/30 animate-pulse"
                        : isWarn
                        ? "text-brand-amber bg-brand-amber/10 border-brand-amber/30"
                        : "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30"
                    }`}
                  >
                    {isCrit ? t("incidents.active_stat") : isWarn ? (language === "ko" ? "주의" : "WARN") : t("fleet.sensors_ok")}
                  </span>
                </div>

                {/* Progress bar battery */}
                <div className="my-3 space-y-1">
                  <div className="flex justify-between text-[10px] text-[var(--muted-text)]">
                    <span className="flex items-center gap-1 font-medium">
                      <Battery className={`w-3.5 h-3.5 ${veh.battery < 20 ? "text-brand-rose" : "text-[var(--muted-text)]"}`} />
                      {language === "ko" ? "배터리" : "BATTERY"}
                    </span>
                    <span className="font-bold text-[var(--foreground)] tabular-nums">{veh.battery}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        veh.battery < 20 ? "bg-brand-rose" : veh.battery < 50 ? "bg-brand-amber" : "bg-brand-emerald"
                      }`}
                      style={{ width: `${veh.battery}%` }}
                    ></div>
                  </div>
                </div>

                {/* Location & Speed */}
                <div className="flex justify-between items-center text-[10px] text-[var(--muted-text)] border-t border-panel-border pt-2.5 mt-2.5">
                  <span className="truncate max-w-[120px] font-medium text-[var(--foreground)]">
                    {getLocationLabel(veh.location)}
                  </span>
                  <span className="flex items-center gap-1 font-mono font-bold text-[var(--foreground)] shrink-0">
                    <Gauge className="w-3 h-3 text-[var(--muted-text)]" />
                    <span>{isCrit ? 0 : veh.speed} / {veh.speedLimit} km/h</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TELEMETRY & DIAGNOSTICS SLIDE-OVER DRAWER                              */}
      {/* ========================================================================= */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setSelectedVehicle(null)}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-lg bg-[var(--panel-bg)] border-l border-panel-border h-full shadow-2xl z-10 flex flex-col animate-slide-left">
            {/* Drawer Header */}
            <div className="p-4 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-brand-cyan font-bold bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20">
                    {selectedVehicle.id}
                  </span>
                  <span className="text-[10px] text-[var(--muted-text)]">
                    {getTypeLabel(selectedVehicle.type)}
                  </span>
                </div>
                <h2 className="text-base font-bold text-[var(--foreground)] mt-1.5 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-brand-cyan" />
                  <span>{language === "ko" ? "실시간 텔레메트리 링크" : "Real-time Telematics Link"}</span>
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenSpeedModal(selectedVehicle)}
                  className="px-3 py-1.5 rounded bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan hover:text-white dark:hover:text-black text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{language === "ko" ? "속도 제어" : "Speed"}</span>
                </button>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="p-1.5 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--panel-header-bg)] border border-panel-border transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 scrollbar-thin">
              {/* Key Indicators Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
                  <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "배터리 잔량" : "Battery"}</span>
                  <span className="font-bold text-[var(--foreground)] mt-0.5 block tabular-nums">{selectedVehicle.battery}%</span>
                </div>
                <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
                  <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "현재 주행속도" : "Current Speed"}</span>
                  <span className="font-bold text-brand-cyan mt-0.5 block tabular-nums">{selectedVehicle.speed} km/h</span>
                </div>
                <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
                  <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "인가 속도 제한" : "Speed Governor"}</span>
                  <span className="font-bold text-brand-amber mt-0.5 block tabular-nums">{selectedVehicle.speedLimit} km/h</span>
                </div>
              </div>

              {/* Sensor Stack Diagnostics */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-cyan" />
                  <span>{language === "ko" ? "센서 스택 자가진단 (Sensor Diagnostics)" : "Sensor Stack Diagnostics"}</span>
                </span>

                <div className="space-y-2">
                  {/* LiDAR */}
                  <div className="flex justify-between items-center bg-[var(--panel-header-bg)] p-2.5 rounded border border-panel-border text-xs">
                    <div>
                      <span className="font-bold text-[var(--foreground)] block">{language === "ko" ? "LiDAR 어레이 센서" : "LiDAR Arrays"}</span>
                      <span className="text-[10px] text-[var(--muted-text)]">Solid-State 128ch Pulse Return</span>
                    </div>
                    <span
                      className={`font-bold text-[10px] px-2 py-0.5 rounded border ${
                        selectedVehicle.lidar === "SECURE"
                          ? "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30"
                          : "text-brand-rose bg-brand-rose/10 border-brand-rose/30 animate-pulse"
                      }`}
                    >
                      {selectedVehicle.lidar === "SECURE" ? t("fleet.sensors_ok") : t("fleet.sensors_deg")}
                    </span>
                  </div>

                  {/* RADAR */}
                  <div className="flex justify-between items-center bg-[var(--panel-header-bg)] p-2.5 rounded border border-panel-border text-xs">
                    <div>
                      <span className="font-bold text-[var(--foreground)] block">{language === "ko" ? "Radar 송수신 레이더" : "Radar Ingress"}</span>
                      <span className="text-[10px] text-[var(--muted-text)]">77GHz Millimeter Wave Scanner</span>
                    </div>
                    <span
                      className={`font-bold text-[10px] px-2 py-0.5 rounded border ${
                        selectedVehicle.radar === "SECURE"
                          ? "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30"
                          : "text-brand-amber bg-brand-amber/10 border-brand-amber/30"
                      }`}
                    >
                      {selectedVehicle.radar === "SECURE" ? t("fleet.sensors_ok") : t("fleet.sensors_deg")}
                    </span>
                  </div>

                  {/* CAMERA */}
                  <div className="flex justify-between items-center bg-[var(--panel-header-bg)] p-2.5 rounded border border-panel-border text-xs">
                    <div>
                      <span className="font-bold text-[var(--foreground)] block">{language === "ko" ? "카메라 서라운드 비전" : "Surround Cameras"}</span>
                      <span className="text-[10px] text-[var(--muted-text)]">8x HD Autonomous Vision Rig</span>
                    </div>
                    <span
                      className={`font-bold text-[10px] px-2 py-0.5 rounded border ${
                        selectedVehicle.camera === "SECURE"
                          ? "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30"
                          : "text-brand-rose bg-brand-rose/10 border-brand-rose/30"
                      }`}
                    >
                      {selectedVehicle.camera === "SECURE" ? t("fleet.sensors_ok") : t("fleet.sensors_off")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assigned Deployment Zone Dropdown */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-cyan" />
                  <span>{language === "ko" ? "할당된 배치 권역 (Zone)" : "Assigned Deployment Zone"}</span>
                </span>
                <select
                  value={selectedVehicle.location}
                  onChange={(e) => handleLocationChange(selectedVehicle.id, e.target.value)}
                  className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md p-2 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none cursor-pointer font-medium"
                >
                  <option value="Gangnam Station">강남역 (Zone A)</option>
                  <option value="Gangnam 3rd Ave">강남 3대로 (Zone B)</option>
                  <option value="Teheran-ro Street">테헤란로 (Zone C)</option>
                  <option value="Yeoksam Subway">역삼역 (Zone D)</option>
                  <option value="Samseong Center">삼성 센터 (Zone E)</option>
                  <option value="Pangyo Blvd">판교대로 (판교 지역)</option>
                  <option value="Pangyo Valley Depot">판교 밸리 기지 (정비고)</option>
                  <option value="Hangar Standby">정비고 대기 (유지보수)</option>
                </select>
              </div>

              {/* V2X Latency Sparkline */}
              <div className="bg-[var(--panel-header-bg)] border border-panel-border rounded-lg p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>{language === "ko" ? "V2X 무선 통신 지연 시간 (최근 5분)" : "V2X Latency (Last 5 Mins)"}</span>
                  </span>
                  <span className="text-brand-cyan font-bold tabular-nums">평균 14.1ms</span>
                </div>
                <div className="h-14 w-full flex items-end pt-1">
                  <svg className="w-full h-full text-zinc-300 dark:text-zinc-800" viewBox="0 0 160 40" preserveAspectRatio="none">
                    <path
                      d="M0,20 L20,18 L40,25 L60,12 L80,15 L100,32 L120,10 L140,15 L160,18"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="2"
                    />
                    <circle cx="160" cy="18" r="3.5" fill="#0284c7" />
                  </svg>
                </div>
              </div>

              {/* Firmware Info */}
              <div className="flex justify-between items-center text-xs p-3 bg-[var(--panel-header-bg)] rounded-md border border-panel-border">
                <span className="text-[var(--muted-text)] font-medium">{language === "ko" ? "현재 펌웨어 버전" : "Firmware Version"}</span>
                <span className="font-mono font-bold text-[var(--foreground)]">{selectedVehicle.ota}</span>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-center">
              <button
                onClick={() => handleDecommission(selectedVehicle.id)}
                className="px-3 py-1.5 rounded border border-panel-border text-[var(--muted-text)] hover:text-brand-rose hover:bg-brand-rose/10 hover:border-brand-rose text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === "ko" ? "차량 폐기" : "Decommission"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(language === "ko" ? `${selectedVehicle.id}에 대한 강제 OTA 업데이트 신호를 전송했습니다.` : `Dispatched OTA signal for ${selectedVehicle.id}`)}
                  className="px-3 py-1.5 rounded border border-panel-border bg-[var(--panel-bg)] hover:bg-[var(--panel-header-bg)] text-[var(--foreground)] text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>FORCE OTA</span>
                </button>
                <button
                  onClick={() => handleOpenSpeedModal(selectedVehicle)}
                  className="px-4 py-1.5 rounded bg-brand-cyan hover:opacity-90 text-white dark:text-black text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{language === "ko" ? "속도 제한 설정" : "Set Speed"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SPEED GOVERNOR OVERRIDE MODAL                                          */}
      {/* ========================================================================= */}
      {isSpeedModalOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsSpeedModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-[var(--panel-bg)] border border-panel-border rounded-xl shadow-2xl z-10 flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-4 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-brand-cyan" />
                <div>
                  <h2 className="text-base font-bold text-[var(--foreground)]">
                    {selectedVehicle.id} {language === "ko" ? "최대 속도 제어기 (Governor)" : "Speed Limit Governor"}
                  </h2>
                  <span className="text-[11px] text-[var(--muted-text)]">
                    {getTypeLabel(selectedVehicle.type)} &bull; {getLocationLabel(selectedVehicle.location)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsSpeedModalOpen(false)}
                className="p-1 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 text-xs">
              {/* Speed Comparison Strip */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[var(--panel-header-bg)] border border-panel-border">
                  <span className="text-[10px] text-[var(--muted-text)] uppercase font-bold block">{language === "ko" ? "현재 인가 속도" : "Current Limit"}</span>
                  <span className="text-xl font-bold font-mono text-[var(--foreground)] mt-1 block">{selectedVehicle.speedLimit} km/h</span>
                </div>
                <div className="p-3 rounded-lg bg-brand-cyan/10 border border-brand-cyan/40">
                  <span className="text-[10px] text-brand-cyan uppercase font-bold block">{language === "ko" ? "새로운 목표 제한 속도" : "Target Limit"}</span>
                  <span className="text-xl font-bold font-mono text-brand-cyan mt-1 block">{pendingSpeedLimit} km/h</span>
                </div>
              </div>

              {/* Slider Control */}
              <div className="space-y-3 bg-[var(--panel-header-bg)] p-4 rounded-lg border border-panel-border">
                <div className="flex justify-between items-center text-xs font-bold text-[var(--foreground)]">
                  <span>{language === "ko" ? "목표 제한 속도 조절" : "Adjust Speed Limit"}</span>
                  <span className="font-mono text-brand-cyan text-sm">{pendingSpeedLimit} km/h</span>
                </div>

                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={pendingSpeedLimit}
                  onChange={(e) => setPendingSpeedLimit(parseInt(e.target.value))}
                  className="w-full accent-brand-cyan cursor-pointer"
                />

                {/* Quick Preset Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase">{language === "ko" ? "빠른 프리셋:" : "Presets:"}</span>
                  <div className="flex gap-1.5">
                    {[30, 50, 60, 80].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setPendingSpeedLimit(preset)}
                        className={`px-3 py-1 rounded text-xs border transition-all cursor-pointer font-bold ${
                          pendingSpeedLimit === preset
                            ? "border-brand-cyan text-brand-cyan bg-brand-cyan/15 shadow-xs"
                            : "border-panel-border text-[var(--muted-text)] hover:text-[var(--foreground)] bg-[var(--panel-bg)]"
                        }`}
                      >
                        {preset}km/h
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Safety Warning Box */}
              <div className="p-3 rounded-lg bg-brand-amber/10 border border-brand-amber/30 flex items-start gap-2.5 text-xs text-brand-amber">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {language === "ko"
                    ? "주의: 변경된 속도 제한은 V2X 보안 무선 링크를 통해 차량의 전자 제어 장치(ECU)에 즉시 하달되며 자율주행 경로 플래너에 강제 반영됩니다."
                    : "Caution: The new speed governor is securely dispatched to the vehicle ECU via V2X and immediately restricts path planning algorithms."}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-panel-border bg-[var(--panel-header-bg)] flex justify-end gap-2">
              <button
                onClick={() => setIsSpeedModalOpen(false)}
                className="px-4 py-2 rounded-md border border-panel-border bg-[var(--panel-bg)] hover:bg-[var(--panel-header-bg)] text-[var(--foreground)] text-xs font-semibold transition-colors"
              >
                {t("policies.cancel")}
              </button>
              <button
                onClick={handleApplySpeedLimit}
                disabled={isApplyingSpeed}
                className="px-5 py-2 rounded-md bg-brand-cyan hover:opacity-90 text-white dark:text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {isApplyingSpeed ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5px]" />
                )}
                <span>{language === "ko" ? "ECU 동기화 및 즉시 적용" : "Apply & Sync ECU"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

