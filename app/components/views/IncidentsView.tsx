"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Search,
  Check,
  Terminal,
  ShieldAlert,
  Sliders,
  ChevronRight,
  X,
  Car,
  MessageSquare,
  Send
} from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface Incident {
  id: string;
  vehicleId: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
  status: "ACTIVE" | "TRIAGED" | "RESOLVED";
  timestamp: string;
  description: string;
}

interface IncidentsViewProps {
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
  selectedIncidentFromDashboard: Incident | null;
  clearSelectedIncidentFromDashboard: () => void;
  panicMode: boolean;
}

export default function IncidentsView({
  incidents,
  setIncidents,
  selectedIncidentFromDashboard,
  clearSelectedIncidentFromDashboard,
  panicMode
}: IncidentsViewProps) {
  const { t, language } = useLanguage();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [notesHistory, setNotesHistory] = useState<Record<string, { operator: string; text: string; time: string }[]>>({
    "INC-2026-9812": [
      { operator: "Alex S. (Lead Dispatcher)", text: "OB-CAN monitor checked. Injection suspected from telematics box. Initiating CAN tap.", time: "1 min ago" }
    ],
    "INC-2026-9811": [
      { operator: "Min-woo K. (Analyst)", text: "LiDAR optical feedback checked. Diagnostics indicate obstruction. Instructing vehicle to auto-wipe sensor cover.", time: "3 min ago" }
    ]
  });

  // Sync with incident selected from Dashboard
  useEffect(() => {
    if (selectedIncidentFromDashboard) {
      queueMicrotask(() => {
        setSelectedIncident(selectedIncidentFromDashboard);
        clearSelectedIncidentFromDashboard();
      });
    }
  }, [selectedIncidentFromDashboard, clearSelectedIncidentFromDashboard]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedIncident) {
        setSelectedIncident(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIncident]);

  const handleUpdateStatus = (id: string, newStatus: "ACTIVE" | "TRIAGED" | "RESOLVED") => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Filter logic
  const filteredIncidents = incidents.filter(inc => {
    const matchesSeverity = severityFilter === "ALL" || inc.severity === severityFilter;
    const matchesStatus = statusFilter === "ALL" || inc.status === statusFilter;
    const matchesSearch =
      inc.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  // KPI Metrics
  const totalCount = incidents.length;
  const criticalCount = incidents.filter(i => (i.severity === "CRITICAL" || panicMode) && i.status !== "RESOLVED").length;
  const activeCount = incidents.filter(i => i.status === "ACTIVE").length;
  const resolvedCount = incidents.filter(i => i.status === "RESOLVED").length;

  // Mock CAN Bus dump for details
  const getMockCanBusDump = (vehicleId: string) => {
    return [
      { id: "0x120", dlc: 8, data: "0F 00 22 C0 FF A2 03 EC", desc: language === "ko" ? `${vehicleId} 스티어링 각도 센서 (정상)` : `${vehicleId} Steering Angle Sensor (Valid)` },
      { id: "0x13A", dlc: 8, data: "22 4A 10 00 A2 EE 12 00", desc: language === "ko" ? "휠 회전 속도 텔레메트리" : "Wheel Speed Telemetry" },
      { id: "0x0A2", dlc: 4, data: "FF FF FF FF", desc: language === "ko" ? "임계: 브레이크 액추에이터 오버라이드 인젝션" : "CRITICAL: Brakes Actuator Override Injection", suspect: true },
      { id: "0x2C4", dlc: 8, data: "00 00 00 00 00 00 00 00", desc: language === "ko" ? "기어 위치 텔레메트리 (Null)" : "Gear Position Telemetry (Null)" },
    ];
  };

  const getSeverityBadge = (severity: Incident["severity"]) => {
    switch (severity) {
      case "CRITICAL":
        return {
          label: language === "ko" ? "치명적 (CRITICAL)" : "CRITICAL",
          classes: "text-brand-rose bg-brand-rose/10 border-brand-rose/30"
        };
      case "HIGH":
        return {
          label: language === "ko" ? "높음 (HIGH)" : "HIGH",
          classes: "text-brand-amber bg-brand-amber/10 border-brand-amber/30"
        };
      case "MEDIUM":
        return {
          label: language === "ko" ? "중간 (MED)" : "MEDIUM",
          classes: "text-brand-cyan bg-brand-cyan/10 border-brand-cyan/30"
        };
      default:
        return {
          label: language === "ko" ? "정보 (INFO)" : "INFO",
          classes: "text-zinc-400 bg-zinc-500/10 border-panel-border"
        };
    }
  };

  return (
    <div className="space-y-4 animate-fade-in font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & INCIDENT METRICS BANNER                                    */}
      {/* ========================================================================= */}
      <div className="cyber-panel p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-brand-rose animate-pulse" />
            <span className="text-[11px] text-[var(--muted-text)] font-bold uppercase tracking-wider">
              {language === "ko" ? "차량 사이버 위협 탐지 센터" : "SDV CYBER THREAT & ANOMALY RESPONSE"}
            </span>
          </div>
          <h1 className="text-lg font-bold text-[var(--foreground)] mt-0.5">
            {language === "ko" ? "실시간 보안 인시던트 관제 (Security Incidents)" : "Security Incidents & Anomaly Response"}
          </h1>
          <p className="text-xs text-[var(--muted-text)] mt-1">
            {language === "ko"
              ? "차량 내부 CAN 버스 및 V2X 네트워크에서 감지된 이상 패킷과 보안 위협을 실시간 추적하고 조치합니다."
              : "Track, investigate, and triage CAN bus injection attacks, sensor dropouts, and anomalies across SDVs."}
          </p>
        </div>

        {/* Real-time Telemetry Stats Pill */}
        <div className="bg-[var(--panel-header-bg)] border border-panel-border px-3.5 py-2 rounded-md flex items-center gap-4 text-xs">
          <div>
            <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "총 감지" : "Total"}</span>
            <span className="text-[var(--foreground)] font-bold tabular-nums">{totalCount}건</span>
          </div>
          <div className="w-[1px] h-6 bg-panel-border"></div>
          <div>
            <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "미조치 긴급" : "Critical"}</span>
            <span className={`${criticalCount > 0 ? "text-brand-rose animate-pulse" : "text-brand-emerald"} font-bold tabular-nums`}>
              {criticalCount}건
            </span>
          </div>
          <div className="w-[1px] h-6 bg-panel-border"></div>
          <div>
            <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "조사 중" : "Active"}</span>
            <span className="text-brand-amber font-bold tabular-nums">{activeCount}건</span>
          </div>
          <div className="w-[1px] h-6 bg-panel-border"></div>
          <div>
            <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "해결 완료" : "Resolved"}</span>
            <span className="text-brand-emerald font-bold tabular-nums">{resolvedCount}건</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & DUAL-AXIS FILTERS TOOLBAR                                     */}
      {/* ========================================================================= */}
      <div className="cyber-panel p-3 rounded-lg flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[var(--muted-text)] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t("incidents.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md pl-9 pr-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-brand-cyan transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {/* Severity Filters */}
          <div className="flex gap-1">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "INFO"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1.5 rounded text-[11px] font-semibold whitespace-nowrap border transition-all ${
                  severityFilter === sev
                    ? "bg-brand-cyan/15 border-brand-cyan text-brand-cyan font-bold"
                    : "bg-[var(--panel-header-bg)] border-panel-border text-[var(--muted-text)] hover:text-[var(--foreground)]"
                }`}
              >
                {sev === "ALL" ? t("incidents.all") : t("incidents." + sev.toLowerCase() + "_sev")}
              </button>
            ))}
          </div>

          <div className="w-[1px] h-5 bg-panel-border"></div>

          {/* Status Filters */}
          <div className="flex gap-1">
            {["ALL", "ACTIVE", "TRIAGED", "RESOLVED"].map((stat) => (
              <button
                key={stat}
                onClick={() => setStatusFilter(stat)}
                className={`px-2.5 py-1.5 rounded text-[11px] font-semibold whitespace-nowrap border transition-all ${
                  statusFilter === stat
                    ? "bg-brand-cyan/15 border-brand-cyan text-brand-cyan font-bold"
                    : "bg-[var(--panel-header-bg)] border-panel-border text-[var(--muted-text)] hover:text-[var(--foreground)]"
                }`}
              >
                {stat === "ALL" ? "전체" : t("incidents." + stat.toLowerCase() + "_stat")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FULL-WIDTH ENTERPRISE INCIDENTS DATA TABLE                             */}
      {/* ========================================================================= */}
      <div className="cyber-panel rounded-lg overflow-hidden border border-panel-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-panel-border bg-[var(--panel-header-bg)] text-[11px] font-bold text-[var(--muted-text)] uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">ID</th>
                <th className="py-3 px-4">{language === "ko" ? "대상 차량" : "Vehicle"}</th>
                <th className="py-3 px-4">{language === "ko" ? "위협 유형 및 설명" : "Threat Class & Summary"}</th>
                <th className="py-3 px-4 text-center">{language === "ko" ? "심각도" : "Severity"}</th>
                <th className="py-3 px-4 text-center">{language === "ko" ? "상태" : "Status"}</th>
                <th className="py-3 px-4 text-right">{language === "ko" ? "감지 시각" : "Timestamp"}</th>
                <th className="py-3 px-4 text-right">{language === "ko" ? "조치 및 분석" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-panel-border text-[var(--foreground)]">
              {filteredIncidents.map((inc) => {
                const isSelected = selectedIncident?.id === inc.id;
                const isCrit = inc.severity === "CRITICAL" || panicMode;
                const badge = getSeverityBadge(inc.severity);

                return (
                  <tr
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className={`cursor-pointer transition-colors group ${
                      isSelected
                        ? "bg-brand-cyan/10 hover:bg-brand-cyan/15"
                        : "hover:bg-[var(--panel-header-bg)]"
                    }`}
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[11px] text-[var(--muted-text)] group-hover:text-brand-cyan">
                      {inc.id}
                    </td>

                    {/* Vehicle */}
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-[var(--foreground)]">
                      <div className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-brand-cyan" />
                        <span>{inc.vehicleId}</span>
                      </div>
                    </td>

                    {/* Threat Class & Summary */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          {isCrit && (
                            <span className="w-2 h-2 rounded-full bg-brand-rose animate-ping shrink-0"></span>
                          )}
                          <span className="font-bold text-sm text-[var(--foreground)] group-hover:text-brand-cyan transition-colors">
                            {inc.type}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--muted-text)] truncate max-w-md">
                          {inc.description}
                        </p>
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${badge.classes}`}>
                        {badge.label}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          inc.status === "ACTIVE"
                            ? "text-brand-rose bg-brand-rose/10 border-brand-rose/30"
                            : inc.status === "TRIAGED"
                            ? "text-brand-amber bg-brand-amber/10 border-brand-amber/30"
                            : "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            inc.status === "ACTIVE"
                              ? "bg-brand-rose animate-pulse"
                              : inc.status === "TRIAGED"
                              ? "bg-brand-amber"
                              : "bg-brand-emerald"
                          }`}
                        ></span>
                        {t("incidents." + inc.status.toLowerCase() + "_stat")}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-right font-mono text-xs tabular-nums text-[var(--muted-text)]">
                      {inc.timestamp}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {inc.status !== "RESOLVED" && (
                          <button
                            onClick={() => handleUpdateStatus(inc.id, "RESOLVED")}
                            className="p-1.5 rounded text-[var(--muted-text)] hover:text-brand-emerald hover:bg-brand-emerald/10 border border-panel-border transition-colors"
                            title={language === "ko" ? "해결 처리" : "Resolve"}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedIncident(inc)}
                          className="p-1.5 rounded text-[var(--muted-text)] hover:text-brand-cyan hover:bg-brand-cyan/10 border border-panel-border transition-colors"
                          title={language === "ko" ? "상세 조사 파일 (Drawer)" : "Open Dossier"}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredIncidents.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[var(--muted-text)]">
                    {language === "ko"
                      ? "검색 조건에 부합하는 활성 보안 인시던트가 없습니다."
                      : "No active security incidents match the filter criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. INCIDENT INVESTIGATION DOSSIER SLIDE-OVER DRAWER                       */}
      {/* ========================================================================= */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setSelectedIncident(null)}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-xl bg-[var(--panel-bg)] border-l border-panel-border h-full shadow-2xl z-10 flex flex-col animate-slide-left">
            {/* Drawer Header */}
            <div className="p-4 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-brand-rose font-bold bg-brand-rose/10 px-2 py-0.5 rounded border border-brand-rose/20">
                    {selectedIncident.id}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-brand-cyan flex items-center gap-1">
                    <Car className="w-3 h-3" />
                    {selectedIncident.vehicleId}
                  </span>
                  <span className="text-[10px] text-[var(--muted-text)] font-mono">
                    {selectedIncident.timestamp}
                  </span>
                </div>
                <h2 className="text-base font-bold text-[var(--foreground)] mt-1.5 flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${
                    selectedIncident.severity === "CRITICAL" ? "text-brand-rose animate-pulse" : "text-brand-amber"
                  }`} />
                  <span>{selectedIncident.type}</span>
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="p-1.5 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--panel-header-bg)] border border-panel-border transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 scrollbar-thin">
              {/* Threat Key Indicators Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
                  <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "위협 심각도" : "Severity"}</span>
                  <span className={`font-bold mt-0.5 block ${selectedIncident.severity === "CRITICAL" ? "text-brand-rose" : "text-brand-amber"}`}>
                    {selectedIncident.severity}
                  </span>
                </div>
                <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
                  <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "현재 조치 상태" : "Triage State"}</span>
                  <span className="font-bold text-[var(--foreground)] mt-0.5 block">{selectedIncident.status}</span>
                </div>
                <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
                  <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "영향받는 SDV" : "Target Vehicle"}</span>
                  <span className="font-bold text-brand-cyan mt-0.5 block font-mono">{selectedIncident.vehicleId}</span>
                </div>
                <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
                  <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "초기 탐지" : "First Seen"}</span>
                  <span className="font-bold text-[var(--foreground)] mt-0.5 block font-mono">{selectedIncident.timestamp}</span>
                </div>
              </div>

              {/* Description Box */}
              <div className="bg-[var(--panel-header-bg)] p-3.5 rounded-lg border border-panel-border space-y-1">
                <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase tracking-wider block">
                  {language === "ko" ? "인시던트 상세 분석 보고" : "Detailed Telematics Synopsis"}
                </span>
                <p className="text-xs text-[var(--foreground)] leading-relaxed font-mono">
                  {selectedIncident.description}
                </p>
              </div>

              {/* Raw OB-CAN Bus Ingress Frame */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-brand-cyan" />
                    <span>{language === "ko" ? "원시 OB-CAN 버스 수신 프레임 덤프" : "Raw OB-CAN Ingress Frame Dump"}</span>
                  </span>
                  <span className="text-[10px] text-brand-rose font-bold bg-brand-rose/10 border border-brand-rose/20 px-2 py-0.5 rounded animate-pulse">
                    ANOMALY PACKET DETECTED
                  </span>
                </div>

                <div className="p-3 bg-[var(--input-bg)] border border-panel-border rounded-lg space-y-2 font-mono text-[11px] max-h-[160px] overflow-y-auto scrollbar-thin">
                  {getMockCanBusDump(selectedIncident.vehicleId).map((frame, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded border ${
                        frame.suspect
                          ? "bg-brand-rose/10 border-brand-rose/40 text-brand-rose shadow-xs"
                          : "border-panel-border/40 text-[var(--muted-text)]"
                      }`}
                    >
                      <div className="flex justify-between font-bold text-xs">
                        <span>{frame.id} (DLC: {frame.dlc})</span>
                        <span className="text-[9px] font-normal uppercase">{frame.desc}</span>
                      </div>
                      <div className="text-xs tracking-widest font-bold mt-1 text-[var(--foreground)]">
                        {frame.data}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operator Notes Form & History */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-brand-cyan" />
                    <span>{t("incidents.notes_label")}</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("incidents.notes_placeholder")}
                    rows={2}
                    className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-brand-cyan resize-none font-mono"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (!notes.trim() || !selectedIncident) return;
                        const newNote = {
                          operator: "Alex S. (SOC Operator)",
                          text: notes,
                          time: "Just now"
                        };
                        setNotesHistory(prev => ({
                          ...prev,
                          [selectedIncident.id]: [newNote, ...(prev[selectedIncident.id] || [])]
                        }));
                        setNotes("");
                      }}
                      className="px-4 py-1.5 bg-[var(--panel-header-bg)] border border-panel-border hover:border-brand-cyan text-[var(--foreground)] text-xs font-bold rounded transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>{t("incidents.notes_save")}</span>
                    </button>
                  </div>
                </div>

                {/* Notes History list */}
                {notesHistory[selectedIncident.id] && notesHistory[selectedIncident.id].length > 0 && (
                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1 scrollbar-thin">
                    {notesHistory[selectedIncident.id].map((note, index) => (
                      <div key={index} className="bg-[var(--panel-header-bg)] border border-panel-border p-2.5 rounded-md text-[11px] font-mono text-[var(--foreground)]">
                        <div className="flex justify-between text-[9px] text-[var(--muted-text)] font-bold mb-0.5">
                          <span>{note.operator}</span>
                          <span>{note.time}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{note.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-panel-border bg-[var(--panel-header-bg)] space-y-2.5">
              {/* Emergency Stop Override Trigger */}
              <div className="border border-brand-rose/30 bg-brand-rose/5 rounded-lg p-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-brand-rose animate-pulse shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold text-[var(--foreground)] block">
                      {language === "ko" ? "페일세이프 비상 브레이크 전송" : "Fail-Safe Remote Emergency Brake"}
                    </span>
                    <span className="text-[10px] text-[var(--muted-text)]">
                      V2X encrypted killswitch for {selectedIncident.vehicleId}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => alert(`CRITICAL EMERGENCY SIGNAL BROADCAST TO ${selectedIncident.vehicleId}: FORCING EMERGENCY STOP.`)}
                  className="px-3 py-1.5 bg-brand-rose hover:opacity-90 text-white font-bold text-xs rounded transition-opacity shrink-0"
                >
                  {language === "ko" ? "비상 정지" : "EMERGENCY STOP"}
                </button>
              </div>

              {/* Status Triage Controls */}
              <div className="flex justify-between items-center pt-1">
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="px-4 py-2 rounded-md border border-panel-border bg-[var(--panel-bg)] hover:bg-[var(--panel-header-bg)] text-[var(--foreground)] text-xs font-semibold transition-colors"
                >
                  {language === "ko" ? "닫기 (Esc)" : "Close (Esc)"}
                </button>

                <div className="flex items-center gap-2">
                  {selectedIncident.status === "ACTIVE" && (
                    <button
                      onClick={() => handleUpdateStatus(selectedIncident.id, "TRIAGED")}
                      className="px-4 py-2 rounded-md bg-brand-amber/15 border border-brand-amber/40 text-brand-amber hover:bg-brand-amber hover:text-black text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{language === "ko" ? "조사 중으로 변경" : "Mark Triaged"}</span>
                    </button>
                  )}

                  {selectedIncident.status !== "RESOLVED" && (
                    <button
                      onClick={() => handleUpdateStatus(selectedIncident.id, "RESOLVED")}
                      className="px-4 py-2 rounded-md bg-brand-emerald hover:opacity-90 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5px]" />
                      <span>{language === "ko" ? "인시던트 해결" : "Resolve Incident"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

