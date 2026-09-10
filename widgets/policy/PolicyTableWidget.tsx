"use client";

import React, { useMemo } from "react";
import { MapPin, Globe, Clock, AlertTriangle, ChevronRight, Sliders, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Policy } from "@/entities/policy/model/types";
import { PolicyActionBadge } from "@/entities/policy/ui/PolicyActionBadge";
import { useLanguage } from "@/app/components/LanguageContext";
import { DataTable } from "@/shared/ui/data-table/DataTable";

interface PolicyTableWidgetProps {
  policies: Policy[];
  selectedPolicyId: string | null;
  onSelectPolicy: (id: string) => void;
  onEditPolicy: (policy: Policy) => void;
  onDeletePolicy: (id: string) => void;
}

export function PolicyTableWidget({
  policies,
  selectedPolicyId,
  onSelectPolicy,
  onEditPolicy,
  onDeletePolicy,
}: PolicyTableWidgetProps) {
  const { t, language } = useLanguage();

  const columns = useMemo<ColumnDef<Policy>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
        cell: ({ row }) => (
          <span className="font-mono font-bold text-[11px] text-[var(--muted-text)] group-hover:text-brand-cyan">
            {row.original.id.replace("pol-", "P-0")}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: language === "ko" ? "정책명 및 적용 권역" : "Policy Name & Scope",
        cell: ({ row }) => {
          const policy = row.original;
          return (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
              <div>
                <span className="font-bold text-sm block group-hover:text-brand-cyan transition-colors">
                  {policy.name}
                </span>
                <span className="text-[10px] text-[var(--muted-text)] flex items-center gap-1.5 mt-0.5">
                  <Globe className="w-2.5 h-2.5" />
                  {policy.cityName} &bull; Priority {policy.priority}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "action",
        header: language === "ko" ? "제어 조치 (Action)" : "Action Type",
        cell: ({ row }) => <PolicyActionBadge action={row.original.action} />,
      },
      {
        id: "districts",
        header: language === "ko" ? "보호 행정구역" : "Covered Districts",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1 max-w-[260px]">
            {row.original.districtNames.map((name) => (
              <span
                key={name}
                className="px-2 py-0.5 text-[10px] font-medium rounded bg-[var(--panel-header-bg)] border border-panel-border text-[var(--foreground)]"
              >
                {name}
              </span>
            ))}
          </div>
        ),
      },
      {
        id: "schedule",
        header: language === "ko" ? "적용 스케줄" : "Schedule",
        enableSorting: false,
        cell: ({ row }) => {
          const policy = row.original;
          return (
            <div className="text-xs font-mono">
              {policy.startTime && policy.endTime ? (
                <span className="flex items-center gap-1 text-[var(--foreground)]">
                  <Clock className="w-3 h-3 text-brand-amber shrink-0" />
                  <span>
                    {policy.startTime} ~ {policy.endTime}
                  </span>
                </span>
              ) : (
                <span className="text-[var(--muted-text)] text-[11px]">
                  24/7 Always Active
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "fleetCount",
        header: () => (
          <div className="text-center">{language === "ko" ? "플릿 (차량)" : "Fleet"}</div>
        ),
        accessorFn: (row) => row.vehicles.length,
        cell: ({ row }) => (
          <div className="text-center font-mono tabular-nums font-bold">
            <span className="px-2 py-0.5 rounded bg-[var(--panel-header-bg)] border border-panel-border text-[11px]">
              {row.original.vehicles.length}대
            </span>
          </div>
        ),
      },
      {
        id: "status",
        header: () => (
          <div className="text-center">{language === "ko" ? "상태" : "Status"}</div>
        ),
        cell: ({ row }) => {
          const policy = row.original;
          return (
            <div className="flex flex-col items-center gap-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/20">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
                {t("policies.status_active")}
              </span>
              {policy.violationsCount > 0 && (
                <span className="text-[9px] text-brand-rose font-bold flex items-center gap-0.5">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  {policy.violationsCount} 위반
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => (
          <div className="text-right">{language === "ko" ? "관리" : "Actions"}</div>
        ),
        enableSorting: false,
        cell: ({ row }) => {
          const policy = row.original;
          return (
            <div
              className="flex items-center justify-end gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onSelectPolicy(policy.id)}
                className="p-1.5 rounded text-[var(--muted-text)] hover:text-brand-cyan hover:bg-brand-cyan/10 border border-panel-border transition-colors cursor-pointer"
                title={language === "ko" ? "상세 정보 (Drawer)" : "Inspect"}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEditPolicy(policy)}
                className="p-1.5 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--panel-header-bg)] border border-panel-border transition-colors cursor-pointer"
                title={language === "ko" ? "편집 (수정)" : "Edit"}
              >
                <Sliders className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeletePolicy(policy.id)}
                className="p-1.5 rounded text-[var(--muted-text)] hover:text-brand-rose hover:bg-brand-rose/10 border border-panel-border transition-colors cursor-pointer"
                title={language === "ko" ? "삭제" : "Delete"}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [language, t, onSelectPolicy, onEditPolicy, onDeletePolicy]
  );

  return (
    <div className="cyber-panel rounded-lg overflow-hidden border border-panel-border font-sans">
      <DataTable
        data={policies}
        columns={columns}
        selectedRowId={selectedPolicyId}
        getRowId={(p) => p.id}
        onRowClick={(p) => onSelectPolicy(p.id)}
        enableSorting={true}
        emptyMessage={
          language === "ko"
            ? "선택된 도시 또는 필터 조건에 부합하는 보안 정책이 없습니다."
            : "No security policies matching current criteria."
        }
      />
    </div>
  );
}
