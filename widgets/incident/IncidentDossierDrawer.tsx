import React, { useState } from "react";
import {
  AlertTriangle,
  Car,
  X,
  Terminal,
  MessageSquare,
  Send,
  ShieldAlert,
  Sliders,
  Check
} from "lucide-react";
import { Incident, IncidentStatus, IncidentNote, CanBusDumpFrame } from "@/entities/incident/model/types";
import { useLanguage } from "@/app/components/LanguageContext";

interface IncidentDossierDrawerProps {
  incident: Incident | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: IncidentStatus) => void;
}

export function IncidentDossierDrawer({
  incident,
  onClose,
  onUpdateStatus
}: IncidentDossierDrawerProps) {
  const { t, language } = useLanguage();
  const [notes, setNotes] = useState<string>("");
  const [notesHistory, setNotesHistory] = useState<Record<string, IncidentNote[]>>({
    "INC-2026-9812": [
      {
        operator: "Alex S. (Lead Dispatcher)",
        text: "OB-CAN monitor checked. Injection suspected from telematics box. Initiating CAN tap.",
        time: "1 min ago"
      }
    ],
    "INC-2026-9811": [
      {
        operator: "Min-woo K. (Analyst)",
        text: "LiDAR optical feedback checked. Diagnostics indicate obstruction. Instructing vehicle to auto-wipe sensor cover.",
        time: "3 min ago"
      }
    ]
  });

  if (!incident) return null;

  const getMockCanBusDump = (vehicleId: string): CanBusDumpFrame[] => {
    return [
      {
        id: "0x120",
        dlc: 8,
        data: "0F 00 22 C0 FF A2 03 EC",
        desc: language === "ko" ? `${vehicleId} 스티어링 각도 센서 (정상)` : `${vehicleId} Steering Angle Sensor (Valid)`
      },
      {
        id: "0x13A",
        dlc: 8,
        data: "22 4A 10 00 A2 EE 12 00",
        desc: language === "ko" ? "휠 회전 속도 텔레메트리" : "Wheel Speed Telemetry"
      },
      {
        id: "0x0A2",
        dlc: 4,
        data: "FF FF FF FF",
        desc: language === "ko" ? "임계: 브레이크 액추에이터 오버라이드 인젝션" : "CRITICAL: Brakes Actuator Override Injection",
        suspect: true
      },
      {
        id: "0x2C4",
        dlc: 8,
        data: "00 00 00 00 00 00 00 00",
        desc: language === "ko" ? "기어 위치 텔레메트리 (Null)" : "Gear Position Telemetry (Null)"
      }
    ];
  };

  const handleSaveNote = () => {
    if (!notes.trim()) return;
    const newNote: IncidentNote = {
      operator: "Alex S. (SOC Operator)",
      text: notes.trim(),
      time: "Just now"
    };
    setNotesHistory((prev) => ({
      ...prev,
      [incident.id]: [newNote, ...(prev[incident.id] || [])]
    }));
    setNotes("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-xl bg-[var(--panel-bg)] border-l border-panel-border h-full shadow-2xl z-10 flex flex-col animate-slide-left">
        {/* Drawer Header */}
        <div className="p-4 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-brand-rose font-bold bg-brand-rose/10 px-2 py-0.5 rounded border border-brand-rose/20">
                {incident.id}
              </span>
              <span className="text-[10px] font-mono font-bold text-brand-cyan flex items-center gap-1">
                <Car className="w-3 h-3" />
                {incident.vehicleId}
              </span>
              <span className="text-[10px] text-[var(--muted-text)] font-mono">
                {incident.timestamp}
              </span>
            </div>
            <h2 className="text-base font-bold text-[var(--foreground)] mt-1.5 flex items-center gap-2">
              <AlertTriangle
                className={`w-4 h-4 ${
                  incident.severity === "CRITICAL" ? "text-brand-rose animate-pulse" : "text-brand-amber"
                }`}
              />
              <span>{incident.type}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--panel-header-bg)] border border-panel-border transition-colors cursor-pointer"
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
              <span className="text-[9px] text-[var(--muted-text)] uppercase block">
                {language === "ko" ? "위협 심각도" : "Severity"}
              </span>
              <span
                className={`font-bold mt-0.5 block ${
                  incident.severity === "CRITICAL" ? "text-brand-rose" : "text-brand-amber"
                }`}
              >
                {incident.severity}
              </span>
            </div>
            <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
              <span className="text-[9px] text-[var(--muted-text)] uppercase block">
                {language === "ko" ? "현재 조치 상태" : "Triage State"}
              </span>
              <span className="font-bold text-[var(--foreground)] mt-0.5 block">{incident.status}</span>
            </div>
            <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
              <span className="text-[9px] text-[var(--muted-text)] uppercase block">
                {language === "ko" ? "영향받는 SDV" : "Target Vehicle"}
              </span>
              <span className="font-bold text-brand-cyan mt-0.5 block font-mono">{incident.vehicleId}</span>
            </div>
            <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
              <span className="text-[9px] text-[var(--muted-text)] uppercase block">
                {language === "ko" ? "초기 탐지" : "First Seen"}
              </span>
              <span className="font-bold text-[var(--foreground)] mt-0.5 block font-mono">
                {incident.timestamp}
              </span>
            </div>
          </div>

          {/* Description Box */}
          <div className="bg-[var(--panel-header-bg)] p-3.5 rounded-lg border border-panel-border space-y-1">
            <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase tracking-wider block">
              {language === "ko" ? "인시던트 상세 분석 보고" : "Detailed Telematics Synopsis"}
            </span>
            <p className="text-xs text-[var(--foreground)] leading-relaxed font-mono">
              {incident.description}
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
              {getMockCanBusDump(incident.vehicleId).map((frame, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border ${
                    frame.suspect
                      ? "bg-brand-rose/10 border-brand-rose/40 text-brand-rose shadow-xs"
                      : "border-panel-border/40 text-[var(--muted-text)]"
                  }`}
                >
                  <div className="flex justify-between font-bold text-xs">
                    <span>
                      {frame.id} (DLC: {frame.dlc})
                    </span>
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
                  onClick={handleSaveNote}
                  className="px-4 py-1.5 bg-[var(--panel-header-bg)] border border-panel-border hover:border-brand-cyan text-[var(--foreground)] text-xs font-bold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>{t("incidents.notes_save")}</span>
                </button>
              </div>
            </div>

            {/* Notes History list */}
            {notesHistory[incident.id] && notesHistory[incident.id].length > 0 && (
              <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1 scrollbar-thin">
                {notesHistory[incident.id].map((note, index) => (
                  <div
                    key={index}
                    className="bg-[var(--panel-header-bg)] border border-panel-border p-2.5 rounded-md text-[11px] font-mono text-[var(--foreground)]"
                  >
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
                  V2X encrypted killswitch for {incident.vehicleId}
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                alert(
                  `CRITICAL EMERGENCY SIGNAL BROADCAST TO ${incident.vehicleId}: FORCING EMERGENCY STOP.`
                )
              }
              className="px-3 py-1.5 bg-brand-rose hover:opacity-90 text-white font-bold text-xs rounded transition-opacity shrink-0 cursor-pointer"
            >
              {language === "ko" ? "비상 정지" : "EMERGENCY STOP"}
            </button>
          </div>

          {/* Status Triage Controls */}
          <div className="flex justify-between items-center pt-1">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-panel-border bg-[var(--panel-bg)] hover:bg-[var(--panel-header-bg)] text-[var(--foreground)] text-xs font-semibold transition-colors cursor-pointer"
            >
              {language === "ko" ? "닫기 (Esc)" : "Close (Esc)"}
            </button>

            <div className="flex items-center gap-2">
              {incident.status === "ACTIVE" && (
                <button
                  onClick={() => onUpdateStatus(incident.id, "TRIAGED")}
                  className="px-4 py-2 rounded-md bg-brand-amber/15 border border-brand-amber/40 text-brand-amber hover:bg-brand-amber hover:text-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{language === "ko" ? "조사 중으로 변경" : "Mark Triaged"}</span>
                </button>
              )}

              {incident.status !== "RESOLVED" && (
                <button
                  onClick={() => onUpdateStatus(incident.id, "RESOLVED")}
                  className="px-4 py-2 rounded-md bg-brand-emerald hover:opacity-90 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
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
  );
}
