"use client";

import React, { useState, useMemo } from "react";
import { 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  Layers, 
  Search, 
  Sliders, 
  Globe, 
  Car, 
  Shield, 
  Edit3, 
  ChevronRight, 
  X, 
  Clock, 
  Activity, 
  Calendar, 
  Archive,
  Lock,
  Tag,
  Gauge,
  Plus
} from "lucide-react";
import { ThresholdRule, ThresholdScope, TemporalStatus } from "@/entities/threshold/model/types";
import { defaultThresholdRules, defaultMetricDefinitions } from "@/entities/threshold/model/mock-data";
import { ThresholdOverviewWidget } from "@/widgets/threshold/ThresholdOverviewWidget";
import { ThresholdScopeBadge } from "@/entities/threshold/ui/ThresholdScopeBadge";
import { ThresholdTimelineBadge } from "@/entities/threshold/ui/ThresholdTimelineBadge";
import { ThresholdMetricCard } from "@/entities/threshold/ui/ThresholdMetricCard";
import { ThresholdEditModal } from "@/features/threshold/manage-thresholds/ui/ThresholdEditModal";
import { useLanguage } from "../LanguageContext";

export default function ThresholdsView() {
  const { language } = useLanguage();
  const [rules, setRules] = useState<ThresholdRule[]>(defaultThresholdRules);
  const [selectedScope, setSelectedScope] = useState<ThresholdScope | "ALL">("ALL");
  const [selectedTimeline, setSelectedTimeline] = useState<TemporalStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRuleId, setSelectedRuleId] = useState<string>("thr-global");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewRule, setIsNewRule] = useState(false);
  const [editingRule, setEditingRule] = useState<ThresholdRule | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedNotification, setDeployedNotification] = useState<string | null>(null);

  // Scope counts
  const scopeCounts = useMemo(() => {
    return {
      all: rules.length,
      global: rules.filter((r) => r.scope === "GLOBAL").length,
      vehicleType: rules.filter((r) => r.scope === "VEHICLE_TYPE").length,
      policy: rules.filter((r) => r.scope === "POLICY").length,
    };
  }, [rules]);

  // Timeline counts
  const timelineCounts = useMemo(() => {
    return {
      all: rules.length,
      current: rules.filter((r) => r.temporalStatus === "CURRENT").length,
      future: rules.filter((r) => r.temporalStatus === "FUTURE").length,
      historical: rules.filter((r) => r.temporalStatus === "HISTORICAL").length,
    };
  }, [rules]);

  // Filtered rules by search, scope, and timeline
  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      const matchesScope = selectedScope === "ALL" || r.scope === selectedScope;
      const matchesTimeline = selectedTimeline === "ALL" || r.temporalStatus === selectedTimeline;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.targetName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.version && r.version.toLowerCase().includes(q)) ||
        (r.changeReason && r.changeReason.toLowerCase().includes(q));

      return matchesScope && matchesTimeline && matchesSearch;
    });
  }, [rules, selectedScope, selectedTimeline, searchQuery]);

  // Selected Rule object fallback
  const selectedRule = useMemo(() => {
    const found = rules.find((r) => r.id === selectedRuleId);
    if (found) return found;
    return filteredRules[0] || rules[0];
  }, [rules, selectedRuleId, filteredRules]);

  const handleOpenEditModal = (rule: ThresholdRule) => {
    setEditingRule(rule);
    setIsNewRule(false);
    setIsEditModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    const newRuleTemplate: ThresholdRule = {
      id: `thr-custom-${Date.now().toString().slice(-5)}`,
      name: "",
      description: "",
      scope: selectedScope !== "ALL" ? selectedScope : "POLICY",
      targetId: "custom-target",
      targetName: "",
      temporalStatus: selectedTimeline !== "ALL" ? selectedTimeline : "CURRENT",
      startTime: null,
      endTime: null,
      effectiveDate: new Date().toISOString().split("T")[0],
      version: "v1.0",
      changeReason: language === "ko" ? "신규 안전 정책 파라미터 등록" : "Initial safety parameter registration",
      updatedBy: "alex.s@42dot.ai",
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      batteryWarn: 25,
      batteryCrit: 15,
      latencyWarn: 80,
      latencyCrit: 160,
      lidarPpsWarn: 350,
      lidarPpsCrit: 200,
      speedWarn: 50,
      speedCrit: 60,
      canErrorWarn: 5,
      canErrorCrit: 15,
      isActive: true,
    };
    setEditingRule(newRuleTemplate);
    setIsNewRule(true);
    setIsEditModalOpen(true);
  };

  const handleSaveRule = (updatedRule: ThresholdRule) => {
    setRules((prev) => {
      const exists = prev.some((r) => r.id === updatedRule.id);
      if (exists) {
        return prev.map((r) => (r.id === updatedRule.id ? updatedRule : r));
      }
      return [updatedRule, ...prev];
    });
    setIsEditModalOpen(false);
    setEditingRule(null);
    setSelectedRuleId(updatedRule.id);
    setDeployedNotification(
      language === "ko"
        ? `임계값 프로필 '${updatedRule.name}'이(가) 성공적으로 ${isNewRule ? "생성" : "저장"}되었습니다.`
        : `Threshold profile '${updatedRule.name}' was ${isNewRule ? "created" : "saved"} successfully.`
    );
    setTimeout(() => setDeployedNotification(null), 4000);
  };

  const handleToggleRuleActive = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const handleDeployThresholds = () => {
    setIsDeploying(true);
    setDeployedNotification(null);

    setTimeout(() => {
      setIsDeploying(false);
      const activeRulesCount = rules.filter((r) => r.isActive && r.temporalStatus === "CURRENT").length;
      setDeployedNotification(
        language === "ko"
          ? `총 ${activeRulesCount}개의 활성 임계값 프로필이 Kafka / Tyk 게이트웨이를 통해 148대 Edge ADCU에 성공적으로 브로드캐스트되었습니다.`
          : `Successfully broadcasted ${activeRulesCount} active threshold profiles to all 148 Edge ADCU agents via Kafka / Tyk Gateway.`
      );
      setTimeout(() => {
        setDeployedNotification(null);
      }, 5000);
    }, 650);
  };

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* 1. Top Overview KPI Grid */}
      <ThresholdOverviewWidget rules={rules} />

      {/* 2. Precedence Hierarchy Banner */}
      <div className="p-3 bg-[var(--panel-header-bg)] border border-panel-border rounded flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2 text-[var(--foreground)]">
          <Layers className="w-4 h-4 text-brand-cyan shrink-0" />
          <span className="font-bold text-[var(--foreground)]">
            {language === "ko" ? "우선순위 계층 (Precedence Hierarchy):" : "Precedence Hierarchy:"}
          </span>
          <span className="text-amber-400 font-bold">
            {language === "ko" ? "1. 지오펜스 정책" : "1. Geofence Policy"}
          </span>
          <span className="text-zinc-500">&gt;</span>
          <span className="text-purple-400 font-bold">
            {language === "ko" ? "2. 차종별 프로필" : "2. Vehicle Type"}
          </span>
          <span className="text-zinc-500">&gt;</span>
          <span className="text-cyan-400 font-bold">
            {language === "ko" ? "3. 글로벌 기본" : "3. Global Baseline"}
          </span>
        </div>
        <span className="text-[10px] text-zinc-500">
          {language === "ko" 
            ? "높은 우선순위의 지오펜스 임계값이 일반 플릿 기본값을 자동 오버라이드합니다." 
            : "High-priority geofences automatically override general fleet baselines."}
        </span>
      </div>

      {/* 3. Master Dual-Axis Toolbar with Live Search and Deploy Action */}
      <div className="cyber-panel p-4 rounded space-y-3.5 bg-[var(--panel-bg)]">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          {/* Live Search */}
          <div className="relative flex-1 w-full xl:max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder={
                language === "ko"
                  ? "프로필명, 적용 대상, 변경 사유 검색..."
                  : "Search profile, target entity, version..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-panel-border rounded pl-9 pr-4 py-2 text-xs text-[var(--foreground)] outline-none focus:border-panel-border-hover transition-colors"
            />
          </div>

          {/* Action Buttons: Add Threshold Profile + Deploy Action */}
          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto shrink-0">
            <button
              onClick={handleOpenCreateModal}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-[var(--panel-header-bg)] hover:bg-brand-cyan/15 border border-panel-border hover:border-brand-cyan text-[var(--foreground)] hover:text-brand-cyan font-bold rounded text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              title={language === "ko" ? "새로운 임계값 규칙 프로필 추가" : "Create new threshold profile"}
            >
              <Plus className="w-3.5 h-3.5 text-brand-cyan" />
              <span>{language === "ko" ? "새 임계값 등록" : "Add Threshold"}</span>
            </button>

            <button
              onClick={handleDeployThresholds}
              disabled={isDeploying}
              className="w-full sm:w-auto px-4 py-2.5 bg-brand-cyan hover:bg-cyan-400 text-black font-bold rounded text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{language === "ko" ? "엣지 동기화 배포 중..." : "Deploying to Fleet..."}</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === "ko" ? "엣지 ADCU에 규칙 배포" : "Deploy Rules to Edge"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dual-Axis Filter Pills */}
        <div className="pt-2 border-t border-panel-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Timeline State Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mr-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-brand-cyan" />
              {language === "ko" ? "적용 시점:" : "Timeline:"}
            </span>
            <button
              onClick={() => setSelectedTimeline("ALL")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                selectedTimeline === "ALL"
                  ? "bg-brand-cyan/15 text-brand-cyan border-brand-cyan"
                  : "bg-[var(--panel-header-bg)] text-zinc-500 border-panel-border hover:text-[var(--foreground)]"
              }`}
            >
              {language === "ko" ? `전체 (${timelineCounts.all})` : `All (${timelineCounts.all})`}
            </button>
            <button
              onClick={() => setSelectedTimeline("CURRENT")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                selectedTimeline === "CURRENT"
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-400"
                  : "bg-[var(--panel-header-bg)] text-zinc-500 border-panel-border hover:text-[var(--foreground)]"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>{language === "ko" ? `현재 적용 (${timelineCounts.current})` : `Current (${timelineCounts.current})`}</span>
            </button>
            <button
              onClick={() => setSelectedTimeline("FUTURE")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                selectedTimeline === "FUTURE"
                  ? "bg-sky-500/15 text-sky-400 border-sky-400"
                  : "bg-[var(--panel-header-bg)] text-zinc-500 border-panel-border hover:text-[var(--foreground)]"
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>{language === "ko" ? `적용 예정 (${timelineCounts.future})` : `Future (${timelineCounts.future})`}</span>
            </button>
            <button
              onClick={() => setSelectedTimeline("HISTORICAL")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                selectedTimeline === "HISTORICAL"
                  ? "bg-zinc-700/40 text-zinc-300 border-zinc-500"
                  : "bg-[var(--panel-header-bg)] text-zinc-500 border-panel-border hover:text-[var(--foreground)]"
              }`}
            >
              <Archive className="w-3 h-3" />
              <span>{language === "ko" ? `아카이브 (${timelineCounts.historical})` : `Archive (${timelineCounts.historical})`}</span>
            </button>
          </div>

          {/* Scope Target Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mr-1 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-purple-400" />
              {language === "ko" ? "적용 범위:" : "Scope:"}
            </span>
            <button
              onClick={() => setSelectedScope("ALL")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                selectedScope === "ALL"
                  ? "bg-purple-500/15 text-purple-400 border-purple-400"
                  : "bg-[var(--panel-header-bg)] text-zinc-500 border-panel-border hover:text-[var(--foreground)]"
              }`}
            >
              {language === "ko" ? `전체 (${scopeCounts.all})` : `All (${scopeCounts.all})`}
            </button>
            <button
              onClick={() => setSelectedScope("GLOBAL")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                selectedScope === "GLOBAL"
                  ? "bg-cyan-500/15 text-cyan-400 border-cyan-400"
                  : "bg-[var(--panel-header-bg)] text-zinc-500 border-panel-border hover:text-[var(--foreground)]"
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>{language === "ko" ? `글로벌 (${scopeCounts.global})` : `Global (${scopeCounts.global})`}</span>
            </button>
            <button
              onClick={() => setSelectedScope("VEHICLE_TYPE")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                selectedScope === "VEHICLE_TYPE"
                  ? "bg-purple-500/15 text-purple-400 border-purple-400"
                  : "bg-[var(--panel-header-bg)] text-zinc-500 border-panel-border hover:text-[var(--foreground)]"
              }`}
            >
              <Car className="w-3 h-3" />
              <span>{language === "ko" ? `차종별 (${scopeCounts.vehicleType})` : `Vehicle (${scopeCounts.vehicleType})`}</span>
            </button>
            <button
              onClick={() => setSelectedScope("POLICY")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                selectedScope === "POLICY"
                  ? "bg-amber-500/15 text-amber-400 border-amber-400"
                  : "bg-[var(--panel-header-bg)] text-zinc-500 border-panel-border hover:text-[var(--foreground)]"
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>{language === "ko" ? `지오펜스 (${scopeCounts.policy})` : `Policy (${scopeCounts.policy})`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {deployedNotification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{deployedNotification}</span>
        </div>
      )}

      {/* 4. Full-Width Master Rules Table */}
      <div className="cyber-panel rounded overflow-hidden">
        <div className="p-3.5 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-brand-cyan" />
            <span className="text-xs font-bold text-[var(--foreground)] tracking-widest uppercase">
              {language === "ko" ? "임계값 규칙 프로필 마스터 목록" : "THRESHOLD PROFILES MASTER REPOSITORY"}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/25 font-bold">
              {filteredRules.length} {language === "ko" ? "개 규칙" : "Profiles"}
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 font-semibold">
            {language === "ko" ? "행을 클릭하면 상세 센서 진단 서랍이 열립니다" : "Click row to open diagnostic telemetry drawer"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--panel-header-bg)] border-b border-panel-border text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                <th className="p-3">{language === "ko" ? "프로필명 / 버전" : "Profile & Version"}</th>
                <th className="p-3">{language === "ko" ? "적용 범위" : "Scope"}</th>
                <th className="p-3">{language === "ko" ? "적용 대상" : "Target Bound"}</th>
                <th className="p-3">{language === "ko" ? "타임라인 상태" : "Timeline State"}</th>
                <th className="p-3">{language === "ko" ? "안전 한계치 요약 (속도 / 지연 / 배터리 / LiDAR)" : "Threshold Limits"}</th>
                <th className="p-3">{language === "ko" ? "최종 수정자" : "Updated By"}</th>
                <th className="p-3 text-right">{language === "ko" ? "작업" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-panel-border/30 bg-transparent">
              {filteredRules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500">
                    {language === "ko" 
                      ? "검색 조건과 일치하는 임계값 프로필이 없습니다." 
                      : "No threshold profiles found matching the criteria."}
                  </td>
                </tr>
              ) : (
                filteredRules.map((rule) => {
                  const isSelected = selectedRule.id === rule.id && isDrawerOpen;
                  return (
                    <tr
                      key={rule.id}
                      onClick={() => {
                        setSelectedRuleId(rule.id);
                        setIsDrawerOpen(true);
                      }}
                      className={`cursor-pointer transition-colors group ${
                        isSelected
                          ? "bg-brand-cyan/10"
                          : "hover:bg-[var(--panel-header-bg)]"
                      }`}
                    >
                      {/* Name & Version */}
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${rule.isActive ? "bg-emerald-400" : "bg-zinc-500"}`} />
                          <div>
                            <div className="font-bold text-[var(--foreground)] group-hover:text-brand-cyan transition-colors flex items-center gap-1.5">
                              <span>{rule.name}</span>
                              {rule.version && (
                                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[var(--panel-header-bg)] text-brand-cyan border border-panel-border">
                                  {rule.version}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-500 line-clamp-1">
                              {rule.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Scope Badge */}
                      <td className="p-3 whitespace-nowrap">
                        <ThresholdScopeBadge scope={rule.scope} />
                      </td>

                      {/* Target Bound */}
                      <td className="p-3 whitespace-nowrap">
                        <span className="font-bold text-[var(--foreground)]">
                          {rule.targetName}
                        </span>
                      </td>

                      {/* Timeline State */}
                      <td className="p-3 whitespace-nowrap">
                        <ThresholdTimelineBadge
                          temporalStatus={rule.temporalStatus}
                          startTime={rule.startTime}
                          endTime={rule.endTime}
                          effectiveDate={rule.effectiveDate}
                        />
                      </td>

                      {/* Threshold Limits Preview */}
                      <td className="p-3">
                        <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-[var(--panel-header-bg)] border border-panel-border text-zinc-400" title="Speed Cap">
                            속도: <strong className="text-[var(--foreground)]">{rule.speedWarn}km/h</strong>
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[var(--panel-header-bg)] border border-panel-border text-zinc-400" title="V2X Latency">
                            지연: <strong className="text-brand-cyan">{rule.latencyWarn}ms</strong>
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[var(--panel-header-bg)] border border-panel-border text-zinc-400" title="Min Battery">
                            배터리: <strong className="text-amber-400">≥{rule.batteryWarn}%</strong>
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[var(--panel-header-bg)] border border-panel-border text-zinc-400" title="LiDAR Stream">
                            LiDAR: <strong className="text-purple-400">{rule.lidarPpsWarn}k</strong>
                          </span>
                        </div>
                      </td>

                      {/* Updated By */}
                      <td className="p-3 whitespace-nowrap text-zinc-500 text-[10px]">
                        <div>{rule.updatedBy}</div>
                        <div className="text-[9px] text-zinc-600 font-mono">{rule.updatedAt.split(" ")[0]}</div>
                      </td>

                      {/* Actions */}
                      <td className="p-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setSelectedRuleId(rule.id);
                              setIsDrawerOpen(true);
                            }}
                            className="p-1.5 rounded bg-[var(--panel-header-bg)] border border-panel-border hover:border-brand-cyan text-zinc-400 hover:text-brand-cyan transition-colors"
                            title={language === "ko" ? "상세 진단 열기" : "Inspect Dossier"}
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(rule)}
                            className="p-1.5 rounded bg-[var(--panel-header-bg)] border border-panel-border hover:border-brand-cyan text-zinc-400 hover:text-[var(--foreground)] transition-colors"
                            title={language === "ko" ? "임계값 설정" : "Configure Parameters"}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Slide-over Telemetry Threshold Dossier Drawer */}
      {isDrawerOpen && selectedRule && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-[var(--panel-bg)] border-l border-panel-border shadow-2xl flex flex-col font-mono text-xs">
              {/* Drawer Header */}
              <div className="p-4 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Sliders className="w-5 h-5 text-brand-cyan shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                      {language === "ko" ? "임계값 프로필 & 센서 분석" : "THRESHOLD PROFILE & SENSOR DOSSIER"}
                    </span>
                    <h3 className="text-sm font-bold text-[var(--foreground)] truncate">
                      {selectedRule.name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded hover:bg-zinc-800/20 text-zinc-400 hover:text-[var(--foreground)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Meta Header Card */}
                <div className="cyber-panel p-3.5 rounded bg-[var(--panel-header-bg)]/40 border-panel-border space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <ThresholdScopeBadge scope={selectedRule.scope} />
                      <ThresholdTimelineBadge
                        temporalStatus={selectedRule.temporalStatus}
                        startTime={selectedRule.startTime}
                        endTime={selectedRule.endTime}
                        effectiveDate={selectedRule.effectiveDate}
                      />
                      {selectedRule.version && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--panel-header-bg)] text-brand-cyan border border-brand-cyan/30">
                          {selectedRule.version}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleRuleActive(selectedRule.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                        selectedRule.isActive
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-400/40"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}
                    >
                      {selectedRule.isActive 
                        ? (language === "ko" ? "🟢 엔진 활성화" : "🟢 ACTIVE ENGINE") 
                        : (language === "ko" ? "⚪ 비활성화됨" : "⚪ DISABLED")}
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">
                      {language === "ko" ? "적용 바인딩 대상:" : "Target Binding Entity:"}
                    </span>
                    <span className="text-sm font-bold text-brand-cyan">
                      {selectedRule.targetName}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {selectedRule.description}
                  </p>

                  {selectedRule.changeReason && (
                    <div className="p-2 rounded bg-[var(--panel-bg)] border border-panel-border text-[10px] text-zinc-400 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span><strong>{language === "ko" ? "변경 사유:" : "Reason:"}</strong> {selectedRule.changeReason}</span>
                    </div>
                  )}
                </div>

                {/* Read-Only Safety Banner */}
                <div className="p-2.5 bg-[var(--panel-header-bg)] border border-panel-border rounded flex items-center justify-between text-[10px] text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span>
                      {language === "ko"
                        ? "센서 임계값은 읽기 전용 상태입니다. 수정을 원하시면 아래 [설정 변경]을 누르세요."
                        : "Values are in read-only inspection. Click [Configure Parameters] below to edit."}
                    </span>
                  </div>
                  <span className="text-zinc-500 font-mono shrink-0">5 Channels</span>
                </div>

                {/* 5 Telemetry Channels Inspection Gauges */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-brand-cyan" />
                      {language === "ko" ? "5대 핵심 센서 채널 임계치" : "5 CORE TELEMETRY CHANNELS"}
                    </span>
                    <span>{language === "ko" ? "경고(WARN) / 위험(CRIT) 밴드" : "WARN / CRIT BANDS"}</span>
                  </div>

                  {defaultMetricDefinitions.map((metric) => (
                    <ThresholdMetricCard
                      key={metric.key}
                      metric={metric}
                      rule={selectedRule}
                    />
                  ))}
                </div>

                {/* Governance & Audit Metadata */}
                <div className="cyber-panel p-3 rounded bg-[var(--panel-header-bg)]/30 border-panel-border space-y-1.5 text-[10px] text-zinc-500">
                  <div className="flex justify-between">
                    <span>{language === "ko" ? "최종 감사 작성자:" : "Author / Updater:"}</span>
                    <strong className="text-[var(--foreground)]">{selectedRule.updatedBy}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === "ko" ? "동기화 타임스탬프:" : "Audit Timestamp:"}</span>
                    <strong className="text-zinc-400 font-mono">{selectedRule.updatedAt}</strong>
                  </div>
                  {selectedRule.startTime && selectedRule.endTime && (
                    <div className="flex justify-between">
                      <span>{language === "ko" ? "시간 제약 윈도우:" : "Time Window:"}</span>
                      <strong className="text-amber-400 font-mono">{selectedRule.startTime} - {selectedRule.endTime} KST</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-panel-border bg-[var(--panel-header-bg)] flex items-center justify-between gap-3 shrink-0">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2 rounded bg-[var(--panel-bg)] border border-panel-border hover:border-panel-border-hover text-zinc-400 hover:text-[var(--foreground)] text-xs font-bold transition-colors cursor-pointer"
                >
                  {language === "ko" ? "닫기" : "Close"}
                </button>

                <button
                  onClick={() => handleOpenEditModal(selectedRule)}
                  className="px-4 py-2 rounded bg-brand-cyan hover:bg-cyan-400 text-black text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{language === "ko" ? "임계값 경계값 수정" : "Configure Parameters"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Edit Modal */}
      {isEditModalOpen && editingRule && (
        <ThresholdEditModal
          rule={editingRule}
          isNew={isNewRule}
          onSave={handleSaveRule}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingRule(null);
          }}
        />
      )}
    </div>
  );
}
