"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  X
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { RbacRole } from "../RbacContext";
import { useLanguage } from "../LanguageContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  canClose?: boolean;
}

export default function AuthModal({ isOpen, onClose, canClose = false }: AuthModalProps) {
  const { login, requestAccess } = useAuth();
  const { language } = useLanguage();

  const [mode, setMode] = useState<"login" | "register">("login");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("admin@coreguard.io");
  const [loginPassword, setLoginPassword] = useState("••••••••");
  const [loginRoleOverride, setLoginRoleOverride] = useState<RbacRole>("admin");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Registration form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regDept, setRegDept] = useState("Autonomous Mobility Fleet Division");
  const [regRole, setRegRole] = useState<RbacRole>("dispatcher");
  const [regReason, setRegReason] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const result = await login(loginEmail, loginRoleOverride);
    setIsLoading(false);

    if (result.success) {
      if (onClose) onClose();
    } else {
      setErrorMessage(result.error || "Authentication failed. Please check credentials.");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regReason.trim()) {
      setErrorMessage(language === "ko" ? "모든 필수 항목을 입력해 주십시오." : "Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await requestAccess({
      name: regName,
      email: regEmail,
      department: regDept,
      requestedRole: regRole,
      reason: regReason
    });

    setIsLoading(false);

    if (result.success) {
      setRegSuccess(true);
      setRegName("");
      setRegEmail("");
      setRegReason("");
    } else {
      setErrorMessage(result.error || "Registration failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
      <div className="relative w-full max-w-md bg-[var(--panel-bg)] border border-panel-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-panel-border bg-[var(--panel-header-bg)] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[var(--foreground)] tracking-tight">
                {language === "ko" ? "CoreGuard 보안 관제 센터" : "CoreGuard SOC Console"}
              </h1>
              <p className="text-xs text-[var(--muted-text)] mt-0.5">
                {language === "ko" ? "운영자 인증 및 권한 관리" : "Operator Authentication & Clearance"}
              </p>
            </div>
          </div>

          {canClose && onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--panel-bg)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 bg-[var(--panel-header-bg)] border-b border-panel-border">
          <div className="flex items-center gap-1 bg-[var(--input-bg)] p-1 rounded-lg border border-panel-border">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage(null);
                setRegSuccess(false);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-[var(--panel-bg)] text-brand-cyan shadow-2xs"
                  : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
              }`}
            >
              {language === "ko" ? "운영자 로그인" : "Sign In"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-[var(--panel-bg)] text-brand-cyan shadow-2xs"
                  : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
              }`}
            >
              {language === "ko" ? "가입 신청" : "Request Access"}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-brand-rose/10 border border-brand-rose/20 rounded-md text-xs text-brand-rose flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)]">
                  {language === "ko" ? "사내 이메일" : "Email Address"}
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="operator@coreguard.io"
                  className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-2 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-text)] outline-none focus:border-brand-cyan transition-colors"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)]">
                  {language === "ko" ? "비밀번호" : "Password"}
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-brand-cyan transition-colors font-mono"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)]">
                  {language === "ko" ? "역할 (RBAC Role)" : "Role"}
                </label>
                <select
                  value={loginRoleOverride}
                  onChange={(e) => setLoginRoleOverride(e.target.value as RbacRole)}
                  className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-2 text-xs text-[var(--foreground)] font-medium outline-none focus:border-brand-cyan cursor-pointer"
                >
                  <option value="admin">Administrator (전체 관리자)</option>
                  <option value="dispatcher">Lead Dispatcher (플릿 관제/비상정지)</option>
                  <option value="analyst">Security Analyst (보안/이상탐지 분석)</option>
                  <option value="technician">Technician (차량 센서/정비)</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 bg-brand-cyan hover:opacity-90 text-white dark:text-black font-semibold text-xs rounded-md transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>
                  {isLoading
                    ? (language === "ko" ? "인증 중..." : "Authenticating...")
                    : (language === "ko" ? "로그인" : "Sign In")}
                </span>
              </button>
            </form>
          )}

          {/* MODE: REGISTER / REQUEST ACCESS */}
          {mode === "register" && (
            <div>
              {regSuccess ? (
                <div className="space-y-3 py-2 text-center animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[var(--foreground)]">
                      {language === "ko" ? "가입 신청이 완료되었습니다" : "Request Submitted"}
                    </h3>
                    <p className="text-xs text-[var(--muted-text)] leading-relaxed">
                      {language === "ko"
                        ? "SOC 관리자의 승인(Approve) 후 콘솔에 로그인할 수 있습니다."
                        : "A SOC Administrator will review your clearance request before access is granted."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setRegSuccess(false);
                    }}
                    className="px-4 py-2 bg-[var(--panel-header-bg)] border border-panel-border text-[var(--foreground)] rounded-md text-xs font-semibold hover:bg-[var(--panel-bg)] transition-colors cursor-pointer"
                  >
                    {language === "ko" ? "로그인으로 돌아가기" : "Return to Sign In"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--foreground)]">
                      {language === "ko" ? "성명" : "Full Name"} *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Hye-Jin Lee"
                      className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-2 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-text)] outline-none focus:border-brand-cyan"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--foreground)]">
                      {language === "ko" ? "사내 이메일" : "Email Address"} *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="operator@coreguard.io"
                      className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-2 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-text)] outline-none focus:border-brand-cyan"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--foreground)]">
                        {language === "ko" ? "부서" : "Department"}
                      </label>
                      <input
                        type="text"
                        value={regDept}
                        onChange={(e) => setRegDept(e.target.value)}
                        placeholder="Fleet Division"
                        className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-2 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-text)] outline-none focus:border-brand-cyan"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--foreground)]">
                        {language === "ko" ? "희망 역할" : "Role"}
                      </label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as RbacRole)}
                        className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-2 text-xs text-[var(--foreground)] font-medium outline-none focus:border-brand-cyan cursor-pointer"
                      >
                        <option value="dispatcher">Dispatcher</option>
                        <option value="analyst">Analyst</option>
                        <option value="technician">Technician</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--foreground)]">
                      {language === "ko" ? "신청 사유" : "Reason / Purpose"} *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={regReason}
                      onChange={(e) => setRegReason(e.target.value)}
                      placeholder={language === "ko" ? "업무 목적을 간략히 작성해 주십시오." : "Describe operational purpose..."}
                      className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-2 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-text)] outline-none focus:border-brand-cyan resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-2.5 bg-brand-cyan hover:opacity-90 text-white dark:text-black font-semibold text-xs rounded-md transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserCheck className="w-4 h-4" />
                    )}
                    <span>
                      {language === "ko" ? "신청서 제출" : "Submit Request"}
                    </span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

