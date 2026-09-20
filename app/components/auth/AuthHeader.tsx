"use client";

import React from "react";
import { ShieldCheck, Fingerprint } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function AuthHeader() {
  const { language } = useLanguage();

  return (
    <div className="p-6 border-b border-panel-border bg-zinc-900/30 flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
          <span className="text-[10px] text-brand-cyan font-bold tracking-widest uppercase font-mono">
            42dot CoreGuard SOC // AUTHENTICATION GATEWAY
          </span>
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-cyan" />
          <span>{language === "ko" ? "보안 관제 센터 통합 인증" : "SOC Security Gateway"}</span>
        </h1>
        <p className="text-xs text-zinc-400">
          {language === "ko"
            ? "자율주행 차량 관제 콘솔 접근을 위해 운영자 자격을 증명하거나 가입을 신청하십시오."
            : "Authenticate operator credentials or request clearance for autonomous vehicle fleet management."}
        </p>
      </div>

      <div className="flex flex-col items-end shrink-0 ml-4 font-mono">
        <span className="text-[9px] px-2 py-0.5 rounded font-bold border border-brand-emerald/30 bg-brand-emerald/10 text-brand-emerald flex items-center gap-1">
          <Fingerprint className="w-3 h-3" />
          <span>KMS ENCRYPTED</span>
        </span>
        <span className="text-[9px] text-zinc-500 mt-1">v2.4.1 (HSM Level 3)</span>
      </div>
    </div>
  );
}
