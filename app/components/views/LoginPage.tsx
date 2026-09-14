"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Sun, 
  Moon, 
  Globe,
  Radio,
  KeyRound,
  ShieldAlert
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { RbacRole, useRbac } from "../RbacContext";
import { useLanguage } from "../LanguageContext";
import { useTheme } from "../ThemeContext";

export default function LoginPage() {
  const { login, requestAccess } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [mode, setMode] = useState<"login" | "register">("login");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("admin@gmail.com");
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const result = await login(loginEmail, loginRoleOverride);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || "Authentication failed. Please check credentials.");
    }
  };

  const handleQuickRoleSelect = (role: RbacRole, email: string) => {
    setLoginEmail(email);
    setLoginRoleOverride(role);
    setErrorMessage(null);
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
    <div className="min-h-screen w-full bg-[#060a15] bg-gradient-to-b from-[#080e1e] via-[#060a15] to-[#04060d] text-slate-100 flex flex-col justify-between select-none relative overflow-x-hidden font-sans">
      {/* Subtle ambient navy glow in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="h-14 border-b border-slate-800/80 bg-[#080e1e]/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">
                CoreGuard SOC
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30 font-mono font-bold">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Autonomous Mobility Cyber Defense & Safety Platform
            </p>
          </div>
        </div>

        {/* Right tools (Language & Theme toggle) */}
        <div className="flex items-center gap-2.5">
          {/* System status pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SYSTEMS ONLINE</span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-[#0a1020] p-0.5 text-xs font-medium">
            <button
              onClick={() => setLanguage("ko")}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                language === "ko" 
                  ? "bg-sky-500/20 text-sky-400 font-bold" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              한국어
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                language === "en" 
                  ? "bg-sky-500/20 text-sky-400 font-bold" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-800 bg-[#0a1020] text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto z-10">
        <div className="w-full max-w-md bg-[#0c1427]/95 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col">
          {/* Card Header */}
          <div className="p-6 border-b border-slate-800 bg-[#0f1930]/80 text-center">
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              {language === "ko" ? "보안 관제 센터 인증" : "SOC Operator Authentication"}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {language === "ko" 
                ? "관제 권한 확인 및 자율주행 보안 콘솔 접속" 
                : "Verify operational clearance for autonomous fleet telemetry"}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="px-6 pt-4 bg-[#0f1930]/40 border-b border-slate-800">
            <div className="flex items-center gap-1 bg-[#080e1c] p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMessage(null);
                  setRegSuccess(false);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  mode === "login"
                    ? "bg-[#111c36] text-sky-400 shadow-sm font-bold border border-slate-700/50"
                    : "text-slate-400 hover:text-slate-200"
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
                    ? "bg-[#111c36] text-sky-400 shadow-sm font-bold border border-slate-700/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {language === "ko" ? "가입 신청" : "Request Access"}
              </button>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 bg-brand-rose/10 border border-brand-rose/20 rounded-md text-xs text-brand-rose flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* MODE: LOGIN */}
            {mode === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-200 flex items-center justify-between">
                    <span>{language === "ko" ? "사내 이메일" : "Email Address"}</span>
                
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="operator@coreguard.io"
                    className="w-full bg-[#080e1c] border border-slate-700/80 rounded-md px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-400 transition-colors"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-200">
                    {language === "ko" ? "비밀번호" : "Password"}
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#080e1c] border border-slate-700/80 rounded-md px-3.5 py-2.5 text-xs text-slate-100 outline-none focus:border-sky-400 transition-colors font-mono"
                  />
                </div>

            
     

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-sky-500/20"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  <span>
                    {isLoading
                      ? (language === "ko" ? "인증 확인 중..." : "Authenticating...")
                      : (language === "ko" ? "보안 콘솔 로그인" : "Sign In to SOC Console")}
                  </span>
                </button>
              </form>
            )}

            {/* MODE: REGISTER / REQUEST ACCESS */}
            {mode === "register" && (
              <div>
                {regSuccess ? (
                  <div className="space-y-4 py-4 text-center animate-fade-in">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-white">
                        {language === "ko" ? "가입 신청이 접수되었습니다" : "Access Request Submitted"}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                        {language === "ko"
                          ? "SOC 관리자의 승인(Approve) 완료 후 해당 계정으로 로그인할 수 있습니다."
                          : "A SOC Administrator will review and approve your clearance request shortly."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setRegSuccess(false);
                      }}
                      className="px-5 py-2 bg-[#0f1930] border border-slate-700 text-slate-200 rounded-md text-xs font-semibold hover:bg-[#152342] transition-colors cursor-pointer"
                    >
                      {language === "ko" ? "로그인 화면으로 이동" : "Return to Sign In"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-200">
                        {language === "ko" ? "성명" : "Full Name"} *
                      </label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Hye-Jin Lee"
                        className="w-full bg-[#080e1c] border border-slate-700/80 rounded-md px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-200">
                        {language === "ko" ? "사내 이메일" : "Email Address"} *
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="operator@coreguard.io"
                        className="w-full bg-[#080e1c] border border-slate-700/80 rounded-md px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-200">
                          {language === "ko" ? "부서" : "Department"}
                        </label>
                        <input
                          type="text"
                          value={regDept}
                          onChange={(e) => setRegDept(e.target.value)}
                          placeholder="Fleet Division"
                          className="w-full bg-[#080e1c] border border-slate-700/80 rounded-md px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-200">
                          {language === "ko" ? "희망 역할" : "Role"}
                        </label>
                        <select
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value as RbacRole)}
                          className="w-full bg-[#080e1c] border border-slate-700/80 rounded-md px-3 py-2 text-xs text-slate-100 font-medium outline-none focus:border-sky-400 cursor-pointer"
                        >
                          <option value="dispatcher">Dispatcher</option>
                          <option value="analyst">Analyst</option>
                          <option value="technician">Technician</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-200">
                        {language === "ko" ? "신청 사유" : "Reason / Justification"} *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={regReason}
                        onChange={(e) => setRegReason(e.target.value)}
                        placeholder={language === "ko" ? "업무 목적을 간략히 작성해 주십시오." : "Describe operational clearance purpose..."}
                        className="w-full bg-[#080e1c] border border-slate-700/80 rounded-md px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-400 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-sky-500/20"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserCheck className="w-4 h-4" />
                      )}
                      <span>
                        {language === "ko" ? "신청서 제출" : "Submit Access Request"}
                      </span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-10 border-t border-panel-border bg-[var(--panel-bg)]/80 flex items-center justify-between px-6 font-mono text-[11px] text-[var(--muted-text)] z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-emerald"></span>
          <span>ISO/SAE 21434 Road Vehicles Cybersecurity Compliance</span>
        </div>
        <div>
          <span>CoreGuard v3.4.12-PROD</span>
        </div>
      </footer>
    </div>
  );
}
