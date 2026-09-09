"use client";

import React, { useState } from "react";
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
  Radio 
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

  // Selected Policy in list mode (for inspector view)
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>("pol-1");

  // Editor states
  const [isEditingPolicy, setIsEditingPolicy] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Partial<Policy> | null>(null);
  
  // Administrative District Selection states
  const [districtSearchQuery, setDistrictSearchQuery] = useState("");
  const [policySearchFilter, setPolicySearchFilter] = useState("");

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
    setIsEditingPolicy(true);
  };

  const handleStartEditPolicy = (policy: Policy) => {
    setEditingPolicy({ ...policy });
    setDistrictSearchQuery("");
    setIsEditingPolicy(true);
  };

  const handleDeletePolicy = (id: string) => {
    const checkMsg = language === "ko"
      ? "선택한 정책을 삭제하시겠습니까?"
      : "Are you sure you want to delete the selected policy?";
    if (confirm(checkMsg)) {
      setPolicies(prev => prev.filter(p => p.id !== id));
      if (selectedPolicyId === id) {
        setSelectedPolicyId("");
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
    setIsEditingPolicy(false);
    setEditingPolicy(null);
  };

  // Metrics
  const activeCount = policies.filter(p => p.status === "ACTIVE").length;
  const totalDistrictsCovered = Array.from(new Set(policies.flatMap(p => p.districtCodes))).length;
  const totalFleetBound = Array.from(new Set(policies.flatMap(p => p.vehicles))).length;

  return (
    <div className="space-y-4 animate-fade-in font-mono">
      {/* Top Banner & Telemetry Statistics Header */}
      <div className="cyber-panel p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-cyan" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              {language === "ko" ? "자율주행 안전 관제 엔진" : "AUTONOMOUS FLEET GEOFENCE & SAFETY RULES"}
            </span>
          </div>
          <h1 className="text-base font-bold text-white mt-0.5">
            {language === "ko" ? "보안 정책 및 지오존 관제 (Security Policies)" : "Security Policies & Administrative Geozones"}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {language === "ko"
              ? "행정구역 데이터베이스(TB_ADMIN_REGIONS)와 연동되어 구/군 단위 안전 정책(TB_SECURITY_POLICIES)을 원격 배포합니다."
              : "Synchronized with TB_ADMIN_REGIONS to configure and dispatch administrative safety rules & speed governors to edge vehicles."}
          </p>
        </div>

        {/* Real-time Telemetry Stats Pill */}
        <div className="flex items-center gap-2">
          <div className="bg-zinc-950/80 border border-panel-border px-3 py-2 rounded flex items-center gap-4 text-xs">
            <div>
              <span className="text-[8px] text-zinc-500 uppercase block">{language === "ko" ? "활성 정책" : "Active Policies"}</span>
              <span className="text-white font-bold">{activeCount} / {policies.length}</span>
            </div>
            <div className="w-[1px] h-6 bg-panel-border"></div>
            <div>
              <span className="text-[8px] text-zinc-500 uppercase block">{language === "ko" ? "보호 구역" : "Covered Districts"}</span>
              <span className="text-brand-cyan font-bold">{totalDistrictsCovered} {language === "ko" ? "개 구역" : "districts"}</span>
            </div>
            <div className="w-[1px] h-6 bg-panel-border"></div>
            <div>
              <span className="text-[8px] text-zinc-500 uppercase block">{language === "ko" ? "플릿 바인딩" : "Fleet Bound"}</span>
              <span className="text-brand-emerald font-bold">{totalFleetBound} / {fleetVehiclesList.length} vehs</span>
            </div>
          </div>

          {!isEditingPolicy && (
            <button
              onClick={handleStartCreatePolicy}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-cyan hover:bg-brand-cyan/85 text-black rounded text-xs font-bold uppercase transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)]"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
              <span>{t("policies.create")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main View: List Mode OR Editor Mode */}
      {!isEditingPolicy ? (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Left Column (2 cols): Policy List */}
          <div className="xl:col-span-2 space-y-3">
            {/* Filter Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={policySearchFilter}
                onChange={(e) => setPolicySearchFilter(e.target.value)}
                placeholder={language === "ko" ? "정책 이름 또는 도시 검색..." : "Filter policies by name or city..."}
                className="w-full bg-zinc-950 border border-panel-border rounded pl-9 pr-3 py-1.5 text-xs text-zinc-200 focus:border-zinc-600 outline-none font-mono"
              />
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1 scrollbar-thin">
              {policies
                .filter(p => 
                  policySearchFilter.trim() === "" ||
                  p.name.toLowerCase().includes(policySearchFilter.toLowerCase()) ||
                  p.cityName.toLowerCase().includes(policySearchFilter.toLowerCase())
                )
                .map(policy => {
                  const isSelected = selectedPolicyId === policy.id;
                  const actionColors = 
                    policy.action === "ACT_FORCE_STOP" ? "border-brand-rose/25 text-brand-rose bg-brand-rose/5" :
                    policy.action === "ACT_LIMIT_SPEED" ? "border-brand-amber/25 text-brand-amber bg-brand-amber/5" :
                    policy.action === "ACT_WARN_DRIVER" ? "border-brand-cyan/25 text-brand-cyan bg-brand-cyan/5" :
                    "border-zinc-700 text-zinc-400 bg-zinc-900/30";

                  return (
                    <div
                      key={policy.id}
                      onClick={() => setSelectedPolicyId(policy.id)}
                      className={`p-3.5 rounded border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected 
                          ? "bg-zinc-900/70 border-brand-cyan shadow-[0_0_14px_rgba(6,182,212,0.12)]" 
                          : "bg-zinc-950/40 border-panel-border hover:border-zinc-700 hover:bg-zinc-900/30"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1.5 flex-1 pr-2">
                          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                            <span>{policy.name}</span>
                          </h3>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${actionColors}`}>
                              {policy.action}
                            </span>
                            <span className="text-[8px] text-brand-cyan font-mono bg-brand-cyan/10 border border-brand-cyan/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Globe className="w-2.5 h-2.5" />
                              {policy.cityName} &bull; {policy.districtNames.length} {t("policies.points_drawn")}
                            </span>
                            <span className="text-[8px] text-zinc-400 font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                              Priority: {policy.priority}
                            </span>
                            {policy.startTime && policy.endTime ? (
                              <span className="text-[8px] text-zinc-400 font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 text-brand-amber" />
                                {policy.startTime} ~ {policy.endTime}
                              </span>
                            ) : (
                              <span className="text-[8px] text-zinc-500 font-mono bg-zinc-900 px-1.5 py-0.5 rounded">
                                24/7 Active
                              </span>
                            )}
                          </div>

                          {/* Selected District Names Badges */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {policy.districtNames.map(name => (
                              <span key={name} className="text-[8px] bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono px-1.5 py-0.5 rounded">
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[9px] font-bold text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/20 px-1.5 py-0.5 rounded">
                            {t("policies.status_active")}
                          </span>
                        </div>
                      </div>

                      {/* Vehicle list string */}
                      <div className="mt-3 pt-2.5 border-t border-panel-border/50 flex justify-between items-center text-[9px] text-zinc-500">
                        <span>
                          {language === "ko" ? "적용 차량: " : "VEHICLES: "}
                          <strong className="text-zinc-300">
                            {policy.vehicles.length === 0 
                              ? "None" 
                              : policy.vehicles.length === fleetVehiclesList.length
                              ? "All Fleet"
                              : policy.vehicles.slice(0, 3).join(", ") + (policy.vehicles.length > 3 ? ` +${policy.vehicles.length - 3}` : "")}
                          </strong>
                        </span>
                        <span className="flex items-center gap-1 text-brand-rose font-bold">
                          <span className="w-1 h-1 rounded-full bg-brand-rose"></span>
                          {policy.violationsCount > 0 
                            ? `${policy.violationsCount} ${t("policies.violations")}`
                            : "No violations"}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-2.5 flex justify-end gap-1.5 border-t border-panel-border/20 pt-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleStartEditPolicy(policy)}
                          className="px-2 py-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 border border-panel-border transition-all flex items-center gap-1 text-[9px]"
                          title={t("policies.edit")}
                        >
                          <Sliders className="w-3 h-3" />
                          <span>{language === "ko" ? "편집" : "Edit"}</span>
                        </button>
                        <button
                          onClick={() => handleDeletePolicy(policy.id)}
                          className="p-1 rounded text-zinc-500 hover:text-brand-rose hover:bg-brand-rose/10 border border-panel-border transition-all flex items-center gap-1 text-[9px]"
                          title="Delete Policy"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

              {policies.length === 0 && (
                <div className="text-center py-12 border border-dashed border-panel-border rounded text-zinc-500 text-xs">
                  No active policies configured. Click &quot;Create New Policy&quot; to define one.
                </div>
              )}
            </div>
          </div>

          {/* Right Column (3 cols): Policy Inspector & District Breakdown */}
          <div className="xl:col-span-3">
            {selectedPolicyId && policies.find(p => p.id === selectedPolicyId) ? (
              (() => {
                const selectedPolicy = policies.find(p => p.id === selectedPolicyId)!;
                const cityRegions = defaultAdminRegions.filter(r => r.cityName === selectedPolicy.cityName);
                const actionColorClass = 
                  selectedPolicy.action === "ACT_FORCE_STOP" ? "text-brand-rose border-brand-rose/30 bg-brand-rose/10" :
                  selectedPolicy.action === "ACT_LIMIT_SPEED" ? "text-brand-amber border-brand-amber/30 bg-brand-amber/10" :
                  "text-brand-cyan border-brand-cyan/30 bg-brand-cyan/10";

                return (
                  <div className="space-y-4">
                    {/* Header Card */}
                    <div className="cyber-panel p-4 rounded space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-zinc-500 font-mono uppercase block">
                            {language === "ko" ? "정책 상세 인스펙터 (선택됨)" : "Policy Inspector & Telematics Binding"}
                          </span>
                          <h2 className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-brand-cyan" />
                            {selectedPolicy.name}
                          </h2>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${actionColorClass}`}>
                            {selectedPolicy.action}
                          </span>
                          <span className="text-[10px] font-bold text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/20 px-2 py-0.5 rounded flex items-center gap-1">
                            <Radio className="w-2.5 h-2.5 animate-pulse" />
                            <span>DEPLOYED TO EDGE</span>
                          </span>
                        </div>
                      </div>

                      {/* Key Indicators Strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-panel-border/60 text-xs">
                        <div className="bg-zinc-950/60 p-2.5 rounded border border-panel-border/40">
                          <span className="text-zinc-500 block text-[9px] uppercase">{language === "ko" ? "시/도 (City)" : "City"}</span>
                          <span className="font-bold text-zinc-100">{selectedPolicy.cityName}</span>
                        </div>
                        <div className="bg-zinc-950/60 p-2.5 rounded border border-panel-border/40">
                          <span className="text-zinc-500 block text-[9px] uppercase">{language === "ko" ? "관제 자치구" : "Protected Districts"}</span>
                          <span className="font-bold text-brand-cyan">{selectedPolicy.districtCodes.length} / {cityRegions.length} {language === "ko" ? "개 구역" : "districts"}</span>
                        </div>
                        <div className="bg-zinc-950/60 p-2.5 rounded border border-panel-border/40">
                          <span className="text-zinc-500 block text-[9px] uppercase">{language === "ko" ? "우선순위 (Priority)" : "Priority Level"}</span>
                          <span className="font-bold text-zinc-100">{selectedPolicy.priority} (1-100)</span>
                        </div>
                        <div className="bg-zinc-950/60 p-2.5 rounded border border-panel-border/40">
                          <span className="text-zinc-500 block text-[9px] uppercase">{language === "ko" ? "운용 스케줄" : "Time Window"}</span>
                          <span className="font-bold text-zinc-100">
                            {selectedPolicy.startTime && selectedPolicy.endTime ? `${selectedPolicy.startTime} ~ ${selectedPolicy.endTime}` : "24/7 Always Active"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Districts Coverage Breakdown Table/Grid */}
                    <div className="cyber-panel p-4 rounded space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-brand-cyan" />
                          <span>{selectedPolicy.cityName} {language === "ko" ? "행정구역 관제 커버리지 현황" : "Administrative Region Coverage Status"}</span>
                        </span>
                        <span className="text-[9px] text-brand-cyan font-mono bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded">
                          TB_ADMIN_REGIONS
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
                        {cityRegions.map(region => {
                          const isIncluded = selectedPolicy.districtCodes.includes(region.regionCode);
                          const vehsInDistrict = fleetVehiclesList.filter(v => v.districtCode === region.regionCode);

                          return (
                            <div
                              key={region.regionCode}
                              className={`p-3 rounded border transition-all flex flex-col justify-between ${
                                isIncluded
                                  ? "bg-brand-cyan/5 border-brand-cyan/40 shadow-[0_0_8px_rgba(6,182,212,0.08)]"
                                  : "bg-zinc-950/30 border-panel-border/40 opacity-50"
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${isIncluded ? "bg-brand-cyan shadow-[0_0_6px_rgba(6,182,212,0.8)]" : "bg-zinc-700"}`}></span>
                                    <span className={`font-bold text-xs ${isIncluded ? "text-white" : "text-zinc-400"}`}>
                                      {region.districtName}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-zinc-500 block ml-3.5 mt-0.5">
                                    {region.subDistrictName || ""}
                                  </span>
                                </div>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono ${
                                  isIncluded ? "bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20" : "bg-zinc-900 text-zinc-600"
                                }`}>
                                  {isIncluded ? "✔ PROTECTED" : "EXCLUDED"}
                                </span>
                              </div>

                              <div className="mt-2.5 pt-2 border-t border-panel-border/30 flex justify-between items-center text-[8px] text-zinc-500 font-mono">
                                <span>Code: #{region.regionCode.slice(-4)}</span>
                                {vehsInDistrict.length > 0 ? (
                                  <span className="text-zinc-300 font-bold">
                                    {vehsInDistrict.length} fleet vehicles
                                  </span>
                                ) : (
                                  <span>0 vehicles</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Applied Vehicles & Edge Dispatch */}
                    <div className="cyber-panel p-4 rounded space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-brand-cyan" />
                          <span>{language === "ko" ? "정책 바인딩 플릿 차량" : "Bound Fleet Vehicles & Telematics Nodes"}</span>
                        </span>
                        <span className="text-[9px] text-zinc-500">
                          {selectedPolicy.vehicles.length} vehicles assigned
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {selectedPolicy.vehicles.length === 0 ? (
                          <span className="text-zinc-500 text-xs py-2">No vehicles currently bound to this policy.</span>
                        ) : (
                          selectedPolicy.vehicles.map(vehId => {
                            const vehObj = fleetVehiclesList.find(v => v.id === vehId);
                            return (
                              <div
                                key={vehId}
                                className="px-2.5 py-1.5 rounded bg-zinc-950 border border-panel-border text-[9px] font-mono flex items-center gap-2"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
                                <span className="font-bold text-white">{vehId}</span>
                                <span className="text-zinc-500 text-[8px]">{vehObj?.type} &bull; {vehObj?.district}</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-panel-border rounded p-12 text-zinc-600 text-xs">
                Select a policy from the left to view administrative districts coverage, precedence priority, and bound fleet devices.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* POLICY EDITOR: CITY SELECT + ADMINISTRATIVE DISTRICTS CHECKBOX SELECTOR  */
        /* ========================================================================= */
        <div className="cyber-panel p-5 rounded space-y-4 font-mono">
          {/* Editor Header */}
          <div className="border-b border-panel-border pb-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsEditingPolicy(false);
                  setEditingPolicy(null);
                }}
                className="text-zinc-500 hover:text-white transition-all text-xs flex items-center gap-1"
              >
                &larr; {t("policies.cancel")}
              </button>
              <span className="text-zinc-600">|</span>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-cyan" />
                {editingPolicy?.id && policies.some(p => p.id === editingPolicy.id)
                  ? t("policies.edit")
                  : t("policies.create")}
              </h2>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsEditingPolicy(false);
                  setEditingPolicy(null);
                }}
                className="px-3.5 py-1.5 rounded bg-zinc-900 border border-panel-border hover:border-zinc-700 text-zinc-400 hover:text-white text-[10px] font-bold uppercase transition-all"
              >
                {t("policies.cancel")}
              </button>
              <button
                onClick={handleSavePolicy}
                className="px-4 py-1.5 rounded bg-brand-cyan hover:bg-brand-cyan/90 text-black text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              >
                <Check className="w-3.5 h-3.5 stroke-[3px]" />
                {t("policies.save")}
              </button>
            </div>
          </div>

          {/* Form Layout Split */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Left Form Column (2 columns): Policy Metadata */}
            <div className="xl:col-span-2 space-y-4">
              {/* Name input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase block">
                  {t("policies.name_label")}
                </label>
                <input
                  type="text"
                  value={editingPolicy?.name || ""}
                  onChange={(e) => setEditingPolicy(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder={language === "ko" ? "예: 강남/서초 자율주행 안전구역" : "e.g. Gangnam & Seocho Safe-Zone"}
                  className="w-full bg-zinc-950 border border-panel-border rounded p-2 text-xs text-zinc-200 focus:border-zinc-600 outline-none transition-colors"
                />
              </div>

              {/* City selection dropdown: SELECT (TB_ADMIN_REGIONS.CITY_NAME) */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-brand-cyan" />
                    <span>{t("policies.city_label")}</span>
                  </span>
                  <span className="text-[9px] text-brand-cyan font-mono">SELECT</span>
                </label>
                <select
                  value={editingPolicy?.cityName || "서울특별시"}
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
                  className="w-full bg-zinc-950 border border-brand-cyan/30 rounded p-2.5 text-xs text-zinc-200 focus:border-brand-cyan outline-none font-bold cursor-pointer"
                >
                  <option value="서울특별시">서울특별시 (Seoul Special City)</option>
                  <option value="경기도">경기도 (Gyeonggi-do Testing Hubs)</option>
                </select>
              </div>

              {/* Priority & Time Window (TB_SECURITY_POLICIES) */}
              <div className="grid grid-cols-2 gap-3">
                {/* Priority */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase block">
                    {t("policies.priority_label")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editingPolicy?.priority || 10}
                    onChange={(e) => setEditingPolicy(prev => prev ? { ...prev, priority: parseInt(e.target.value) || 10 } : null)}
                    className="w-full bg-zinc-950 border border-panel-border rounded p-2 text-xs text-zinc-200 focus:border-zinc-600 outline-none"
                  />
                </div>

                {/* Violation action */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase block">
                    {t("policies.action_label")}
                  </label>
                  <select
                    value={editingPolicy?.action || "ACT_RAISE_INCIDENT"}
                    onChange={(e) => setEditingPolicy(prev => prev ? { ...prev, action: e.target.value as Policy["action"] } : null)}
                    className="w-full bg-zinc-950 border border-panel-border rounded p-2 text-xs text-zinc-200 focus:border-zinc-700 outline-none cursor-pointer"
                  >
                    <option value="ACT_RAISE_INCIDENT">{t("policies.action_raise")}</option>
                    <option value="ACT_FORCE_STOP">{t("policies.action_stop")}</option>
                    <option value="ACT_LIMIT_SPEED">{t("policies.action_limit")}</option>
                    <option value="ACT_WARN_DRIVER">{t("policies.action_warn")}</option>
                  </select>
                </div>
              </div>

              {/* Time Window (Start Time - End Time) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">
                    {t("policies.time_window")}
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingPolicy(prev => prev ? { ...prev, startTime: null, endTime: null } : null)}
                    className="text-[8px] text-zinc-500 hover:text-zinc-300 underline"
                  >
                    24/7 (Always Active)
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={editingPolicy?.startTime || ""}
                    onChange={(e) => setEditingPolicy(prev => prev ? { ...prev, startTime: e.target.value || null } : null)}
                    className="bg-zinc-950 border border-panel-border rounded p-1.5 text-xs text-zinc-200 focus:border-zinc-600 outline-none"
                  />
                  <input
                    type="time"
                    value={editingPolicy?.endTime || ""}
                    onChange={(e) => setEditingPolicy(prev => prev ? { ...prev, endTime: e.target.value || null } : null)}
                    className="bg-zinc-950 border border-panel-border rounded p-1.5 text-xs text-zinc-200 focus:border-zinc-600 outline-none"
                  />
                </div>
              </div>

              {/* Vehicles selection */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">
                    {t("policies.vehicles_label")}
                  </label>
                  <div className="flex gap-2 text-[8px] font-bold">
                    <button
                      type="button"
                      onClick={handleSelectAllVehicles}
                      className="text-brand-cyan hover:underline"
                    >
                      {t("policies.all_vehicles")}
                    </button>
                    <span className="text-zinc-700">|</span>
                    <button
                      type="button"
                      onClick={handleDeselectAllVehicles}
                      className="text-zinc-500 hover:underline"
                    >
                      {t("policies.none_vehicles")}
                    </button>
                  </div>
                </div>
                
                <div className="border border-panel-border rounded bg-zinc-950/40 p-2 max-h-[160px] overflow-y-auto space-y-1 scrollbar-thin">
                  {fleetVehiclesList.map(veh => {
                    const isChecked = editingPolicy?.vehicles?.includes(veh.id) || false;
                    return (
                      <label
                        key={veh.id}
                        className="flex items-center gap-2 text-xs p-1 hover:bg-zinc-900 rounded cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleVehicleSelection(veh.id)}
                          className="w-3.5 h-3.5 accent-brand-cyan cursor-pointer rounded border-zinc-700 bg-zinc-900"
                        />
                        <div className="flex justify-between items-center flex-1">
                          <span className="font-bold text-zinc-300">{veh.id}</span>
                          <span className="text-[9px] text-zinc-500">{veh.type} &bull; {veh.district}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Form Column (3 columns): Administrative Districts CHECKBOX Selector */}
            <div className="xl:col-span-3 space-y-3">
              <div className="p-4 rounded bg-zinc-950 border border-panel-border space-y-3">
                {/* Header & Controls */}
                <div className="flex justify-between items-center pb-2.5 border-b border-panel-border/60">
                  <div>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-brand-cyan" />
                      <span>{editingPolicy?.cityName || "서울특별시"} {t("policies.district_label")}</span>
                    </span>
                    <span className="text-[9px] text-zinc-500 block mt-0.5">
                      {language === "ko" ? "체크박스를 선택하여 관제할 행정구역을 복수 지정하세요" : "Select checkboxes to include multiple administrative districts"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-cyan font-mono bg-brand-cyan/10 border border-brand-cyan/20 px-2.5 py-0.5 rounded text-[10px] font-bold">
                      {editingPolicy?.districtCodes?.length || 0} / {defaultAdminRegions.filter(r => r.cityName === (editingPolicy?.cityName || "서울특별시")).length} {language === "ko" ? "선택됨" : "selected"}
                    </span>
                    <div className="flex gap-1.5 text-[9px] font-bold ml-2">
                      <button
                        type="button"
                        onClick={handleSelectAllDistricts}
                        className="px-2.5 py-1 rounded bg-zinc-900 border border-panel-border text-brand-cyan hover:text-white transition-all"
                      >
                        {t("policies.all_vehicles")}
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAllDistricts}
                        className="px-2.5 py-1 rounded bg-zinc-900 border border-panel-border text-zinc-400 hover:text-white transition-all"
                      >
                        {t("policies.none_vehicles")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* District Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={districtSearchQuery}
                    onChange={(e) => setDistrictSearchQuery(e.target.value)}
                    placeholder={language === "ko" ? "구/군 검색 (예: 강남구, 서초구, 송파구, 용산구)..." : "Search districts (e.g. Gangnam, Seocho)..."}
                    className="w-full bg-zinc-900/60 border border-panel-border rounded pl-9 pr-2.5 py-1.5 text-xs text-zinc-200 focus:border-zinc-600 outline-none"
                  />
                </div>

                {/* Districts Checkbox Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
                  {defaultAdminRegions
                    .filter(r => r.cityName === (editingPolicy?.cityName || "서울특별시"))
                    .filter(r => 
                      districtSearchQuery.trim() === "" || 
                      r.districtName.toLowerCase().includes(districtSearchQuery.toLowerCase()) ||
                      (r.subDistrictName && r.subDistrictName.toLowerCase().includes(districtSearchQuery.toLowerCase()))
                    )
                    .map(region => {
                      const isChecked = editingPolicy?.districtCodes?.includes(region.regionCode) || false;
                      const vehCountInDistrict = fleetVehiclesList.filter(v => v.districtCode === region.regionCode).length;

                      return (
                        <label
                          key={region.regionCode}
                          className={`flex items-start gap-3 p-3 rounded cursor-pointer transition-all border select-none ${
                            isChecked
                              ? "bg-brand-cyan/10 border-brand-cyan shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                              : "bg-zinc-900/30 border-panel-border/60 hover:border-zinc-700 hover:bg-zinc-900/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleDistrictSelection(region.regionCode)}
                            className="w-4 h-4 mt-0.5 accent-brand-cyan cursor-pointer rounded border-zinc-700 bg-zinc-900 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className={`font-bold text-xs ${isChecked ? "text-white" : "text-zinc-300"}`}>
                                {region.districtName}
                              </span>
                              <span className="text-[8px] font-mono text-zinc-600">
                                #{region.regionCode.slice(-4)}
                              </span>
                            </div>
                            <span className="text-[9px] text-zinc-500 block truncate mt-0.5">
                              {region.subDistrictName || ""}
                            </span>
                            
                            <div className="mt-2.5 pt-1.5 border-t border-panel-border/30 flex justify-between items-center text-[8px]">
                              <span className={`font-bold ${isChecked ? "text-brand-cyan" : "text-zinc-600"}`}>
                                {isChecked ? "✔ SELECTED" : "UNCHECKED"}
                              </span>
                              {vehCountInDistrict > 0 && (
                                <span className="text-zinc-400 font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                                  {vehCountInDistrict} vehs
                                </span>
                              )}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                </div>
              </div>

              {/* Selected Districts Chips Summary */}
              <div className="p-3 bg-zinc-950 border border-panel-border rounded space-y-2">
                <div className="text-[10px] font-bold text-zinc-400 flex items-center justify-between">
                  <span className="uppercase text-zinc-500">
                    {language === "ko" ? "선택된 행정구역 목록 (클릭시 제외):" : "Active Selected Districts (Click to remove):"}
                  </span>
                  <span className="text-brand-cyan font-mono">{editingPolicy?.districtCodes?.length || 0} selected</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {editingPolicy?.districtCodes && editingPolicy.districtCodes.length > 0 ? (
                    editingPolicy.districtCodes.map(code => {
                      const region = defaultAdminRegions.find(r => r.regionCode === code);
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => toggleDistrictSelection(code)}
                          className="px-2.5 py-1 rounded bg-zinc-900 border border-brand-cyan/40 hover:border-brand-rose text-brand-cyan hover:text-brand-rose text-[9px] font-mono font-bold flex items-center gap-1.5 transition-colors group"
                        >
                          <span>{region?.districtName || code}</span>
                          <X className="w-2.5 h-2.5 group-hover:stroke-brand-rose" />
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-zinc-600 text-[10px] py-1">
                      {t("policies.no_points")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
