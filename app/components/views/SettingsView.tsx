"use client";

import React, { useState } from "react";
import {
  Users,
  Key,
  Lock,
  Plus,
  ShieldCheck,
  Trash2,
  Sliders,
  FileCode
} from "lucide-react";
import { useLanguage } from "../LanguageContext";

type RbacRole = "admin" | "dispatcher" | "analyst" | "technician";
type RbacPermission = "emergencyStop" | "forceOta" | "editPolicy" | "viewRawCan";
const rbacPermissions: RbacPermission[] = ["emergencyStop", "forceOta", "editPolicy", "viewRawCan"];

export default function SettingsView() {
  const { t, language } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState("rbac");

  const [apiKeyList, setApiKeyList] = useState([
    { id: "key-1", name: "seoul-gangnam-telemetry-ingest", created: "2026-05-12", status: "ACTIVE", type: "Ingress" },
    { id: "key-2", name: "california-hq-dashboard-mirror", created: "2026-06-01", status: "ACTIVE", type: "Egress" },
    { id: "key-3", name: "hangar-diag-technician-probe", created: "2026-07-20", status: "REVOKED", type: "Diagnostic" }
  ]);

  // RBAC Permission Grid State
  const [rbacMatrix, setRbacMatrix] = useState<Record<RbacRole, Record<RbacPermission, boolean>>>({
    admin: { emergencyStop: true, forceOta: true, editPolicy: true, viewRawCan: true },
    dispatcher: { emergencyStop: true, forceOta: false, editPolicy: false, viewRawCan: true },
    analyst: { emergencyStop: false, forceOta: false, editPolicy: false, viewRawCan: true },
    technician: { emergencyStop: false, forceOta: true, editPolicy: false, viewRawCan: false },
  });

  const toggleRbac = (role: RbacRole, permission: RbacPermission) => {
    setRbacMatrix(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role][permission]
      }
    }));
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
          onClick={() => setActiveSubTab("abac")}
          className={`w-full text-left p-3 rounded font-mono text-xs border transition-all flex items-center gap-2.5 ${
            activeSubTab === "abac"
              ? "bg-zinc-900 border-brand-cyan text-white font-bold"
              : "bg-transparent text-zinc-400 border-panel-border hover:bg-zinc-900/50 hover:text-white"
          }`}
        >
          <FileCode className="w-4 h-4 text-brand-cyan" />
          <span>ABAC & OPA Policy Engine</span>
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
                    {rbacPermissions.map((perm) => (
                      <td key={perm} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={rbacMatrix.admin[perm]}
                          onChange={() => toggleRbac("admin", perm)}
                          className="w-4 h-4 cursor-pointer accent-brand-cyan rounded border-zinc-700 bg-zinc-900"
                        />
                      </td>
                    ))}
                  </tr>
                  {/* LEAD DISPATCHER */}
                  <tr>
                    <td className="p-3 font-bold text-zinc-300">{language === "ko" ? "SOC 리드 디스패처" : "SOC Lead Dispatcher"}</td>
                    {rbacPermissions.map((perm) => (
                      <td key={perm} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={rbacMatrix.dispatcher[perm]}
                          onChange={() => toggleRbac("dispatcher", perm)}
                          className="w-4 h-4 cursor-pointer accent-brand-cyan rounded border-zinc-700 bg-zinc-900"
                        />
                      </td>
                    ))}
                  </tr>
                  {/* ANALYST */}
                  <tr>
                    <td className="p-3 font-bold text-zinc-300">{language === "ko" ? "보안 분석가" : "Security Analyst"}</td>
                    {rbacPermissions.map((perm) => (
                      <td key={perm} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={rbacMatrix.analyst[perm]}
                          onChange={() => toggleRbac("analyst", perm)}
                          className="w-4 h-4 cursor-pointer accent-brand-cyan rounded border-zinc-700 bg-zinc-900"
                        />
                      </td>
                    ))}
                  </tr>
                  {/* TECHNICIAN */}
                  <tr>
                    <td className="p-3 font-bold text-zinc-300">{language === "ko" ? "정비고 엔지니어" : "Hangar Depot Tech"}</td>
                    {rbacPermissions.map((perm) => (
                      <td key={perm} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={rbacMatrix.technician[perm]}
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

        {/* Security Policies & Geozones - Promoted to Dedicated SOC Module */}
        {activeSubTab === "policies" && (
          <div className="cyber-panel p-6 rounded space-y-4 font-mono">
            <div className="border-b border-panel-border pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-brand-cyan font-bold uppercase tracking-wider block">
                  {language === "ko" ? "독립 전용 메뉴로 승격됨" : "PROMOTED TO DEDICATED SOC MODULE"}
                </span>
                <h2 className="text-sm font-bold text-white mt-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-cyan" />
                  <span>{language === "ko" ? "보안 정책 및 지오존 관제 (Security Policies)" : "Security Policies & Geozones"}</span>
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-bold">
                DEDICATED MENU ACTIVE
              </span>
            </div>

            <div className="p-4 bg-zinc-950/60 border border-panel-border rounded space-y-3 text-xs text-zinc-300">
              <p>
                {language === "ko"
                  ? "지오존 및 보안 정책 엔진은 행정구역(TB_ADMIN_REGIONS) 기반의 다중 자치구 선택, 우선순위(Priority 1-100), 운용 스케줄(START/END TIME), 플릿 바인딩 및 원격 엣지 배포를 지원하는 독립된 1급 관제 메뉴로 분리되었습니다."
                  : "Security Policies & Geozones have been elevated to a dedicated primary SOC menu featuring TB_ADMIN_REGIONS multi-district selection, precedence priority (1-100), time-window scheduling, and remote edge deployment."}
              </p>
              <div className="pt-2 border-t border-panel-border flex items-center justify-between text-zinc-400">
                <span>
                  {language === "ko"
                    ? "좌측 사이드바의 '보안 정책 및 지오존' (Security Policies) 메뉴를 이용하세요."
                    : "Please access via the dedicated 'Security Policies' menu in the left sidebar navigation."}
                </span>
              </div>
            </div>
          </div>
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

        {/* Threshold Rules - Relocated Notice */}
        {activeSubTab === "thresholds" && (
          <div className="cyber-panel p-6 rounded space-y-4 font-mono">
            <div className="border-b border-panel-border pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-brand-cyan font-bold uppercase tracking-wider block">
                  {language === "ko" ? "독립 전용 메뉴로 승격됨" : "PROMOTED TO DEDICATED SOC MODULE"}
                </span>
                <h2 className="text-sm font-bold text-white mt-1">
                  {language === "ko" ? "보안 임계값 규칙 (Alert Thresholds)" : "Alert Threshold Rules Engine"}
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold">
                DEDICATED MENU ACTIVE
              </span>
            </div>

            <div className="p-4 bg-zinc-950/60 border border-panel-border rounded space-y-3 text-xs text-zinc-300">
              <p>
                {language === "ko"
                  ? "보안 임계값 규칙은 글로벌 기준값(Global Baseline), 차량 유형별(Vehicle Type: Robotaxi, Shuttle, Delivery), 지오펜스 정책별(Geofence Policy) 및 활성 시간대(Start/End Time)를 지원하는 독립된 1급 관제 메뉴로 분리되었습니다."
                  : "Alert Threshold Rules have been elevated to a dedicated primary SOC menu featuring Global Baseline, Vehicle Type profiles (Robotaxi, Shuttle, Delivery), Geofence Policy bindings, and active time-window scheduling (START_TIME / END_TIME)."}
              </p>
              <div className="pt-2 border-t border-panel-border flex items-center justify-between text-zinc-400">
                <span>
                  {language === "ko"
                    ? "좌측 사이드바의 '보안 임계값 규칙' (Alert Thresholds) 메뉴를 이용하세요."
                    : "Please access via the dedicated 'Alert Thresholds' menu in the left sidebar navigation."}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ABAC & OPA (Open Policy Agent) Policy Engine */}
        {activeSubTab === "abac" && (
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="border-b border-panel-border pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Policy-as-Code Engine</span>
                <h2 className="text-sm font-bold text-white mt-1">Attribute-Based Access Control (ABAC & Rego)</h2>
              </div>
              <span className="text-[10px] text-brand-emerald font-bold border border-brand-emerald/30 bg-brand-emerald/10 px-2 py-0.5 rounded">
                OPA v0.68 COMPILED
              </span>
            </div>

            {/* ABAC Rules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-zinc-950/60 border border-panel-border rounded space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-white">POL-01: Emergency Braking Overrides</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30 rounded font-bold">ACTIVE</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-mono">
                  Allow <span className="text-brand-cyan">POST /v1/fleet/control/emergency-stop</span> ONLY IF:
                </p>
                <div className="space-y-1 text-[10px] text-zinc-400 font-mono bg-zinc-900/60 p-2 rounded border border-panel-border">
                  <div>• Subject: <span className="text-zinc-200">{"role == 'DISPATCHER' && mfa == true"}</span></div>
                  <div>• Environment: <span className="text-zinc-200">{"location == 'Gangnam_SOC'"}</span></div>
                  <div>• Resource: <span className="text-zinc-200">{"vehicle.state in ['AUTONOMOUS_RUN', 'EMERGENCY']"}</span></div>
                </div>
              </div>

              <div className="p-3.5 bg-zinc-950/60 border border-panel-border rounded space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-white">POL-02: Direct OB-CAN Streaming</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30 rounded font-bold">ACTIVE</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-mono">
                  Allow <span className="text-brand-cyan">gRPC /v1/can-bus/stream</span> ONLY IF:
                </p>
                <div className="space-y-1 text-[10px] text-zinc-400 font-mono bg-zinc-900/60 p-2 rounded border border-panel-border">
                  <div>• Subject: <span className="text-zinc-200">{"clearance >= 3 && pki_cert == 'VALID'"}</span></div>
                  <div>• Environment: <span className="text-zinc-200">{"time_window == 'MAINTENANCE_HOURS' || threat == 'CRITICAL'"}</span></div>
                  <div>• Resource: <span className="text-zinc-200">{"bus_mask in ['0x0A2', '0x0F0']"}</span></div>
                </div>
              </div>
            </div>

            {/* Live OPA Rego Code Viewer */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white font-bold flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-brand-cyan" />
                  Live Open Policy Agent (Rego) Definition
                </span>
                <span className="text-[10px] text-zinc-500">package soc.authz.fleet</span>
              </div>

              <pre className="p-3.5 bg-zinc-950 border border-panel-border rounded text-xs text-brand-cyan font-mono overflow-x-auto leading-relaxed">
{`package soc.authz.fleet

default allow = false

# Rule: Emergency Remote Control Overrides
allow {
    input.action.method == "POST"
    input.action.path == "/v1/fleet/control/emergency-stop"
    input.subject.role == "DISPATCHER"
    input.subject.mfa_verified == true
    input.environment.soc_location == "Gangnam_SOC"
    input.resource.vehicle_status == "CRITICAL_ANOMALY"
}

# Rule: OTA Campaign Execution Guard
allow {
    input.action.path == "/v1/ota/campaigns/dispatch"
    input.subject.clearance_level >= 4
    input.subject.scopes[_] == "ota:dispatch"
    input.environment.fleet_threat_level != "CRITICAL" # OTA blocked during critical threat
}`}
              </pre>
            </div>

            <div className="p-3 bg-brand-cyan/5 border border-brand-cyan/20 rounded flex items-center justify-between text-xs">
              <span className="text-zinc-400 text-[11px]">
                OPA Policies are evaluated in &lt; 0.8ms at the API Gateway Envoy WASM filter layer before hitting upstream services.
              </span>
              <button 
                onClick={() => alert("Simulating OPA Policy Evaluation against current SOC Operator claims: RESULT = ALLOW (200)")}
                className="px-3 py-1 bg-brand-cyan text-black rounded text-[10px] font-bold uppercase transition-colors shrink-0 ml-4 cursor-pointer"
              >
                Evaluate Policy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
