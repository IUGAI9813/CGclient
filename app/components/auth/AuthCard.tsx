"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertCircle, X } from "lucide-react";
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
    <div className="w-full max-w-md bg-[var(--panel-bg)] border border-panel-border rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col font-sans">
      {/* Card Header */}
      <div className="p-6 border-b border-panel-border bg-[var(--panel-header-bg)]/80 text-center relative">
        <div className="w-12 h-12 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan flex items-center justify-center mx-auto mb-3 shadow-sm">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
          {language === "ko" ? "보안 관제 센터 인증" : "SOC Operator Authentication"}
        </h1>
        <p className="text-xs text-[var(--muted-text)] mt-1">
          {language === "ko" 
            ? "관제 권한 확인 및 자율주행 보안 콘솔 접속" 
            : "Verify operational clearance for autonomous fleet telemetry"}
        </p>

        {canClose && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--panel-bg)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="px-6 pt-4 bg-[var(--panel-header-bg)]/40 border-b border-panel-border">
        <AuthTabs mode={mode} onSelectMode={handleSelectMode} />
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-4">
        {errorMessage && (
          <div className="p-3 bg-brand-rose/10 border border-brand-rose/20 rounded-md text-xs text-brand-rose flex items-start gap-2 animate-fade-in font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
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
    </div>
  );
}
