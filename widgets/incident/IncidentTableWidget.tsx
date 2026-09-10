"use client";

import React, { useMemo } from "react";
import { Car, Check, ChevronRight } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Incident, IncidentStatus } from "@/entities/incident/model/types";
import { IncidentSeverityBadge } from "@/entities/incident/ui/IncidentSeverityBadge";
import { IncidentStatusBadge } from "@/entities/incident/ui/IncidentStatusBadge";
import { useLanguage } from "@/app/components/LanguageContext";
import { DataTable } from "@/shared/ui/data-table/DataTable";

interface IncidentTableWidgetProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  panicMode: boolean;
  onSelectIncident: (inc: Incident) => void;
  onUpdateStatus: (id: string, status: IncidentStatus) => void;
}

export function IncidentTableWidget({
  incidents,
  selectedIncident,
  panicMode,
  onSelectIncident,
  onUpdateStatus,
}: IncidentTableWidgetProps) {
  const { language } = useLanguage();

  const columns = useMemo<ColumnDef<Incident>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
        cell: ({ row }) => (
          <span className="font-mono font-bold text-[11px] text-[var(--muted-text)] group-hover:text-brand-cyan">
            {row.original.id}
          </span>
        ),
      },
      {
        accessorKey: "vehicleId",
        header: language === "ko" ? "대상 차량" : "Vehicle",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-[var(--foreground)]">
            <Car className="w-3.5 h-3.5 text-brand-cyan" />
            <span>{row.original.vehicleId}</span>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: language === "ko" ? "위협 유형 및 설명" : "Threat Class & Summary",
        cell: ({ row }) => {
          const inc = row.original;
          const isCrit = inc.severity === "CRITICAL" || panicMode;
          return (
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                {isCrit && (
                  <span className="w-2 h-2 rounded-full bg-brand-rose animate-ping shrink-0" />
                )}
                <span className="font-bold text-sm text-[var(--foreground)] group-hover:text-brand-cyan transition-colors">
                  {inc.type}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-text)] truncate max-w-md">
                {inc.description}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "severity",
        header: language === "ko" ? "심각도" : "Severity",
        cell: ({ row }) => (
          <IncidentSeverityBadge severity={row.original.severity} />
        ),
      },
      {
        accessorKey: "status",
        header: language === "ko" ? "상태" : "Status",
        cell: ({ row }) => (
          <IncidentStatusBadge status={row.original.status} />
        ),
      },
      {
        accessorKey: "timestamp",
        header: () => (
          <div className="text-right">{language === "ko" ? "감지 시각" : "Timestamp"}</div>
        ),
        cell: ({ row }) => (
          <div className="text-right font-mono text-xs tabular-nums text-[var(--muted-text)]">
            {row.original.timestamp}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => (
          <div className="text-right">{language === "ko" ? "조치 및 분석" : "Actions"}</div>
        ),
        enableSorting: false,
        cell: ({ row }) => {
          const inc = row.original;
          return (
            <div
              className="flex items-center justify-end gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              {inc.status !== "RESOLVED" && (
                <button
                  onClick={() => onUpdateStatus(inc.id, "RESOLVED")}
                  className="p-1.5 rounded text-[var(--muted-text)] hover:text-brand-emerald hover:bg-brand-emerald/10 border border-panel-border transition-colors cursor-pointer"
                  title={language === "ko" ? "해결 처리" : "Resolve"}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => onSelectIncident(inc)}
                className="p-1.5 rounded text-[var(--muted-text)] hover:text-brand-cyan hover:bg-brand-cyan/10 border border-panel-border transition-colors cursor-pointer"
                title={language === "ko" ? "상세 조사 파일 (Drawer)" : "Open Dossier"}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [language, panicMode, onSelectIncident, onUpdateStatus]
  );

  return (
    <div className="cyber-panel rounded-lg overflow-hidden border border-panel-border">
      <DataTable
        data={incidents}
        columns={columns}
        selectedRowId={selectedIncident?.id}
        getRowId={(inc) => inc.id}
        onRowClick={onSelectIncident}
        enableSorting={true}
        emptyMessage={
          language === "ko"
            ? "검색 조건에 부합하는 활성 보안 인시던트가 없습니다."
            : "No active security incidents match the filter criteria."
        }
      />
    </div>
  );
}
