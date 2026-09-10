import React from "react";
import {
  Layers,
  Search,
  Plus,
  RefreshCw,
  Send,
  Clock,
  CheckCircle2,
  Calendar,
  Archive,
  Sliders,
  Globe,
  Car,
  Shield
} from "lucide-react";
import { ThresholdScope, TemporalStatus } from "@/entities/threshold/model/types";
import { useLanguage } from "@/app/components/LanguageContext";

interface ThresholdFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTimeline: TemporalStatus | "ALL";
  onTimelineChange: (status: TemporalStatus | "ALL") => void;
  selectedScope: ThresholdScope | "ALL";
  onScopeChange: (scope: ThresholdScope | "ALL") => void;
  timelineCounts: { all: number; current: number; future: number; historical: number };
  scopeCounts: { all: number; global: number; vehicleType: number; policy: number };
  isDeploying: boolean;
  onOpenCreateModal: () => void;
  onDeploy: () => void;
}

export function ThresholdFilterToolbar({
  searchQuery,
  onSearchChange,
  selectedTimeline,
  onTimelineChange,
  selectedScope,
  onScopeChange,
  timelineCounts,
  scopeCounts,
  isDeploying,
  onOpenCreateModal,
  onDeploy
}: ThresholdFilterToolbarProps) {
  const { language } = useLanguage();

  return (
    <div className="space-y-4 font-mono">
      {/* Precedence Hierarchy Banner */}
      <div className="p-3 bg-[var(--panel-header-bg)] border border-panel-border rounded flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2 text-[var(--foreground)]">
          <Layers className="w-4 h-4 text-brand-cyan shrink-0" />
          <span className="font-bold text-[var(--foreground)]">
            {language === "ko" ? "우선순위 계층 (Precedence Hierarchy):" : "Precedence Hierarchy:"}
          </span>
          <span className="text-amber-400 font-bold">
            {language === "ko" ? "1. 지오펜스 정책" : "1. Geofence Policy"}
          </span>
          <span className="text-zinc-500">&gt;</span>
          <span className="text-purple-400 font-bold">
            {language === "ko" ? "2. 차종별 프로필" : "2. Vehicle Type"}
          </span>
          <span className="text-zinc-500">&gt;</span>
          <span className="text-cyan-400 font-bold">
            {language === "ko" ? "3. 글로벌 기본" : "3. Global Baseline"}
          </span>
        </div>
        <span className="text-[10px] text-zinc-500">
          {language === "ko"
            ? "높은 우선순위의 지오펜스 임계값이 일반 플릿 기본값을 자동 오버라이드합니다."
            : "High-priority geofences automatically override general fleet baselines."}
        </span>
      </div>

      {/* Dual-Axis Search & Actions Toolbar */}
      <div className="cyber-panel p-4 rounded space-y-3.5 bg-[var(--panel-bg)]">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          {/* Live Search */}
          <div className="relative flex-1 w-full xl:max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder={
                language === "ko"
                  ? "프로필명, 적용 대상, 변경 사유 검색..."
                  : "Search profile, target entity, version..."
              }
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-panel-border rounded pl-9 pr-4 py-2 text-xs text-[var(--foreground)] outline-none focus:border-panel-border-hover transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto shrink-0">
            <button
              onClick={onOpenCreateModal}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-[var(--panel-header-bg)] hover:bg-brand-cyan/15 border border-panel-border hover:border-brand-cyan text-[var(--foreground)] hover:text-brand-cyan font-bold rounded text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              title={language === "ko" ? "새로운 임계값 규칙 프로필 추가" : "Create new threshold profile"}
            >
              <Plus className="w-3.5 h-3.5 text-brand-cyan" />
              <span>{language === "ko" ? "새 임계값 등록" : "Add Threshold"}</span>
            </button>

            <button
              onClick={onDeploy}
              disabled={isDeploying}
              className="w-full sm:w-auto px-4 py-2.5 bg-brand-cyan hover:bg-cyan-400 text-black font-bold rounded text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{language === "ko" ? "엣지 동기화 배포 중..." : "Deploying to Fleet..."}</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === "ko" ? "엣지 ADCU에 규칙 배포" : "Deploy Rules to Edge"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dual-Axis Filter Pills */}
        <div className="pt-2 border-t border-panel-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Timeline State Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mr-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-brand-cyan" />
              {language === "ko" ? "적용 시점:" : "Timeline:"}
            </span>
            <button
              onClick={() => onTimelineChange("ALL")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                selectedTimeline === "ALL"
                  ? "bg-brand-cyan/15 text-brand-cyan border-brand-cyan"
                  : "bg-[var(--panel-header-bg)] text-zinc-500 border-panel-border hover:text-[var(--foreground)]"
              }`}
            >
              {language === "ko" ? `전체 (${timelineCounts.all})` : `All (${timelineCounts.all})`}
            </button>
            <button
              onClick={() => onTimelineChange("CURRENT")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                selectedTimeline === "CURRENT"
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-400"
                  : "bg-[var(--panel-header-bg)] text-zinc-500 border-panel-border hover:text-[var(--foreground)]"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>
                {language === "ko" ? `현재 적용 (${timelineCounts.current})` : `Current (${timelineCounts.current})`}
              </span>
            </button>
            <button
              onClick={() => onTimelineChange("FUTURE")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                selectedTimeline === "FUTURE"
                  ? "bg-sky-500/15 text-sky-400 border-sky-400"
                  : "bg-[var(--panel-header-bg)] text-zinc-500 border-panel-border hover:text-[var(--foreground)]"
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>
                {language === "ko" ? `적용 예정 (${timelineCounts.future})` : `Future (${timelineCounts.future})`}
              </span>
            </button>
            <button
              onClick={() => onTimelineChange("HISTORICAL")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                selectedTimeline === "HISTORICAL"
                  ? "bg-zinc-700/40 text-zinc-300 border-zinc-500"
                  : "bg-[var(--panel-header-bg)] text-zinc-500 border-panel-border hover:text-[var(--foreground)]"
              }`}
            >
              <Archive className="w-3 h-3" />
              <span>
                {language === "ko" ? `아카이브 (${timelineCounts.historical})` : `Archive (${timelineCounts.historical})`}
              </span>
            </button>
          </div>

          {/* Scope Target Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mr-1 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-purple-400" />
              {language === "ko" ? "적용 범위:" : "Scope:"}
            </span>
            <button
              onClick={() => onScopeChange("ALL")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                selectedScope === "ALL"
                  ? "bg-purple-500/15 text-purple-400 border-purple-400"
                  : "bg-[var(--panel-header-bg)] text-zinc-500 border-panel-border hover:text-[var(--foreground)]"
              }`}
            >
              {language === "ko" ? `전체 (${scopeCounts.all})` : `All (${scopeCounts.all})`}
            </button>
            <button
              onClick={() => onScopeChange("GLOBAL")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                selectedScope === "GLOBAL"
                  ? "bg-cyan-500/15 text-cyan-400 border-cyan-400"
                  : "bg-[var(--panel-header-bg)] text-zinc-500 border-panel-border hover:text-[var(--foreground)]"
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>
                {language === "ko" ? `글로벌 (${scopeCounts.global})` : `Global (${scopeCounts.global})`}
              </span>
            </button>
            <button
              onClick={() => onScopeChange("VEHICLE_TYPE")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                selectedScope === "VEHICLE_TYPE"
                  ? "bg-purple-500/15 text-purple-400 border-purple-400"
                  : "bg-[var(--panel-header-bg)] text-zinc-500 border-panel-border hover:text-[var(--foreground)]"
              }`}
            >
              <Car className="w-3 h-3" />
              <span>
                {language === "ko" ? `차종별 (${scopeCounts.vehicleType})` : `Vehicle (${scopeCounts.vehicleType})`}
              </span>
            </button>
            <button
              onClick={() => onScopeChange("POLICY")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                selectedScope === "POLICY"
                  ? "bg-amber-500/15 text-amber-400 border-amber-400"
                  : "bg-[var(--panel-header-bg)] text-zinc-500 border-panel-border hover:text-[var(--foreground)]"
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>
                {language === "ko" ? `지오펜스 (${scopeCounts.policy})` : `Policy (${scopeCounts.policy})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
