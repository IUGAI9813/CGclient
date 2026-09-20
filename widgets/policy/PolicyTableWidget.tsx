"use client";

import React, { useMemo } from "react";
import { Edit2, Trash2 } from "lucide-react";
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
        size: 70,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-[var(--muted-text)]">
            {row.original.id.replace("pol-", "P-")}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: language === "ko" ? "정책명" : "Policy",
        cell: ({ row }) => {
          const policy = row.original;
          return (
            <div>
              <span className="font-semibold text-xs text-[var(--foreground)] block">
                {policy.name}
              </span>
              <span className="text-[11px] text-[var(--muted-text)]">
                {policy.cityName} &bull; Priority {policy.priority}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "action",
        header: language === "ko" ? "조치" : "Action",
        size: 110,
        cell: ({ row }) => <PolicyActionBadge action={row.original.action} />,
      },
      {
        id: "districts",
        header: language === "ko" ? "적용 구역" : "Districts",
        enableSorting: false,
        cell: ({ row }) => {
          const dists = row.original.districtNames;
          if (dists.length === 0) return <span className="text-[var(--muted-text)] text-xs">-</span>;
          if (dists.length <= 2) {
            return <span className="text-xs text-[var(--foreground)]">{dists.join(", ")}</span>;
          }
          return (
            <span className="text-xs text-[var(--foreground)]">
              {dists[0]}, {dists[1]}{" "}
              <span className="text-[10px] text-[var(--muted-text)] font-medium font-mono">
                +{dists.length - 2}
              </span>
            </span>
          );
        },
      },
      {
        id: "schedule",
        header: language === "ko" ? "스케줄" : "Schedule",
        enableSorting: false,
        size: 110,
        cell: ({ row }) => {
          const policy = row.original;
          return (
            <span className="text-xs text-[var(--muted-text)] font-mono">
              {policy.startTime && policy.endTime
                ? `${policy.startTime}-${policy.endTime}`
                : "24/7"}
            </span>
          );
        },
      },
      {
        id: "fleetCount",
        header: () => (
          <div className="text-center">{language === "ko" ? "차량" : "Fleet"}</div>
        ),
        size: 70,
        accessorFn: (row) => row.vehicles.length,
        cell: ({ row }) => (
          <div className="text-center text-xs font-mono text-[var(--foreground)]">
            {row.original.vehicles.length}
          </div>
        ),
      },
      {
        id: "status",
        header: () => (
          <div className="text-center">{language === "ko" ? "상태" : "Status"}</div>
        ),
        size: 90,
        cell: () => {
          return (
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
              <span className="text-xs text-[var(--foreground)] font-medium">
                {t("policies.status_active")}
              </span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => null,
        size: 80,
        enableSorting: false,
        cell: ({ row }) => {
          const policy = row.original;
          return (
            <div
              className="flex items-center justify-end gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onEditPolicy(policy)}
                className="p-1 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--panel-header-bg)] transition-colors cursor-pointer"
                title={language === "ko" ? "편집" : "Edit"}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeletePolicy(policy.id)}
                className="p-1 rounded text-[var(--muted-text)] hover:text-brand-rose hover:bg-brand-rose/10 transition-colors cursor-pointer"
                title={language === "ko" ? "삭제" : "Delete"}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        },
      },
    ],
    [language, t, onEditPolicy, onDeletePolicy]
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
            ? "조건에 부합하는 보안 정책이 없습니다."
            : "No security policies matching current criteria."
        }
      />
    </div>
  );
}

