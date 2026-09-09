import React from "react";
import { Edit3, Layers, Lock, Tag } from "lucide-react";
import { ThresholdRule } from "@/entities/threshold/model/types";
import { defaultMetricDefinitions } from "@/entities/threshold/model/mock-data";
import { ThresholdScopeBadge } from "@/entities/threshold/ui/ThresholdScopeBadge";
import { ThresholdTimelineBadge } from "@/entities/threshold/ui/ThresholdTimelineBadge";
import { ThresholdMetricCard } from "@/entities/threshold/ui/ThresholdMetricCard";

interface ThresholdPolicyBindingWidgetProps {
  rules: ThresholdRule[];
  selectedRule: ThresholdRule;
  onSelectRule: (rule: ThresholdRule) => void;
  onOpenEditModal: (rule: ThresholdRule) => void;
}

export const ThresholdPolicyBindingWidget: React.FC<ThresholdPolicyBindingWidgetProps> = ({
  rules,
  selectedRule,
  onOpenEditModal,
  onSelectRule,
}) => {
  return (
    <div className="space-y-4 font-mono">
      {/* Precedence Banner */}
      <div className="p-3 bg-zinc-950/80 border border-panel-border rounded flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-zinc-300">
          <Layers className="w-4 h-4 text-brand-cyan shrink-0" />
          <span className="font-bold text-white">Precedence Hierarchy:</span>
          <span className="text-amber-400 font-bold">1. Geofence Policy</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="text-purple-400 font-bold">2. Vehicle Type</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="text-cyan-400 font-bold">3. Global Baseline</span>
        </div>
        <span className="text-[10px] text-zinc-500">
          High-priority geofences automatically override general fleet baselines.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rules Listing (5 Columns) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider px-1">
            <span>Threshold Profiles ({rules.length})</span>
            <span>Click to Inspect</span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {rules.map((rule) => {
              const isSelected = selectedRule.id === rule.id;
              return (
                <div
                  key={rule.id}
                  onClick={() => onSelectRule(rule)}
                  className={`p-3.5 rounded border transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-zinc-900/90 border-brand-cyan shadow-[inset_3px_0_0_var(--brand-cyan)]"
                      : "bg-zinc-950/40 border-panel-border hover:border-zinc-700 hover:bg-zinc-900/40"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <ThresholdScopeBadge scope={rule.scope} />
                        <ThresholdTimelineBadge
                          temporalStatus={rule.temporalStatus}
                          startTime={rule.startTime}
                          endTime={rule.endTime}
                          effectiveDate={rule.effectiveDate}
                        />
                        {rule.version && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-panel-border">
                            {rule.version}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white tracking-wide">
                        {rule.name}
                      </h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditModal(rule);
                      }}
                      className="p-1.5 rounded bg-zinc-900 border border-panel-border text-zinc-400 hover:text-white hover:border-brand-cyan transition-colors cursor-pointer shrink-0"
                      title="Configure Rule Parameters"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-400 mt-2 line-clamp-2">
                    {rule.description}
                  </p>

                  {rule.changeReason && (
                    <div className="mt-2 text-[10px] text-zinc-500 flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5 text-zinc-600" />
                      <span className="truncate">Reason: {rule.changeReason}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-panel-border/50 text-[10px]">
                    <span className="text-zinc-500">
                      Target: <strong className="text-zinc-300">{rule.targetName}</strong>
                    </span>
                    <span className="text-zinc-500 font-mono text-[9px]">
                      {rule.updatedAt.split(" ")[0]}
                    </span>
                  </div>
                </div>
              );
            })}

            {rules.length === 0 && (
              <div className="cyber-panel p-8 rounded text-center text-zinc-500 text-xs">
                No threshold rules found matching the selected state/scope filter.
              </div>
            )}
          </div>
        </div>

        {/* Rule Details & Read-Only Metric Gauges (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-panel-border pb-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <ThresholdScopeBadge scope={selectedRule.scope} />
                  <ThresholdTimelineBadge
                    temporalStatus={selectedRule.temporalStatus}
                    startTime={selectedRule.startTime}
                    endTime={selectedRule.endTime}
                    effectiveDate={selectedRule.effectiveDate}
                  />
                  {selectedRule.version && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-300 border border-cyan-500/30">
                      Release: {selectedRule.version}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white">{selectedRule.name}</h3>
                <span className="text-[11px] text-zinc-400 block mt-0.5">
                  Applied Target: <span className="text-brand-cyan">{selectedRule.targetName}</span>
                </span>
              </div>

              <button
                onClick={() => onOpenEditModal(selectedRule)}
                className="px-3.5 py-2 rounded bg-brand-cyan hover:bg-cyan-400 text-black text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Configure
              </button>
            </div>

            {/* Read-Only Safety Banner */}
            <div className="p-2.5 bg-zinc-950/70 border border-panel-border rounded flex items-center justify-between text-[10px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Values are in read-only inspection mode. Click <strong>Configure</strong> to alter boundaries.</span>
              </div>
              <span className="text-zinc-500 font-mono">5 Telemetry Channels</span>
            </div>

            {/* Read-Only Metric cards */}
            <div className="space-y-3">
              {defaultMetricDefinitions.map((metric) => (
                <ThresholdMetricCard
                  key={metric.key}
                  metric={metric}
                  rule={selectedRule}
                />
              ))}
            </div>

            {/* Footer Metadata */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-3 border-t border-panel-border text-[10px] text-zinc-500">
              <span>Author / Updater: <strong className="text-zinc-300">{selectedRule.updatedBy}</strong></span>
              <span>Audit Timestamp: <strong className="text-zinc-400">{selectedRule.updatedAt}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
