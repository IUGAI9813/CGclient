"use client";

import React from "react";
import { ShieldCheck, Sun, Moon } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useTheme } from "../ThemeContext";

export default function AuthHeader() {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 border-b border-panel-border bg-[var(--panel-header-bg)]/80 backdrop-blur-md flex items-center justify-between px-6 z-10 font-mono">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan shadow-sm">
          <ShieldCheck className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-[var(--foreground)]">
              CoreGuard SOC
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 font-bold">
              ENTERPRISE
            </span>
          </div>
          <p className="text-[10px] text-[var(--muted-text)] font-sans hidden sm:block">
            Autonomous Mobility Cyber Defense & Safety Platform
          </p>
        </div>
      </div>

      {/* Right tools (Status, Language & Theme toggle) */}
      <div className="flex items-center gap-2.5">
        {/* System status pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SYSTEMS ONLINE</span>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center rounded-lg border border-panel-border bg-[var(--input-bg)] p-0.5 text-xs font-medium">
          <button
            onClick={() => setLanguage("ko")}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
              language === "ko"
                ? "bg-brand-cyan/20 text-brand-cyan font-bold"
                : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
            }`}
          >
            한국어
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
              language === "en"
                ? "bg-brand-cyan/20 text-brand-cyan font-bold"
                : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
            }`}
          >
            EN
          </button>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-panel-border bg-[var(--input-bg)] text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-brand-cyan" />}
        </button>
      </div>
    </header>
  );
}
