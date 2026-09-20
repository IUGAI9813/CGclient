import React from "react";
import { Search } from "lucide-react";
import { RouteCategory } from "@/entities/gateway/model/types";

interface RouteFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: RouteCategory) => void;
}

const CATEGORIES: RouteCategory[] = ["ALL", "Telemetry", "Fleet Control", "OTA", "Partner"];

export const RouteFilterBar: React.FC<RouteFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 justify-between font-sans">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--muted-text)]" />
        <input
          type="text"
          placeholder="Filter URI or upstream service..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md pl-8.5 pr-3 py-1.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus:border-brand-cyan outline-none transition-colors"
        />
      </div>

      <div className="flex items-center gap-1 bg-[var(--panel-header-bg)] p-1 rounded-md border border-panel-border overflow-x-auto scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? "bg-[var(--panel-bg)] text-brand-cyan font-semibold shadow-2xs"
                : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

