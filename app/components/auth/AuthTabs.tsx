"use client";

import React from "react";
import { KeyRound, UserPlus } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export type AuthMode = "login" | "register";

interface AuthTabsProps {
  mode: AuthMode;
  onSelectMode: (mode: AuthMode) => void;
}

export default function AuthTabs({ mode, onSelectMode }: AuthTabsProps) {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-2 border-b border-panel-border bg-zinc-900/40 text-xs font-bold font-mono">
      <button
        type="button"
        onClick={() => onSelectMode("login")}
        className={`py-3 flex items-center justify-center gap-2 transition-all cursor-pointer ${
          mode === "login"
            ? "bg-zinc-950 text-brand-cyan border-b-2 border-brand-cyan shadow-[inset_0_-2px_8px_rgba(0,229,255,0.15)]"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <KeyRound className="w-3.5 h-3.5" />
        <span>{language === "ko" ? "운영자 로그인" : "Operator Sign In"}</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectMode("register")}
        className={`py-3 flex items-center justify-center gap-2 transition-all cursor-pointer ${
          mode === "register"
            ? "bg-zinc-950 text-brand-cyan border-b-2 border-brand-cyan shadow-[inset_0_-2px_8px_rgba(0,229,255,0.15)]"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <UserPlus className="w-3.5 h-3.5" />
        <span>{language === "ko" ? "접근 권한 등록 신청" : "Request Access Clearance"}</span>
      </button>
    </div>
  );
}
