"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";

export type AuthMode = "login" | "register";

interface AuthTabsProps {
  mode: AuthMode;
  onSelectMode: (mode: AuthMode) => void;
}

export default function AuthTabs({ mode, onSelectMode }: AuthTabsProps) {
  const { language } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-[var(--input-bg)] p-1 rounded-lg border border-panel-border">
      <button
        type="button"
        onClick={() => onSelectMode("login")}
        className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
          mode === "login"
            ? "bg-[var(--panel-bg)] text-brand-cyan shadow-sm font-bold border border-panel-border/80"
            : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
        }`}
      >
        {language === "ko" ? "운영자 로그인" : "Sign In"}
      </button>

      <button
        type="button"
        onClick={() => onSelectMode("register")}
        className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
          mode === "register"
            ? "bg-[var(--panel-bg)] text-brand-cyan shadow-sm font-bold border border-panel-border/80"
            : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
        }`}
      >
        {language === "ko" ? "가입 신청" : "Request Access"}
      </button>
    </div>
  );
}
