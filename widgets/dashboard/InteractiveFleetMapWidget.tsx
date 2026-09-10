import React, { useState } from "react";
import { useLanguage } from "@/app/components/LanguageContext";

interface MapVehicle {
  id: string;
  x: number;
  y: number;
  status: string;
  type: string;
}

interface InteractiveFleetMapWidgetProps {
  panicMode: boolean;
  onNavigateToTab: (tab: string) => void;
}

export function InteractiveFleetMapWidget({
  panicMode,
  onNavigateToTab
}: InteractiveFleetMapWidgetProps) {
  const { t, language } = useLanguage();
  const [hoveredVehicle, setHoveredVehicle] = useState<string | null>(null);

  const mockVehiclesOnMap: MapVehicle[] = [
    { id: "VEH-42-012", x: 120, y: 150, status: "warning", type: "Robotaxi" },
    { id: "VEH-42-089", x: 280, y: 90, status: "critical", type: "Shuttle" },
    { id: "VEH-42-005", x: 90, y: 80, status: "secure", type: "Robotaxi" },
    { id: "VEH-42-104", x: 210, y: 220, status: "secure", type: "Delivery Pod" },
    { id: "VEH-42-067", x: 340, y: 180, status: "secure", type: "Robotaxi" },
    { id: "VEH-42-132", x: 170, y: 110, status: "secure", type: "Shuttle" }
  ];

  return (
    <div className="cyber-panel rounded overflow-hidden flex flex-col relative h-[360px] font-mono">
      <div className="p-3 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          <span className="text-xs font-bold text-[var(--foreground)] tracking-widest uppercase">
            {t("dashboard.map_header")}
          </span>
        </div>
        <span className="text-[10px] text-zinc-500 font-bold">
          {language === "ko" ? "그리드 스케일: 1:500m" : "GRID SCALE: 1:500m"}
        </span>
      </div>

      {/* Simulated Vector Grid Map */}
      <div className="flex-1 bg-[var(--panel-bg)] relative overflow-hidden flex items-center justify-center p-4">
        {/* Grid map overlay */}
        <div className="absolute inset-0 map-grid opacity-75" />

        {/* Simulated Roads/Sectors */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[80%] h-[1px] bg-zinc-700 transform rotate-12" />
          <div className="w-[80%] h-[1px] bg-zinc-700 transform -rotate-45" />
          <div className="w-[1px] h-[80%] bg-zinc-700 transform translate-x-20" />
          <div className="w-[1px] h-[80%] bg-zinc-700 transform -translate-x-32" />
          <div className="w-[160px] h-[160px] rounded-full border border-dashed border-zinc-500 animate-pulse-slow" />
        </div>

        {/* Central base station */}
        <div className="absolute top-[48%] left-[48%] flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-[var(--panel-bg)] border-2 border-brand-cyan flex items-center justify-center relative">
            <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-ping" />
          </div>
          <span className="text-[8px] text-zinc-500 font-bold mt-1 tracking-tighter">BASE_SOC</span>
        </div>

        {/* Dynamic Vehicle Dots */}
        {mockVehiclesOnMap.map((veh) => {
          const isCritical = veh.status === "critical" || panicMode;
          const isWarning = veh.status === "warning" && !panicMode;
          const colorClass = isCritical
            ? "text-brand-rose bg-brand-rose"
            : isWarning
            ? "text-brand-amber bg-brand-amber"
            : "text-brand-emerald bg-brand-emerald";

          return (
            <div
              key={veh.id}
              className="absolute cursor-pointer transition-all duration-300 transform hover:scale-125 z-10"
              style={{ left: `${veh.x}px`, top: `${veh.y}px` }}
              onMouseEnter={() => setHoveredVehicle(veh.id)}
              onMouseLeave={() => setHoveredVehicle(null)}
              onClick={() => {
                if (isCritical || isWarning) {
                  onNavigateToTab("incidents");
                } else {
                  onNavigateToTab("fleet");
                }
              }}
            >
              {/* Ping Animation Layer */}
              <span
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${colorClass} bg-opacity-20`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${colorClass} border border-black relative ping-dot`} />
              </span>

              {/* Popover overlay on hover */}
              {hoveredVehicle === veh.id && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[var(--panel-bg)] border border-panel-border rounded p-2 text-[9px] w-36 shadow-xl z-30 font-mono text-zinc-400">
                  <div className="font-bold text-[var(--foreground)] border-b border-panel-border pb-1 flex justify-between">
                    <span>{veh.id}</span>
                    <span
                      className={
                        isCritical
                          ? "text-brand-rose"
                          : isWarning
                          ? "text-brand-amber"
                          : "text-brand-emerald"
                      }
                    >
                      {isCritical
                        ? t("incidents.active_stat")
                        : isWarning
                        ? language === "ko"
                          ? "주의"
                          : "WARN"
                        : t("fleet.sensors_ok")}
                    </span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    <div>
                      {language === "ko" ? "유형" : "TYPE"}: {veh.type}
                    </div>
                    <div>
                      {language === "ko" ? "속도" : "SPEED"}: {isCritical ? "0 km/h" : "48 km/h"}
                    </div>
                    <div>GPS: 37.517, 127.047</div>
                    <div className="text-brand-cyan underline cursor-pointer mt-1">
                      {language === "ko" ? "클릭하여 분석" : "Click to analyze"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Map Info Box */}
        <div className="absolute bottom-4 left-4 p-2 bg-[var(--panel-bg)]/95 border border-panel-border rounded text-[9px] space-y-1 z-15 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
            <span className="text-zinc-400">144 {t("dashboard.map.secure_objects")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-amber" />
            <span className="text-zinc-400">3 {t("dashboard.map.warning_overrides")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-pulse" />
            <span className="text-zinc-400">
              {panicMode
                ? `148 ${t("dashboard.map.emergency_tripped")}`
                : `1 ${t("dashboard.map.critical_tamper")}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
