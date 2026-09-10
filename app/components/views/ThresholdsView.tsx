"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle2 } from "lucide-react";
import { ThresholdRule, ThresholdScope, TemporalStatus } from "@/entities/threshold/model/types";
import { defaultThresholdRules } from "@/entities/threshold/model/mock-data";
import { ThresholdOverviewWidget } from "@/widgets/threshold/ThresholdOverviewWidget";
import { ThresholdFilterToolbar } from "@/widgets/threshold/ThresholdFilterToolbar";
import { ThresholdRuleTableWidget } from "@/widgets/threshold/ThresholdRuleTableWidget";
import { ThresholdDiagnosticDrawer } from "@/widgets/threshold/ThresholdDiagnosticDrawer";
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
      policy: rules.filter((r) => r.scope === "POLICY").length
    };
  }, [rules]);

  // Timeline counts
  const timelineCounts = useMemo(() => {
    return {
      all: rules.length,
      current: rules.filter((r) => r.temporalStatus === "CURRENT").length,
      future: rules.filter((r) => r.temporalStatus === "FUTURE").length,
      historical: rules.filter((r) => r.temporalStatus === "HISTORICAL").length
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

  // Selected Rule object
  const selectedRule = useMemo(() => {
    const found = rules.find((r) => r.id === selectedRuleId);
    if (found) return found;
    return filteredRules[0] || rules[0];
  }, [rules, selectedRuleId, filteredRules]);

  const handleSelectRule = (rule: ThresholdRule) => {
    setSelectedRuleId(rule.id);
    setIsDrawerOpen(true);
  };

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
      changeReason:
        language === "ko" ? "신규 안전 정책 파라미터 등록" : "Initial safety parameter registration",
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
      isActive: true
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
      const activeRulesCount = rules.filter(
        (r) => r.isActive && r.temporalStatus === "CURRENT"
      ).length;
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

      {/* 2. Dual-Axis Precedence Toolbar */}
      <ThresholdFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTimeline={selectedTimeline}
        onTimelineChange={setSelectedTimeline}
        selectedScope={selectedScope}
        onScopeChange={setSelectedScope}
        timelineCounts={timelineCounts}
        scopeCounts={scopeCounts}
        isDeploying={isDeploying}
        onOpenCreateModal={handleOpenCreateModal}
        onDeploy={handleDeployThresholds}
      />

      {/* Notification Toast */}
      {deployedNotification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{deployedNotification}</span>
        </div>
      )}

      {/* 3. Master Rules Table */}
      <ThresholdRuleTableWidget
        rules={filteredRules}
        selectedRuleId={selectedRuleId}
        onSelectRule={handleSelectRule}
        onOpenEditModal={handleOpenEditModal}
        onToggleActive={handleToggleRuleActive}
      />

      {/* 4. Slide-Over Diagnostic Drawer */}
      <ThresholdDiagnosticDrawer
        rule={selectedRule}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenEditModal={handleOpenEditModal}
        onToggleActive={handleToggleRuleActive}
      />

      {/* 5. Edit & Create Modal */}
      {isEditModalOpen && editingRule && (
        <ThresholdEditModal
          isNew={isNewRule}
          rule={editingRule}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingRule(null);
          }}
          onSave={handleSaveRule}
        />
      )}
    </div>
  );
}
