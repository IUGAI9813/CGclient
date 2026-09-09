import React, { useState } from "react";
import { X, Save, Clock, Plus, Sliders, Globe, Shield, Car, CheckSquare, Square } from "lucide-react";
import { ThresholdRule, TemporalStatus, ThresholdScope } from "@/entities/threshold/model/types";
import { defaultMetricDefinitions } from "@/entities/threshold/model/mock-data";
import { useLanguage } from "@/app/components/LanguageContext";

interface ThresholdEditModalProps {
  rule: ThresholdRule;
  onSave: (updatedRule: ThresholdRule) => void;
  onClose: () => void;
  isNew?: boolean;
}

export const ThresholdEditModal: React.FC<ThresholdEditModalProps> = ({
  rule,
  onSave,
  onClose,
  isNew = false,
}) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<ThresholdRule>({ ...rule });

  // Predefined Policies
  const policyOptions = [
    { id: "pol-1", name: language === "ko" ? "강남구 테헤란로 배송 안전 구역" : "Gangnam Teheran-ro Delivery Bounds" },
    { id: "pol-2", name: language === "ko" ? "강남/서초 광역 순찰 및 비상 제어 구역" : "Gangnam & Seocho Combined Patrol Corridor" },
    { id: "pol-3", name: language === "ko" ? "판교 테크노밸리 자율주행 특구" : "Pangyo Techno Valley Autonomous Testbed" },
    { id: "pol-school", name: language === "ko" ? "어린이보호구역 안심존 (제한속도 30)" : "School Safety Zone Restrictive" },
    { id: "pol-sangam", name: language === "ko" ? "상암 DMC 자율주행 시범지구" : "Sangam DMC Autonomous District" },
    { id: "custom", name: language === "ko" ? "직접 입력 (신규 지오펜스)..." : "Custom Geofence Policy..." },
  ];

  // Predefined Vehicle Types
  const vehicleTypeOptions = [
    { id: "ROBOTAXI", short: language === "ko" ? "로보택시" : "Robotaxi", desc: language === "ko" ? "승객 운송용 L4" : "Passenger L4 Fleet" },
    { id: "SHUTTLE", short: language === "ko" ? "자율주행 셔틀" : "Transit Shuttle", desc: language === "ko" ? "대중교통 버스" : "Autonomous Bus" },
    { id: "DELIVERY", short: language === "ko" ? "도심 배달 포드" : "Delivery Pod", desc: language === "ko" ? "라스트마일 화물" : "Cargo Delivery" },
  ];

  const isVehicleTypeChecked = (typeId: string) => {
    if (!formData.targetId) return false;
    const ids = formData.targetId.split(",").map((s) => s.trim().toUpperCase());
    return ids.includes(typeId.toUpperCase()) || formData.targetName.toUpperCase().includes(typeId.toUpperCase());
  };

  const toggleVehicleType = (typeId: string, shortName: string) => {
    let currentIds = formData.targetId ? formData.targetId.split(",").map((s) => s.trim()).filter(Boolean) : [];
    let currentNames = formData.targetName ? formData.targetName.split(",").map((s) => s.trim()).filter(Boolean) : [];

    if (currentIds.includes(typeId)) {
      currentIds = currentIds.filter((id) => id !== typeId);
      currentNames = currentNames.filter((name) => !name.includes(shortName));
    } else {
      currentIds.push(typeId);
      currentNames.push(shortName);
    }

    if (currentIds.length === 0) {
      currentIds = [typeId];
      currentNames = [shortName];
    }

    setFormData((prev) => ({
      ...prev,
      targetId: currentIds.join(","),
      targetName: currentNames.join(", "),
    }));
  };

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
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block flex items-center gap-1.5">
              {isNew ? <Plus className="w-3 h-3 text-brand-cyan" /> : <Sliders className="w-3 h-3 text-brand-cyan" />}
              {isNew 
                ? (language === "ko" ? "신규 안전 임계값 등록" : "NEW THRESHOLD PROFILE REGISTRATION")
                : (language === "ko" ? "파라미터 및 스케줄 구성" : "PARAMETER & SCHEDULE CONFIGURATION")}
            </span>
            <h2 className="text-base font-bold text-[var(--foreground)] mt-0.5 flex items-center gap-2">
              {isNew 
                ? (language === "ko" ? "새로운 임계값 규칙 프로필 생성" : "Create New Threshold Profile")
                : (language === "ko" ? `임계값 설정: ${formData.name}` : `Configure: ${formData.name}`)}
              {formData.version && !isNew && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--panel-header-bg)] text-brand-cyan border border-panel-border font-normal">
                  {formData.version}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--panel-header-bg)] text-zinc-400 hover:text-[var(--foreground)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={isNew ? "sm:col-span-1" : "sm:col-span-2"}>
              <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">
                {language === "ko" ? "프로필명 (Rule Name)" : "Rule Profile Name"}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={language === "ko" ? "예: 판교 야간 감속 프로필" : "e.g. Pangyo Night Corridor"}
                className="w-full tester-input text-xs"
                required
              />
            </div>

            {isNew && (
              <div>
                <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">
                  {language === "ko" ? "적용 범위 (Scope)" : "Target Scope"}
                </label>
                <select
                  value={formData.scope}
                  onChange={(e) => {
                    const newScope = e.target.value as ThresholdScope;
                    let newTargetId = "GLOBAL";
                    let newTargetName = "All Connected Vehicles (148 Fleet)";
                    if (newScope === "GLOBAL") {
                      newTargetId = "GLOBAL";
                      newTargetName = language === "ko" ? "전체 커넥티드 플릿 (148대)" : "All Connected Vehicles (148 Fleet)";
                    } else if (newScope === "POLICY") {
                      newTargetId = policyOptions[0].id;
                      newTargetName = policyOptions[0].name;
                    } else if (newScope === "VEHICLE_TYPE") {
                      newTargetId = vehicleTypeOptions[0].id;
                      newTargetName = vehicleTypeOptions[0].short;
                    }
                    setFormData((prev) => ({
                      ...prev,
                      scope: newScope,
                      targetId: newTargetId,
                      targetName: newTargetName,
                    }));
                  }}
                  className="w-full tester-input text-xs bg-[var(--input-bg)] text-[var(--foreground)] font-bold cursor-pointer"
                >
                  <option value="POLICY">🛡️ {language === "ko" ? "지오펜스 정책 (Policy)" : "Geofence Policy"}</option>
                  <option value="VEHICLE_TYPE">🚗 {language === "ko" ? "차종별 프로필 (Vehicle)" : "Vehicle Type"}</option>
                  <option value="GLOBAL">🌐 {language === "ko" ? "글로벌 기본 (Global)" : "Global Baseline"}</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">
                {language === "ko" ? "타임라인 상태 (Timeline)" : "Timeline State"}
              </label>
              <select
                value={formData.temporalStatus}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    temporalStatus: e.target.value as TemporalStatus,
                  }))
                }
                className="w-full tester-input text-xs bg-[var(--input-bg)] text-[var(--foreground)] font-bold cursor-pointer"
              >
                <option value="CURRENT">🟢 {language === "ko" ? "현재 적용 (Active)" : "CURRENT (Active)"}</option>
                <option value="FUTURE">🔵 {language === "ko" ? "적용 예정 (Scheduled)" : "FUTURE (Scheduled)"}</option>
                <option value="HISTORICAL">⚪ {language === "ko" ? "아카이브 (Archived)" : "HISTORICAL (Archived)"}</option>
              </select>
            </div>
          </div>

          {/* Dynamic Target Entity Binding Section */}
          <div className="space-y-1.5 p-3 rounded bg-[var(--panel-header-bg)]/40 border border-panel-border">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1.5">
                {formData.scope === "GLOBAL" && <Globe className="w-3.5 h-3.5 text-cyan-400" />}
                {formData.scope === "POLICY" && <Shield className="w-3.5 h-3.5 text-amber-400" />}
                {formData.scope === "VEHICLE_TYPE" && <Car className="w-3.5 h-3.5 text-purple-400" />}
                <span>
                  {language === "ko" ? "적용 바인딩 대상 (Target Entity Bound)" : "Target Entity Bound"}
                  {formData.scope === "POLICY" && (language === "ko" ? " — 지오펜스 정책 목록 선택" : " — Select Policy Zone")}
                  {formData.scope === "VEHICLE_TYPE" && (language === "ko" ? " — 적용 차종 체크박스 선택" : " — Check Applicable Vehicle Types")}
                </span>
              </label>
              <span className="text-[10px] font-mono text-zinc-500">
                Scope: <strong className={formData.scope === "POLICY" ? "text-amber-400" : formData.scope === "VEHICLE_TYPE" ? "text-purple-400" : "text-cyan-400"}>{formData.scope}</strong>
              </span>
            </div>

            {/* Scope 1: GLOBAL */}
            {formData.scope === "GLOBAL" && (
              <div className="p-3 rounded bg-[var(--panel-bg)] border border-panel-border flex items-center gap-3">
                <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--foreground)]">
                    {language === "ko" ? "전체 커넥티드 플릿 (148대 기본 적용)" : "All Connected Vehicles (148 Fleet Baseline)"}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {language === "ko" 
                      ? "글로벌 기본 프로필은 특정 차종이나 지오펜스 예외가 없는 모든 차량에 공통 적용됩니다." 
                      : "Applies across all connected vehicles in the fleet as default baseline."}
                  </div>
                </div>
              </div>
            )}

            {/* Scope 2: POLICY (Dropdown list of policies + custom option) */}
            {formData.scope === "POLICY" && (
              <div className="space-y-2">
                <select
                  value={
                    policyOptions.some((p) => p.id === formData.targetId || p.name === formData.targetName)
                      ? (policyOptions.find((p) => p.id === formData.targetId || p.name === formData.targetName)?.id || "custom")
                      : "custom"
                  }
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    if (selectedId === "custom") {
                      setFormData((prev) => ({ ...prev, targetId: "custom-policy", targetName: "" }));
                    } else {
                      const found = policyOptions.find((p) => p.id === selectedId);
                      if (found) {
                        setFormData((prev) => ({ ...prev, targetId: found.id, targetName: found.name }));
                      }
                    }
                  }}
                  className="w-full tester-input text-xs bg-[var(--input-bg)] text-[var(--foreground)] font-bold cursor-pointer py-2 pl-3 pr-8"
                >
                  {policyOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.id !== "custom" ? `[${p.id}]` : ""}
                    </option>
                  ))}
                </select>

                {formData.targetId === "custom-policy" && (
                  <input
                    type="text"
                    value={formData.targetName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, targetName: e.target.value }))}
                    placeholder={language === "ko" ? "신규 지오펜스 정책명 직접 입력..." : "Enter custom geofence policy name..."}
                    className="w-full tester-input text-xs"
                    required
                  />
                )}
              </div>
            )}

            {/* Scope 3: VEHICLE_TYPE (Interactive Checkbox Cards) */}
            {formData.scope === "VEHICLE_TYPE" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {vehicleTypeOptions.map((vType) => {
                  const checked = isVehicleTypeChecked(vType.id);
                  return (
                    <div
                      key={vType.id}
                      onClick={() => toggleVehicleType(vType.id, vType.short)}
                      className={`p-3 rounded border transition-all cursor-pointer flex items-center gap-2.5 select-none ${
                        checked
                          ? "bg-purple-500/15 border-purple-400 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.15)]"
                          : "bg-[var(--panel-bg)] border-panel-border text-zinc-400 hover:text-[var(--foreground)] hover:border-panel-border-hover"
                      }`}
                    >
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-purple-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-500 shrink-0" />
                      )}
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold block truncate text-[var(--foreground)]">
                          {vType.short}
                        </span>
                        <span className="text-[9px] text-zinc-500 block truncate">
                          {vType.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Change Reason & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">
                {language === "ko" ? "변경 / 감사 사유 (Change Reason)" : "Change / Audit Reason"}
              </label>
              <input
                type="text"
                value={formData.changeReason || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, changeReason: e.target.value }))}
                placeholder={language === "ko" ? "예: 폭우 기상 악화 대비 안전 감속" : "e.g. Monsoon weather calibration"}
                className="w-full tester-input text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">
                {language === "ko" ? "설명 및 보안 의도 (Description)" : "Description & Security Intent"}
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder={language === "ko" ? "규칙 적용 목적 및 안전 프로토콜 상세 설명..." : "Describe the objective of this safety profile..."}
                className="w-full tester-input text-xs"
              />
            </div>
          </div>

          {/* Time Window (START_TIME / END_TIME) */}
          <div className="p-3 bg-[var(--panel-header-bg)] border border-panel-border rounded space-y-2">
            <span className="text-[10px] font-bold text-brand-cyan uppercase flex items-center gap-1.5">
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
                  className="p-3 bg-[var(--panel-header-bg)]/50 border border-panel-border rounded space-y-2"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[var(--foreground)]">{metric.name}</span>
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
                        className="w-full accent-amber-400 cursor-pointer bg-[var(--panel-bg)]"
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
                        className="w-full accent-rose-400 cursor-pointer bg-[var(--panel-bg)]"
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
              className="px-4 py-2 rounded bg-[var(--panel-header-bg)] border border-panel-border hover:border-panel-border-hover text-zinc-400 hover:text-[var(--foreground)] text-xs font-bold uppercase transition-colors cursor-pointer"
            >
              {language === "ko" ? "취소" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-brand-cyan hover:bg-cyan-400 text-black text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.25)]"
            >
              {isNew ? <Plus className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>
                {isNew 
                  ? (language === "ko" ? "규칙 프로필 생성" : "Create Profile") 
                  : (language === "ko" ? "설정 저장" : "Save Configuration")}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
