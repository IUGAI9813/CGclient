"use client";

import React, { useState, useMemo } from "react";
import { RefreshCw, Send, CheckCircle2 } from "lucide-react";
import { ThresholdRule, ThresholdScope, TemporalStatus } from "@/entities/threshold/model/types";
import { defaultThresholdRules } from "@/entities/threshold/model/mock-data";
import { ThresholdOverviewWidget } from "@/widgets/threshold/ThresholdOverviewWidget";
import { ThresholdPolicyBindingWidget } from "@/widgets/threshold/ThresholdPolicyBindingWidget";
import { ThresholdScopeSelector } from "@/features/threshold/manage-thresholds/ui/ThresholdScopeSelector";
import { ThresholdEditModal } from "@/features/threshold/manage-thresholds/ui/ThresholdEditModal";

export default function ThresholdsView() {
  const [rules, setRules] = useState<ThresholdRule[]>(defaultThresholdRules);
  const [selectedScope, setSelectedScope] = useState<ThresholdScope | "ALL">("ALL");
  const [selectedTimeline, setSelectedTimeline] = useState<TemporalStatus | "ALL">("ALL");
  const [selectedRuleId, setSelectedRuleId] = useState<string>("thr-global");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  // Filtered rules by both scope and timeline
  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      const matchesScope = selectedScope === "ALL" || r.scope === selectedScope;
      const matchesTimeline = selectedTimeline === "ALL" || r.temporalStatus === selectedTimeline;
      return matchesScope && matchesTimeline;
    });
  }, [rules, selectedScope, selectedTimeline]);

  // Selected Rule object fallback
  const selectedRule = useMemo(() => {
    const found = filteredRules.find((r) => r.id === selectedRuleId);
    if (found) return found;
    return filteredRules[0] || rules[0];
  }, [filteredRules, selectedRuleId, rules]);

  const handleOpenEditModal = (rule: ThresholdRule) => {
    setEditingRule(rule);
    setIsEditModalOpen(true);
  };

  const handleSaveRule = (updatedRule: ThresholdRule) => {
    setRules((prev) =>
      prev.map((r) => (r.id === updatedRule.id ? updatedRule : r))
    );
    setIsEditModalOpen(false);
    setEditingRule(null);
  };

  const handleDeployThresholds = () => {
    setIsDeploying(true);
    setDeployedNotification(null);

    setTimeout(() => {
      setIsDeploying(false);
      const activeRulesCount = rules.filter((r) => r.isActive && r.temporalStatus === "CURRENT").length;
      setDeployedNotification(
        `Successfully broadcasted ${activeRulesCount} active threshold profiles to all 148 Edge ADCU agents via Kafka / Tyk Gateway.`
      );
      setTimeout(() => {
        setDeployedNotification(null);
      }, 5000);
    }, 650);
  };

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Top Overview KPI Grid */}
      <ThresholdOverviewWidget rules={rules} />

      {/* Control Action Bar with Dual Filter (Timeline & Scope) */}
      <div className="cyber-panel p-4 rounded flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="w-full xl:w-auto">
          <ThresholdScopeSelector
            selectedScope={selectedScope}
            onSelectScope={setSelectedScope}
            selectedTimeline={selectedTimeline}
            onSelectTimeline={setSelectedTimeline}
            scopeCounts={scopeCounts}
            timelineCounts={timelineCounts}
          />
        </div>

        <div className="flex items-center gap-2 w-full xl:w-auto shrink-0">
          <button
            onClick={handleDeployThresholds}
            disabled={isDeploying}
            className="w-full xl:w-auto px-4 py-2.5 bg-brand-cyan hover:bg-cyan-400 text-black font-bold rounded text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
          >
            {isDeploying ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Deploying to Fleet...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Deploy Rules to Edge</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {deployedNotification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{deployedNotification}</span>
        </div>
      )}

      {/* Main Hierarchy & Configuration Widget (Read-Only Inspection + Configure Modal) */}
      <ThresholdPolicyBindingWidget
        rules={filteredRules}
        selectedRule={selectedRule}
        onSelectRule={(rule) => setSelectedRuleId(rule.id)}
        onOpenEditModal={handleOpenEditModal}
      />

      {/* Edit Modal (Configure button trigger) */}
      {isEditModalOpen && editingRule && (
        <ThresholdEditModal
          rule={editingRule}
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
