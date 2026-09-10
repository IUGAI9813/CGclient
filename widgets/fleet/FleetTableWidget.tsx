"use client";

import React, { useMemo } from "react";
import { MapPin, Gauge, Sliders, ChevronRight } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { FleetVehicle } from "@/entities/fleet/model/types";
import { getTypeLabel, getLocationLabel } from "@/entities/fleet/model/mock-data";
import { VehicleStatusBadge } from "@/entities/fleet/ui/VehicleStatusBadge";
import { VehicleBatteryBar } from "@/entities/fleet/ui/VehicleBatteryBar";
import { useLanguage } from "@/app/components/LanguageContext";
import { DataTable } from "@/shared/ui/data-table/DataTable";

interface FleetTableWidgetProps {
  vehicles: FleetVehicle[];
  selectedVehicle: FleetVehicle | null;
  panicMode: boolean;
  onSelectVehicle: (veh: FleetVehicle) => void;
  onOpenSpeedModal: (veh: FleetVehicle) => void;
}

export function FleetTableWidget({
  vehicles,
  selectedVehicle,
  panicMode,
  onSelectVehicle,
  onOpenSpeedModal,
}: FleetTableWidgetProps) {
  const { language } = useLanguage();

  const columns = useMemo<ColumnDef<FleetVehicle>[]>(
    () => [
      {
        accessorKey: "id",
        header: language === "ko" ? "차량 식별자 (ID)" : "Vehicle ID",
        cell: ({ row }) => (
          <span className="font-mono font-bold text-sm text-[var(--foreground)] group-hover:text-brand-cyan">
            {row.original.id}
          </span>
        ),
      },
      {
        accessorKey: "type",
        header: language === "ko" ? "차종" : "Type",
        cell: ({ row }) => (
          <span className="font-medium text-[var(--foreground)]">
            {getTypeLabel(row.original.type, language)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: language === "ko" ? "상태" : "Status",
        cell: ({ row }) => (
          <VehicleStatusBadge status={row.original.status} panicMode={panicMode} />
        ),
      },
      {
        accessorKey: "location",
        header: language === "ko" ? "배치 지역 (Zone)" : "Deployment Zone",
        cell: ({ row }) => (
          <span className="flex items-center gap-1.5 font-medium text-xs">
            <MapPin className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
            <span>{getLocationLabel(row.original.location, language)}</span>
          </span>
        ),
      },
      {
        accessorKey: "battery",
        header: language === "ko" ? "배터리" : "Battery",
        cell: ({ row }) => <VehicleBatteryBar battery={row.original.battery} />,
      },
      {
        accessorKey: "speed",
        header: language === "ko" ? "주행 속도 / 제한" : "Speed / Limit",
        cell: ({ row }) => {
          const veh = row.original;
          const isCrit = veh.status === "critical" || panicMode;
          return (
            <div className="flex items-center gap-1 font-mono tabular-nums">
              <Gauge className="w-3.5 h-3.5 text-[var(--muted-text)]" />
              <span className="font-bold">{isCrit ? 0 : veh.speed}</span>
              <span className="text-[var(--muted-text)] text-[11px]">
                / {veh.speedLimit} km/h
              </span>
            </div>
          );
        },
      },
      {
        id: "sensors",
        header: language === "ko" ? "센서 스택 진단" : "Sensor Diagnostics",
        enableSorting: false,
        cell: ({ row }) => {
          const veh = row.original;
          return (
            <div className="flex items-center gap-1.5 text-[9px] font-mono">
              <span
                className={`px-1.5 py-0.5 rounded border ${
                  veh.lidar === "SECURE"
                    ? "border-brand-emerald/30 text-brand-emerald bg-brand-emerald/5"
                    : "border-brand-rose/30 text-brand-rose bg-brand-rose/10 font-bold"
                }`}
              >
                LiDAR
              </span>
              <span
                className={`px-1.5 py-0.5 rounded border ${
                  veh.radar === "SECURE"
                    ? "border-brand-emerald/30 text-brand-emerald bg-brand-emerald/5"
                    : "border-brand-amber/30 text-brand-amber bg-brand-amber/10 font-bold"
                }`}
              >
                Radar
              </span>
              <span
                className={`px-1.5 py-0.5 rounded border ${
                  veh.camera === "SECURE"
                    ? "border-brand-emerald/30 text-brand-emerald bg-brand-emerald/5"
                    : "border-brand-rose/30 text-brand-rose bg-brand-rose/10 font-bold"
                }`}
              >
                Cam
              </span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => (
          <div className="text-right">{language === "ko" ? "제어 및 분석" : "Actions"}</div>
        ),
        enableSorting: false,
        cell: ({ row }) => {
          const veh = row.original;
          return (
            <div
              className="flex items-center justify-end gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onOpenSpeedModal(veh)}
                className="px-2.5 py-1 rounded bg-[var(--panel-header-bg)] hover:bg-brand-cyan/15 hover:text-brand-cyan border border-panel-border text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                title={language === "ko" ? "속도 제한 제어기" : "Speed Limit Governor"}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{veh.speedLimit}km/h</span>
              </button>
              <button
                onClick={() => onSelectVehicle(veh)}
                className="p-1.5 rounded text-[var(--muted-text)] hover:text-brand-cyan hover:bg-brand-cyan/10 border border-panel-border transition-colors cursor-pointer"
                title={language === "ko" ? "상세 텔레메트리 (Drawer)" : "Inspect Telematics"}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [language, panicMode, onOpenSpeedModal, onSelectVehicle]
  );

  return (
    <div className="cyber-panel rounded-lg overflow-hidden border border-panel-border font-sans">
      <DataTable
        data={vehicles}
        columns={columns}
        selectedRowId={selectedVehicle?.id}
        getRowId={(veh) => veh.id}
        onRowClick={onSelectVehicle}
        enableSorting={true}
        emptyMessage={
          language === "ko"
            ? "검색 조건에 해당하는 차량이 없습니다."
            : "No fleet vehicles match search criteria."
        }
      />
    </div>
  );
}
