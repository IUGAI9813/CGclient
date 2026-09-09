import React from "react";
import { Sliders, Globe, Car, Shield, CheckCircle2 } from "lucide-react";
import { ThresholdRule } from "@/entities/threshold/model/types";
import { useLanguage } from "@/app/components/LanguageContext";

interface ThresholdOverviewWidgetProps {
  rules: ThresholdRule[];
}

export const ThresholdOverviewWidget: React.FC<ThresholdOverviewWidgetProps> = ({ rules }) => {
  const { language } = useLanguage();
  const globalCount = rules.filter((r) => r.scope === "GLOBAL").length;
  const vehicleCount = rules.filter((r) => r.scope === "VEHICLE_TYPE").length;
  const policyCount = rules.filter((r) => r.scope === "POLICY").length;
  const activeCount = rules.filter((r) => r.isActive).length;

  return (
    <div className="gateway-kpi-grid font-mono">
      {/* Card 1: Active Rules Engine */}
      <div className="cyber-panel gateway-kpi-card">
        <div className="flex justify-between items-start">
          <div>
            <span className="gateway-kpi-label">
              {language === "ko" ? "탐지 임계 엔진" : "Detection Rules Engine"}
            </span>
            <span className="gateway-kpi-value flex items-center gap-2">
              {activeCount} / {rules.length}
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </span>
          </div>
          <div className="gateway-kpi-icon-box border-cyan-500/40 text-cyan-400">
            <Sliders className="w-5 h-5" />
          </div>
        </div>
        <div className="gateway-kpi-footer">
          <span>{language === "ko" ? "엔진 상태:" : "Engine Status:"}</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {language === "ko" ? "실시간 ADCU 가동 중" : "Realtime ADCU Active"}
          </span>
        </div>
      </div>

      {/* Card 2: Global Baseline */}
      <div className="cyber-panel gateway-kpi-card">
        <div className="flex justify-between items-start">
          <div>
            <span className="gateway-kpi-label">
              {language === "ko" ? "글로벌 기본 상태" : "Global Baseline Status"}
            </span>
            <span className="gateway-kpi-value text-cyan-400">
              {globalCount > 0 
                ? (language === "ko" ? "기본 활성 적용" : "Default Active") 
                : (language === "ko" ? "비활성" : "Inactive")}
            </span>
          </div>
          <div className="gateway-kpi-icon-box text-cyan-400">
            <Globe className="w-5 h-5" />
          </div>
        </div>
        <div className="gateway-kpi-footer">
          <span>{language === "ko" ? "적용 대상:" : "Target Scope:"}</span>
          <span className="text-[var(--foreground)] font-bold">
            {language === "ko" ? "148대 전체 플릿 차량" : "148 Fleet Vehicles"}
          </span>
        </div>
      </div>

      {/* Card 3: Vehicle Type Profiles */}
      <div className="cyber-panel gateway-kpi-card">
        <div className="flex justify-between items-start">
          <div>
            <span className="gateway-kpi-label">
              {language === "ko" ? "차종별 임계 프로필" : "Vehicle Type Profiles"}
            </span>
            <span className="gateway-kpi-value text-purple-400">
              {vehicleCount} {language === "ko" ? "개 차종" : "Types"}
            </span>
          </div>
          <div className="gateway-kpi-icon-box text-purple-400">
            <Car className="w-5 h-5" />
          </div>
        </div>
        <div className="gateway-kpi-footer">
          <span>{language === "ko" ? "분류군:" : "Classes:"}</span>
          <span className="text-[var(--foreground)] font-bold">
            {language === "ko" ? "로보택시, 셔틀, 배달포드" : "Robotaxi, Shuttle, Pod"}
          </span>
        </div>
      </div>

      {/* Card 4: Geofence Overrides */}
      <div className="cyber-panel gateway-kpi-card">
        <div className="flex justify-between items-start">
          <div>
            <span className="gateway-kpi-label">
              {language === "ko" ? "지오펜스 정책 오버라이드" : "Geofence Policy Overrides"}
            </span>
            <span className="gateway-kpi-value text-amber-400">
              {policyCount} {language === "ko" ? "개 구역" : "Zones"}
            </span>
          </div>
          <div className="gateway-kpi-icon-box text-amber-400">
            <Shield className="w-5 h-5" />
          </div>
        </div>
        <div className="gateway-kpi-footer">
          <span>{language === "ko" ? "우선순위:" : "Resolution:"}</span>
          <span className="text-amber-400 font-bold">
            {language === "ko" ? "최우선 순위 오버라이드" : "High Priority Override"}
          </span>
        </div>
      </div>
    </div>
  );
};
