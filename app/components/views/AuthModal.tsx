"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  UserPlus, 
  ChevronRight,
  Fingerprint
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
  const [loginEmail, setLoginEmail] = useState("admin@42dot.ai");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-mono">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-panel-border rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        {/* Top Decorative Cyberpunk Scanline / Header */}
        <div className="h-1 bg-gradient-to-r from-brand-cyan via-brand-emerald to-brand-cyan w-full" />

        <div className="p-6 border-b border-panel-border bg-zinc-900/30 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
              <span className="text-[10px] text-brand-cyan font-bold tracking-widest uppercase">
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

          <div className="flex flex-col items-end">
            <span className="text-[9px] px-2 py-0.5 rounded font-bold border border-brand-emerald/30 bg-brand-emerald/10 text-brand-emerald flex items-center gap-1">
              <Fingerprint className="w-3 h-3" />
              <span>KMS ENCRYPTED</span>
            </span>
            <span className="text-[9px] text-zinc-500 mt-1">v2.4.1 (HSM Level 3)</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-panel-border bg-zinc-900/40 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage(null);
              setRegSuccess(false);
            }}
            className={`py-3 flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === "login"
                ? "bg-zinc-950 text-brand-cyan border-b-2 border-brand-cyan"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{language === "ko" ? "운영자 로그인" : "Operator Sign In"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMessage(null);
            }}
            className={`py-3 flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === "register"
                ? "bg-zinc-950 text-brand-cyan border-b-2 border-brand-cyan"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{language === "ko" ? "접근 권한 등록 신청" : "Request Access Clearance"}</span>
          </button>
        </div>

        {/* Modal Body */}
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

          {/* MODE: LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  {language === "ko" ? "운영자 사내 이메일" : "OPERATOR CORPORATE EMAIL"}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="operator@42dot.ai"
                    className="w-full bg-zinc-900 border border-panel-border rounded p-2.5 text-xs text-white outline-none focus:border-brand-cyan transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    {language === "ko" ? "비밀번호 / HSM 챌린지 핀" : "PASSWORD / HSM PIN"}
                  </label>
                  <span className="text-[9px] text-zinc-600">SHA-256 / BCrypt</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-900 border border-panel-border rounded p-2.5 text-xs text-white outline-none focus:border-brand-cyan transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Role Override Selector */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  {language === "ko" ? "세션 역할 지정 (RBAC Clearance)" : "SESSION RBAC ROLE"}
                </label>
                <select
                  value={loginRoleOverride}
                  onChange={(e) => setLoginRoleOverride(e.target.value as RbacRole)}
                  className="w-full bg-zinc-900 border border-panel-border rounded p-2.5 text-xs text-brand-cyan font-bold outline-none focus:border-brand-cyan cursor-pointer"
                >
                  <option value="admin">SOC Administrator (전체 권한 / Full Security & RBAC)</option>
                  <option value="dispatcher">SOC Lead Dispatcher (플릿 관제 & E-Stop / Fleet Control)</option>
                  <option value="analyst">Security Analyst (CAN 분석 & 이상 탐지 / Threat Analysis)</option>
                  <option value="technician">Hangar Depot Tech (차량 센서 & OTA 보수 / Diagnostics)</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-brand-cyan hover:bg-brand-cyan/90 text-black font-bold text-xs rounded transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>
                  {isLoading
                    ? (language === "ko" ? "인증 토큰 서명 중..." : "Validating Token via KMS...")
                    : (language === "ko" ? "관제 콘솔 로그인" : "Authenticate & Access Console")}
                </span>
              </button>
            </form>
          )}

          {/* MODE: REGISTER / REQUEST ACCESS */}
          {mode === "register" && (
            <div>
              {regSuccess ? (
                <div className="space-y-4 py-4 text-center animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">
                      {language === "ko" ? "가입 승인 신청이 접수되었습니다" : "Clearance Request Submitted Successfully"}
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                      {language === "ko"
                        ? "보안 규정에 따라 SOC 관리자가 귀하의 사원 정보 및 역할을 검토한 후 승인(Approve)을 완료하면 콘솔에 로그인할 수 있습니다."
                        : "According to ISO/SAE 21434 protocols, a SOC Administrator will review your department and requested role before granting login access."}
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-900/60 border border-panel-border rounded text-[11px] text-zinc-400 font-mono text-left max-w-md mx-auto">
                    <div className="flex justify-between py-0.5">
                      <span className="text-zinc-500">REQUEST_STATUS:</span>
                      <span className="text-amber-400 font-bold">PENDING_ADMIN_SIGNOFF</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-zinc-500">APPLICANT:</span>
                      <span className="text-white">{regName || "New Operator"}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setRegSuccess(false);
                    }}
                    className="px-4 py-2 bg-zinc-900 border border-panel-border hover:border-zinc-700 text-white rounded text-xs font-bold transition-all cursor-pointer"
                  >
                    {language === "ko" ? "로그인 화면으로 이동" : "Return to Sign In"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        {language === "ko" ? "운영자 성명" : "FULL NAME"} *
                      </label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Hye-Jin Lee"
                        className="w-full bg-zinc-900 border border-panel-border rounded p-2 text-xs text-white outline-none focus:border-brand-cyan"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        {language === "ko" ? "사내 이메일" : "CORPORATE EMAIL"} *
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="operator@42dot.ai"
                        className="w-full bg-zinc-900 border border-panel-border rounded p-2 text-xs text-white outline-none focus:border-brand-cyan"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Department */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        {language === "ko" ? "소속 부서" : "DEPARTMENT / ORG"}
                      </label>
                      <input
                        type="text"
                        value={regDept}
                        onChange={(e) => setRegDept(e.target.value)}
                        placeholder="e.g. Gangnam Operations Division"
                        className="w-full bg-zinc-900 border border-panel-border rounded p-2 text-xs text-white outline-none focus:border-brand-cyan"
                      />
                    </div>

                    {/* Desired Role */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        {language === "ko" ? "신청 권한 등급 (Role)" : "REQUESTED RBAC ROLE"}
                      </label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as RbacRole)}
                        className="w-full bg-zinc-900 border border-panel-border rounded p-2 text-xs text-brand-cyan font-bold outline-none focus:border-brand-cyan cursor-pointer"
                      >
                        <option value="dispatcher">Lead Dispatcher (관제 및 지령 운용)</option>
                        <option value="analyst">Security Analyst (위협 분석 및 로그 분석)</option>
                        <option value="technician">Hangar Tech (센서 하드웨어 및 정비)</option>
                        <option value="admin">SOC Administrator (전체 관리자)</option>
                      </select>
                    </div>
                  </div>

                  {/* Access Reason / Justification */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      {language === "ko" ? "신청 사유 및 업무 목적" : "JUSTIFICATION FOR ACCESS"} *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={regReason}
                      onChange={(e) => setRegReason(e.target.value)}
                      placeholder={language === "ko" ? "예: 강남구 로보택시 야간 운행 모니터링 및 비상 대응 담당" : "Describe operational mission requirements..."}
                      className="w-full bg-zinc-900 border border-panel-border rounded p-2 text-xs text-white outline-none focus:border-brand-cyan resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 bg-brand-cyan hover:bg-brand-cyan/90 text-black font-bold text-xs rounded transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserCheck className="w-4 h-4" />
                    )}
                    <span>
                      {language === "ko" ? "가입 승인 신청서 제출" : "Submit Clearance Application"}
                    </span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer info & Optional Close */}
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
    </div>
  );
}
