import React from "react";
import { Users, FileCode, KeyRound, Fingerprint } from "lucide-react";
import { useLanguage } from "@/app/components/LanguageContext";
import { IamSubTab } from "@/entities/iam/model/types";

interface IamSubNavProps {
  activeTab: IamSubTab;
  onTabChange: (tab: IamSubTab) => void;
  pendingCount: number;
}

export function IamSubNav({ activeTab, onTabChange, pendingCount }: IamSubNavProps) {
  const { language } = useLanguage();

  return (
    <div className="flex border-b border-panel-border space-x-2 overflow-x-auto">
      <button
        onClick={() => onTabChange("users")}
        className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
          activeTab === "users"
            ? "border-brand-cyan text-white bg-zinc-900/50"
            : "border-transparent text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <Users className="w-4 h-4 text-brand-cyan" />
        <span>{language === "ko" ? "운영자 계정 및 승인 관리" : "Operators & Clearance Approvals"}</span>
        {pendingCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse font-mono font-bold">
            {pendingCount} PENDING
          </span>
        )}
      </button>

      <button
        onClick={() => onTabChange("jwt")}
        className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
          activeTab === "jwt"
            ? "border-brand-cyan text-white bg-zinc-900/50"
            : "border-transparent text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <FileCode className="w-4 h-4 text-brand-cyan" />
        <span>Interactive JWT & Claims Inspector</span>
      </button>

      <button
        onClick={() => onTabChange("clients")}
        className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
          activeTab === "clients"
            ? "border-brand-cyan text-white bg-zinc-900/50"
            : "border-transparent text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <KeyRound className="w-4 h-4 text-brand-cyan" />
        <span>OAuth 2.0 Clients & Grant Types</span>
      </button>

      <button
        onClick={() => onTabChange("mtls")}
        className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
          activeTab === "mtls"
            ? "border-brand-cyan text-white bg-zinc-900/50"
            : "border-transparent text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <Fingerprint className="w-4 h-4 text-brand-cyan" />
        <span>Fleet mTLS Certificate Authority (PKI)</span>
      </button>
    </div>
  );
}
