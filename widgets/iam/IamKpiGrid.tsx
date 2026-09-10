import React from "react";
import { Users, UserCheck, KeyRound, Lock } from "lucide-react";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Registered Operators */}
      <div className="cyber-panel p-4 rounded relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              {language === "ko" ? "인가 운영자 총원" : "Authorized Personnel"}
            </span>
            <span className="text-xl font-bold text-white tracking-tight block mt-1">
              {users.length} {language === "ko" ? "명" : "Active"}
            </span>
          </div>
          <div className="p-2 rounded bg-zinc-900 border border-panel-border text-brand-cyan">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 text-xs text-zinc-400 flex items-center justify-between">
          <span>{language === "ko" ? "정상 인가 상태:" : "Status:"}</span>
          <span className="text-brand-emerald font-bold">{activeUsersCount} ACTIVE</span>
        </div>
      </div>

      {/* Card 2: Pending Approvals Queue */}
      <div className="cyber-panel p-4 rounded relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              {language === "ko" ? "가입 심사 대기열" : "Pending Sign-Offs"}
            </span>
            <span
              className={`text-xl font-bold tracking-tight block mt-1 ${
                pendingApprovals.length > 0 ? "text-amber-400 animate-pulse" : "text-white"
              }`}
            >
              {pendingApprovals.length} {language === "ko" ? "건" : "Requests"}
            </span>
          </div>
          <div className="p-2 rounded bg-zinc-900 border border-panel-border text-amber-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 text-xs text-zinc-400 flex items-center justify-between">
          <span>{language === "ko" ? "관리자 서명 필요:" : "Action Required:"}</span>
          <span className={pendingApprovals.length > 0 ? "text-amber-400 font-bold" : "text-zinc-500"}>
            {pendingApprovals.length > 0 ? "REVIEW REQUIRED" : "CLEAR"}
          </span>
        </div>
      </div>

      {/* Card 3: IdP Engine */}
      <div className="cyber-panel p-4 rounded relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              Identity Provider (IdP)
            </span>
            <span className="text-xl font-bold text-brand-cyan tracking-tight block mt-1">
              42dot OIDC Engine
            </span>
          </div>
          <div className="p-2 rounded bg-zinc-900 border border-panel-border text-brand-cyan">
            <KeyRound className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 text-xs text-zinc-400 flex items-center justify-between">
          <span>Compliance:</span>
          <span className="text-brand-emerald font-bold">OAuth 2.1 / OIDC</span>
        </div>
      </div>

      {/* Card 4: Revocation Endpoint */}
      <div className="cyber-panel p-4 rounded relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              Fleet PKI Endpoint
            </span>
            <span className="text-xl font-bold text-brand-emerald tracking-tight block mt-1">
              OCSP / CRL Synced
            </span>
          </div>
          <div className="p-2 rounded bg-zinc-900 border border-panel-border text-brand-emerald">
            <Lock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 text-xs text-zinc-400 flex items-center justify-between">
          <span>mTLS CA:</span>
          <span className="text-zinc-300 font-bold">42dot Fleet G3</span>
        </div>
      </div>
    </div>
  );
}
