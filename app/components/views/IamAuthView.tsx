"use client";

import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";
import { RbacRole } from "../RbacContext";
import { IamSubTab, OAuthClient, MtlsCert } from "@/entities/iam/model/types";
import { defaultOauthClients, defaultMtlsCerts } from "@/entities/iam/model/mock-data";
import { IamKpiGrid } from "@/widgets/iam/IamKpiGrid";
import { IamSubNav } from "@/widgets/iam/IamSubNav";
import { UserDirectoryWidget } from "@/widgets/iam/UserDirectoryWidget";
import { JwtInspectorWidget } from "@/widgets/iam/JwtInspectorWidget";
import { ClientAppsWidget } from "@/widgets/iam/ClientAppsWidget";
import { MtlsCertWidget } from "@/widgets/iam/MtlsCertWidget";

export default function IamAuthView() {
  const {
    users,
    pendingApprovals,
    approveUser,
    rejectUser,
    addUserDirectly,
    toggleUserLock,
    deleteUser
  } = useAuth();
  const { language } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState<IamSubTab>("jwt");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [oauthClients] = useState<OAuthClient[]>(defaultOauthClients);
  const [mtlsCerts, setMtlsCerts] = useState<MtlsCert[]>(defaultMtlsCerts);

  const handleApprove = (id: string, assignedRole: RbacRole) => {
    const target = pendingApprovals.find((p) => p.id === id);
    approveUser(id, assignedRole);
    setActionFeedback(
      language === "ko"
        ? `${target?.name || "운영자"} (${assignedRole.toUpperCase()}) 님의 가입 신청이 성공적으로 승인되었습니다.`
        : `${target?.name || "Operator"} approved as ${assignedRole.toUpperCase()} successfully.`
    );
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleReject = (id: string) => {
    const target = pendingApprovals.find((p) => p.id === id);
    rejectUser(id);
    setActionFeedback(
      language === "ko"
        ? `${target?.name || "운영자"} 님의 신청이 반려되었습니다.`
        : `Application rejected.`
    );
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleAddUser = (userData: Parameters<typeof addUserDirectly>[0]) => {
    addUserDirectly(userData);
    setActionFeedback(
      language === "ko"
        ? `신규 운영자 ${userData.name} (${userData.role.toUpperCase()}) 등록이 완료되었습니다.`
        : `Operator ${userData.name} (${userData.role.toUpperCase()}) successfully registered.`
    );
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleRevokeMtls = (id: string) => {
    setMtlsCerts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "REVOKED" as const } : c))
    );
  };

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Top IAM Overview KPI Metric Cards */}
      <IamKpiGrid users={users} pendingApprovals={pendingApprovals} />

      {/* Sub-tab Navigation */}
      <IamSubNav
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
        pendingCount={pendingApprovals.length}
      />

      {/* Sub-tab Content Panels */}
      {activeSubTab === "users" && (
        <UserDirectoryWidget
          users={users}
          pendingApprovals={pendingApprovals}
          actionFeedback={actionFeedback}
          onApprove={handleApprove}
          onReject={handleReject}
          onToggleLock={toggleUserLock}
          onDeleteUser={deleteUser}
          onAddUser={handleAddUser}
        />
      )}

      {activeSubTab === "jwt" && <JwtInspectorWidget />}

      {activeSubTab === "clients" && <ClientAppsWidget clients={oauthClients} />}

      {activeSubTab === "mtls" && (
        <MtlsCertWidget certs={mtlsCerts} onRevokeCert={handleRevokeMtls} />
      )}
    </div>
  );
}
