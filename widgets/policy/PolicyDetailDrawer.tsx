import React from "react";
import { MapPin, Sliders, X, Radio, Layers, Activity, Trash2 } from "lucide-react";
import { Policy } from "@/entities/policy/model/types";
import { defaultAdminRegions } from "@/entities/region/model/mock-data";
import { defaultPolicyFleetVehicles } from "@/entities/policy/model/mock-data";
import { useLanguage } from "@/app/components/LanguageContext";

interface PolicyDetailDrawerProps {
  policy: Policy | null;
  onClose: () => void;
  onEditPolicy: (policy: Policy) => void;
  onDeletePolicy: (id: string) => void;
}

export function PolicyDetailDrawer({
  policy,
  onClose,
  onEditPolicy,
  onDeletePolicy
}: PolicyDetailDrawerProps) {
  const { language } = useLanguage();

  if (!policy) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-sans">
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
              <span className="text-[10px] font-mono uppercase text-brand-cyan font-bold bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20">
                {policy.id.replace("pol-", "POLICY-0")}
              </span>
              <span className="text-[10px] text-[var(--muted-text)] font-mono">{policy.cityName}</span>
            </div>
            <h2 className="text-base font-bold text-[var(--foreground)] mt-1.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-cyan" />
              <span>{policy.name}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditPolicy(policy)}
              className="px-3 py-1.5 rounded bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan hover:text-white dark:hover:text-black text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{language === "ko" ? "정책 수정" : "Edit"}</span>
            </button>
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
          {/* Telemetry Status Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
              <span className="text-[9px] text-[var(--muted-text)] uppercase block">
                {language === "ko" ? "소속 도시" : "City"}
              </span>
              <span className="font-bold text-[var(--foreground)] mt-0.5 block">{policy.cityName}</span>
            </div>
            <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
              <span className="text-[9px] text-[var(--muted-text)] uppercase block">
                {language === "ko" ? "보호 구역" : "Districts"}
              </span>
              <span className="font-bold text-brand-cyan mt-0.5 block">
                {policy.districtCodes.length}개 구역
              </span>
            </div>
            <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
              <span className="text-[9px] text-[var(--muted-text)] uppercase block">
                {language === "ko" ? "우선순위" : "Priority"}
              </span>
              <span className="font-bold text-[var(--foreground)] mt-0.5 block">
                Level {policy.priority}
              </span>
            </div>
            <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
              <span className="text-[9px] text-[var(--muted-text)] uppercase block">
                {language === "ko" ? "제어 조치" : "Action"}
              </span>
              <span className="font-bold text-brand-amber mt-0.5 block">
                {policy.action.replace("ACT_", "")}
              </span>
            </div>
          </div>

          {/* Edge Deployment Status */}
          <div className="p-3 rounded border border-brand-emerald/20 bg-brand-emerald/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-brand-emerald animate-pulse" />
              <div>
                <span className="text-xs font-bold text-[var(--foreground)] block">
                  {language === "ko"
                    ? "실시간 엣지 노드 동기화 완료"
                    : "Edge Telematics Synchronized"}
                </span>
                <span className="text-[10px] text-[var(--muted-text)]">
                  TB_SECURITY_POLICIES &bull; Active in V2X Mesh
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/20 px-2 py-0.5 rounded">
              24/7 ACTIVE
            </span>
          </div>

          {/* Administrative Region Coverage Grid */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-brand-cyan" />
                <span>
                  {policy.cityName}{" "}
                  {language === "ko" ? "행정구역 관제 현황" : "Districts Breakdown"}
                </span>
              </span>
              <span className="text-[10px] text-brand-cyan font-mono bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded">
                TB_ADMIN_REGIONS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {defaultAdminRegions
                .filter((r) => r.cityName === policy.cityName)
                .map((region) => {
                  const isIncluded = policy.districtCodes.includes(region.regionCode);
                  const vehsInDistrict = defaultPolicyFleetVehicles.filter(
                    (v) => v.districtCode === region.regionCode
                  );

                  return (
                    <div
                      key={region.regionCode}
                      className={`p-2.5 rounded border transition-all flex flex-col justify-between ${
                        isIncluded
                          ? "bg-brand-cyan/10 border-brand-cyan/40 shadow-xs"
                          : "bg-[var(--panel-header-bg)] border-panel-border opacity-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isIncluded
                                  ? "bg-brand-cyan shadow-[0_0_6px_rgba(6,182,212,0.8)]"
                                  : "bg-zinc-400 dark:bg-zinc-700"
                              }`}
                            />
                            <span
                              className={`font-bold text-xs ${
                                isIncluded ? "text-[var(--foreground)]" : "text-zinc-500"
                              }`}
                            >
                              {region.districtName}
                            </span>
                          </div>
                          <span className="text-[9px] text-[var(--muted-text)] block ml-3.5 mt-0.5">
                            {region.subDistrictName || ""}
                          </span>
                        </div>
                        <span
                          className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono ${
                            isIncluded
                              ? "bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20"
                              : "bg-[var(--panel-bg)] border border-panel-border text-[var(--muted-text)]"
                          }`}
                        >
                          {isIncluded ? "PROTECTED" : "EXCLUDED"}
                        </span>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-panel-border/40 flex justify-between items-center text-[9px] text-[var(--muted-text)] font-mono">
                        <span>#{region.regionCode.slice(-4)}</span>
                        <span>{vehsInDistrict.length}대 운행중</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Bound Fleet Vehicles */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brand-cyan" />
                <span>
                  {language === "ko" ? "적용 플릿 차량" : "Bound Vehicles"} ({policy.vehicles.length})
                </span>
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {policy.vehicles.length === 0 ? (
                <span className="text-[var(--muted-text)] text-xs py-2">
                  {language === "ko" ? "연계된 차량이 없습니다." : "No vehicles bound to this policy."}
                </span>
              ) : (
                policy.vehicles.map((vehId) => {
                  const vehObj = defaultPolicyFleetVehicles.find((v) => v.id === vehId);
                  return (
                    <div
                      key={vehId}
                      className="px-2.5 py-1.5 rounded bg-[var(--panel-header-bg)] border border-panel-border text-[11px] font-mono flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                      <span className="font-bold text-[var(--foreground)]">{vehId}</span>
                      <span className="text-[var(--muted-text)] text-[10px]">
                        {vehObj?.type} &bull; {vehObj?.district}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-center">
          <button
            onClick={() => onDeletePolicy(policy.id)}
            className="px-3 py-1.5 rounded border border-panel-border text-[var(--muted-text)] hover:text-brand-rose hover:bg-brand-rose/10 hover:border-brand-rose text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{language === "ko" ? "정책 삭제" : "Delete"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded border border-panel-border bg-[var(--panel-bg)] hover:bg-[var(--panel-header-bg)] text-[var(--foreground)] text-xs font-semibold transition-colors cursor-pointer"
            >
              {language === "ko" ? "닫기 (Esc)" : "Close (Esc)"}
            </button>
            <button
              onClick={() => onEditPolicy(policy)}
              className="px-4 py-1.5 rounded bg-brand-cyan hover:opacity-90 text-white dark:text-black text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {language === "ko" ? "수정하기" : "Edit Policy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
