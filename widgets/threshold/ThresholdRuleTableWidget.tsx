"use client";

import React, { useMemo } from "react";
import { Gauge, Sliders, ChevronRight, Check } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { ThresholdRule } from "@/entities/threshold/model/types";
import { ThresholdScopeBadge } from "@/entities/threshold/ui/ThresholdScopeBadge";
import { ThresholdTimelineBadge } from "@/entities/threshold/ui/ThresholdTimelineBadge";
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
        header: language === "ko" ? "프로필명 / 버전" : "Profile & Version",
        cell: ({ row }) => {
          const rule = row.original;
          return (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm block group-hover:text-brand-cyan transition-colors">
                  {rule.name}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-zinc-900 border border-panel-border text-zinc-400">
                  {rule.version || "v1.0"}
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                {rule.description}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "scope",
        header: language === "ko" ? "적용 범위" : "Scope",
        cell: ({ row }) => <ThresholdScopeBadge scope={row.original.scope} />,
      },
      {
        accessorKey: "targetName",
        header: language === "ko" ? "적용 대상" : "Target Bound",
        cell: ({ row }) => {
          const rule = row.original;
          return (
            <div className="font-mono text-xs">
              <span className="text-zinc-200 font-bold">{rule.targetName}</span>
              <span className="text-[10px] text-zinc-500 block">ID: {rule.targetId}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "temporalStatus",
        header: language === "ko" ? "타임라인 상태" : "Timeline State",
        cell: ({ row }) => {
          const rule = row.original;
          return (
            <ThresholdTimelineBadge
              temporalStatus={rule.temporalStatus}
              startTime={rule.startTime}
              endTime={rule.endTime}
              effectiveDate={rule.effectiveDate}
            />
          );
        },
      },
      {
        id: "thresholds",
        header:
          language === "ko"
            ? "안전 한계치 요약 (속도 / 지연 / 배터리)"
            : "Threshold Limits",
        enableSorting: false,
        cell: ({ row }) => {
          const rule = row.original;
          return (
            <div className="flex flex-wrap gap-2 font-mono text-[11px] text-zinc-400">
              <span className="text-amber-400">
                Spd: {rule.speedWarn}/{rule.speedCrit}km/h
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-cyan-400">
                Lat: {rule.latencyWarn}/{rule.latencyCrit}ms
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-emerald-400">Bat: {rule.batteryWarn}%</span>
            </div>
          );
        },
      },
      {
        accessorKey: "updatedBy",
        header: language === "ko" ? "최종 수정자" : "Updated By",
        cell: ({ row }) => {
          const rule = row.original;
          return (
            <div className="text-[10px] text-zinc-500 font-mono">
              <div>{rule.updatedBy}</div>
              <div className="text-[9px] text-zinc-600">{rule.updatedAt}</div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => (
          <div className="text-right">{language === "ko" ? "작업" : "Actions"}</div>
        ),
        enableSorting: false,
        cell: ({ row }) => {
          const rule = row.original;
          return (
            <div
              className="flex items-center justify-end gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onToggleActive(rule.id)}
                className={`p-1.5 rounded border transition-colors cursor-pointer ${
                  rule.isActive
                    ? "bg-brand-emerald/10 border-brand-emerald/30 text-brand-emerald hover:bg-brand-emerald/20"
                    : "bg-zinc-900 border-panel-border text-zinc-500 hover:text-zinc-300"
                }`}
                title={rule.isActive ? "Deactivate Rule" : "Activate Rule"}
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenEditModal(rule)}
                className="p-1.5 rounded bg-[var(--panel-header-bg)] hover:bg-brand-cyan/15 hover:text-brand-cyan border border-panel-border text-zinc-400 text-xs transition-colors cursor-pointer"
                title={language === "ko" ? "파라미터 편집" : "Edit Parameters"}
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSelectRule(rule)}
                className="p-1.5 rounded text-zinc-400 hover:text-brand-cyan hover:bg-brand-cyan/10 border border-panel-border transition-colors cursor-pointer"
                title={language === "ko" ? "진단 서랍 열기" : "Open Diagnostics"}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [language, onToggleActive, onOpenEditModal, onSelectRule]
  );

  return (
    <div className="cyber-panel rounded overflow-hidden font-mono">
      <div className="p-3.5 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-brand-cyan" />
          <span className="text-xs font-bold text-[var(--foreground)] tracking-widest uppercase">
            {language === "ko"
              ? "임계값 규칙 프로필 마스터 목록"
              : "THRESHOLD PROFILES MASTER REPOSITORY"}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/25 font-bold">
            {rules.length} {language === "ko" ? "개 규칙" : "Profiles"}
          </span>
        </div>
        <span className="text-[10px] text-zinc-500 font-semibold">
          {language === "ko"
            ? "행을 클릭하면 상세 센서 진단 서랍이 열립니다"
            : "Click row to open diagnostic telemetry drawer"}
        </span>
      </div>

      <DataTable
        data={rules}
        columns={columns}
        selectedRowId={selectedRuleId}
        getRowId={(rule) => rule.id}
        onRowClick={onSelectRule}
        enableSorting={true}
        emptyMessage={
          language === "ko"
            ? "선택한 필터 조건에 부합하는 임계값 규칙 프로필이 없습니다."
            : "No threshold rule profiles matching current filter criteria."
        }
      />
    </div>
  );
}
