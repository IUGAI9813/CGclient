import React from "react";
import { ShieldCheck, Plus } from "lucide-react";
import { useLanguage } from "@/app/components/LanguageContext";

interface PolicyKpiBannerProps {
  activeCount: number;
  totalPolicies: number;
  totalDistrictsCovered: number;
  totalFleetBound: number;
  totalFleetCount: number;
  onNewPolicyClick: () => void;
}

export function PolicyKpiBanner({
  activeCount,
  totalPolicies,
  totalDistrictsCovered,
  totalFleetBound,
  totalFleetCount,
  onNewPolicyClick
}: PolicyKpiBannerProps) {
  const { language } = useLanguage();

  return (
    <div className="cyber-panel p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-sans">
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-cyan" />
          <span className="text-[11px] text-[var(--muted-text)] font-bold uppercase tracking-wider">
            {language === "ko" ? "자율주행 안전 관제 엔진" : "AUTONOMOUS FLEET GEOFENCE & SAFETY RULES"}
          </span>
        </div>
        <h1 className="text-lg font-bold text-[var(--foreground)] mt-0.5">
          {language === "ko"
            ? "보안 정책 및 지오존 관제 (Security Policies)"
            : "Security Policies & Administrative Geozones"}
        </h1>
        <p className="text-xs text-[var(--muted-text)] mt-1">
          {language === "ko"
            ? "행정구역 데이터베이스(TB_ADMIN_REGIONS)와 연동되어 구/군 단위 안전 정책(TB_SECURITY_POLICIES)을 원격 배포합니다."
            : "Synchronized with TB_ADMIN_REGIONS to configure and dispatch administrative safety rules & speed governors to edge vehicles."}
        </p>
      </div>

      {/* Telemetry Stats Pill & Add Button */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        <div className="bg-[var(--panel-header-bg)] border border-panel-border px-3.5 py-2 rounded-md flex items-center gap-4 text-xs">
          <div>
            <span className="text-[9px] text-[var(--muted-text)] uppercase block">
              {language === "ko" ? "활성 정책" : "Active"}
            </span>
            <span className="text-[var(--foreground)] font-bold tabular-nums">
              {activeCount} / {totalPolicies}
            </span>
          </div>
          <div className="w-[1px] h-6 bg-panel-border" />
          <div>
            <span className="text-[9px] text-[var(--muted-text)] uppercase block">
              {language === "ko" ? "보호 구역" : "Districts"}
            </span>
            <span className="text-brand-cyan font-bold tabular-nums">
              {totalDistrictsCovered} {language === "ko" ? "개소" : "districts"}
            </span>
          </div>
          <div className="w-[1px] h-6 bg-panel-border" />
          <div>
            <span className="text-[9px] text-[var(--muted-text)] uppercase block">
              {language === "ko" ? "연계 플릿" : "Bound Fleet"}
            </span>
            <span className="text-brand-emerald font-bold tabular-nums">
              {totalFleetBound} / {totalFleetCount}
            </span>
          </div>
        </div>

        <button
          onClick={onNewPolicyClick}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-cyan hover:opacity-90 text-white dark:text-black rounded-md text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>{language === "ko" ? "새 정책 생성" : "New Policy"}</span>
        </button>
      </div>
    </div>
  );
}
