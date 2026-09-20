"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight } from "lucide-react";
import AuthCard from "../components/auth/AuthCard";
import { useAuth } from "../components/AuthContext";
import { useLanguage } from "../components/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAuth();
  const { language } = useLanguage();



  return (
    <div className="min-h-screen w-full bg-black text-zinc-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono select-none">
      {/* Background Cyberpunk Ambient Glows & Grid */}
      <div className="absolute inset-0 map-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-cyan/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-brand-emerald/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Brand Tag */}
      <div className="mb-6 flex items-center gap-3 z-10">
        <div className="p-2 rounded bg-zinc-900/80 border border-brand-cyan/50 text-brand-cyan shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          <Shield className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <span className="font-bold text-sm tracking-widest text-white block">
            COREGUARD SOC
          </span>
          <span className="text-[10px] text-zinc-500 tracking-widest uppercase">
            Autonomous Mobility Safety & Cyber Defense
          </span>
        </div>
      </div>

      {/* Main Authentication Card Component */}
      <div className="w-full max-w-xl z-10">
        <AuthCard />
      </div>

      {/* Quick Return Link if Already Authenticated */}
      {isAuthenticated && (
        <div className="mt-4 z-10 text-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-zinc-900/90 border border-panel-border hover:border-brand-cyan text-xs text-zinc-300 hover:text-white transition-all cursor-pointer shadow-lg"
          >
            <span>
              {language === "ko"
                ? `현재 로그인된 계정 (${currentUser?.name})으로 콘솔 열기`
                : `Enter Console as (${currentUser?.name})`}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-cyan" />
          </button>
        </div>
      )}

      {/* Bottom Legal / Security Info */}
      <div className="mt-8 text-center text-[10px] text-zinc-600 z-10">
        <span>ISO/SAE 21434 & UN R155 Certified Vehicle Security Operations Center</span>
      </div>
    </div>
  );
}
