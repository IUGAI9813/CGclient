import React from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Send
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
  selectedScope,
  onScopeChange,
  isDeploying,
  onOpenCreateModal,
  onDeploy
}: ThresholdFilterToolbarProps) {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5 font-sans">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--muted-text)]" />
        <input
          type="text"
          placeholder={
            language === "ko"
              ? "프로필명, 적용 대상 검색..."
              : "Search profile or target..."
          }
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md pl-8.5 pr-3 py-1.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus:border-brand-cyan outline-none transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Scope Filter Segmented Tabs */}
        <div className="flex items-center gap-1 bg-[var(--panel-header-bg)] p-1 rounded-md border border-panel-border overflow-x-auto scrollbar-none">
          {[
            { key: "ALL", label: language === "ko" ? "전체" : "All" },
            { key: "GLOBAL", label: language === "ko" ? "글로벌" : "Global" },
            { key: "VEHICLE_TYPE", label: language === "ko" ? "차종별" : "Vehicle" },
            { key: "POLICY", label: language === "ko" ? "지오펜스" : "Policy" }
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => onScopeChange(f.key as ThresholdScope | "ALL")}
              className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedScope === f.key
                  ? "bg-[var(--panel-bg)] text-brand-cyan font-semibold shadow-2xs"
                  : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <button
          onClick={onOpenCreateModal}
          className="px-3 py-1.5 bg-[var(--panel-header-bg)] hover:bg-brand-cyan/15 border border-panel-border hover:border-brand-cyan text-[var(--foreground)] hover:text-brand-cyan font-semibold rounded-md text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-brand-cyan" />
          <span>{language === "ko" ? "새 규칙" : "Add"}</span>
        </button>

        {/* <button
          onClick={onDeploy}
          disabled={isDeploying}
          className="px-3 py-1.5 bg-brand-cyan hover:opacity-90 text-white dark:text-black font-semibold rounded-md text-xs flex items-center gap-1.5 transition-opacity cursor-pointer disabled:opacity-50"
        >
          {isDeploying ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{language === "ko" ? "배포 중..." : "Deploying..."}</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>{language === "ko" ? "엣지 동기화" : "Deploy"}</span>
            </>
          )}
        </button> */}
      </div>
    </div>
  );
}

