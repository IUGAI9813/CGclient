"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Plus,
  Trash2,
  Sliders,
  Activity,
  MapPin,
  Layers,
  Globe,
  Clock,
  Search,
  Check,
  X,
  Radio,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { defaultAdminRegions } from "@/entities/region/model/mock-data";

export interface Policy {
  id: string;
  name: string;
  cityName: string; // "서울특별시", "경기도" (from TB_ADMIN_REGIONS)
  districtCodes: string[]; // ["1168000000", "1165000000"]
  districtNames: string[]; // ["강남구", "서초구"]
  action: "ACT_RAISE_INCIDENT" | "ACT_FORCE_STOP" | "ACT_LIMIT_SPEED" | "ACT_WARN_DRIVER";
  priority: number; // default 10 (from TB_SECURITY_POLICIES.PRIORITY)
  startTime: string | null; // from TB_SECURITY_POLICIES.START_TIME
  endTime: string | null; // from TB_SECURITY_POLICIES.END_TIME
  vehicles: string[];
  status: "ACTIVE" | "INACTIVE";
  violationsCount: number;
}

const fleetVehiclesList = [
  { id: "VEH-42-012", type: "Robotaxi", location: "Gangnam 3rd Ave", district: "강남구", districtCode: "1168000000" },
  { id: "VEH-42-089", type: "Shuttle", location: "Hangar Standby", district: "용산구", districtCode: "1117000000" },
  { id: "VEH-42-005", type: "Robotaxi", location: "Gangnam Station", district: "강남구", districtCode: "1168000000" },
  { id: "VEH-42-104", type: "Delivery Pod", location: "Teheran-ro Street", district: "강남구", districtCode: "1168000000" },
  { id: "VEH-42-067", type: "Robotaxi", location: "Pangyo Blvd", district: "성남시 분당구 (판교)", districtCode: "4113500000" },
  { id: "VEH-42-132", type: "Shuttle", location: "Yeoksam Subway", district: "강남구", districtCode: "1168000000" },
  { id: "VEH-42-111", type: "Robotaxi", location: "Samseong Center", district: "송파구", districtCode: "1171000000" },
  { id: "VEH-42-150", type: "Delivery Pod", location: "Pangyo Valley Depot", district: "성남시 분당구 (판교)", districtCode: "4113500000" },
];

export default function PoliciesView() {
  const { t, language } = useLanguage();

  // Policies State (based on TB_SECURITY_POLICIES & TB_ADMIN_REGIONS)
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: "pol-1",
      name: language === "ko" ? "강남구 테헤란로 배송 안전 구역" : "Gangnam Teheran-ro Delivery Bounds",
      cityName: "서울특별시",
      districtCodes: ["1168000000"],
      districtNames: ["강남구"],
      action: "ACT_RAISE_INCIDENT",
      priority: 10,
      startTime: "08:00",
      endTime: "20:00",
      vehicles: ["VEH-42-104", "VEH-42-012"],
      status: "ACTIVE",
      violationsCount: 3
    },
    {
      id: "pol-2",
      name: language === "ko" ? "강남/서초 광역 순찰 및 비상 제어 구역" : "Gangnam & Seocho Combined Patrol Corridor",
      cityName: "서울특별시",
      districtCodes: ["1168000000", "1165000000"],
      districtNames: ["강남구", "서초구"],
      action: "ACT_LIMIT_SPEED",
      priority: 20,
      startTime: null,
      endTime: null,
      vehicles: ["VEH-42-005", "VEH-42-132", "VEH-42-067"],
      status: "ACTIVE",
      violationsCount: 0
    },
    {
      id: "pol-3",
      name: language === "ko" ? "판교 테크노밸리 자율주행 특구" : "Pangyo Techno Valley Autonomous Testbed",
      cityName: "경기도",
      districtCodes: ["4113500000"],
      districtNames: ["성남시 분당구 (판교)"],
      action: "ACT_WARN_DRIVER",
      priority: 15,
      startTime: null,
      endTime: null,
      vehicles: ["VEH-42-067", "VEH-42-150"],
      status: "ACTIVE",
      violationsCount: 1
    }
  ]);

  // Selected Policy for Slide-over Drawer
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);

  // Modal Editor state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Partial<Policy> | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [districtSearchQuery, setDistrictSearchQuery] = useState("");

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

  const selectedPolicy = policies.find(p => p.id === selectedPolicyId) || null;

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
    setDistrictSearchQuery("");
    setIsModalOpen(true);
  };

  const handleStartEditPolicy = (policy: Policy) => {
    setEditingPolicy({ ...policy });
    setDistrictSearchQuery("");
    setIsModalOpen(true);
  };

  const handleDeletePolicy = (id: string) => {
    const checkMsg = language === "ko"
      ? "선택한 정책을 삭제하시겠습니까?"
      : "Are you sure you want to delete the selected policy?";
    if (confirm(checkMsg)) {
      setPolicies(prev => prev.filter(p => p.id !== id));
      if (selectedPolicyId === id) {
        setSelectedPolicyId(null);
      }
    }
  };

  const toggleDistrictSelection = (districtCode: string) => {
    setEditingPolicy(prev => {
      if (!prev) return null;
      const currentCodes = prev.districtCodes || [];
      const isSelected = currentCodes.includes(districtCode);
      const nextCodes = isSelected
        ? currentCodes.filter(c => c !== districtCode)
        : [...currentCodes, districtCode];

      const nextNames = defaultAdminRegions
        .filter(r => nextCodes.includes(r.regionCode))
        .map(r => r.districtName);

      return {
        ...prev,
        districtCodes: nextCodes,
        districtNames: nextNames
      };
    });
  };

  const handleSelectAllDistricts = () => {
    setEditingPolicy(prev => {
      if (!prev) return null;
      const targetCity = prev.cityName || "서울특별시";
      const cityRegions = defaultAdminRegions.filter(r => r.cityName === targetCity);
      return {
        ...prev,
        districtCodes: cityRegions.map(r => r.regionCode),
        districtNames: cityRegions.map(r => r.districtName)
      };
    });
  };

  const handleClearAllDistricts = () => {
    setEditingPolicy(prev => {
      if (!prev) return null;
      return {
        ...prev,
        districtCodes: [],
        districtNames: []
      };
    });
  };

  const toggleVehicleSelection = (vehId: string) => {
    setEditingPolicy(prev => {
      if (!prev) return null;
      const currentVehicles = prev.vehicles || [];
      const updated = currentVehicles.includes(vehId)
        ? currentVehicles.filter(id => id !== vehId)
        : [...currentVehicles, vehId];
      return { ...prev, vehicles: updated };
    });
  };

  const handleSelectAllVehicles = () => {
    setEditingPolicy(prev => {
      if (!prev) return null;
      return { ...prev, vehicles: fleetVehiclesList.map(v => v.id) };
    });
  };

  const handleDeselectAllVehicles = () => {
    setEditingPolicy(prev => {
      if (!prev) return null;
      return { ...prev, vehicles: [] };
    });
  };

  const handleSavePolicy = () => {
    if (!editingPolicy) return;
    if (!editingPolicy.name?.trim()) {
      alert(language === "ko" ? "정책 이름을 입력하십시오." : "Please enter a policy name.");
      return;
    }
    if (!editingPolicy.districtCodes || editingPolicy.districtCodes.length === 0) {
      alert(language === "ko" ? "최소 1개 이상의 관제 행정구역(시/군/구)을 선택하십시오." : "Please select at least one administrative district.");
      return;
    }

    const finalPolicy: Policy = {
      id: editingPolicy.id || `pol-${Date.now()}`,
      name: editingPolicy.name,
      cityName: editingPolicy.cityName || "서울특별시",
      districtCodes: editingPolicy.districtCodes,
      districtNames: editingPolicy.districtNames || [],
      action: editingPolicy.action || "ACT_RAISE_INCIDENT",
      priority: editingPolicy.priority || 10,
      startTime: editingPolicy.startTime || null,
      endTime: editingPolicy.endTime || null,
      vehicles: editingPolicy.vehicles || [],
      status: "ACTIVE",
      violationsCount: editingPolicy.violationsCount || 0
    };

    setPolicies(prev => {
      const idx = prev.findIndex(p => p.id === finalPolicy.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = finalPolicy;
        return updated;
      } else {
        return [...prev, finalPolicy];
      }
    });

    setSelectedPolicyId(finalPolicy.id);
    setIsModalOpen(false);
    setEditingPolicy(null);
  };

  // Filtered Policies
  const filteredPolicies = policies.filter(p => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.districtNames.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === "ALL" || p.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  // KPI Metrics
  const activeCount = policies.filter(p => p.status === "ACTIVE").length;
  const totalDistrictsCovered = Array.from(new Set(policies.flatMap(p => p.districtCodes))).length;
  const totalFleetBound = Array.from(new Set(policies.flatMap(p => p.vehicles))).length;

  // Helper for action badge colors
  const getActionBadge = (action: Policy["action"]) => {
    switch (action) {
      case "ACT_FORCE_STOP":
        return {
          label: language === "ko" ? "비상 정지" : "FORCE STOP",
          classes: "border-brand-rose/30 text-brand-rose bg-brand-rose/10"
        };
      case "ACT_LIMIT_SPEED":
        return {
          label: language === "ko" ? "속도 제한" : "LIMIT SPEED",
          classes: "border-brand-amber/30 text-brand-amber bg-brand-amber/10"
        };
      case "ACT_WARN_DRIVER":
        return {
          label: language === "ko" ? "운전자 경고" : "WARN DRIVER",
          classes: "border-brand-cyan/30 text-brand-cyan bg-brand-cyan/10"
        };
      default:
        return {
          label: language === "ko" ? "인시던트 등록" : "RAISE INCIDENT",
          classes: "border-zinc-500/30 text-zinc-400 bg-zinc-500/10"
        };
    }
  };

  return (
    <div className="space-y-4 animate-fade-in font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & TELEMETRY KPI PILLS                                       */}
      {/* ========================================================================= */}
      <div className="cyber-panel p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-cyan" />
            <span className="text-[11px] text-[var(--muted-text)] font-bold uppercase tracking-wider">
              {language === "ko" ? "자율주행 안전 관제 엔진" : "AUTONOMOUS FLEET GEOFENCE & SAFETY RULES"}
            </span>
          </div>
          <h1 className="text-lg font-bold text-[var(--foreground)] mt-0.5">
            {language === "ko" ? "보안 정책 및 지오존 관제 (Security Policies)" : "Security Policies & Administrative Geozones"}
          </h1>
          <p className="text-xs text-[var(--muted-text)] mt-1">
            {language === "ko"
              ? "행정구역 데이터베이스(TB_ADMIN_REGIONS)와 연동되어 구/군 단위 안전 정책(TB_SECURITY_POLICIES)을 원격 배포합니다."
              : "Synchronized with TB_ADMIN_REGIONS to configure and dispatch administrative safety rules & speed governors to edge vehicles."}
          </p>
        </div>

        {/* Real-time Telemetry Stats Pill & Add Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-[var(--panel-header-bg)] border border-panel-border px-3.5 py-2 rounded-md flex items-center gap-4 text-xs">
            <div>
              <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "활성 정책" : "Active"}</span>
              <span className="text-[var(--foreground)] font-bold tabular-nums">{activeCount} / {policies.length}</span>
            </div>
            <div className="w-[1px] h-6 bg-panel-border"></div>
            <div>
              <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "보호 구역" : "Districts"}</span>
              <span className="text-brand-cyan font-bold tabular-nums">{totalDistrictsCovered} {language === "ko" ? "개소" : "districts"}</span>
            </div>
            <div className="w-[1px] h-6 bg-panel-border"></div>
            <div>
              <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "연계 플릿" : "Bound Fleet"}</span>
              <span className="text-brand-emerald font-bold tabular-nums">{totalFleetBound} / {fleetVehiclesList.length}</span>
            </div>
          </div>

          <button
            onClick={handleStartCreatePolicy}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-cyan hover:opacity-90 text-white dark:text-black rounded-md text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span>{language === "ko" ? "새 정책 생성" : "New Policy"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & FILTER TOOLBAR                                                */}
      {/* ========================================================================= */}
      <div className="cyber-panel p-3 rounded-lg flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[var(--muted-text)] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === "ko" ? "정책명, 관할 구역(강남구 등), 도시 검색..." : "Filter by policy name, district, or city..."}
            className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md pl-9 pr-3 py-2 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none transition-colors"
          />
        </div>

        {/* Action Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { key: "ALL", label: language === "ko" ? "전체 (All)" : "All Actions" },
            { key: "ACT_RAISE_INCIDENT", label: language === "ko" ? "인시던트 등록" : "Incident" },
            { key: "ACT_LIMIT_SPEED", label: language === "ko" ? "속도 제한" : "Speed Limit" },
            { key: "ACT_WARN_DRIVER", label: language === "ko" ? "운전자 경고" : "Warn Driver" },
            { key: "ACT_FORCE_STOP", label: language === "ko" ? "비상 정지" : "Force Stop" },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setActionFilter(f.key)}
              className={`px-3 py-1.5 rounded text-[11px] font-semibold whitespace-nowrap border transition-all ${
                actionFilter === f.key
                  ? "bg-brand-cyan/15 border-brand-cyan text-brand-cyan font-bold"
                  : "bg-[var(--panel-header-bg)] border-panel-border text-[var(--muted-text)] hover:text-[var(--foreground)] hover:border-panel-border-hover"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CLEAN ENTERPRISE DATA TABLE                                            */}
      {/* ========================================================================= */}
      <div className="cyber-panel rounded-lg overflow-hidden border border-panel-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-panel-border bg-[var(--panel-header-bg)] text-[11px] font-bold text-[var(--muted-text)] uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">ID</th>
                <th className="py-3 px-4">{language === "ko" ? "정책명 및 적용 권역" : "Policy Name & Scope"}</th>
                <th className="py-3 px-4">{language === "ko" ? "제어 조치 (Action)" : "Action Type"}</th>
                <th className="py-3 px-4">{language === "ko" ? "보호 행정구역" : "Covered Districts"}</th>
                <th className="py-3 px-4">{language === "ko" ? "적용 스케줄" : "Schedule"}</th>
                <th className="py-3 px-4 text-center">{language === "ko" ? "플릿 (차량)" : "Fleet"}</th>
                <th className="py-3 px-4 text-center">{language === "ko" ? "상태" : "Status"}</th>
                <th className="py-3 px-4 text-right">{language === "ko" ? "관리" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-panel-border text-[var(--foreground)]">
              {filteredPolicies.map(policy => {
                const isSelected = selectedPolicyId === policy.id;
                const badge = getActionBadge(policy.action);

                return (
                  <tr
                    key={policy.id}
                    onClick={() => setSelectedPolicyId(policy.id)}
                    className={`cursor-pointer transition-colors group ${
                      isSelected
                        ? "bg-brand-cyan/10 hover:bg-brand-cyan/15"
                        : "hover:bg-[var(--panel-header-bg)]"
                    }`}
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[11px] text-[var(--muted-text)] group-hover:text-brand-cyan">
                      {policy.id.replace("pol-", "P-0")}
                    </td>

                    {/* Policy Name & City */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                        <div>
                          <span className="font-bold text-sm block group-hover:text-brand-cyan transition-colors">
                            {policy.name}
                          </span>
                          <span className="text-[10px] text-[var(--muted-text)] flex items-center gap-1.5 mt-0.5">
                            <Globe className="w-2.5 h-2.5" />
                            {policy.cityName} &bull; Priority {policy.priority}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Action Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${badge.classes}`}>
                        {badge.label}
                      </span>
                    </td>

                    {/* Districts Chips */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[260px]">
                        {policy.districtNames.map(name => (
                          <span
                            key={name}
                            className="px-2 py-0.5 text-[10px] font-medium rounded bg-[var(--panel-header-bg)] border border-panel-border text-[var(--foreground)]"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Schedule */}
                    <td className="py-3.5 px-4 text-xs font-mono">
                      {policy.startTime && policy.endTime ? (
                        <span className="flex items-center gap-1 text-[var(--foreground)]">
                          <Clock className="w-3 h-3 text-brand-amber shrink-0" />
                          <span>{policy.startTime} ~ {policy.endTime}</span>
                        </span>
                      ) : (
                        <span className="text-[var(--muted-text)] text-[11px]">24/7 Always Active</span>
                      )}
                    </td>

                    {/* Fleet */}
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums font-bold">
                      <span className="px-2 py-0.5 rounded bg-[var(--panel-header-bg)] border border-panel-border text-[11px]">
                        {policy.vehicles.length}대
                      </span>
                    </td>

                    {/* Status & Violations */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center gap-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse"></span>
                          {t("policies.status_active")}
                        </span>
                        {policy.violationsCount > 0 && (
                          <span className="text-[9px] text-brand-rose font-bold flex items-center gap-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            {policy.violationsCount} 위반
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPolicyId(policy.id)}
                          className="p-1.5 rounded text-[var(--muted-text)] hover:text-brand-cyan hover:bg-brand-cyan/10 border border-panel-border transition-colors"
                          title={language === "ko" ? "상세 정보 (Drawer)" : "Inspect"}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStartEditPolicy(policy)}
                          className="p-1.5 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--panel-header-bg)] border border-panel-border transition-colors"
                          title={language === "ko" ? "편집 (수정)" : "Edit"}
                        >
                          <Sliders className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePolicy(policy.id)}
                          className="p-1.5 rounded text-[var(--muted-text)] hover:text-brand-rose hover:bg-brand-rose/10 border border-panel-border transition-colors"
                          title={language === "ko" ? "삭제" : "Delete"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredPolicies.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[var(--muted-text)]">
                    {language === "ko"
                      ? "검색 조건과 일치하는 안전 정책이 없습니다."
                      : "No security policies matching the search criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SLIDE-OVER DRAWER (RIGHT PANEL FOR DEEP POLICY INSPECTION)             */}
      {/* ========================================================================= */}
      {selectedPolicy && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setSelectedPolicyId(null)}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-xl bg-[var(--panel-bg)] border-l border-panel-border h-full shadow-2xl z-10 flex flex-col animate-slide-left">
            {/* Drawer Header */}
            <div className="p-4 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-brand-cyan font-bold bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20">
                    {selectedPolicy.id.replace("pol-", "POLICY-0")}
                  </span>
                  <span className="text-[10px] text-[var(--muted-text)] font-mono">
                    {selectedPolicy.cityName}
                  </span>
                </div>
                <h2 className="text-base font-bold text-[var(--foreground)] mt-1.5 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-cyan" />
                  <span>{selectedPolicy.name}</span>
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartEditPolicy(selectedPolicy)}
                  className="px-3 py-1.5 rounded bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan hover:text-white dark:hover:text-black text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{language === "ko" ? "정책 수정" : "Edit"}</span>
                </button>
                <button
                  onClick={() => setSelectedPolicyId(null)}
                  className="p-1.5 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--panel-header-bg)] border border-panel-border transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 scrollbar-thin">
              {/* Telemetry Status Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
                  <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "소속 도시" : "City"}</span>
                  <span className="font-bold text-[var(--foreground)] mt-0.5 block">{selectedPolicy.cityName}</span>
                </div>
                <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
                  <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "보호 구역" : "Districts"}</span>
                  <span className="font-bold text-brand-cyan mt-0.5 block">{selectedPolicy.districtCodes.length}개 구역</span>
                </div>
                <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
                  <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "우선순위" : "Priority"}</span>
                  <span className="font-bold text-[var(--foreground)] mt-0.5 block">Level {selectedPolicy.priority}</span>
                </div>
                <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
                  <span className="text-[9px] text-[var(--muted-text)] uppercase block">{language === "ko" ? "제어 조치" : "Action"}</span>
                  <span className="font-bold text-brand-amber mt-0.5 block">{selectedPolicy.action.replace("ACT_", "")}</span>
                </div>
              </div>

              {/* Edge Deployment Status */}
              <div className="p-3 rounded border border-brand-emerald/20 bg-brand-emerald/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-brand-emerald animate-pulse" />
                  <div>
                    <span className="text-xs font-bold text-[var(--foreground)] block">
                      {language === "ko" ? "실시간 엣지 노드 동기화 완료" : "Edge Telematics Synchronized"}
                    </span>
                    <span className="text-[10px] text-[var(--muted-text)]">
                      TB_SECURITY_POLICIES &bull; Active in V2X Mesh
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/20 px-2 py-0.5 rounded">
                  24/7 ACTIVE
                </span>
              </div>

              {/* Administrative Region Coverage Grid */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-brand-cyan" />
                    <span>{selectedPolicy.cityName} {language === "ko" ? "행정구역 관제 현황" : "Districts Breakdown"}</span>
                  </span>
                  <span className="text-[10px] text-brand-cyan font-mono bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded">
                    TB_ADMIN_REGIONS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                  {defaultAdminRegions
                    .filter(r => r.cityName === selectedPolicy.cityName)
                    .map(region => {
                      const isIncluded = selectedPolicy.districtCodes.includes(region.regionCode);
                      const vehsInDistrict = fleetVehiclesList.filter(v => v.districtCode === region.regionCode);

                      return (
                        <div
                          key={region.regionCode}
                          className={`p-2.5 rounded border transition-all flex flex-col justify-between ${
                            isIncluded
                              ? "bg-brand-cyan/10 border-brand-cyan/40 shadow-xs"
                              : "bg-[var(--panel-header-bg)] border-panel-border opacity-50"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${isIncluded ? "bg-brand-cyan shadow-[0_0_6px_rgba(6,182,212,0.8)]" : "bg-zinc-400 dark:bg-zinc-700"}`}></span>
                                <span className={`font-bold text-xs ${isIncluded ? "text-[var(--foreground)]" : "text-zinc-500"}`}>
                                  {region.districtName}
                                </span>
                              </div>
                              <span className="text-[9px] text-[var(--muted-text)] block ml-3.5 mt-0.5">
                                {region.subDistrictName || ""}
                              </span>
                            </div>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono ${
                              isIncluded ? "bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20" : "bg-[var(--panel-bg)] border border-panel-border text-[var(--muted-text)]"
                            }`}>
                              {isIncluded ? "PROTECTED" : "EXCLUDED"}
                            </span>
                          </div>

                          <div className="mt-2 pt-1.5 border-t border-panel-border/40 flex justify-between items-center text-[9px] text-[var(--muted-text)] font-mono">
                            <span>#{region.regionCode.slice(-4)}</span>
                            <span>{vehsInDistrict.length}대 운행중</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Bound Fleet Vehicles */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-brand-cyan" />
                    <span>{language === "ko" ? "적용 플릿 차량" : "Bound Vehicles"} ({selectedPolicy.vehicles.length})</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedPolicy.vehicles.length === 0 ? (
                    <span className="text-[var(--muted-text)] text-xs py-2">
                      {language === "ko" ? "연계된 차량이 없습니다." : "No vehicles bound to this policy."}
                    </span>
                  ) : (
                    selectedPolicy.vehicles.map(vehId => {
                      const vehObj = fleetVehiclesList.find(v => v.id === vehId);
                      return (
                        <div
                          key={vehId}
                          className="px-2.5 py-1.5 rounded bg-[var(--panel-header-bg)] border border-panel-border text-[11px] font-mono flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
                          <span className="font-bold text-[var(--foreground)]">{vehId}</span>
                          <span className="text-[var(--muted-text)] text-[10px]">{vehObj?.type} &bull; {vehObj?.district}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-center">
              <button
                onClick={() => handleDeletePolicy(selectedPolicy.id)}
                className="px-3 py-1.5 rounded border border-panel-border text-[var(--muted-text)] hover:text-brand-rose hover:bg-brand-rose/10 hover:border-brand-rose text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === "ko" ? "정책 삭제" : "Delete"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPolicyId(null)}
                  className="px-4 py-1.5 rounded border border-panel-border bg-[var(--panel-bg)] hover:bg-[var(--panel-header-bg)] text-[var(--foreground)] text-xs font-semibold transition-colors"
                >
                  {language === "ko" ? "닫기 (Esc)" : "Close (Esc)"}
                </button>
                <button
                  onClick={() => handleStartEditPolicy(selectedPolicy)}
                  className="px-4 py-1.5 rounded bg-brand-cyan hover:opacity-90 text-white dark:text-black text-xs font-bold transition-all shadow-xs"
                >
                  {language === "ko" ? "수정하기" : "Edit Policy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. EDIT & CREATE MODAL (CLEAN POPUP FOR ZONE & RULE EDITING)              */}
      {/* ========================================================================= */}
      {isModalOpen && editingPolicy && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => {
              setIsModalOpen(false);
              setEditingPolicy(null);
            }}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-4xl bg-[var(--panel-bg)] border border-panel-border rounded-xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-4 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-cyan" />
                <h2 className="text-base font-bold text-[var(--foreground)]">
                  {policies.some(p => p.id === editingPolicy.id)
                    ? (language === "ko" ? "보안 정책 편집 (Edit Policy)" : "Edit Security Policy")
                    : (language === "ko" ? "신규 보안 정책 등록 (New Policy)" : "Create New Security Policy")}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingPolicy(null);
                }}
                className="p-1 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--panel-header-bg)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Column 1: Metadata & Rules */}
                <div className="space-y-4">
                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[var(--foreground)] block">
                      {t("policies.name_label")}
                    </label>
                    <input
                      type="text"
                      value={editingPolicy.name || ""}
                      onChange={(e) => setEditingPolicy(prev => prev ? { ...prev, name: e.target.value } : null)}
                      placeholder={language === "ko" ? "예: 강남구 테헤란로 배송 안전 구역" : "e.g. Gangnam Teheran-ro Safe Bounds"}
                      className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-2 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none"
                    />
                  </div>

                  {/* City Selection */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[var(--foreground)] flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-brand-cyan" />
                        <span>{t("policies.city_label")}</span>
                      </span>
                      <span className="text-[10px] text-brand-cyan font-mono">TB_ADMIN_REGIONS</span>
                    </label>
                    <select
                      value={editingPolicy.cityName || "서울특별시"}
                      onChange={(e) => {
                        const newCity = e.target.value;
                        const cityRegions = defaultAdminRegions.filter(r => r.cityName === newCity);
                        const firstRegion = cityRegions[0];
                        setEditingPolicy(prev => prev ? {
                          ...prev,
                          cityName: newCity,
                          districtCodes: firstRegion ? [firstRegion.regionCode] : [],
                          districtNames: firstRegion ? [firstRegion.districtName] : []
                        } : null);
                      }}
                      className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-2 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none font-medium cursor-pointer"
                    >
                      <option value="서울특별시">서울특별시 (Seoul Special City)</option>
                      <option value="경기도">경기도 (Gyeonggi-do Hubs)</option>
                    </select>
                  </div>

                  {/* Action & Priority */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[var(--foreground)] block">
                        {t("policies.action_label")}
                      </label>
                      <select
                        value={editingPolicy.action || "ACT_RAISE_INCIDENT"}
                        onChange={(e) => setEditingPolicy(prev => prev ? { ...prev, action: e.target.value as Policy["action"] } : null)}
                        className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-2 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none cursor-pointer"
                      >
                        <option value="ACT_RAISE_INCIDENT">{t("policies.action_raise")}</option>
                        <option value="ACT_FORCE_STOP">{t("policies.action_stop")}</option>
                        <option value="ACT_LIMIT_SPEED">{t("policies.action_limit")}</option>
                        <option value="ACT_WARN_DRIVER">{t("policies.action_warn")}</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[var(--foreground)] block">
                        {t("policies.priority_label")} (1-100)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={editingPolicy.priority || 10}
                        onChange={(e) => setEditingPolicy(prev => prev ? { ...prev, priority: parseInt(e.target.value) || 10 } : null)}
                        className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-2 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Time Window */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-[var(--foreground)]">
                        {t("policies.time_window")}
                      </label>
                      <button
                        type="button"
                        onClick={() => setEditingPolicy(prev => prev ? { ...prev, startTime: null, endTime: null } : null)}
                        className="text-[10px] text-brand-cyan hover:underline"
                      >
                        24/7 (Always Active)
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="time"
                        value={editingPolicy.startTime || ""}
                        onChange={(e) => setEditingPolicy(prev => prev ? { ...prev, startTime: e.target.value || null } : null)}
                        className="bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none font-mono"
                      />
                      <input
                        type="time"
                        value={editingPolicy.endTime || ""}
                        onChange={(e) => setEditingPolicy(prev => prev ? { ...prev, endTime: e.target.value || null } : null)}
                        className="bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Bound Vehicles */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-[var(--foreground)]">
                        {t("policies.vehicles_label")}
                      </label>
                      <div className="flex gap-2 text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={handleSelectAllVehicles}
                          className="text-brand-cyan hover:underline"
                        >
                          {t("policies.all_vehicles")}
                        </button>
                        <span className="text-[var(--muted-text)]">|</span>
                        <button
                          type="button"
                          onClick={handleDeselectAllVehicles}
                          className="text-[var(--muted-text)] hover:underline"
                        >
                          {t("policies.none_vehicles")}
                        </button>
                      </div>
                    </div>

                    <div className="border border-panel-border rounded-md bg-[var(--panel-header-bg)] p-2 max-h-[140px] overflow-y-auto space-y-1 scrollbar-thin">
                      {fleetVehiclesList.map(veh => {
                        const isChecked = editingPolicy.vehicles?.includes(veh.id) || false;
                        return (
                          <label
                            key={veh.id}
                            className="flex items-center gap-2 text-xs p-1 hover:bg-[var(--panel-bg)] rounded cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleVehicleSelection(veh.id)}
                              className="w-3.5 h-3.5 accent-brand-cyan cursor-pointer rounded border-panel-border"
                            />
                            <div className="flex justify-between items-center flex-1 font-mono">
                              <span className="font-bold text-[var(--foreground)]">{veh.id}</span>
                              <span className="text-[10px] text-[var(--muted-text)]">{veh.type} &bull; {veh.district}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Column 2: Administrative Districts Selection */}
                <div className="space-y-3 flex flex-col">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-brand-cyan" />
                        <span>{editingPolicy.cityName || "서울특별시"} {t("policies.district_label")}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-brand-cyan font-mono bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded text-[10px] font-bold">
                        {editingPolicy.districtCodes?.length || 0} / {defaultAdminRegions.filter(r => r.cityName === (editingPolicy.cityName || "서울특별시")).length} 선택
                      </span>
                      <div className="flex gap-1 text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={handleSelectAllDistricts}
                          className="px-2 py-0.5 rounded bg-[var(--panel-header-bg)] border border-panel-border text-brand-cyan hover:border-brand-cyan"
                        >
                          전체
                        </button>
                        <button
                          type="button"
                          onClick={handleClearAllDistricts}
                          className="px-2 py-0.5 rounded bg-[var(--panel-header-bg)] border border-panel-border text-[var(--muted-text)] hover:text-[var(--foreground)]"
                        >
                          해제
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* District Search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[var(--muted-text)] absolute left-3 top-2" />
                    <input
                      type="text"
                      value={districtSearchQuery}
                      onChange={(e) => setDistrictSearchQuery(e.target.value)}
                      placeholder={language === "ko" ? "구/군 검색 (예: 강남구, 서초구, 판교)..." : "Search districts..."}
                      className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md pl-8 pr-2.5 py-1.5 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none"
                    />
                  </div>

                  {/* Districts Checkbox Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
                    {defaultAdminRegions
                      .filter(r => r.cityName === (editingPolicy.cityName || "서울특별시"))
                      .filter(r =>
                        districtSearchQuery.trim() === "" ||
                        r.districtName.toLowerCase().includes(districtSearchQuery.toLowerCase()) ||
                        (r.subDistrictName && r.subDistrictName.toLowerCase().includes(districtSearchQuery.toLowerCase()))
                      )
                      .map(region => {
                        const isChecked = editingPolicy.districtCodes?.includes(region.regionCode) || false;
                        return (
                          <label
                            key={region.regionCode}
                            className={`flex items-start gap-2.5 p-2.5 rounded-md cursor-pointer transition-all border select-none ${
                              isChecked
                                ? "bg-brand-cyan/10 border-brand-cyan"
                                : "bg-[var(--panel-header-bg)] border-panel-border hover:border-panel-border-hover"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleDistrictSelection(region.regionCode)}
                              className="w-4 h-4 mt-0.5 accent-brand-cyan cursor-pointer rounded border-panel-border shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <span className={`font-bold text-xs ${isChecked ? "text-brand-cyan" : "text-[var(--foreground)]"}`}>
                                  {region.districtName}
                                </span>
                                <span className="text-[9px] font-mono text-[var(--muted-text)]">
                                  #{region.regionCode.slice(-4)}
                                </span>
                              </div>
                              <span className="text-[10px] text-[var(--muted-text)] block truncate mt-0.5">
                                {region.subDistrictName || ""}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                  </div>

                  {/* Selected Chips Strip */}
                  <div className="p-2.5 bg-[var(--panel-header-bg)] border border-panel-border rounded-md">
                    <span className="text-[10px] font-bold text-[var(--muted-text)] block mb-1.5 uppercase">
                      {language === "ko" ? "선택된 행정구역 태그 (클릭 시 제외):" : "Selected District Tags:"}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {editingPolicy.districtCodes && editingPolicy.districtCodes.length > 0 ? (
                        editingPolicy.districtCodes.map(code => {
                          const region = defaultAdminRegions.find(r => r.regionCode === code);
                          return (
                            <button
                              key={code}
                              type="button"
                              onClick={() => toggleDistrictSelection(code)}
                              className="px-2 py-0.5 rounded bg-[var(--panel-bg)] border border-brand-cyan/40 hover:border-brand-rose text-brand-cyan hover:text-brand-rose text-[10px] font-bold flex items-center gap-1 transition-colors"
                            >
                              <span>{region?.districtName || code}</span>
                              <X className="w-2.5 h-2.5" />
                            </button>
                          );
                        })
                      ) : (
                        <span className="text-[10px] text-[var(--muted-text)] py-0.5">
                          {t("policies.no_points")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-panel-border bg-[var(--panel-header-bg)] flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingPolicy(null);
                }}
                className="px-4 py-2 rounded-md border border-panel-border bg-[var(--panel-bg)] hover:bg-[var(--panel-header-bg)] text-[var(--foreground)] text-xs font-semibold transition-colors"
              >
                {t("policies.cancel")}
              </button>
              <button
                onClick={handleSavePolicy}
                className="px-5 py-2 rounded-md bg-brand-cyan hover:opacity-90 text-white dark:text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4 stroke-[3px]" />
                <span>{language === "ko" ? "정책 저장 및 즉시 배포" : "Save & Deploy Policy"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
