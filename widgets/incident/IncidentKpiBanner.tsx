import React from "react";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/app/components/LanguageContext";

interface IncidentKpiBannerProps {
  totalCount: number;
  criticalCount: number;
  activeCount: number;
  resolvedCount: number;
}

export function IncidentKpiBanner({
  totalCount,
  criticalCount,
  activeCount,
  resolvedCount
}: IncidentKpiBannerProps) {
  const { language } = useLanguage();

  return (
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
          <span className="text-[9px] text-[var(--muted-text)] uppercase block">
            {language === "ko" ? "총 감지" : "Total"}
          </span>
          <span className="text-[var(--foreground)] font-bold tabular-nums">{totalCount}건</span>
        </div>
        <div className="w-[1px] h-6 bg-panel-border" />
        <div>
          <span className="text-[9px] text-[var(--muted-text)] uppercase block">
            {language === "ko" ? "미조치 긴급" : "Critical"}
          </span>
          <span
            className={`${
              criticalCount > 0 ? "text-brand-rose animate-pulse" : "text-brand-emerald"
            } font-bold tabular-nums`}
          >
            {criticalCount}건
          </span>
        </div>
        <div className="w-[1px] h-6 bg-panel-border" />
        <div>
          <span className="text-[9px] text-[var(--muted-text)] uppercase block">
            {language === "ko" ? "조사 중" : "Active"}
          </span>
          <span className="text-brand-amber font-bold tabular-nums">{activeCount}건</span>
        </div>
        <div className="w-[1px] h-6 bg-panel-border" />
        <div>
          <span className="text-[9px] text-[var(--muted-text)] uppercase block">
            {language === "ko" ? "해결 완료" : "Resolved"}
          </span>
          <span className="text-brand-emerald font-bold tabular-nums">{resolvedCount}건</span>
        </div>
      </div>
    </div>
  );
}
