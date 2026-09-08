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
    <div className="cyber-panel p-3 rounded flex flex-col sm:flex-row items-center gap-3 justify-between bg-zinc-950/40">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-500" />
        <input
          type="text"
          placeholder="Filter endpoints by URI or upstream..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-zinc-900 border border-panel-border rounded pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-brand-cyan"
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-2 py-1 text-[10px] font-bold rounded border transition-colors cursor-pointer ${
              selectedCategory === cat
                ? "bg-brand-cyan/20 border-brand-cyan text-brand-cyan"
                : "bg-zinc-900 border-panel-border text-zinc-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
