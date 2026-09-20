import React from "react";
import { useLanguage } from "@/app/components/LanguageContext";
import { IamSubTab } from "@/entities/iam/model/types";

interface IamSubNavProps {
  activeTab: IamSubTab;
  onTabChange: (tab: IamSubTab) => void;
  pendingCount: number;
}

export function IamSubNav({ activeTab, onTabChange, pendingCount }: IamSubNavProps) {
  const { language } = useLanguage();

  const tabs: { key: IamSubTab; label: string; badge?: number }[] = [
    {
      key: "users",
      label: language === "ko" ? "운영자 계정" : "Operators",
      badge: pendingCount
    },
    {
      key: "jwt",
      label: "JWT Inspector"
    },
    {
      key: "clients",
      label: "OAuth 2.0 Clients"
    },
    {
      key: "mtls",
      label: "mTLS PKI"
    }
  ];

  return (
    <div className="flex items-center gap-1 bg-[var(--panel-header-bg)] p-1 rounded-md border border-panel-border overflow-x-auto scrollbar-none font-sans">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === tab.key
              ? "bg-[var(--panel-bg)] text-brand-cyan font-semibold shadow-2xs"
              : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
          }`}
        >
          <span>{tab.label}</span>
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-400 font-mono font-bold">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

