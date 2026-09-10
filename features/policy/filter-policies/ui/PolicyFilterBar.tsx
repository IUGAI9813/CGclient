import React from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/app/components/LanguageContext";

interface PolicyFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  actionFilter: string;
  onActionFilterChange: (action: string) => void;
}

export function PolicyFilterBar({
  searchQuery,
  onSearchChange,
  actionFilter,
  onActionFilterChange
}: PolicyFilterBarProps) {
  const { language } = useLanguage();

  return (
    <div className="cyber-panel p-3 rounded-lg flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 font-sans">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-[var(--muted-text)] absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={
            language === "ko"
              ? "정책명, 관할 구역(강남구 등), 도시 검색..."
              : "Filter by policy name, district, or city..."
          }
          className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md pl-9 pr-3 py-2 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none transition-colors"
        />
      </div>

      {/* Action Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {[
          { key: "ALL", label: language === "ko" ? "전체 (All)" : "All Actions" },
          { key: "ACT_RAISE_INCIDENT", label: language === "ko" ? "인시던트 등록" : "Incident" },
          { key: "ACT_LIMIT_SPEED", label: language === "ko" ? "속도 제한" : "Speed Limit" },
          { key: "ACT_WARN_DRIVER", label: language === "ko" ? "운전자 경고" : "Warn Driver" },
          { key: "ACT_FORCE_STOP", label: language === "ko" ? "비상 정지" : "Force Stop" }
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => onActionFilterChange(f.key)}
            className={`px-3 py-1.5 rounded text-[11px] font-semibold whitespace-nowrap border transition-all cursor-pointer ${
              actionFilter === f.key
                ? "bg-brand-cyan/15 border-brand-cyan text-brand-cyan font-bold"
                : "bg-[var(--panel-header-bg)] border-panel-border text-[var(--muted-text)] hover:text-[var(--foreground)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
