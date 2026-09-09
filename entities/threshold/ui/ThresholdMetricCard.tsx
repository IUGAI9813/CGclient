import React from "react";
import { Activity, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { MetricDefinition, ThresholdRule } from "../model/types";

interface ThresholdMetricCardProps {
  metric: MetricDefinition;
  rule: ThresholdRule;
}

export const ThresholdMetricCard: React.FC<ThresholdMetricCardProps> = ({
  metric,
  rule,
}) => {
  const warnVal = rule[metric.warnKey] as number;
  const critVal = rule[metric.critKey] as number;

  return (
    <div className="cyber-panel p-3.5 rounded space-y-2.5 font-mono bg-zinc-950/40 border-panel-border hover:border-zinc-700 transition-colors">
      {/* Metric Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-brand-cyan" />
          <span className="text-xs font-bold text-white uppercase tracking-wide">
            {metric.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5" />
            WARN: {warnVal}{metric.unit}
          </span>
          <span className="text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded flex items-center gap-1">
            <ShieldAlert className="w-2.5 h-2.5" />
            CRIT: {critVal}{metric.unit}
          </span>
        </div>
      </div>

      {/* Visual threshold band bar */}
      <div className="space-y-1">
        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden flex border border-panel-border/80">
          {metric.invertCrit ? (
            <>
              {/* Critical is at lower values (e.g. Battery, LiDAR) */}
              <div
                className="bg-rose-500/90 h-full transition-all"
                style={{ width: `${Math.max(5, ((critVal - metric.min) / (metric.max - metric.min)) * 100)}%` }}
                title={`Critical: < ${critVal}${metric.unit}`}
              />
              <div
                className="bg-amber-500/90 h-full transition-all"
                style={{ width: `${Math.max(5, ((warnVal - critVal) / (metric.max - metric.min)) * 100)}%` }}
                title={`Warning: < ${warnVal}${metric.unit}`}
              />
              <div className="bg-emerald-500/90 h-full flex-1 transition-all" title="Nominal Safe Zone" />
            </>
          ) : (
            <>
              {/* Critical is at higher values (e.g. Latency, Speed, CAN Errors) */}
              <div
                className="bg-emerald-500/90 h-full transition-all"
                style={{ width: `${Math.max(5, ((warnVal - metric.min) / (metric.max - metric.min)) * 100)}%` }}
                title="Nominal Safe Zone"
              />
              <div
                className="bg-amber-500/90 h-full transition-all"
                style={{ width: `${Math.max(5, ((critVal - warnVal) / (metric.max - metric.min)) * 100)}%` }}
                title={`Warning: > ${warnVal}${metric.unit}`}
              />
              <div className="bg-rose-500/90 h-full flex-1 transition-all" title={`Critical: > ${critVal}${metric.unit}`} />
            </>
          )}
        </div>
      </div>

      {/* Read-Only Bounds Summary */}
      <div className="flex justify-between items-center text-[10px] text-zinc-400 pt-1 border-t border-panel-border/40">
        <div className="flex items-center gap-1 text-emerald-400">
          <CheckCircle2 className="w-3 h-3" />
          <span>
            Nominal: {metric.invertCrit ? `> ${warnVal}${metric.unit}` : `< ${warnVal}${metric.unit}`}
          </span>
        </div>
        <div className="flex items-center gap-3 text-zinc-500 font-mono text-[9px]">
          <span>Range: {metric.min}{metric.unit} - {metric.max}{metric.unit}</span>
        </div>
      </div>
    </div>
  );
};
