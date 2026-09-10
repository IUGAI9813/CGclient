import React from "react";
import {
  Sliders,
  X,
  Gauge,
  Battery,
  Radio,
  Activity,
  CheckCircle2,
  Calendar,
  Lock,
  Tag
} from "lucide-react";
import { ThresholdRule } from "@/entities/threshold/model/types";
import { defaultMetricDefinitions } from "@/entities/threshold/model/mock-data";
import { ThresholdScopeBadge } from "@/entities/threshold/ui/ThresholdScopeBadge";
import { ThresholdTimelineBadge } from "@/entities/threshold/ui/ThresholdTimelineBadge";
import { ThresholdMetricCard } from "@/entities/threshold/ui/ThresholdMetricCard";
import { useLanguage } from "@/app/components/LanguageContext";

interface ThresholdDiagnosticDrawerProps {
  rule: ThresholdRule | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEditModal: (rule: ThresholdRule) => void;
  onToggleActive: (id: string) => void;
}

export function ThresholdDiagnosticDrawer({
  rule,
  isOpen,
  onClose,
  onOpenEditModal,
  onToggleActive
}: ThresholdDiagnosticDrawerProps) {
  const { language } = useLanguage();

  if (!isOpen || !rule) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-mono">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-2xl bg-[var(--panel-bg)] border-l border-panel-border h-full shadow-2xl z-10 flex flex-col animate-slide-left">
        {/* Drawer Header */}
        <div className="p-4 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                {language === "ko" ? "선택된 임계값 프로필 진단" : "THRESHOLD PROFILE TELEMETRY"}
              </span>
              <ThresholdScopeBadge scope={rule.scope} />
              <ThresholdTimelineBadge
                temporalStatus={rule.temporalStatus}
                startTime={rule.startTime}
                endTime={rule.endTime}
                effectiveDate={rule.effectiveDate}
              />
              <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-zinc-900 border border-panel-border text-zinc-400">
                {rule.version || "v1.0"}
              </span>
            </div>
            <h2 className="text-base font-bold text-[var(--foreground)] mt-1 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-brand-cyan" />
              <span>{rule.name}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenEditModal(rule)}
              className="px-3 py-1.5 rounded bg-[var(--panel-header-bg)] hover:bg-brand-cyan/15 hover:text-brand-cyan border border-panel-border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5 text-brand-cyan" />
              <span>{language === "ko" ? "파라미터 수정" : "Edit Profile"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-zinc-500 hover:text-[var(--foreground)] hover:bg-[var(--panel-header-bg)] border border-panel-border transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1 scrollbar-thin">
          {/* Target & Scope Binding Summary */}
          <div className="p-3.5 bg-zinc-950/40 border border-panel-border rounded space-y-2">
            <div className="flex justify-between items-start text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">
                  {language === "ko" ? "적용 대상 엔티티 (Target Bound)" : "Bound Entity Scope"}
                </span>
                <span className="text-white font-bold text-sm mt-0.5 block">{rule.targetName}</span>
                <span className="text-[10px] text-zinc-500 font-mono">ID: {rule.targetId}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 block uppercase">
                  {language === "ko" ? "유효 시행 일자" : "Effective Date"}
                </span>
                <span className="text-brand-cyan font-bold text-xs mt-0.5 block">
                  {rule.effectiveDate || "IMMEDIATE"}
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 pt-2 border-t border-panel-border/50 leading-relaxed">
              {rule.description}
            </p>
          </div>

          {/* Detailed Metric Threshold Cards Grid */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[var(--foreground)] tracking-wide uppercase flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-brand-cyan" />
                <span>
                  {language === "ko"
                    ? "센서 및 텔레메트리 임계값 세부 구성"
                    : "Sensor & Telematics Limit Values"}
                </span>
              </span>
              <span className="text-[10px] text-zinc-500">
                {language === "ko" ? "경고치 및 위험치 한계" : "Warning & Critical Limits"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {defaultMetricDefinitions.map((def) => (
                <ThresholdMetricCard
                  key={def.key}
                  metric={def}
                  rule={rule}
                />
              ))}
            </div>
          </div>

          {/* Temporal & Version Audit Breakdown */}
          <div className="p-3.5 bg-zinc-950/30 border border-panel-border rounded space-y-3">
            <span className="text-xs font-bold text-[var(--foreground)] uppercase flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
              <span>
                {language === "ko"
                  ? "정책 버전 관리 및 감사 기록 (Audit Trail)"
                  : "Version History & Audit Metadata"}
              </span>
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-[var(--panel-header-bg)] border border-panel-border">
                <span className="text-[10px] text-zinc-500 uppercase block">
                  {language === "ko" ? "현재 배포 버전" : "Release Version"}
                </span>
                <span className="font-bold text-white font-mono mt-0.5 block">{rule.version || "v1.0"}</span>
              </div>
              <div className="p-2.5 rounded bg-[var(--panel-header-bg)] border border-panel-border">
                <span className="text-[10px] text-zinc-500 uppercase block">
                  {language === "ko" ? "최종 수정자" : "Author / Approver"}
                </span>
                <span className="font-bold text-brand-cyan font-mono mt-0.5 block">{rule.updatedBy}</span>
              </div>
            </div>

            {rule.changeReason && (
              <div className="text-xs text-zinc-400 p-2.5 rounded bg-[var(--panel-header-bg)] border border-panel-border">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">
                  {language === "ko" ? "변경 사유 및 운영 의도 (Justification):" : "Operational Change Reason:"}
                </span>
                &quot;{rule.changeReason}&quot;
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-center">
          <button
            onClick={() => onToggleActive(rule.id)}
            className={`px-3.5 py-1.5 rounded border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              rule.isActive
                ? "bg-brand-emerald/10 border-brand-emerald/30 text-brand-emerald hover:bg-brand-emerald/20"
                : "bg-zinc-900 border-panel-border text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {rule.isActive
                ? language === "ko"
                  ? "활성 프로필 (Active)"
                  : "Active in Mesh"
                : language === "ko"
                ? "비활성 (Deactivated)"
                : "Inactive"}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded border border-panel-border bg-[var(--panel-bg)] hover:bg-[var(--panel-header-bg)] text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              {language === "ko" ? "닫기 (Esc)" : "Close (Esc)"}
            </button>
            <button
              onClick={() => onOpenEditModal(rule)}
              className="px-4 py-1.5 rounded bg-brand-cyan hover:bg-cyan-400 text-black text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{language === "ko" ? "수정하기" : "Edit Profile"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
