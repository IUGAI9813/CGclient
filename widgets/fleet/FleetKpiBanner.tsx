import React from "react";
import { Compass } from "lucide-react";
import { useLanguage } from "@/app/components/LanguageContext";

interface FleetKpiBannerProps {
  totalCount: number;
  secureCount: number;
  criticalCount: number;
  warningCount: number;
  avgBattery: number;
}

export function FleetKpiBanner({
  totalCount,
  secureCount,
  criticalCount,
  warningCount,
  avgBattery
}: FleetKpiBannerProps) {
  const { language } = useLanguage();

  return (
    <div className="cyber-panel p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-sans">
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
          <span className="text-[9px] text-[var(--muted-text)] uppercase block">
            {language === "ko" ? "총 운용 차량" : "Total Fleet"}
          </span>
          <span className="text-[var(--foreground)] font-bold tabular-nums">{totalCount}대</span>
        </div>
        <div className="w-[1px] h-6 bg-panel-border" />
        <div>
          <span className="text-[9px] text-[var(--muted-text)] uppercase block">
            {language === "ko" ? "정상 작동" : "Secure"}
          </span>
          <span className="text-brand-emerald font-bold tabular-nums">{secureCount}대</span>
        </div>
        <div className="w-[1px] h-6 bg-panel-border" />
        <div>
          <span className="text-[9px] text-[var(--muted-text)] uppercase block">
            {language === "ko" ? "이상 감지" : "Warning/Crit"}
          </span>
          <span
            className={`${
              criticalCount > 0 ? "text-brand-rose" : "text-brand-amber"
            } font-bold tabular-nums`}
          >
            {criticalCount + warningCount}대
          </span>
        </div>
        <div className="w-[1px] h-6 bg-panel-border" />
        <div>
          <span className="text-[9px] text-[var(--muted-text)] uppercase block">
            {language === "ko" ? "평균 배터리" : "Avg Battery"}
          </span>
          <span className="text-brand-cyan font-bold tabular-nums">{avgBattery}%</span>
        </div>
      </div>
    </div>
  );
}
