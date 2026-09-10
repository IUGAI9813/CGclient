"use client";

import React from "react";
import { useLanguage } from "@/app/components/LanguageContext";
import { useRbac, RbacRole, NavTabId, RbacAction } from "@/app/components/RbacContext";

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

export const RbacMatrixWidget: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    pagePermissions,
    actionPermissions,
    togglePagePermission,
    toggleActionPermission,
  } = useRbac();

  return (
    <div className="cyber-panel p-4 rounded space-y-6">
      <div className="border-b border-panel-border pb-3 flex justify-between items-center">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
            {language === "ko"
              ? "보안 규정 및 접근 통제 매트릭스"
              : "Role-Based Access Control & Navigation Matrices"}
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
              {language === "ko"
                ? "1. 화면 및 메뉴 접근 권한 (Page Navigation Access)"
                : "1. Page & Navigation Access Permissions"}
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
              {language === "ko"
                ? "2. 핵심 조작 및 비상 제어 권한 (Operational Capabilities)"
                : "2. Operational Action Capabilities"}
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
  );
};
