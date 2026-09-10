"use client";

import React from "react";
import { CheckCircle2, Cpu, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/app/components/LanguageContext";

export interface SafetyOverrideSetting {
  id: string;
  titleEn: string;
  titleKo: string;
  descEn: string;
  descKo: string;
  enabled: boolean;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  protocol: string;
}

interface SafetyOverridesWidgetProps {
  overrides: SafetyOverrideSetting[];
  onToggleOverride: (id: string) => void;
}

export const SafetyOverridesWidget: React.FC<SafetyOverridesWidgetProps> = ({
  overrides,
  onToggleOverride,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="cyber-panel p-4 rounded space-y-4">
      <div className="border-b border-panel-border pb-3 flex justify-between items-center">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
            {language === "ko" ? "플릿 제어 보호 규정" : "Fleet Actuation Fail-Safes"}
          </span>
          <h2 className="text-sm font-bold text-white mt-1">{t("settings.safety_title")}</h2>
        </div>
        <span className="text-[10px] text-brand-emerald font-bold border border-brand-emerald/20 bg-brand-emerald/5 px-2 py-0.5 rounded flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
          <span>FAIL-SAFE ACTIVE</span>
        </span>
      </div>

      <p className="text-xs text-zinc-400">{t("settings.safety_subtitle")}</p>

      <div className="space-y-3 pt-1">
        {overrides.map((item) => (
          <div
            key={item.id}
            className="p-3.5 bg-zinc-950/60 border border-panel-border hover:border-zinc-700 rounded transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {language === "ko" ? item.titleKo : item.titleEn}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${
                    item.severity === "CRITICAL"
                      ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
                      : item.severity === "HIGH"
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                      : "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                  }`}
                >
                  {item.severity}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {language === "ko" ? item.descKo : item.descEn}
              </p>
              <div className="flex items-center gap-2 text-[9px] text-zinc-500">
                <Cpu className="w-3 h-3 text-zinc-500" />
                <span>{item.protocol}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`text-[10px] font-bold ${
                  item.enabled ? "text-brand-cyan" : "text-zinc-500"
                }`}
              >
                {item.enabled
                  ? language === "ko"
                    ? "가드 활성"
                    : "ACTIVE"
                  : language === "ko"
                  ? "해제됨"
                  : "BYPASSED"}
              </span>

              <button
                onClick={() => onToggleOverride(item.id)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  item.enabled ? "bg-brand-cyan" : "bg-zinc-800"
                }`}
                role="switch"
                aria-checked={item.enabled}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                    item.enabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-zinc-900/40 border border-panel-border rounded text-[10px] text-zinc-500 font-mono flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          {language === "ko"
            ? "안전 오버라이드 매개변수의 변경 사항은 SOC 감사 로그(TB_AUDIT_LOGS)에 운영자의 전자 서명과 함께 즉시 기록됩니다."
            : "Modifications to safety overrides are immediately recorded in TB_AUDIT_LOGS with operator cryptographic signature."}
        </span>
      </div>
    </div>
  );
};
