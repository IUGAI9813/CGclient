"use client";

import React, { useState } from "react";
import {
  Settings,
  Users,
  Key,
  Lock,
  Check,
  X,
  Plus,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Trash2,
  Sliders,
  Activity
} from "lucide-react";
import { useLanguage } from "../LanguageContext";

export interface Policy {
  id: string;
  name: string;
  action: "ACT_RAISE_INCIDENT" | "ACT_FORCE_STOP" | "ACT_LIMIT_SPEED" | "ACT_WARN_DRIVER";
  vehicles: string[];
  polygon: { x: number; y: number }[];
  status: "ACTIVE" | "INACTIVE";
  violationsCount: number;
}

const fleetVehiclesList = [
  { id: "VEH-42-012", type: "Robotaxi", location: "Gangnam 3rd Ave", x: 120, y: 150 },
  { id: "VEH-42-089", type: "Shuttle", location: "Hangar Standby", x: 280, y: 90 },
  { id: "VEH-42-005", type: "Robotaxi", location: "Gangnam Station", x: 90, y: 80 },
  { id: "VEH-42-104", type: "Delivery Pod", location: "Teheran-ro Street", x: 210, y: 220 },
  { id: "VEH-42-067", type: "Robotaxi", location: "Pangyo Blvd", x: 340, y: 180 },
  { id: "VEH-42-132", type: "Shuttle", location: "Yeoksam Subway", x: 170, y: 110 },
  { id: "VEH-42-111", type: "Robotaxi", location: "Samseong Center", x: 410, y: 240 },
  { id: "VEH-42-150", type: "Delivery Pod", location: "Pangyo Valley Depot", x: 440, y: 80 },
];

export default function SettingsView() {
  const { t, language } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState("rbac");

  // Policies State
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: "pol-1",
      name: language === "ko" ? "테헤ران로 배송 안전 구역" : "Teheran-ro Delivery Bounds",
      action: "ACT_RAISE_INCIDENT",
      vehicles: ["VEH-42-104", "VEH-42-012"],
      polygon: [
        { x: 150, y: 150 },
        { x: 300, y: 150 },
        { x: 300, y: 250 },
        { x: 150, y: 250 }
      ],
      status: "ACTIVE",
      violationsCount: 3
    },
    {
      id: "pol-2",
      name: language === "ko" ? "강남대로 속도 제한 구역" : "Gangnam Speed Limit Patrol",
      action: "ACT_LIMIT_SPEED",
      vehicles: ["VEH-42-005", "VEH-42-132", "VEH-42-067"],
      polygon: [
        { x: 80, y: 60 },
        { x: 200, y: 60 },
        { x: 200, y: 160 },
        { x: 80, y: 160 }
      ],
      status: "ACTIVE",
      violationsCount: 0
    }
  ]);

  // Selected Policy in list mode (to show geozone preview)
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>("pol-1");

  // Editor states
  const [isEditingPolicy, setIsEditingPolicy] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Partial<Policy> | null>(null);
  
  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<{ x: number; y: number }[]>([]);
  const [hoveredMapPoint, setHoveredMapPoint] = useState<{ x: number; y: number } | null>(null);

  const [apiKeyList, setApiKeyList] = useState([
    { id: "key-1", name: "seoul-gangnam-telemetry-ingest", created: "2026-05-12", status: "ACTIVE", type: "Ingress" },
    { id: "key-2", name: "california-hq-dashboard-mirror", created: "2026-06-01", status: "ACTIVE", type: "Egress" },
    { id: "key-3", name: "hangar-diag-technician-probe", created: "2026-07-20", status: "REVOKED", type: "Diagnostic" }
  ]);

  // RBAC Permission Grid State
  const [rbacMatrix, setRbacMatrix] = useState({
    admin: { emergencyStop: true, forceOta: true, editPolicy: true, viewRawCan: true },
    dispatcher: { emergencyStop: true, forceOta: false, editPolicy: false, viewRawCan: true },
    analyst: { emergencyStop: false, forceOta: false, editPolicy: false, viewRawCan: true },
    technician: { emergencyStop: false, forceOta: true, editPolicy: false, viewRawCan: false },
  });

  // Safe Mode Options Toggles
  const [overrides, setOverrides] = useState({
    remoteTakeover: true,
    mfaBrakeOverride: true,
    doubleAcknowledge: false,
    level4Override: true
  });

  // Alert Threshold Rules State
  const [thresholds, setThresholds] = useState({
    batteryWarn: 30,
    batteryCrit: 15,
    latencyWarn: 100,
    latencyCrit: 200,
    lidarPpsWarn: 400,
    lidarPpsCrit: 200,
  });

  const toggleRbac = (role: keyof typeof rbacMatrix, permission: string) => {
    setRbacMatrix(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !((prev[role] as any)[permission])
      }
    }));
  };

  const toggleOverride = (key: keyof typeof overrides) => {
    setOverrides(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCreateApiKey = () => {
    const promptMsg = language === "ko"
      ? "새 데이터 수집(Ingest) API 키의 설명/식별자를 입력하세요:"
      : "Enter description/identifier for new Ingest API Key:";
    const keyName = prompt(promptMsg);
    if (!keyName) return;

    const newKey = {
      id: `key-${Date.now()}`,
      name: keyName,
      created: new Date().toISOString().split("T")[0],
      status: "ACTIVE",
      type: "Ingress"
    };
    setApiKeyList(prev => [...prev, newKey]);
  };

  const handleRevokeKey = (id: string) => {
    setApiKeyList(prev => prev.map(k => k.id === id ? { ...k, status: "REVOKED" } : k));
  };

  const handleStartCreatePolicy = () => {
    setEditingPolicy({
      id: `pol-${Date.now()}`,
      name: "",
      action: "ACT_RAISE_INCIDENT",
      vehicles: [],
      polygon: [],
      status: "ACTIVE",
      violationsCount: 0
    });
    setDrawingPoints([]);
    setIsDrawing(false);
    setIsEditingPolicy(true);
  };

  const handleStartEditPolicy = (policy: Policy) => {
    setEditingPolicy(policy);
    setDrawingPoints(policy.polygon);
    setIsDrawing(false);
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

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 500);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 350);

    // If click is close to the first point and points.length >= 3, close it!
    if (drawingPoints.length >= 3) {
      const firstPt = drawingPoints[0];
      const dist = Math.sqrt((x - firstPt.x) ** 2 + (y - firstPt.y) ** 2);
      if (dist < 12) {
        setIsDrawing(false);
        setEditingPolicy(prev => prev ? { ...prev, polygon: drawingPoints } : null);
        return;
      }
    }

    setDrawingPoints(prev => [...prev, { x, y }]);
  };

  const handleMapDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    if (drawingPoints.length >= 3) {
      setIsDrawing(false);
      setEditingPolicy(prev => prev ? { ...prev, polygon: drawingPoints } : null);
    }
  };

  const handleMapMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 500);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 350);
    setHoveredMapPoint({ x, y });
  };

  const handleMapMouseLeave = () => {
    setHoveredMapPoint(null);
  };

  const handleClearDrawing = () => {
    setDrawingPoints([]);
    setIsDrawing(false);
    setEditingPolicy(prev => prev ? { ...prev, polygon: [] } : null);
  };

  const handleStartDrawing = () => {
    setDrawingPoints([]);
    setIsDrawing(true);
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
    if (drawingPoints.length < 3) {
      alert(language === "ko" ? "지오펜스를 그리십시오 (최소 3개 이상의 좌표)." : "Please draw a geofence (minimum 3 coordinates).");
      return;
    }

    const finalPolicy: Policy = {
      id: editingPolicy.id || `pol-${Date.now()}`,
      name: editingPolicy.name,
      action: editingPolicy.action || "ACT_RAISE_INCIDENT",
      vehicles: editingPolicy.vehicles || [],
      polygon: drawingPoints,
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in font-mono">
      {/* Sub navigation sidebar */}
      <div className="lg:col-span-1 flex flex-col space-y-2">
        <button
          onClick={() => setActiveSubTab("rbac")}
          className={`w-full text-left p-3 rounded font-mono text-xs border transition-all flex items-center gap-2.5 ${activeSubTab === "rbac"
              ? "bg-zinc-900 border-brand-cyan text-white font-bold"
              : "bg-transparent text-zinc-400 border-panel-border hover:bg-zinc-900/50 hover:text-white"
            }`}
        >
          <Users className="w-4 h-4 text-brand-cyan" />
          <span>{t("settings.tab_rbac")}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("policies")}
          className={`w-full text-left p-3 rounded font-mono text-xs border transition-all flex items-center gap-2.5 ${activeSubTab === "policies"
              ? "bg-zinc-900 border-brand-cyan text-white font-bold"
              : "bg-transparent text-zinc-400 border-panel-border hover:bg-zinc-900/50 hover:text-white"
            }`}
        >
          <Lock className="w-4 h-4 text-brand-cyan" />
          <span>{t("settings.tab_policies")}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("keys")}
          className={`w-full text-left p-3 rounded font-mono text-xs border transition-all flex items-center gap-2.5 ${activeSubTab === "keys"
              ? "bg-zinc-900 border-brand-cyan text-white font-bold"
              : "bg-transparent text-zinc-400 border-panel-border hover:bg-zinc-900/50 hover:text-white"
            }`}
        >
          <Key className="w-4 h-4 text-brand-cyan" />
          <span>{t("settings.tab_api")}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("thresholds")}
          className={`w-full text-left p-3 rounded font-mono text-xs border transition-all flex items-center gap-2.5 ${activeSubTab === "thresholds"
              ? "bg-zinc-900 border-brand-cyan text-white font-bold"
              : "bg-transparent text-zinc-400 border-panel-border hover:bg-zinc-900/50 hover:text-white"
            }`}
        >
          <Sliders className="w-4 h-4 text-brand-cyan" />
          <span>{language === "ko" ? "알림 기준값 규칙" : "Alert Threshold Rules"}</span>
        </button>
      </div>

      {/* Settings Action Content (Right 3 Columns) */}
      <div className="lg:col-span-3">
        {/* RBAC Role-Permission Grid */}
        {activeSubTab === "rbac" && (
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="border-b border-panel-border pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">{language === "ko" ? "보안 규정 구성" : "Security Rule Configurations"}</span>
                <h2 className="text-sm font-bold text-white mt-1">{t("settings.rbac_title")}</h2>
              </div>
              <span className="text-[10px] text-brand-cyan font-bold border border-brand-cyan/20 bg-brand-cyan/5 px-2 py-0.5 rounded">
                {language === "ko" ? "RBAC 활성화됨" : "RBAC ACTIVE"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-950 border-b border-panel-border text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="p-3">{language === "ko" ? "역할 분류" : "Role Descriptor"}</th>
                    <th className="p-3 text-center">{language === "ko" ? "비상 정지 가동" : "EMERGENCY STOP"}</th>
                    <th className="p-3 text-center">{language === "ko" ? "OTA 강제 실행" : "FORCE OTA"}</th>
                    <th className="p-3 text-center">{language === "ko" ? "액세스 정책 수정" : "EDIT ACCESS POLICIES"}</th>
                    <th className="p-3 text-center">{language === "ko" ? "원시 OB-CAN 조회" : "VIEW RAW OB-CAN"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-panel-border bg-zinc-950/20">
                  {/* ADMIN */}
                  <tr>
                    <td className="p-3 font-bold text-zinc-300">{language === "ko" ? "SOC 관리자" : "SOC Administrator"}</td>
                    {["emergencyStop", "forceOta", "editPolicy", "viewRawCan"].map((perm) => (
                      <td key={perm} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={(rbacMatrix.admin as any)[perm]}
                          onChange={() => toggleRbac("admin", perm)}
                          className="w-4 h-4 cursor-pointer accent-brand-cyan rounded border-zinc-700 bg-zinc-900"
                        />
                      </td>
                    ))}
                  </tr>
                  {/* LEAD DISPATCHER */}
                  <tr>
                    <td className="p-3 font-bold text-zinc-300">{language === "ko" ? "SOC 리드 디스패처" : "SOC Lead Dispatcher"}</td>
                    {["emergencyStop", "forceOta", "editPolicy", "viewRawCan"].map((perm) => (
                      <td key={perm} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={(rbacMatrix.dispatcher as any)[perm]}
                          onChange={() => toggleRbac("dispatcher", perm)}
                          className="w-4 h-4 cursor-pointer accent-brand-cyan rounded border-zinc-700 bg-zinc-900"
                        />
                      </td>
                    ))}
                  </tr>
                  {/* ANALYST */}
                  <tr>
                    <td className="p-3 font-bold text-zinc-300">{language === "ko" ? "보안 분석가" : "Security Analyst"}</td>
                    {["emergencyStop", "forceOta", "editPolicy", "viewRawCan"].map((perm) => (
                      <td key={perm} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={(rbacMatrix.analyst as any)[perm]}
                          onChange={() => toggleRbac("analyst", perm)}
                          className="w-4 h-4 cursor-pointer accent-brand-cyan rounded border-zinc-700 bg-zinc-900"
                        />
                      </td>
                    ))}
                  </tr>
                  {/* TECHNICIAN */}
                  <tr>
                    <td className="p-3 font-bold text-zinc-300">{language === "ko" ? "정비고 엔지니어" : "Hangar Depot Tech"}</td>
                    {["emergencyStop", "forceOta", "editPolicy", "viewRawCan"].map((perm) => (
                      <td key={perm} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={(rbacMatrix.technician as any)[perm]}
                          onChange={() => toggleRbac("technician", perm)}
                          className="w-4 h-4 cursor-pointer accent-brand-cyan rounded border-zinc-700 bg-zinc-900"
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-zinc-900/40 border border-panel-border rounded p-3 text-[10px] text-zinc-500 leading-relaxed font-mono">
              <strong>* {language === "ko" ? "접근 참고 사항:" : "ACCESS NOTE:"}</strong> {language === "ko" ? "비상 정지 가동이나 정책 편집과 같은 위험한 오버라이드를 허용하면 HSM 클러스터에 암호화 세션 토큰이 즉시 기록되고 배포 시 MFA 재검증이 강제됩니다." : "Permitting dangerous overrides (e.g. Emergency stop override or edit policy overrides) instantly logs cryptographic session tokens into the HSM cluster and forces MFA re-validation on deployment."}
            </div>
          </div>
        )}

        {/* Global Failsafe Policies & Geozones */}
        {activeSubTab === "policies" && (
          !isEditingPolicy ? (
            <div className="cyber-panel p-4 rounded space-y-4">
              {/* Header */}
              <div className="border-b border-panel-border pb-3 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                    {language === "ko" ? "지오존 및 대응 규칙" : "Geozone & Response Protocols"}
                  </span>
                  <h2 className="text-sm font-bold text-white mt-1">
                    {t("settings.tab_policies")}
                  </h2>
                </div>
                <button
                  onClick={handleStartCreatePolicy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-cyan hover:bg-brand-cyan/85 text-black rounded text-[10px] font-bold uppercase transition-all"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                  {t("policies.create")}
                </button>
              </div>

              {/* Split Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                {/* Policy list (2 columns) */}
                <div className="xl:col-span-2 space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {policies.map(policy => {
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
                        className={`p-3 rounded border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected 
                            ? "bg-zinc-900/60 border-brand-cyan shadow-[0_0_12px_rgba(6,182,212,0.1)]" 
                            : "bg-zinc-950/20 border-panel-border hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="text-xs font-bold text-white">{policy.name}</h3>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${actionColors}`}>
                                {policy.action}
                              </span>
                              <span className="text-[8px] text-zinc-500 font-mono bg-zinc-900 px-1 py-0.5 rounded">
                                {policy.polygon.length} {t("policies.points_drawn")}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
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
                            className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
                            title={t("policies.edit")}
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePolicy(policy.id)}
                            className="p-1 rounded text-zinc-500 hover:text-brand-rose hover:bg-brand-rose/10 transition-all"
                            title="Delete Policy"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {policies.length === 0 && (
                    <div className="text-center py-10 border border-dashed border-panel-border rounded text-zinc-500 text-xs">
                      No active policies configured. Click "Create New Policy" to define one.
                    </div>
                  )}
                </div>

                {/* Map preview (3 columns) */}
                <div className="xl:col-span-3 flex flex-col justify-between">
                  {selectedPolicyId && policies.find(p => p.id === selectedPolicyId) ? (
                    (() => {
                      const selectedPolicy = policies.find(p => p.id === selectedPolicyId)!;
                      return (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
                              {language === "ko" ? "지오펜스 궤적 프리뷰: " : "Geozone Path Preview: "}
                              <strong className="text-white">{selectedPolicy.name}</strong>
                            </span>
                            <span>{selectedPolicy.polygon.length} Points</span>
                          </div>

                          {/* Vector Map Preview */}
                          <div className="border border-panel-border bg-zinc-950 rounded relative h-[320px] overflow-hidden flex items-center justify-center p-4">
                            <div className="absolute inset-0 map-grid opacity-75"></div>
                            
                            {/* Streets */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 350">
                              {/* Simulated block structures */}
                              <rect x="20" y="20" width="100" height="60" fill="rgba(39, 39, 45, 0.05)" stroke="rgba(39, 39, 45, 0.15)" strokeWidth="1" />
                              <rect x="180" y="20" width="140" height="60" fill="rgba(39, 39, 45, 0.05)" stroke="rgba(39, 39, 45, 0.15)" strokeWidth="1" />
                              <rect x="380" y="20" width="100" height="60" fill="rgba(39, 39, 45, 0.05)" stroke="rgba(39, 39, 45, 0.15)" strokeWidth="1" />
                              <rect x="20" y="220" width="100" height="100" fill="rgba(39, 39, 45, 0.05)" stroke="rgba(39, 39, 45, 0.15)" strokeWidth="1" />
                              <rect x="380" y="220" width="100" height="100" fill="rgba(39, 39, 45, 0.05)" stroke="rgba(39, 39, 45, 0.15)" strokeWidth="1" />

                              {/* Road Network */}
                              <line x1="0" y1="180" x2="500" y2="180" stroke="#1c1c24" strokeWidth="16" />
                              <line x1="0" y1="180" x2="500" y2="180" stroke="#2a2a35" strokeWidth="1" strokeDasharray="6,4" />
                              <line x1="150" y1="0" x2="150" y2="350" stroke="#1c1c24" strokeWidth="16" />
                              <line x1="150" y1="0" x2="150" y2="350" stroke="#2a2a35" strokeWidth="1" strokeDasharray="6,4" />
                              <line x1="0" y1="100" x2="500" y2="100" stroke="#181820" strokeWidth="10" />
                              <line x1="350" y1="0" x2="350" y2="350" stroke="#181820" strokeWidth="10" />

                              {/* Street Labels */}
                              <text x="30" y="184" fill="#52525b" className="text-[7px]" fontFamily="monospace">TEHERAN-RO</text>
                              <text x="144" y="280" fill="#52525b" className="text-[7px] rotate-90 origin-left" fontFamily="monospace">GANGNAM-DAERO</text>

                              {/* Geozone Area Polygon */}
                              {selectedPolicy.polygon && selectedPolicy.polygon.length >= 3 && (
                                <polygon
                                  points={selectedPolicy.polygon.map(p => `${p.x},${p.y}`).join(" ")}
                                  fill={selectedPolicy.action === "ACT_FORCE_STOP" ? "rgba(244, 63, 94, 0.12)" : selectedPolicy.action === "ACT_LIMIT_SPEED" ? "rgba(245, 158, 11, 0.12)" : "rgba(6, 182, 212, 0.12)"}
                                  stroke={selectedPolicy.action === "ACT_FORCE_STOP" ? "var(--brand-rose)" : selectedPolicy.action === "ACT_LIMIT_SPEED" ? "var(--brand-amber)" : "var(--brand-cyan)"}
                                  strokeWidth="2"
                                  className="animate-pulse-slow"
                                />
                              )}

                              {/* Vehicle Markers */}
                              {fleetVehiclesList.map(veh => {
                                const isAssigned = selectedPolicy.vehicles.includes(veh.id);
                                return (
                                  <g key={veh.id}>
                                    <circle
                                      cx={veh.x}
                                      cy={veh.y}
                                      r={isAssigned ? "5" : "3"}
                                      fill={isAssigned ? "var(--brand-cyan)" : "#3f3f46"}
                                      stroke="black"
                                      strokeWidth="1"
                                    />
                                    {isAssigned && (
                                      <circle
                                        cx={veh.x}
                                        cy={veh.y}
                                        r="9"
                                        fill="none"
                                        stroke="var(--brand-cyan)"
                                        strokeWidth="0.5"
                                        className="animate-ping"
                                        style={{ animationDuration: "3s" }}
                                      />
                                    )}
                                    <text
                                      x={veh.x + 8}
                                      y={veh.y + 3}
                                      fill={isAssigned ? "#ffffff" : "#71717a"}
                                      className="text-[6px] font-bold"
                                      fontFamily="monospace"
                                    >
                                      {veh.id}
                                    </text>
                                  </g>
                                );
                              })}
                            </svg>

                            {/* Zoom controls */}
                            <div className="absolute top-3 left-3 flex flex-col border border-panel-border bg-zinc-950 rounded overflow-hidden text-xs">
                              <button className="w-6 h-6 hover:bg-zinc-900 border-b border-panel-border text-zinc-400 font-bold flex items-center justify-center">+</button>
                              <button className="w-6 h-6 hover:bg-zinc-900 text-zinc-400 font-bold flex items-center justify-center">-</button>
                            </div>
                            <div className="absolute bottom-3 left-3 bg-zinc-950/90 border border-panel-border px-2 py-0.5 rounded text-[8px] text-zinc-500 font-bold">
                              LEAFLET ENGINE ACTIVE (DARK MODE)
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center border border-dashed border-panel-border rounded p-10 text-zinc-600 text-xs">
                      Select a policy to preview geofence polygon overlay and assigned fleet objects.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="cyber-panel p-4 rounded space-y-4 font-mono">
              {/* Editor Header */}
              <div className="border-b border-panel-border pb-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsEditingPolicy(false);
                      setEditingPolicy(null);
                    }}
                    className="text-zinc-500 hover:text-white transition-all text-xs"
                  >
                    &larr; {t("policies.cancel")}
                  </button>
                  <span className="text-zinc-500">|</span>
                  <h2 className="text-sm font-bold text-white">
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
                    className="px-3 py-1.5 rounded bg-zinc-900 border border-panel-border hover:border-zinc-700 text-zinc-400 hover:text-white text-[10px] font-bold uppercase transition-all"
                  >
                    {t("policies.cancel")}
                  </button>
                  <button
                    onClick={handleSavePolicy}
                    className="px-3 py-1.5 rounded bg-brand-cyan hover:bg-brand-cyan/90 text-black text-[10px] font-bold uppercase transition-all"
                  >
                    {t("policies.save")}
                  </button>
                </div>
              </div>

              {/* Form Layout Split */}
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                {/* Form column (2 columns) */}
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
                      placeholder={t("policies.name_placeholder")}
                      className="w-full bg-zinc-950 border border-panel-border rounded p-2 text-xs text-zinc-200 focus:border-zinc-600 outline-none transition-colors"
                    />
                  </div>

                  {/* Violation action select */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase block">
                      {t("policies.action_label")}
                    </label>
                    <select
                      value={editingPolicy?.action || "ACT_RAISE_INCIDENT"}
                      onChange={(e) => setEditingPolicy(prev => prev ? { ...prev, action: e.target.value as any } : null)}
                      className="w-full bg-zinc-950 border border-panel-border rounded p-2 text-xs text-zinc-200 focus:border-zinc-700 outline-none"
                    >
                      <option value="ACT_RAISE_INCIDENT">{t("policies.action_raise")}</option>
                      <option value="ACT_FORCE_STOP">{t("policies.action_stop")}</option>
                      <option value="ACT_LIMIT_SPEED">{t("policies.action_limit")}</option>
                      <option value="ACT_WARN_DRIVER">{t("policies.action_warn")}</option>
                    </select>
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
                    
                    <div className="border border-panel-border rounded bg-zinc-950/40 p-2 max-h-[180px] overflow-y-auto space-y-1.5 scrollbar-thin">
                      {fleetVehiclesList.map(veh => {
                        const isChecked = editingPolicy?.vehicles?.includes(veh.id) || false;
                        return (
                          <label
                            key={veh.id}
                            className="flex items-center gap-2 text-xs p-1.5 hover:bg-zinc-900 rounded cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleVehicleSelection(veh.id)}
                              className="w-3.5 h-3.5 accent-brand-cyan cursor-pointer rounded border-zinc-700 bg-zinc-900"
                            />
                            <div className="flex justify-between items-center flex-1">
                              <span className="font-bold text-zinc-300">{veh.id}</span>
                              <span className="text-[9px] text-zinc-500">{veh.type} &bull; {veh.location}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Map Drawing column (3 columns) */}
                <div className="xl:col-span-3 space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase font-bold">
                    <span>{t("policies.map_instructions")}</span>
                    <span className="text-brand-cyan font-bold">
                      {drawingPoints.length} {t("policies.points_drawn")}
                    </span>
                  </div>

                  {/* Interactive Drawing Board */}
                  <div className="border border-panel-border bg-zinc-950 rounded relative h-[320px] overflow-hidden select-none">
                    <div className="absolute inset-0 map-grid opacity-75"></div>
                    
                    {/* Main Drawing SVG canvas */}
                    <svg
                      onClick={handleMapClick}
                      onMouseMove={handleMapMouseMove}
                      onMouseLeave={handleMapMouseLeave}
                      onDoubleClick={handleMapDoubleClick}
                      className={`absolute inset-0 w-full h-full ${isDrawing ? "cursor-crosshair animate-pulse" : "cursor-default"}`}
                      viewBox="0 0 500 350"
                    >
                      {/* Background block structures */}
                      <rect x="20" y="20" width="100" height="60" fill="rgba(39, 39, 45, 0.05)" stroke="rgba(39, 39, 45, 0.15)" strokeWidth="1" />
                      <rect x="180" y="20" width="140" height="60" fill="rgba(39, 39, 45, 0.05)" stroke="rgba(39, 39, 45, 0.15)" strokeWidth="1" />
                      <rect x="380" y="20" width="100" height="60" fill="rgba(39, 39, 45, 0.05)" stroke="rgba(39, 39, 45, 0.15)" strokeWidth="1" />
                      <rect x="20" y="220" width="100" height="100" fill="rgba(39, 39, 45, 0.05)" stroke="rgba(39, 39, 45, 0.15)" strokeWidth="1" />
                      <rect x="380" y="220" width="100" height="100" fill="rgba(39, 39, 45, 0.05)" stroke="rgba(39, 39, 45, 0.15)" strokeWidth="1" />

                      {/* Road Network */}
                      <line x1="0" y1="180" x2="500" y2="180" stroke="#1c1c24" strokeWidth="16" />
                      <line x1="0" y1="180" x2="500" y2="180" stroke="#2a2a35" strokeWidth="1" strokeDasharray="6,4" />
                      <line x1="150" y1="0" x2="150" y2="350" stroke="#1c1c24" strokeWidth="16" />
                      <line x1="150" y1="0" x2="150" y2="350" stroke="#2a2a35" strokeWidth="1" strokeDasharray="6,4" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="#181820" strokeWidth="10" />
                      <line x1="350" y1="0" x2="350" y2="350" stroke="#181820" strokeWidth="10" />

                      {/* Labels */}
                      <text x="30" y="184" fill="#52525b" className="text-[7px]" fontFamily="monospace">TEHERAN-RO</text>
                      <text x="144" y="280" fill="#52525b" className="text-[7px] rotate-90 origin-left" fontFamily="monospace">GANGNAM-DAERO</text>

                      {/* Drawing Line/Polygon preview */}
                      {drawingPoints.length > 0 && (
                        <>
                          {/* Closed filled polygon (only when completed / not drawing) */}
                          {!isDrawing && drawingPoints.length >= 3 && (
                            <polygon
                              points={drawingPoints.map(p => `${p.x},${p.y}`).join(" ")}
                              fill="rgba(6, 182, 212, 0.15)"
                              stroke="var(--brand-cyan)"
                              strokeWidth="2"
                              className="animate-pulse-slow"
                            />
                          )}
                          
                          {/* Open polyline while drawing */}
                          {isDrawing && drawingPoints.length >= 2 && (
                            <polyline
                              points={drawingPoints.map(p => `${p.x},${p.y}`).join(" ")}
                              fill="none"
                              stroke="var(--brand-cyan)"
                              strokeWidth="2"
                            />
                          )}

                          {/* Line from last point to hover cursor */}
                          {isDrawing && hoveredMapPoint && (
                            <line
                              x1={drawingPoints[drawingPoints.length - 1].x}
                              y1={drawingPoints[drawingPoints.length - 1].y}
                              x2={hoveredMapPoint.x}
                              y2={hoveredMapPoint.y}
                              stroke="var(--brand-cyan)"
                              strokeWidth="1.5"
                              strokeDasharray="4,4"
                            />
                          )}

                          {/* Line from first point to hover cursor to help visualize closing */}
                          {isDrawing && drawingPoints.length >= 3 && hoveredMapPoint && (
                            (() => {
                              const firstPt = drawingPoints[0];
                              const dist = Math.sqrt((hoveredMapPoint.x - firstPt.x) ** 2 + (hoveredMapPoint.y - firstPt.y) ** 2);
                              const closeSnap = dist < 12;
                              return (
                                <line
                                  x1={firstPt.x}
                                  y1={firstPt.y}
                                  x2={hoveredMapPoint.x}
                                  y2={hoveredMapPoint.y}
                                  stroke={closeSnap ? "var(--brand-emerald)" : "var(--brand-cyan)"}
                                  strokeWidth="1"
                                  strokeDasharray="3,6"
                                />
                              );
                            })()
                          )}

                          {/* Vertices handles */}
                          {drawingPoints.map((pt, idx) => {
                            const isFirst = idx === 0;
                            return (
                              <g key={idx}>
                                <circle
                                  cx={pt.x}
                                  cy={pt.y}
                                  r={isFirst && isDrawing ? "6" : "4"}
                                  fill={isFirst && isDrawing ? "var(--brand-emerald)" : "var(--brand-cyan)"}
                                  stroke="black"
                                  strokeWidth="1"
                                  className={isFirst && isDrawing ? "cursor-pointer animate-pulse" : "cursor-default"}
                                />
                                {isFirst && isDrawing && (
                                  <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r="12"
                                    fill="none"
                                    stroke="var(--brand-emerald)"
                                    strokeWidth="0.5"
                                    className="animate-ping"
                                  />
                                )}
                              </g>
                            );
                          })}
                        </>
                      )}

                      {/* Vehicle Positions */}
                      {fleetVehiclesList.map(veh => {
                        const isChecked = editingPolicy?.vehicles?.includes(veh.id) || false;
                        return (
                          <g key={veh.id}>
                            <circle
                              cx={veh.x}
                              cy={veh.y}
                              r={isChecked ? "5" : "3"}
                              fill={isChecked ? "var(--brand-cyan)" : "#3f3f46"}
                              stroke="black"
                              strokeWidth="1"
                            />
                            {isChecked && (
                              <circle
                                cx={veh.x}
                                cy={veh.y}
                                r="9"
                                fill="none"
                                stroke="var(--brand-cyan)"
                                strokeWidth="0.5"
                                className="animate-ping"
                                style={{ animationDuration: "3s" }}
                              />
                            )}
                          </g>
                        );
                      })}
                    </svg>

                    {/* Scale & Controls overlay */}
                    <div className="absolute top-3 left-3 flex flex-col border border-panel-border bg-zinc-950 rounded overflow-hidden text-xs">
                      <button className="w-6 h-6 hover:bg-zinc-900 border-b border-panel-border text-zinc-400 font-bold flex items-center justify-center">+</button>
                      <button className="w-6 h-6 hover:bg-zinc-900 text-zinc-400 font-bold flex items-center justify-center">-</button>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-zinc-950/90 border border-panel-border px-2 py-0.5 rounded text-[8px] text-zinc-500 font-bold uppercase">
                      Map Mode: {isDrawing ? "Drawing active" : "Map Idle"}
                    </div>

                    {/* Latitude & Longitude dynamic display */}
                    <div className="absolute bottom-3 right-3 bg-zinc-950/90 border border-panel-border px-2.5 py-1 rounded text-[9px] text-zinc-400 font-bold">
                      {hoveredMapPoint ? (
                        <>
                          LAT: {(37.5112 + (350 - hoveredMapPoint.y) * 0.0001).toFixed(6)} &bull; LNG: {(127.0215 + hoveredMapPoint.x * 0.00015).toFixed(6)}
                        </>
                      ) : (
                        <>LAT: 37.511200 &bull; LNG: 127.021500</>
                      )}
                    </div>
                  </div>

                  {/* Toolbar */}
                  <div className="flex gap-2">
                    {!isDrawing ? (
                      <button
                        type="button"
                        onClick={handleStartDrawing}
                        className="px-3 py-1.5 rounded bg-zinc-900 border border-panel-border hover:border-zinc-700 text-brand-cyan hover:text-white text-[10px] font-bold uppercase transition-all flex items-center gap-1.5"
                      >
                        <Activity className="w-3.5 h-3.5 animate-pulse" />
                        {t("policies.draw_start")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsDrawing(false);
                          if (drawingPoints.length >= 3) {
                            setEditingPolicy(prev => prev ? { ...prev, polygon: drawingPoints } : null);
                          }
                        }}
                        className="px-3 py-1.5 rounded bg-brand-emerald text-black text-[10px] font-bold uppercase transition-all flex items-center gap-1.5"
                        disabled={drawingPoints.length < 3}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        Finish Polygon
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleClearDrawing}
                      className="px-3 py-1.5 rounded bg-zinc-900 border border-panel-border hover:border-zinc-700 text-zinc-400 hover:text-white text-[10px] font-bold uppercase transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {t("policies.draw_clear")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* API Credentials */}
        {activeSubTab === "keys" && (
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="border-b border-panel-border pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">{language === "ko" ? "인증 키 관리" : "Credentials Management"}</span>
                <h2 className="text-sm font-bold text-white mt-1">{t("settings.api_title")}</h2>
              </div>
              <button
                onClick={handleCreateApiKey}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-cyan hover:bg-brand-cyan/85 text-black rounded text-[10px] font-bold uppercase transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                {t("settings.api_create")}
              </button>
            </div>

            <div className="space-y-3">
              {apiKeyList.map((key) => (
                <div key={key.id} className="flex justify-between items-center bg-zinc-900/40 border border-panel-border p-3 rounded">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${key.status === "ACTIVE" ? "bg-brand-emerald" : "bg-zinc-600"}`}></span>
                      {key.name}
                    </span>
                    <div className="flex gap-4 text-[9px] text-zinc-500">
                      <span>{language === "ko" ? "역할:" : "TYPE:"} <strong className="text-zinc-400">{key.type === "Ingress" && language === "ko" ? "수신(Ingress)" : key.type === "Egress" && language === "ko" ? "송신(Egress)" : key.type}</strong></span>
                      <span>{language === "ko" ? "생성일:" : "CREATED:"} <strong className="text-zinc-400">{key.created}</strong></span>
                      <span>ID: <strong className="text-zinc-400">{key.id}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${key.status === "ACTIVE"
                        ? "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20"
                        : "text-zinc-500 bg-zinc-900 border-panel-border"
                      }`}>
                      {key.status === "ACTIVE" ? (language === "ko" ? "활성" : "ACTIVE") : (language === "ko" ? "폐기됨" : "REVOKED")}
                    </span>

                    {key.status === "ACTIVE" && (
                      <button
                        onClick={() => handleRevokeKey(key.id)}
                        className="p-1 rounded text-zinc-500 hover:text-brand-rose hover:bg-brand-rose/10 transition-colors"
                        title={language === "ko" ? "토큰 철회" : "Revoke Token"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Threshold Rules */}
        {activeSubTab === "thresholds" && (
          <div className="cyber-panel p-4 rounded space-y-6">
            <div className="border-b border-panel-border pb-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">{language === "ko" ? "규칙 엔진" : "Rule Engine"}</span>
              <h2 className="text-sm font-bold text-white mt-1">{t("settings.alerts_title")}</h2>
            </div>

            <div className="space-y-6">
              {/* Battery Threshold */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-cyan" />
                    {language === "ko" ? "최소 차량 배터리 여유분" : "MINIMUM VEHICLE BATTERY MARGIN"}
                  </span>
                  <span className="text-zinc-500 text-[10px]">{language === "ko" ? `임계: ${thresholds.batteryCrit}% | 경고: ${thresholds.batteryWarn}%` : `CRIT: ${thresholds.batteryCrit}% | WARN: ${thresholds.batteryWarn}%`}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-900/40 border border-panel-border p-3 rounded space-y-2">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>{language === "ko" ? "경고 레벨 (%)" : "WARNING LEVEL (%)"}</span>
                      <span className="text-brand-amber font-bold">{thresholds.batteryWarn}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={thresholds.batteryWarn}
                      onChange={(e) => setThresholds(prev => ({ ...prev, batteryWarn: parseInt(e.target.value) }))}
                      className="w-full accent-brand-amber cursor-pointer bg-zinc-955"
                    />
                  </div>

                  <div className="bg-zinc-900/40 border border-panel-border p-3 rounded space-y-2">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>{language === "ko" ? "임계 레벨 (%)" : "CRITICAL LEVEL (%)"}</span>
                      <span className="text-brand-rose font-bold">{thresholds.batteryCrit}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      value={thresholds.batteryCrit}
                      onChange={(e) => setThresholds(prev => ({ ...prev, batteryCrit: parseInt(e.target.value) }))}
                      className="w-full accent-brand-rose cursor-pointer bg-zinc-955"
                    />
                  </div>
                </div>
              </div>

              {/* V2X Latency Threshold */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-cyan" />
                    {language === "ko" ? "최대 V2X 왕복 지연 시간 (RTT)" : "MAXIMUM V2X ROUND-TRIP LATENCY (RTT)"}
                  </span>
                  <span className="text-zinc-500 text-[10px]">{language === "ko" ? `임계: ${thresholds.latencyCrit}ms | 경고: ${thresholds.latencyWarn}ms` : `CRIT: ${thresholds.latencyCrit}ms | WARN: ${thresholds.latencyWarn}ms`}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-900/40 border border-panel-border p-3 rounded space-y-2">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>{language === "ko" ? "경고 레벨 (MS)" : "WARNING LEVEL (MS)"}</span>
                      <span className="text-brand-amber font-bold">{thresholds.latencyWarn} ms</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={thresholds.latencyWarn}
                      onChange={(e) => setThresholds(prev => ({ ...prev, latencyWarn: parseInt(e.target.value) }))}
                      className="w-full accent-brand-amber cursor-pointer bg-zinc-955"
                    />
                  </div>

                  <div className="bg-zinc-900/40 border border-panel-border p-3 rounded space-y-2">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>{language === "ko" ? "임계 레벨 (MS)" : "CRITICAL LEVEL (MS)"}</span>
                      <span className="text-brand-rose font-bold">{thresholds.latencyCrit} ms</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="300"
                      value={thresholds.latencyCrit}
                      onChange={(e) => setThresholds(prev => ({ ...prev, latencyCrit: parseInt(e.target.value) }))}
                      className="w-full accent-brand-rose cursor-pointer bg-zinc-955"
                    />
                  </div>
                </div>
              </div>

              {/* LiDAR Ingest Threshold */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-cyan" />
                    {language === "ko" ? "최소 LIDAR 수신 스트림 속도 (PPS)" : "MINIMUM LIDAR INGEST STREAM RATE (PPS)"}
                  </span>
                  <span className="text-zinc-500 text-[10px]">{language === "ko" ? `임계: ${thresholds.lidarPpsCrit}k/s | 경고: ${thresholds.lidarPpsWarn}k/s` : `CRIT: ${thresholds.lidarPpsCrit}k/s | WARN: ${thresholds.lidarPpsWarn}k/s`}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-900/40 border border-panel-border p-3 rounded space-y-2">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>{language === "ko" ? "경고 한계 (k points/s)" : "WARNING BOUND (k points/s)"}</span>
                      <span className="text-brand-amber font-bold">{thresholds.lidarPpsWarn}k / s</span>
                    </div>
                    <input
                      type="range"
                      min="300"
                      max="500"
                      value={thresholds.lidarPpsWarn}
                      onChange={(e) => setThresholds(prev => ({ ...prev, lidarPpsWarn: parseInt(e.target.value) }))}
                      className="w-full accent-brand-amber cursor-pointer bg-zinc-955"
                    />
                  </div>

                  <div className="bg-zinc-900/40 border border-panel-border p-3 rounded space-y-2">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>{language === "ko" ? "임계 한계 (k points/s)" : "CRITICAL BOUND (k points/s)"}</span>
                      <span className="text-brand-rose font-bold">{thresholds.lidarPpsCrit}k / s</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="300"
                      value={thresholds.lidarPpsCrit}
                      onChange={(e) => setThresholds(prev => ({ ...prev, lidarPpsCrit: parseInt(e.target.value) }))}
                      className="w-full accent-brand-rose cursor-pointer bg-zinc-955"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-panel-border pt-4">
              <button
                onClick={() => alert(language === "ko" ? "오버라이드를 KMS 기본 서명 값으로 되돌립니다." : "Reverting overrides to KMS default signature values.")}
                className="px-3 py-1.5 rounded bg-zinc-900 border border-panel-border hover:border-zinc-700 text-zinc-400 hover:text-white text-[10px] font-bold uppercase transition-all"
              >
                {language === "ko" ? "기본값 리셋" : "RESET DEFAULTS"}
              </button>
              <button
                onClick={() => alert(language === "ko" ? "모든 엣지 ADCU 에이전트에 새로운 운영 경고 정책 규칙을 브로드캐스트합니다..." : "Broadcasting new operational alert policy rules to all Edge ADCU agents...")}
                className="px-3 py-1.5 rounded bg-brand-cyan hover:bg-brand-cyan/90 text-black text-[10px] font-bold uppercase transition-all"
              >
                {language === "ko" ? "정책 규칙 배포" : "DEPLOY POLICY RULES"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
