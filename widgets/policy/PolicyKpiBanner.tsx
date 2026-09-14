import React from "react";
import { Plus } from "lucide-react";
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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-1">
      {/* Title & Quick Stats */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-base font-bold text-[var(--foreground)] tracking-tight">
            {language === "ko" ? "보안 정책 관제" : "Security Policies"}
          </h1>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted-text)]">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--panel-header-bg)] border border-panel-border text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
              <span>{activeCount}/{totalPolicies} {language === "ko" ? "활성" : "Active"}</span>
            </span>
            <span className="hidden md:inline text-[11px] text-[var(--muted-text)]">
              &bull; {totalDistrictsCovered} {language === "ko" ? "개 권역" : "districts"} &bull; {totalFleetBound}/{totalFleetCount} {language === "ko" ? "차량 연계" : "vehicles"}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={onNewPolicyClick}
        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-cyan hover:opacity-90 text-white dark:text-black rounded-md text-xs font-semibold transition-all shadow-xs cursor-pointer shrink-0"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5px]" />
        <span>{language === "ko" ? "새 정책 등록" : "New Policy"}</span>
      </button>
    </div>
  );
}

