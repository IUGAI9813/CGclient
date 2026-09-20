"use client";

import React from "react";

export default function AuthFooter() {
  return (
    <footer className="h-10 border-t border-panel-border bg-[var(--panel-bg)]/80 flex items-center justify-between px-6 font-mono text-[11px] text-[var(--muted-text)] z-10">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></span>
        <span>ISO/SAE 21434 Road Vehicles Cybersecurity Compliance</span>
      </div>
      <div>
        <span>CoreGuard v3.4.12-PROD</span>
      </div>
    </footer>
  );
}
