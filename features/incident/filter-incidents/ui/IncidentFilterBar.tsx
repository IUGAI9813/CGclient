import React from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/app/components/LanguageContext";

interface IncidentFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  severityFilter: string;
  onSeverityFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
}

export function IncidentFilterBar({
  searchQuery,
  onSearchChange,
  severityFilter,
  onSeverityFilterChange,
  statusFilter,
  onStatusFilterChange
}: IncidentFilterBarProps) {
  const { t } = useLanguage();

  return (
    <div className="cyber-panel p-3 rounded-lg flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-[var(--muted-text)] absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder={t("incidents.search")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md pl-9 pr-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-brand-cyan transition-colors"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {/* Severity Filters */}
        <div className="flex gap-1">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "INFO"].map((sev) => (
            <button
              key={sev}
              onClick={() => onSeverityFilterChange(sev)}
              className={`px-2.5 py-1.5 rounded text-[11px] font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                severityFilter === sev
                  ? "bg-brand-cyan/15 border-brand-cyan text-brand-cyan font-bold"
                  : "bg-[var(--panel-header-bg)] border-panel-border text-[var(--muted-text)] hover:text-[var(--foreground)]"
              }`}
            >
              {sev === "ALL" ? t("incidents.all") : t("incidents." + sev.toLowerCase() + "_sev")}
            </button>
          ))}
        </div>

        <div className="w-[1px] h-5 bg-panel-border" />

        {/* Status Filters */}
        <div className="flex gap-1">
          {["ALL", "ACTIVE", "TRIAGED", "RESOLVED"].map((stat) => (
            <button
              key={stat}
              onClick={() => onStatusFilterChange(stat)}
              className={`px-2.5 py-1.5 rounded text-[11px] font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                statusFilter === stat
                  ? "bg-brand-cyan/15 border-brand-cyan text-brand-cyan font-bold"
                  : "bg-[var(--panel-header-bg)] border-panel-border text-[var(--muted-text)] hover:text-[var(--foreground)]"
              }`}
            >
              {stat === "ALL" ? "전체" : t("incidents." + stat.toLowerCase() + "_stat")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
