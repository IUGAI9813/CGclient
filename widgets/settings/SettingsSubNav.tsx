"use client";

import React from "react";
import { Users, ShieldCheck, Key } from "lucide-react";
import { useLanguage } from "@/app/components/LanguageContext";

export type SettingsSubTab = "rbac" | "safety" | "keys";

interface SettingsSubNavProps {
  activeTab: SettingsSubTab;
  onSelectTab: (tab: SettingsSubTab) => void;
}

export const SettingsSubNav: React.FC<SettingsSubNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-2 font-mono">
      <button
        onClick={() => onSelectTab("rbac")}
        className={`w-full text-left p-3 rounded font-mono text-xs border transition-all flex items-center gap-2.5 cursor-pointer ${
          activeTab === "rbac"
            ? "bg-zinc-900 border-brand-cyan text-white font-bold"
            : "bg-transparent text-zinc-400 border-panel-border hover:bg-zinc-900/50 hover:text-white"
        }`}
      >
        <Users className="w-4 h-4 text-brand-cyan" />
        <span>{t("settings.tab_rbac")}</span>
      </button>

      <button
        onClick={() => onSelectTab("safety")}
        className={`w-full text-left p-3 rounded font-mono text-xs border transition-all flex items-center gap-2.5 cursor-pointer ${
          activeTab === "safety"
            ? "bg-zinc-900 border-brand-cyan text-white font-bold"
            : "bg-transparent text-zinc-400 border-panel-border hover:bg-zinc-900/50 hover:text-white"
        }`}
      >
        <ShieldCheck className="w-4 h-4 text-brand-cyan" />
        <span>{t("settings.tab_safety")}</span>
      </button>

      <button
        onClick={() => onSelectTab("keys")}
        className={`w-full text-left p-3 rounded font-mono text-xs border transition-all flex items-center gap-2.5 cursor-pointer ${
          activeTab === "keys"
            ? "bg-zinc-900 border-brand-cyan text-white font-bold"
            : "bg-transparent text-zinc-400 border-panel-border hover:bg-zinc-900/50 hover:text-white"
        }`}
      >
        <Key className="w-4 h-4 text-brand-cyan" />
        <span>{t("settings.tab_api")}</span>
      </button>
    </div>
  );
};
