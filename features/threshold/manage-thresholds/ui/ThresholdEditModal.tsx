import React, { useState } from "react";
import { X, Save, Clock } from "lucide-react";
import { ThresholdRule, TemporalStatus } from "@/entities/threshold/model/types";
import { defaultMetricDefinitions } from "@/entities/threshold/model/mock-data";

interface ThresholdEditModalProps {
  rule: ThresholdRule;
  onSave: (updatedRule: ThresholdRule) => void;
  onClose: () => void;
}

export const ThresholdEditModal: React.FC<ThresholdEditModalProps> = ({
  rule,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<ThresholdRule>({ ...rule });

  const handleMetricChange = (
    warnKey: keyof ThresholdRule,
    critKey: keyof ThresholdRule,
    warnVal: number,
    critVal: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [warnKey]: warnVal,
      [critKey]: critVal,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-mono">
      <div className="cyber-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded p-6 space-y-5 shadow-2xl border-brand-cyan/40">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-panel-border pb-4">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              Parameter & Schedule Configuration
            </span>
            <h2 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
              Configure: {formData.name}
              {formData.version && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-400 border border-panel-border font-normal">
                  {formData.version}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">
                Rule Profile Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full tester-input text-xs"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">
                Timeline State
              </label>
              <select
                value={formData.temporalStatus}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    temporalStatus: e.target.value as TemporalStatus,
                  }))
                }
                className="w-full tester-input text-xs bg-zinc-950 font-bold cursor-pointer"
              >
                <option value="CURRENT">🟢 CURRENT (Active)</option>
                <option value="FUTURE">🔵 FUTURE (Scheduled)</option>
                <option value="HISTORICAL">⚪ HISTORICAL (Archived)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">
                Target Entity Bound
              </label>
              <input
                type="text"
                value={formData.targetName}
                onChange={(e) => setFormData((prev) => ({ ...prev, targetName: e.target.value }))}
                className="w-full tester-input text-xs"
                disabled={formData.scope === "GLOBAL"}
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">
                Change / Audit Reason
              </label>
              <input
                type="text"
                value={formData.changeReason || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, changeReason: e.target.value }))}
                placeholder="e.g. Typhoon weather calibration, battery safety update"
                className="w-full tester-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">
              Description & Security Intent
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full tester-input text-xs resize-y"
            />
          </div>

          {/* Time Window (START_TIME / END_TIME) */}
          <div className="p-3 bg-zinc-950/60 border border-panel-border rounded space-y-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Active Time Window (Database `START_TIME` / `END_TIME`)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  Start Time (leave empty for 24/7 continuous):
                </label>
                <input
                  type="time"
                  value={formData.startTime || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startTime: e.target.value || null,
                    }))
                  }
                  className="tester-input w-full"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  End Time (leave empty for 24/7 continuous):
                </label>
                <input
                  type="time"
                  value={formData.endTime || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endTime: e.target.value || null,
                    }))
                  }
                  className="tester-input w-full"
                />
              </div>
            </div>
          </div>

          {/* Metric Threshold Sliders */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              Sensor & Telemetry Threshold Boundaries
            </span>

            {defaultMetricDefinitions.map((metric) => {
              const warnVal = formData[metric.warnKey] as number;
              const critVal = formData[metric.critKey] as number;

              return (
                <div
                  key={metric.key}
                  className="p-3 bg-zinc-950/40 border border-panel-border rounded space-y-2"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{metric.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Unit: {metric.unit}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px]">
                    <div>
                      <div className="flex justify-between text-zinc-400 mb-1">
                        <span>Warning Level:</span>
                        <span className="text-amber-400 font-bold">
                          {warnVal} {metric.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={metric.min}
                        max={metric.max}
                        step={metric.step}
                        value={warnVal}
                        onChange={(e) =>
                          handleMetricChange(
                            metric.warnKey,
                            metric.critKey,
                            Number(e.target.value),
                            critVal
                          )
                        }
                        className="w-full accent-amber-400 cursor-pointer bg-zinc-900"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-zinc-400 mb-1">
                        <span>Critical Level:</span>
                        <span className="text-rose-400 font-bold">
                          {critVal} {metric.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={metric.min}
                        max={metric.max}
                        step={metric.step}
                        value={critVal}
                        onChange={(e) =>
                          handleMetricChange(
                            metric.warnKey,
                            metric.critKey,
                            warnVal,
                            Number(e.target.value)
                          )
                        }
                        className="w-full accent-rose-400 cursor-pointer bg-zinc-900"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-panel-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-zinc-900 border border-panel-border hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold uppercase transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-brand-cyan hover:bg-cyan-400 text-black text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.25)]"
            >
              <Save className="w-3.5 h-3.5" />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
