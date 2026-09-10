"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Policy } from "@/entities/policy/model/types";
import { defaultPolicies, defaultPolicyFleetVehicles } from "@/entities/policy/model/mock-data";
import { PolicyFilterBar } from "@/features/policy/filter-policies/ui/PolicyFilterBar";
import { PolicyEditModal } from "@/features/policy/manage-policy/ui/PolicyEditModal";
import { PolicyKpiBanner } from "@/widgets/policy/PolicyKpiBanner";
import { PolicyTableWidget } from "@/widgets/policy/PolicyTableWidget";
import { PolicyDetailDrawer } from "@/widgets/policy/PolicyDetailDrawer";
import { useLanguage } from "../LanguageContext";

export default function PoliciesView() {
  const { language } = useLanguage();

  const [policies, setPolicies] = useState<Policy[]>(defaultPolicies);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Partial<Policy> | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("ALL");

  // Close Drawer / Modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isModalOpen) {
          setIsModalOpen(false);
          setEditingPolicy(null);
        } else if (selectedPolicyId) {
          setSelectedPolicyId(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, selectedPolicyId]);

  const selectedPolicy = policies.find((p) => p.id === selectedPolicyId) || null;

  const handleStartCreatePolicy = () => {
    setEditingPolicy({
      id: `pol-${Date.now()}`,
      name: "",
      cityName: "서울특별시",
      districtCodes: ["1168000000"],
      districtNames: ["강남구"],
      action: "ACT_RAISE_INCIDENT",
      priority: 10,
      startTime: null,
      endTime: null,
      vehicles: [],
      status: "ACTIVE",
      violationsCount: 0
    });
    setIsModalOpen(true);
  };

  const handleStartEditPolicy = (policy: Policy) => {
    setEditingPolicy({ ...policy });
    setIsModalOpen(true);
  };

  const handleDeletePolicy = (id: string) => {
    const checkMsg =
      language === "ko"
        ? "선택한 정책을 삭제하시겠습니까?"
        : "Are you sure you want to delete the selected policy?";
    if (confirm(checkMsg)) {
      setPolicies((prev) => prev.filter((p) => p.id !== id));
      if (selectedPolicyId === id) {
        setSelectedPolicyId(null);
      }
    }
  };

  const handleSavePolicy = (savedPolicy: Policy) => {
    setPolicies((prev) => {
      const idx = prev.findIndex((p) => p.id === savedPolicy.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = savedPolicy;
        return updated;
      } else {
        return [...prev, savedPolicy];
      }
    });

    setSelectedPolicyId(savedPolicy.id);
    setIsModalOpen(false);
    setEditingPolicy(null);
  };

  // Filtered Policies
  const filteredPolicies = useMemo(() => {
    return policies.filter((p) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.districtNames.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAction = actionFilter === "ALL" || p.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [policies, searchQuery, actionFilter]);

  // KPI Metrics
  const activeCount = policies.filter((p) => p.status === "ACTIVE").length;
  const totalDistrictsCovered = Array.from(new Set(policies.flatMap((p) => p.districtCodes))).length;
  const totalFleetBound = Array.from(new Set(policies.flatMap((p) => p.vehicles))).length;

  return (
    <div className="space-y-4 animate-fade-in font-sans">
      {/* 1. Header & Telemetry KPI Banner */}
      <PolicyKpiBanner
        activeCount={activeCount}
        totalPolicies={policies.length}
        totalDistrictsCovered={totalDistrictsCovered}
        totalFleetBound={totalFleetBound}
        totalFleetCount={defaultPolicyFleetVehicles.length}
        onNewPolicyClick={handleStartCreatePolicy}
      />

      {/* 2. Search & Action Filter Bar */}
      <PolicyFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        actionFilter={actionFilter}
        onActionFilterChange={setActionFilter}
      />

      {/* 3. Clean Enterprise Data Table */}
      <PolicyTableWidget
        policies={filteredPolicies}
        selectedPolicyId={selectedPolicyId}
        onSelectPolicy={setSelectedPolicyId}
        onEditPolicy={handleStartEditPolicy}
        onDeletePolicy={handleDeletePolicy}
      />

      {/* 4. Slide-over Drawer for Deep Policy Inspection */}
      <PolicyDetailDrawer
        policy={selectedPolicy}
        onClose={() => setSelectedPolicyId(null)}
        onEditPolicy={handleStartEditPolicy}
        onDeletePolicy={handleDeletePolicy}
      />

      {/* 5. Create & Edit Modal Dialog */}
      <PolicyEditModal
        isOpen={isModalOpen}
        policy={editingPolicy}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPolicy(null);
        }}
        onSave={handleSavePolicy}
      />
    </div>
  );
}
