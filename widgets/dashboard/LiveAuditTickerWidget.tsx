"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/app/components/LanguageContext";

interface LiveAuditTickerWidgetProps {
  panicMode: boolean;
  onNavigateToTab: (tab: string) => void;
}

export const LiveAuditTickerWidget: React.FC<LiveAuditTickerWidgetProps> = ({
  panicMode,
  onNavigateToTab,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="cyber-panel rounded flex flex-col min-h-[220px]">
      <div className="p-3 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-center">
        <span className="text-xs font-bold text-[var(--foreground)] tracking-widest uppercase">
          {t("dashboard.live_audit")}
        </span>
        <button
          onClick={() => onNavigateToTab("audit")}
          className="text-[9px] text-zinc-500 hover:text-[var(--foreground)] flex items-center gap-1 font-bold"
        >
          {t("dashboard.explore_logs")} <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 p-4 font-mono text-[9px] text-zinc-400 space-y-2 max-h-[180px] overflow-y-auto">
        <div className="flex gap-2 text-zinc-500">
          <span>[22:58:14]</span>
          <span className="text-brand-emerald">INFO</span>
          <span className="text-zinc-300">
            {language === "ko"
              ? "RBAC: 디스패처 Alex S.가 IP 10.42.9.11에서 로그인함"
              : "RBAC: Dispatcher Alex S. logged in from IP 10.42.9.11"}
          </span>
        </div>
        <div className="flex gap-2 text-zinc-500">
          <span>[22:57:42]</span>
          <span className="text-brand-cyan">SYS</span>
          <span className="text-zinc-300">
            {language === "ko"
              ? "OTA: seoul-sub-04에 대해 데이터 수집 텔레메트리가 암호 서명됨"
              : "OTA: Ingress telemetry signed cryptographically for seoul-sub-04"}
          </span>
        </div>
        <div className="flex gap-2 text-zinc-500">
          <span>[22:56:01]</span>
          <span className="text-brand-amber">WARN</span>
          <span className="text-brand-amber">
            {language === "ko"
              ? "이상 현상: 센서 포트 LIDAR_3(VEH-42-012)에서 높은 지터율 탐지됨"
              : "ANOMALY: High jitter rate detected on sensor port LIDAR_3 (VEH-42-012)"}
          </span>
        </div>
        <div className="flex gap-2 text-zinc-500">
          <span>[22:54:19]</span>
          <span className="text-zinc-500">DEBUG</span>
          <span className="text-zinc-400">
            {language === "ko"
              ? "하트비트 확인: DB 클러스터 동기화 완료 (지연 시간: 1.2ms)"
              : "Heartbeat confirmation: DB cluster synchronised (latency: 1.2ms)"}
          </span>
        </div>
        {panicMode && (
          <div className="flex gap-2 text-brand-rose animate-pulse font-bold">
            <span>[{language === "ko" ? "시스템 이벤트" : "SYSTEM EVENT"}]</span>
            <span>{language === "ko" ? "오버라이드" : "OVERRIDE"}</span>
            <span>
              {language === "ko"
                ? "안전 장치 작동: 148대 차량에 비상 정지 신호 브로드캐스트됨."
                : "FAILSAFE TRIGGERED: Broadcast Emergency Stop signal sent to 148 vehicles."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
