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
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="w-3.5 h-3.5 text-[var(--muted-text)] absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={
            language === "ko"
              ? "정책명, 구역(강남구 등), 도시 검색..."
              : "Search policy, district, or city..."
          }
          className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md pl-8.5 pr-3 py-1.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus:border-brand-cyan outline-none transition-colors"
        />
      </div>

      {/* Action Filter Segmented Tabs */}
      <div className="flex items-center gap-1 bg-[var(--panel-header-bg)] p-1 rounded-md border border-panel-border overflow-x-auto scrollbar-none">
        {[
          { key: "ALL", label: language === "ko" ? "전체" : "All" },
          { key: "ACT_RAISE_INCIDENT", label: language === "ko" ? "인시던트" : "Incident" },
          { key: "ACT_LIMIT_SPEED", label: language === "ko" ? "속도제한" : "Speed Limit" },
          { key: "ACT_WARN_DRIVER", label: language === "ko" ? "경고" : "Warning" },
          { key: "ACT_FORCE_STOP", label: language === "ko" ? "비상정지" : "Stop" }
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => onActionFilterChange(f.key)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              actionFilter === f.key
                ? "bg-[var(--panel-bg)] text-brand-cyan font-semibold shadow-2xs"
                : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

