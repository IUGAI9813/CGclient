"use client";

import React, { useMemo } from "react";
import { Edit2, Check, ChevronRight } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { ThresholdRule } from "@/entities/threshold/model/types";
import { ThresholdScopeBadge } from "@/entities/threshold/ui/ThresholdScopeBadge";
import { useLanguage } from "@/app/components/LanguageContext";
import { DataTable } from "@/shared/ui/data-table/DataTable";

interface ThresholdRuleTableWidgetProps {
  rules: ThresholdRule[];
  selectedRuleId: string;
  onSelectRule: (rule: ThresholdRule) => void;
  onOpenEditModal: (rule: ThresholdRule) => void;
  onToggleActive: (id: string) => void;
}

export function ThresholdRuleTableWidget({
  rules,
  selectedRuleId,
  onSelectRule,
  onOpenEditModal,
  onToggleActive,
}: ThresholdRuleTableWidgetProps) {
  const { language } = useLanguage();

  const columns = useMemo<ColumnDef<ThresholdRule>[]>(
    () => [
      {
        accessorKey: "name",
        header: language === "ko" ? "프로필명" : "Profile",
        cell: ({ row }) => {
          const rule = row.original;
          return (
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs text-[var(--foreground)] block">
                  {rule.name}
                </span>
                <span className="text-[10px] text-[var(--muted-text)] font-mono">
                  {rule.version || "v1.0"}
                </span>
              </div>
              <span className="text-[11px] text-[var(--muted-text)] line-clamp-1">
                {rule.description}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "scope",
        header: language === "ko" ? "범위" : "Scope",
        size: 90,
        cell: ({ row }) => <ThresholdScopeBadge scope={row.original.scope} />,
      },
      {
        accessorKey: "targetName",
        header: language === "ko" ? "적용 대상" : "Target",
        size: 130,
        cell: ({ row }) => {
          const rule = row.original;
          return (
            <div className="text-xs">
              <span className="text-[var(--foreground)] font-medium">{rule.targetName}</span>
            </div>
          );
        },
      },
      {
        id: "thresholds",
        header: language === "ko" ? "한계치 (속도 / 지연 / 배터리)" : "Threshold Limits",
        enableSorting: false,
        cell: ({ row }) => {
          const rule = row.original;
          return (
            <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--muted-text)]">
              <span>속도: <strong className="text-[var(--foreground)]">{rule.speedCrit}km/h</strong></span>
              <span>&bull;</span>
              <span>지연: <strong className="text-[var(--foreground)]">{rule.latencyCrit}ms</strong></span>
              <span>&bull;</span>
              <span>배터리: <strong className="text-[var(--foreground)]">{rule.batteryWarn}%</strong></span>
            </div>
          );
        },
      },
      {
        id: "status",
        header: () => (
          <div className="text-center">{language === "ko" ? "상태" : "Status"}</div>
        ),
        size: 80,
        cell: ({ row }) => {
          const rule = row.original;
          return (
            <div className="flex items-center justify-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  rule.isActive ? "bg-brand-emerald" : "bg-zinc-500"
                }`}
              />
              <span className="text-xs text-[var(--foreground)] font-medium">
                {rule.isActive ? (language === "ko" ? "활성" : "Active") : (language === "ko" ? "비활성" : "Off")}
              </span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => null,
        size: 90,
        enableSorting: false,
        cell: ({ row }) => {
          const rule = row.original;
          return (
            <div
              className="flex items-center justify-end gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onToggleActive(rule.id)}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  rule.isActive
                    ? "text-brand-emerald hover:bg-brand-emerald/10"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                title={rule.isActive ? "Deactivate" : "Activate"}
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenEditModal(rule)}
                className="p-1 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--panel-header-bg)] transition-colors cursor-pointer"
                title={language === "ko" ? "편집" : "Edit"}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSelectRule(rule)}
                className="p-1 rounded text-[var(--muted-text)] hover:text-brand-cyan hover:bg-brand-cyan/10 transition-colors cursor-pointer"
                title={language === "ko" ? "상세 정보" : "Inspect"}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        },
      },
    ],
    [language, onToggleActive, onOpenEditModal, onSelectRule]
  );

  return (
    <div className="cyber-panel rounded-lg overflow-hidden border border-panel-border font-sans">
      <DataTable
        data={rules}
        columns={columns}
        selectedRowId={selectedRuleId}
        getRowId={(rule) => rule.id}
        onRowClick={onSelectRule}
        enableSorting={true}
        emptyMessage={
          language === "ko"
            ? "조건에 부합하는 임계값 규칙이 없습니다."
            : "No threshold rule profiles matching current filter criteria."
        }
      />
    </div>
  );
}
