import React from "react";
import { Battery, Gauge } from "lucide-react";
import { FleetVehicle } from "../model/types";
import { getTypeLabel, getLocationLabel } from "../model/mock-data";
import { VehicleStatusBadge } from "./VehicleStatusBadge";
import { useLanguage } from "@/app/components/LanguageContext";

interface VehicleCardProps {
  vehicle: FleetVehicle;
  isSelected: boolean;
  panicMode: boolean;
  onSelect: (v: FleetVehicle) => void;
}

export function VehicleCard({ vehicle, isSelected, panicMode, onSelect }: VehicleCardProps) {
  const { language } = useLanguage();
  const isCrit = vehicle.status === "critical" || panicMode;
  const isWarn = vehicle.status === "warning" && !panicMode;

  return (
    <div
      onClick={() => onSelect(vehicle)}
      className={`cyber-panel p-4 rounded-lg cursor-pointer transition-all hover:translate-y-[-2px] relative flex flex-col justify-between border ${
        isSelected
          ? "border-brand-cyan bg-brand-cyan/10 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
          : isCrit
          ? "border-brand-rose/50 bg-brand-rose/5"
          : isWarn
          ? "border-brand-amber/50 bg-brand-amber/5"
          : "border-panel-border bg-[var(--panel-bg)] hover:bg-[var(--panel-header-bg)]"
      }`}
    >
      {/* Header info */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase">
            {getTypeLabel(vehicle.type, language)}
          </span>
          <h3 className="text-base font-bold text-[var(--foreground)] mt-0.5">{vehicle.id}</h3>
        </div>
        <VehicleStatusBadge status={vehicle.status} panicMode={panicMode} />
      </div>

      {/* Progress bar battery */}
      <div className="my-3 space-y-1">
        <div className="flex justify-between text-[10px] text-[var(--muted-text)]">
          <span className="flex items-center gap-1 font-medium">
            <Battery
              className={`w-3.5 h-3.5 ${vehicle.battery < 20 ? "text-brand-rose" : "text-[var(--muted-text)]"}`}
            />
            {language === "ko" ? "배터리" : "BATTERY"}
          </span>
          <span className="font-bold text-[var(--foreground)] tabular-nums">{vehicle.battery}%</span>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              vehicle.battery < 20 ? "bg-brand-rose" : vehicle.battery < 50 ? "bg-brand-amber" : "bg-brand-emerald"
            }`}
            style={{ width: `${vehicle.battery}%` }}
          />
        </div>
      </div>

      {/* Location & Speed */}
      <div className="flex justify-between items-center text-[10px] text-[var(--muted-text)] border-t border-panel-border pt-2.5 mt-2.5">
        <span className="truncate max-w-[120px] font-medium text-[var(--foreground)]">
          {getLocationLabel(vehicle.location, language)}
        </span>
        <span className="flex items-center gap-1 font-mono font-bold text-[var(--foreground)] shrink-0">
          <Gauge className="w-3 h-3 text-[var(--muted-text)]" />
          <span>
            {isCrit ? 0 : vehicle.speed} / {vehicle.speedLimit} km/h
          </span>
        </span>
      </div>
    </div>
  );
}
