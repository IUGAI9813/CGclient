import React from "react";
import { Search, List, LayoutGrid } from "lucide-react";
import { useLanguage } from "@/app/components/LanguageContext";
import { getTypeLabel } from "@/entities/fleet/model/mock-data";

interface FleetFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
}

export function FleetFilterBar({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange
}: FleetFilterBarProps) {
  const { t, language } = useLanguage();

  return (
    <div className="cyber-panel p-3 rounded-lg flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 font-sans">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-[var(--muted-text)] absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder={t("fleet.search")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md pl-9 pr-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-brand-cyan transition-colors"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {/* Type Filter Pills */}
        <div className="flex gap-1">
          {["ALL", "Robotaxi", "Shuttle", "Delivery Pod"].map((type) => (
            <button
              key={type}
              onClick={() => onTypeFilterChange(type)}
              className={`px-3 py-1.5 rounded text-[11px] font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                typeFilter === type
                  ? "bg-brand-cyan/15 border-brand-cyan text-brand-cyan font-bold"
                  : "bg-[var(--panel-header-bg)] border-panel-border text-[var(--muted-text)] hover:text-[var(--foreground)]"
              }`}
            >
              {type === "ALL" ? t("fleet.type_all") : getTypeLabel(type, language)}
            </button>
          ))}
        </div>

        <div className="w-[1px] h-5 bg-panel-border" />

        {/* Status Filter Pills */}
        <div className="flex gap-1">
          {[
            { key: "ALL", label: language === "ko" ? "전체 상태" : "All Status" },
            { key: "SECURE", label: language === "ko" ? "정상" : "Secure" },
            { key: "WARNING", label: language === "ko" ? "주의" : "Warning" },
            { key: "CRITICAL", label: language === "ko" ? "위험" : "Critical" }
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => onStatusFilterChange(st.key)}
              className={`px-2.5 py-1.5 rounded text-[11px] font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                statusFilter === st.key
                  ? "bg-brand-cyan/15 border-brand-cyan text-brand-cyan font-bold"
                  : "bg-[var(--panel-header-bg)] border-panel-border text-[var(--muted-text)] hover:text-[var(--foreground)]"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle: Table / Grid */}
        <div className="flex border border-panel-border rounded-md bg-[var(--panel-header-bg)] p-0.5">
          <button
            onClick={() => onViewModeChange("table")}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              viewMode === "table"
                ? "bg-[var(--panel-bg)] text-brand-cyan shadow-xs"
                : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
            }`}
            title={language === "ko" ? "테이블 뷰" : "Table View"}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-[var(--panel-bg)] text-brand-cyan shadow-xs"
                : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
            }`}
            title={language === "ko" ? "카드 그리드 뷰" : "Grid View"}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
