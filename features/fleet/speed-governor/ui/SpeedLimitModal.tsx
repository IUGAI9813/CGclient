import React, { useState, useEffect } from "react";
import { Sliders, X, AlertTriangle, RefreshCw, CheckCircle2 } from "lucide-react";
import { FleetVehicle } from "@/entities/fleet/model/types";
import { getTypeLabel, getLocationLabel } from "@/entities/fleet/model/mock-data";
import { useLanguage } from "@/app/components/LanguageContext";

interface SpeedLimitModalProps {
  isOpen: boolean;
  vehicle: FleetVehicle | null;
  onClose: () => void;
  onApply: (speedLimit: number) => Promise<void>;
}

export function SpeedLimitModal({ isOpen, vehicle, onClose, onApply }: SpeedLimitModalProps) {
  const { t, language } = useLanguage();
  const [pendingSpeedLimit, setPendingSpeedLimit] = useState<number>(60);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setPendingSpeedLimit(vehicle.speedLimit);
    }
  }, [vehicle]);

  if (!isOpen || !vehicle) return null;

  const handleApplyClick = async () => {
    setIsApplying(true);
    await onApply(pendingSpeedLimit);
    setIsApplying(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[var(--panel-bg)] border border-panel-border rounded-xl shadow-2xl z-10 flex flex-col overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-4 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-cyan" />
            <div>
              <h2 className="text-base font-bold text-[var(--foreground)]">
                {vehicle.id} {language === "ko" ? "최대 속도 제어기 (Governor)" : "Speed Limit Governor"}
              </h2>
              <span className="text-[11px] text-[var(--muted-text)]">
                {getTypeLabel(vehicle.type, language)} &bull; {getLocationLabel(vehicle.location, language)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 text-xs">
          {/* Speed Comparison Strip */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[var(--panel-header-bg)] border border-panel-border">
              <span className="text-[10px] text-[var(--muted-text)] uppercase font-bold block">
                {language === "ko" ? "현재 인가 속도" : "Current Limit"}
              </span>
              <span className="text-xl font-bold font-mono text-[var(--foreground)] mt-1 block">
                {vehicle.speedLimit} km/h
              </span>
            </div>
            <div className="p-3 rounded-lg bg-brand-cyan/10 border border-brand-cyan/40">
              <span className="text-[10px] text-brand-cyan uppercase font-bold block">
                {language === "ko" ? "새로운 목표 제한 속도" : "Target Limit"}
              </span>
              <span className="text-xl font-bold font-mono text-brand-cyan mt-1 block">
                {pendingSpeedLimit} km/h
              </span>
            </div>
          </div>

          {/* Slider Control */}
          <div className="space-y-3 bg-[var(--panel-header-bg)] p-4 rounded-lg border border-panel-border">
            <div className="flex justify-between items-center text-xs font-bold text-[var(--foreground)]">
              <span>{language === "ko" ? "목표 제한 속도 조절" : "Adjust Speed Limit"}</span>
              <span className="font-mono text-brand-cyan text-sm">{pendingSpeedLimit} km/h</span>
            </div>

            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={pendingSpeedLimit}
              onChange={(e) => setPendingSpeedLimit(parseInt(e.target.value))}
              className="w-full accent-brand-cyan cursor-pointer"
            />

            {/* Quick Preset Buttons */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase">
                {language === "ko" ? "빠른 프리셋:" : "Presets:"}
              </span>
              <div className="flex gap-1.5">
                {[30, 50, 60, 80].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPendingSpeedLimit(preset)}
                    className={`px-3 py-1 rounded text-xs border transition-all cursor-pointer font-bold ${
                      pendingSpeedLimit === preset
                        ? "border-brand-cyan text-brand-cyan bg-brand-cyan/15 shadow-xs"
                        : "border-panel-border text-[var(--muted-text)] hover:text-[var(--foreground)] bg-[var(--panel-bg)]"
                    }`}
                  >
                    {preset}km/h
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Safety Warning Box */}
          <div className="p-3 rounded-lg bg-brand-amber/10 border border-brand-amber/30 flex items-start gap-2.5 text-xs text-brand-amber">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              {language === "ko"
                ? "주의: 변경된 속도 제한은 V2X 보안 무선 링크를 통해 차량의 전자 제어 장치(ECU)에 즉시 하달되며 자율주행 경로 플래너에 강제 반영됩니다."
                : "Caution: The new speed governor is securely dispatched to the vehicle ECU via V2X and immediately restricts path planning algorithms."}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-panel-border bg-[var(--panel-header-bg)] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-panel-border bg-[var(--panel-bg)] hover:bg-[var(--panel-header-bg)] text-[var(--foreground)] text-xs font-semibold transition-colors cursor-pointer"
          >
            {t("policies.cancel")}
          </button>
          <button
            onClick={handleApplyClick}
            disabled={isApplying}
            className="px-5 py-2 rounded-md bg-brand-cyan hover:opacity-90 text-white dark:text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isApplying ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 stroke-[2.5px]" />
            )}
            <span>{language === "ko" ? "ECU 동기화 및 즉시 적용" : "Apply & Sync ECU"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
