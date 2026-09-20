import React from "react";
import { useLanguage } from "@/app/components/LanguageContext";
import { SocUser, PendingApproval } from "@/app/components/AuthContext";

interface IamKpiGridProps {
  users: SocUser[];
  pendingApprovals: PendingApproval[];
}

export function IamKpiGrid({ users, pendingApprovals }: IamKpiGridProps) {
  const { language } = useLanguage();
  const activeUsersCount = users.filter((u) => u.status === "ACTIVE").length;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-1 font-sans">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-[var(--foreground)] tracking-tight">
          {language === "ko" ? "인증 및 권한 관리 (IAM)" : "Identity & Access Management"}
        </h1>
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted-text)]">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--panel-header-bg)] border border-panel-border text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
            <span>{activeUsersCount}/{users.length} {language === "ko" ? "운영자 활성" : "Active"}</span>
          </span>
          {pendingApprovals.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-semibold">
              {pendingApprovals.length} {language === "ko" ? "건 승인 대기" : "Pending"}
            </span>
          )}
          <span className="hidden md:inline text-[11px] text-[var(--muted-text)]">
            &bull; OAuth 2.1 &bull; mTLS PKI
          </span>
        </div>
      </div>
    </div>
  );
}

