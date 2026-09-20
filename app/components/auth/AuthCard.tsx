"use client";

import React, { useState } from "react";
import { AlertCircle, ChevronRight } from "lucide-react";
import AuthHeader from "./AuthHeader";
import AuthTabs, { AuthMode } from "./AuthTabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useLanguage } from "../LanguageContext";

export interface AuthCardProps {
  onClose?: () => void;
  canClose?: boolean;
}

export default function AuthCard({ onClose, canClose = false }: AuthCardProps) {
  const { language } = useLanguage();
  const [mode, setMode] = useState<AuthMode>("login");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMessage(null);
  };

  return (
    <div className="relative w-full max-w-xl bg-zinc-950 border border-panel-border rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col font-mono">
      {/* Top Decorative Cyberpunk Scanline / Header */}
      <div className="h-1 bg-gradient-to-r from-brand-cyan via-brand-emerald to-brand-cyan w-full" />

      {/* Header */}
      <AuthHeader />

      {/* Tab Switcher */}
      <AuthTabs mode={mode} onSelectMode={handleSelectMode} />

      {/* Body Content */}
      <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        {errorMessage && (
          <div className="p-3 bg-brand-rose/10 border border-brand-rose/30 rounded text-xs text-brand-rose flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block uppercase text-[10px]">AUTH_SECURITY_DENIED</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {mode === "login" ? (
          <LoginForm onError={setErrorMessage} />
        ) : (
          <RegisterForm
            onReturnToLogin={() => handleSelectMode("login")}
            onError={setErrorMessage}
          />
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-panel-border bg-zinc-900/20 flex justify-between items-center text-[10px] text-zinc-500">
        <span>Protected by 42dot Zero-Trust Security Gateway</span>
        {canClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
          >
            <span>{language === "ko" ? "닫기" : "Close"}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
