"use client";

import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";
import { SettingsSubNav, SettingsSubTab } from "@/widgets/settings/SettingsSubNav";
import { RbacMatrixWidget } from "@/widgets/settings/RbacMatrixWidget";
import {
  SafetyOverridesWidget,
  SafetyOverrideSetting,
} from "@/widgets/settings/SafetyOverridesWidget";
import {
  ApiKeyManagementWidget,
  ApiKeyItem,
} from "@/widgets/settings/ApiKeyManagementWidget";

export default function SettingsView() {
  const { language } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<SettingsSubTab>("rbac");

  // Ingest API Keys state
  const [apiKeyList, setApiKeyList] = useState<ApiKeyItem[]>([
    {
      id: "key-1",
      name: "seoul-gangnam-telemetry-ingest",
      created: "2026-05-12",
      status: "ACTIVE",
      type: "Ingress",
    },
    {
      id: "key-2",
      name: "california-hq-dashboard-mirror",
      created: "2026-06-01",
      status: "ACTIVE",
      type: "Egress",
    },
    {
      id: "key-3",
      name: "hangar-diag-technician-probe",
      created: "2026-07-20",
      status: "REVOKED",
      type: "Diagnostic",
    },
  ]);

  // Safety & Emergency Overrides State
  const [safetyOverrides, setSafetyOverrides] = useState<SafetyOverrideSetting[]>([
    {
      id: "dual_auth_takeover",
      titleEn: "2-Person Dual Authorization for Remote Takeover",
      titleKo: "원격 수동 운전 인계 시 2인 교차 승인(Dual-Auth) 강제",
      descEn:
        "Requires two authenticated Lead Dispatchers to cryptographically cosign remote vehicle actuator steering override.",
      descKo:
        "차량 액추에이터 및 조향 권한을 원격으로 강제 인계하기 위해 최소 2명의 상위 디스패처 암호화 동시 서명을 강제합니다.",
      enabled: true,
      severity: "CRITICAL",
      protocol: "ISO/SAE 21434 Sec 9.4",
    },
    {
      id: "mfa_brake_release",
      titleEn: "HSM Challenge Token on Emergency Brake Release",
      titleKo: "비상 브레이크 해제 시 HSM 암호 챌린지 토큰 요구",
      descEn:
        "Prevents immediate brake lock clearance after an incident until Hardware Security Module validation verifies zero bus anomaly.",
      descKo:
        "사고 발생 후 차량 브레이크 잠금을 해제하기 전, CAN 버스 이상 유무를 하드웨어 보안 모듈(HSM)에서 재검증하도록 강제합니다.",
      enabled: true,
      severity: "CRITICAL",
      protocol: "UNECE R155 Annex 5",
    },
    {
      id: "double_ack_estop",
      titleEn: "Fleet-Wide Emergency Kill-Switch Confirmation Guard",
      titleKo: "전체 플릿 비상 정지(Kill-Switch) 2단계 확인 가드",
      descEn:
        "Enforces secondary confirmation modal and audit record before issuing a broadcast emergency stop across all connected zones.",
      descKo:
        "연결된 전체 구역 차량에 광역 비상 정지를 브로드캐스팅하기 전에 2차 확인 모달 및 감사 기록 생성을 강제합니다.",
      enabled: true,
      severity: "HIGH",
      protocol: "ISO-26262 Fail-Safe v3.1",
    },
    {
      id: "mrm_pullover_enforce",
      titleEn: "Minimum Risk Maneuver (MRM) Shoulder Pull-over Lock",
      titleKo: "통신 단절 시 최소 위험 운행(MRM) 갓길 정차 프로토콜 강제",
      descEn:
        "Autonomous vehicles entering degraded communication states must safely transition to the nearest roadside shoulder within 8 seconds.",
      descKo:
        "V2X 또는 클라우드 연결이 3초 이상 끊길 경우 차량이 즉시 도로변 가장자리로 비상 정차(MRM)하도록 보증합니다.",
      enabled: true,
      severity: "HIGH",
      protocol: "SAE J3016 Level 4",
    },
    {
      id: "session_autolock",
      titleEn: "SOC Console Inactivity Auto-Lock (15 Mins)",
      titleKo: "SOC 콘솔 15분 미사용 시 세션 자동 잠금",
      descEn:
        "Revokes active operator dispatch authorization and requires biometric / MFA re-authentication if idle.",
      descKo:
        "디스패처 화면이 15분 동안 조작되지 않을 경우 명령 권한을 즉시 정지하고 생체 인식 또는 MFA 재인증을 요구합니다.",
      enabled: false,
      severity: "MEDIUM",
      protocol: "SOC Compliance P-12",
    },
  ]);

  const toggleSafetyOverride = (id: string) => {
    setSafetyOverrides((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const handleCreateApiKey = () => {
    const promptMsg =
      language === "ko"
        ? "새 데이터 수집(Ingest) API 키의 설명/식별자를 입력하세요:"
        : "Enter description/identifier for new Ingest API Key:";
    const keyName = prompt(promptMsg);
    if (!keyName) return;

    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: keyName,
      created: new Date().toISOString().split("T")[0],
      status: "ACTIVE",
      type: "Ingress",
    };
    setApiKeyList((prev) => [...prev, newKey]);
  };

  const handleRevokeKey = (id: string) => {
    setApiKeyList((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "REVOKED" } : k))
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in font-mono">
      {/* 1. Sub navigation sidebar */}
      <div className="lg:col-span-1">
        <SettingsSubNav activeTab={activeSubTab} onSelectTab={setActiveSubTab} />
      </div>

      {/* 2. Settings Action Content */}
      <div className="lg:col-span-3">
        {activeSubTab === "rbac" && <RbacMatrixWidget />}

        {activeSubTab === "safety" && (
          <SafetyOverridesWidget
            overrides={safetyOverrides}
            onToggleOverride={toggleSafetyOverride}
          />
        )}

        {activeSubTab === "keys" && (
          <ApiKeyManagementWidget
            apiKeyList={apiKeyList}
            onCreateApiKey={handleCreateApiKey}
            onRevokeKey={handleRevokeKey}
          />
        )}
      </div>
    </div>
  );
}
