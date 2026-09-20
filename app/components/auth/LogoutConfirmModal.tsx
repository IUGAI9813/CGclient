"use client";

import React from "react";
import { LogOut, AlertTriangle, X } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { SocUser } from "../AuthContext";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  currentUser: SocUser | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutConfirmModal({
  isOpen,
  currentUser,
  onConfirm,
  onCancel,
}: LogoutConfirmModalProps) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono">
      <div className="relative w-full max-w-md bg-zinc-950 border border-panel-border rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        {/* Top Warning Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-brand-rose via-brand-amber to-brand-rose w-full" />

        {/* Header */}
        <div className="p-4 border-b border-panel-border bg-zinc-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-brand-rose/10 border border-brand-rose/30 text-brand-rose">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {language === "ko" ? "운영자 세션 종료 확인" : "Confirm Operator Sign Out"}
            </span>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-start gap-3 p-3 rounded bg-zinc-900/60 border border-panel-border">
            <AlertTriangle className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-zinc-300">
              <p className="font-bold text-white">
                {language === "ko"
                  ? `${currentUser?.name || "현재 운영자"} 님의 세션을 종료하시겠습니까?`
                  : `Sign out active session for ${currentUser?.name || "current operator"}?`}
              </p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {language === "ko"
                  ? "로그아웃 시 활성 관제 권한이 회수되며, 다시 로그인하려면 `/login` 인증 페이지로 이동합니다."
                  : "Logging out will revoke active console dispatch authorization. You will be redirected to the secure `/login` page."}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded bg-zinc-900/30 border border-panel-border/50 text-[10px] text-zinc-500 flex justify-between items-center">
            <span>OPERATOR_ID: {currentUser?.id || "USR-UNKNOWN"}</span>
            <span className="text-brand-cyan font-bold uppercase">{currentUser?.role || "DISPATCHER"}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-panel-border bg-zinc-900/20 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-zinc-900 border border-panel-border hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            {language === "ko" ? "취소 (돌아가기)" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-brand-rose hover:bg-brand-rose/85 text-black text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.3)] flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === "ko" ? "로그아웃 & 콘솔 잠금" : "Sign Out & Lock"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
