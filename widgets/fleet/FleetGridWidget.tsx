import React from "react";
import { FleetVehicle } from "@/entities/fleet/model/types";
import { VehicleCard } from "@/entities/fleet/ui/VehicleCard";
import { useLanguage } from "@/app/components/LanguageContext";

interface FleetGridWidgetProps {
  vehicles: FleetVehicle[];
  selectedVehicle: FleetVehicle | null;
  panicMode: boolean;
  onSelectVehicle: (veh: FleetVehicle) => void;
}

export function FleetGridWidget({
  vehicles,
  selectedVehicle,
  panicMode,
  onSelectVehicle
}: FleetGridWidgetProps) {
  const { language } = useLanguage();

  if (vehicles.length === 0) {
    return (
      <div className="cyber-panel p-12 text-center text-xs text-[var(--muted-text)] rounded-lg border border-panel-border">
        {language === "ko"
          ? "검색 조건에 해당하는 차량이 없습니다."
          : "No fleet vehicles match search criteria."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      {vehicles.map((veh) => (
        <VehicleCard
          key={veh.id}
          vehicle={veh}
          isSelected={selectedVehicle?.id === veh.id}
          panicMode={panicMode}
          onSelect={onSelectVehicle}
        />
      ))}
    </div>
  );
}
