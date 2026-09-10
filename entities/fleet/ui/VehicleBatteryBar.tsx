import React from "react";

interface VehicleBatteryBarProps {
  battery: number;
}

export function VehicleBatteryBar({ battery }: VehicleBatteryBarProps) {
  const getBatteryColor = () => {
    if (battery < 20) return "bg-brand-rose";
    if (battery < 50) return "bg-brand-amber";
    return "bg-brand-emerald";
  };

  return (
    <div className="flex items-center gap-2 max-w-[120px]">
      <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBatteryColor()}`}
          style={{ width: `${battery}%` }}
        />
      </div>
      <span className="font-mono text-xs font-bold tabular-nums shrink-0">{battery}%</span>
    </div>
  );
}
