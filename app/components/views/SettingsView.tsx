"use client";

import React, { useState } from "react";
import {
  Users,
  Key,
  ShieldCheck,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { useLanguage } from "../LanguageContext";
import {
  useRbac,
  RbacRole,
  NavTabId,
  RbacAction
} from "../RbacContext";

const roles: RbacRole[] = ["admin", "dispatcher", "analyst", "technician"];

const roleLabels: Record<RbacRole, { en: string; ko: string }> = {
  admin: { en: "SOC Administrator", ko: "SOC 관리자" },
  dispatcher: { en: "SOC Lead Dispatcher", ko: "SOC 리드 디스패처" },
  analyst: { en: "Security Analyst", ko: "보안 분석가" },
  technician: { en: "Hangar Depot Tech", ko: "정비고 엔지니어" },
};

const tabDisplayList: { id: NavTabId; en: string; ko: string }[] = [
  { id: "dashboard", en: "Dashboard", ko: "대시보드" },
  { id: "gateway", en: "Gateway", ko: "게이트웨이" },
  { id: "iam", en: "IAM & Auth", ko: "IAM/인증" },
  { id: "incidents", en: "Incidents", ko: "인시던트" },
  { id: "thresholds", en: "Thresholds", ko: "임계값" },
  { id: "policies", en: "Policies", ko: "보안정책" },
  { id: "fleet", en: "Fleet", ko: "플릿진단" },
  { id: "audit", en: "Audit Log", ko: "감사로그" },
  { id: "settings", en: "Settings", ko: "설정" },
];

const actionLabels: Record<RbacAction, { en: string; ko: string }> = {
  emergencyStop: { en: "EMERGENCY STOP", ko: "비상 정지 가동" },
  forceOta: { en: "FORCE OTA", ko: "OTA 강제 실행" },
  editPolicy: { en: "EDIT ACCESS POLICIES", ko: "액세스 정책 수정" },
  viewRawCan: { en: "VIEW RAW OB-CAN", ko: "원시 OB-CAN 조회" },
};

interface SafetyOverrideSetting {
  id: string;
  titleEn: string;
  titleKo: string;
  descEn: string;
  descKo: string;
  enabled: boolean;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  protocol: string;
}

export default function SettingsView() {
  const { t, language } = useLanguage();
  const {
    pagePermissions,
    actionPermissions,
    togglePagePermission,
    toggleActionPermission
  } = useRbac();

  const [activeSubTab, setActiveSubTab] = useState<"rbac" | "safety" | "keys">("rbac");

  // Ingest API Keys state
  const [apiKeyList, setApiKeyList] = useState([
    { id: "key-1", name: "seoul-gangnam-telemetry-ingest", created: "2026-05-12", status: "ACTIVE", type: "Ingress" },
    { id: "key-2", name: "california-hq-dashboard-mirror", created: "2026-06-01", status: "ACTIVE", type: "Egress" },
    { id: "key-3", name: "hangar-diag-technician-probe", created: "2026-07-20", status: "REVOKED", type: "Diagnostic" }
  ]);

  // Safety & Emergency Overrides State
  const [safetyOverrides, setSafetyOverrides] = useState<SafetyOverrideSetting[]>([
    {
      id: "dual_auth_takeover",
      titleEn: "2-Person Dual Authorization for Remote Takeover",
      titleKo: "원격 수동 운전 인계 시 2인 교차 승인(Dual-Auth) 강제",
      descEn: "Requires two authenticated Lead Dispatchers to cryptographically cosign remote vehicle actuator steering override.",
      descKo: "차량 액추에이터 및 조향 권한을 원격으로 강제 인계하기 위해 최소 2명의 상위 디스패처 암호화 동시 서명을 강제합니다.",
      enabled: true,
      severity: "CRITICAL",
      protocol: "ISO/SAE 21434 Sec 9.4"
    },
    {
      id: "mfa_brake_release",
      titleEn: "HSM Challenge Token on Emergency Brake Release",
      titleKo: "비상 브레이크 해제 시 HSM 암호 챌린지 토큰 요구",
      descEn: "Prevents immediate brake lock clearance after an incident until Hardware Security Module validation verifies zero bus anomaly.",
      descKo: "사고 발생 후 차량 브레이크 잠금을 해제하기 전, CAN 버스 이상 유무를 하드웨어 보안 모듈(HSM)에서 재검증하도록 강제합니다.",
      enabled: true,
      severity: "CRITICAL",
      protocol: "UNECE R155 Annex 5"
    },
    {
      id: "double_ack_estop",
      titleEn: "Fleet-Wide Emergency Kill-Switch Confirmation Guard",
      titleKo: "전체 플릿 비상 정지(Kill-Switch) 2단계 확인 가드",
      descEn: "Enforces secondary confirmation modal and audit record before issuing a broadcast emergency stop across all connected zones.",
      descKo: "연결된 전체 구역 차량에 광역 비상 정지를 브로드캐스팅하기 전에 2차 확인 모달 및 감사 기록 생성을 강제합니다.",
      enabled: true,
      severity: "HIGH",
      protocol: "42dot Fail-Safe v3.1"
    },
    {
      id: "mrm_pullover_enforce",
      titleEn: "Minimum Risk Maneuver (MRM) Shoulder Pull-over Lock",
      titleKo: "통신 단절 시 최소 위험 운행(MRM) 갓길 정차 프로토콜 강제",
      descEn: "Autonomous vehicles entering degraded communication states must safely transition to the nearest roadside shoulder within 8 seconds.",
      descKo: "V2X 또는 클라우드 연결이 3초 이상 끊길 경우 차량이 즉시 도로변 가장자리로 비상 정차(MRM)하도록 보증합니다.",
      enabled: true,
      severity: "HIGH",
      protocol: "SAE J3016 Level 4"
    },
    {
      id: "session_autolock",
      titleEn: "SOC Console Inactivity Auto-Lock (15 Mins)",
      titleKo: "SOC 콘솔 15분 미사용 시 세션 자동 잠금",
      descEn: "Revokes active operator dispatch authorization and requires biometric / MFA re-authentication if idle.",
      descKo: "디스패처 화면이 15분 동안 조작되지 않을 경우 명령 권한을 즉시 정지하고 생체 인식 또는 MFA 재인증을 요구합니다.",
      enabled: false,
      severity: "MEDIUM",
      protocol: "SOC Compliance P-12"
    }
  ]);

  const toggleSafetyOverride = (id: string) => {
    setSafetyOverrides(prev =>
      prev.map(item => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
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
          className={`w-full text-left p-3 rounded font-mono text-xs border transition-all flex items-center gap-2.5 ${
            activeSubTab === "rbac"
              ? "bg-zinc-900 border-brand-cyan text-white font-bold"
              : "bg-transparent text-zinc-400 border-panel-border hover:bg-zinc-900/50 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4 text-brand-cyan" />
          <span>{t("settings.tab_rbac")}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("safety")}
          className={`w-full text-left p-3 rounded font-mono text-xs border transition-all flex items-center gap-2.5 ${
            activeSubTab === "safety"
              ? "bg-zinc-900 border-brand-cyan text-white font-bold"
              : "bg-transparent text-zinc-400 border-panel-border hover:bg-zinc-900/50 hover:text-white"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-brand-cyan" />
          <span>{t("settings.tab_safety")}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("keys")}
          className={`w-full text-left p-3 rounded font-mono text-xs border transition-all flex items-center gap-2.5 ${
            activeSubTab === "keys"
              ? "bg-zinc-900 border-brand-cyan text-white font-bold"
              : "bg-transparent text-zinc-400 border-panel-border hover:bg-zinc-900/50 hover:text-white"
          }`}
        >
          <Key className="w-4 h-4 text-brand-cyan" />
          <span>{t("settings.tab_api")}</span>
        </button>
      </div>

      {/* Settings Action Content (Right 3 Columns) */}
      <div className="lg:col-span-3">
        {/* RBAC Role-Permission Grid */}
        {activeSubTab === "rbac" && (
          <div className="cyber-panel p-4 rounded space-y-6">
            <div className="border-b border-panel-border pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                  {language === "ko" ? "보안 규정 및 접근 통제 매트릭스" : "Role-Based Access Control & Navigation Matrices"}
                </span>
                <h2 className="text-sm font-bold text-white mt-1">{t("settings.rbac_title")}</h2>
              </div>
              <span className="text-[10px] text-brand-cyan font-bold border border-brand-cyan/20 bg-brand-cyan/5 px-2 py-0.5 rounded">
                {language === "ko" ? "RBAC 실시간 적용됨" : "RBAC LIVE ENFORCED"}
              </span>
            </div>

            {/* Matrix 1: Page Navigation & Menu Access */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                    {language === "ko" ? "1. 화면 및 메뉴 접근 권한 (Page Navigation Access)" : "1. Page & Navigation Access Permissions"}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {language === "ko"
                      ? "해당 역할의 운영자 사이드바에 노출할 메뉴 항목과 접근 가능한 서브시스템을 지정합니다."
                      : "Controls which console modules and sidebar navigation links are accessible for each operator role."}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border border-panel-border rounded">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-panel-border text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                      <th className="p-3 sticky left-0 bg-zinc-950 min-w-[160px]">
                        {language === "ko" ? "역할 분류" : "Role Descriptor"}
                      </th>
                      {tabDisplayList.map((tab) => (
                        <th key={tab.id} className="p-2.5 text-center min-w-[80px]">
                          {language === "ko" ? tab.ko : tab.en}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-panel-border bg-zinc-950/20">
                    {roles.map((role) => (
                      <tr key={role} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="p-3 font-bold text-zinc-300 sticky left-0 bg-zinc-950/90">
                          {language === "ko" ? roleLabels[role].ko : roleLabels[role].en}
                        </td>
                        {tabDisplayList.map((tab) => (
                          <td key={tab.id} className="p-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={pagePermissions[role][tab.id]}
                              onChange={() => togglePagePermission(role, tab.id)}
                              className="w-4 h-4 cursor-pointer accent-brand-cyan rounded border-zinc-700 bg-zinc-900"
                              title={`Toggle ${tab.en} for ${role}`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Matrix 2: Critical Operational Capabilities */}
            <div className="space-y-2 pt-2 border-t border-panel-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                    {language === "ko" ? "2. 핵심 조작 및 비상 제어 권한 (Operational Capabilities)" : "2. Operational Action Capabilities"}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {language === "ko"
                      ? "비상 정지, OTA 배포, 정책 수정, CAN 버스 원시 패킷 조회 등 특권 명령어 실행 권한을 관리합니다."
                      : "Governs authorization to execute emergency actuation overrides, remote OTA, and deep CAN frame inspections."}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border border-panel-border rounded">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-panel-border text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                      <th className="p-3 sticky left-0 bg-zinc-950 min-w-[160px]">
                        {language === "ko" ? "역할 분류" : "Role Descriptor"}
                      </th>
                      {(Object.keys(actionLabels) as RbacAction[]).map((action) => (
                        <th key={action} className="p-2.5 text-center">
                          {language === "ko" ? actionLabels[action].ko : actionLabels[action].en}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-panel-border bg-zinc-950/20">
                    {roles.map((role) => (
                      <tr key={role} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="p-3 font-bold text-zinc-300 sticky left-0 bg-zinc-950/90">
                          {language === "ko" ? roleLabels[role].ko : roleLabels[role].en}
                        </td>
                        {(Object.keys(actionLabels) as RbacAction[]).map((action) => (
                          <td key={action} className="p-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={actionPermissions[role][action]}
                              onChange={() => toggleActionPermission(role, action)}
                              className="w-4 h-4 cursor-pointer accent-brand-cyan rounded border-zinc-700 bg-zinc-900"
                              title={`Toggle ${action} for ${role}`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-panel-border rounded p-3 text-[10px] text-zinc-500 leading-relaxed font-mono">
              <strong>* {language === "ko" ? "실시간 동기화 참고:" : "REAL-TIME RBAC SYNC:"}</strong>{" "}
              {language === "ko"
                ? "화면 접근 권한을 수정하면 해당 역할을 가진 모든 디스패처의 좌측 사이드바 메뉴가 즉시 변경되며, 권한이 없는 화면에 머물고 있을 경우 자동으로 대시보드로 리다이렉트됩니다."
                : "Modifying page access or operational permissions instantly updates the sidebar navigation for all matching operators, and automatically enforces a 403 redirect if an operator is viewing a revoked module."}
            </div>
          </div>
        )}

        {/* Safety & Emergency Overrides */}
        {activeSubTab === "safety" && (
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="border-b border-panel-border pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                  {language === "ko" ? "플릿 제어 보호 규정" : "Fleet Actuation Fail-Safes"}
                </span>
                <h2 className="text-sm font-bold text-white mt-1">{t("settings.safety_title")}</h2>
              </div>
              <span className="text-[10px] text-brand-emerald font-bold border border-brand-emerald/20 bg-brand-emerald/5 px-2 py-0.5 rounded flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
                <span>FAIL-SAFE ACTIVE</span>
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              {t("settings.safety_subtitle")}
            </p>

            <div className="space-y-3 pt-1">
              {safetyOverrides.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-zinc-950/60 border border-panel-border hover:border-zinc-700 rounded transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {language === "ko" ? item.titleKo : item.titleEn}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${
                          item.severity === "CRITICAL"
                            ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
                            : item.severity === "HIGH"
                            ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                            : "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {language === "ko" ? item.descKo : item.descEn}
                    </p>
                    <div className="flex items-center gap-2 text-[9px] text-zinc-500">
                      <Cpu className="w-3 h-3 text-zinc-500" />
                      <span>{item.protocol}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[10px] font-bold ${
                        item.enabled ? "text-brand-cyan" : "text-zinc-500"
                      }`}
                    >
                      {item.enabled ? (language === "ko" ? "가드 활성" : "ACTIVE") : (language === "ko" ? "해제됨" : "BYPASSED")}
                    </span>

                    <button
                      onClick={() => toggleSafetyOverride(item.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        item.enabled ? "bg-brand-cyan" : "bg-zinc-800"
                      }`}
                      role="switch"
                      aria-checked={item.enabled}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                          item.enabled ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-zinc-900/40 border border-panel-border rounded text-[10px] text-zinc-500 font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {language === "ko"
                  ? "안전 오버라이드 매개변수의 변경 사항은 SOC 감사 로그(TB_AUDIT_LOGS)에 운영자의 전자 서명과 함께 즉시 기록됩니다."
                  : "Modifications to safety overrides are immediately recorded in TB_AUDIT_LOGS with operator cryptographic signature."}
              </span>
            </div>
          </div>
        )}

        {/* API Credentials */}
        {activeSubTab === "keys" && (
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="border-b border-panel-border pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                  {language === "ko" ? "인증 키 관리" : "Credentials Management"}
                </span>
                <h2 className="text-sm font-bold text-white mt-1">{t("settings.api_title")}</h2>
              </div>
              <button
                onClick={handleCreateApiKey}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-cyan hover:bg-brand-cyan/85 text-black rounded text-[10px] font-bold uppercase transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                {t("settings.api_create")}
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              {t("settings.api_subtitle")}
            </p>

            <div className="space-y-3">
              {apiKeyList.map((key) => (
                <div
                  key={key.id}
                  className="flex justify-between items-center bg-zinc-900/40 border border-panel-border p-3 rounded"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          key.status === "ACTIVE" ? "bg-brand-emerald" : "bg-zinc-600"
                        }`}
                      />
                      {key.name}
                    </span>
                    <div className="flex gap-4 text-[9px] text-zinc-500">
                      <span>
                        {language === "ko" ? "역할:" : "TYPE:"}{" "}
                        <strong className="text-zinc-400">
                          {key.type === "Ingress" && language === "ko"
                            ? "수신(Ingress)"
                            : key.type === "Egress" && language === "ko"
                            ? "송신(Egress)"
                            : key.type}
                        </strong>
                      </span>
                      <span>
                        {language === "ko" ? "생성일:" : "CREATED:"}{" "}
                        <strong className="text-zinc-400">{key.created}</strong>
                      </span>
                      <span>
                        ID: <strong className="text-zinc-400">{key.id}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        key.status === "ACTIVE"
                          ? "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20"
                          : "text-zinc-500 bg-zinc-900 border-panel-border"
                      }`}
                    >
                      {key.status === "ACTIVE"
                        ? language === "ko"
                          ? "활성"
                          : "ACTIVE"
                        : language === "ko"
                        ? "폐기됨"
                        : "REVOKED"}
                    </span>

                    {key.status === "ACTIVE" && (
                      <button
                        onClick={() => handleRevokeKey(key.id)}
                        className="p-1 rounded text-zinc-500 hover:text-brand-rose hover:bg-brand-rose/10 transition-colors cursor-pointer"
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
      </div>
    </div>
  );
}
