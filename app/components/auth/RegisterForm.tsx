"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { UserCheck, CheckCircle2, RefreshCw, AlertCircle } from "lucide-react";
import { useAuth } from "../AuthContext";
import { RbacRole } from "../RbacContext";
import { useLanguage } from "../LanguageContext";

export interface RegisterFormData {
  name: string;
  email: string;
  department: string;
  role: RbacRole;
  reason: string;
}

interface RegisterFormProps {
  onReturnToLogin: () => void;
  onError: (error: string | null) => void;
}

export default function RegisterForm({ onReturnToLogin, onError }: RegisterFormProps) {
  const { requestAccess } = useAuth();
  const { language } = useLanguage();
  const [regSuccess, setRegSuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      department: "Autonomous Mobility Fleet Division",
      role: "dispatcher",
      reason: "",
    },
  });

  const onFormSubmit = async (data: RegisterFormData) => {
    onError(null);

    const result = await requestAccess({
      name: data.name,
      email: data.email,
      department: data.department,
      requestedRole: data.role,
      reason: data.reason,
    });

    if (result.success) {
      setSubmittedName(data.name);
      setRegSuccess(true);
      reset();
    } else {
      onError(result.error || "Registration failed.");
    }
  };

  if (regSuccess) {
    return (
      <div className="space-y-4 py-4 text-center animate-fade-in font-mono">
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

        <div className="p-3 bg-zinc-900/60 border border-panel-border rounded text-[11px] text-zinc-400 text-left max-w-md mx-auto">
          <div className="flex justify-between py-0.5">
            <span className="text-zinc-500">REQUEST_STATUS:</span>
            <span className="text-amber-400 font-bold">PENDING_ADMIN_SIGNOFF</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-zinc-500">APPLICANT:</span>
            <span className="text-white">{submittedName || "New Operator"}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setRegSuccess(false);
            onReturnToLogin();
          }}
          className="px-4 py-2 bg-zinc-900 border border-panel-border hover:border-zinc-700 text-white rounded text-xs font-bold transition-all cursor-pointer"
        >
          {language === "ko" ? "로그인 화면으로 이동" : "Return to Sign In"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3.5 font-mono">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
            {language === "ko" ? "운영자 성명" : "FULL NAME"} *
          </label>
          <input
            {...register("name", {
              required: language === "ko" ? "성명을 입력해 주십시오." : "Full name is required",
              minLength: { value: 2, message: "Min 2 characters" },
            })}
            type="text"
            placeholder="e.g. Hye-Jin Lee"
            className={`w-full bg-zinc-900 border rounded p-2 text-xs text-white outline-none transition-colors ${
              errors.name ? "border-brand-rose focus:border-brand-rose" : "border-panel-border focus:border-brand-cyan"
            }`}
          />
          {errors.name && (
            <p className="text-[10px] text-brand-rose flex items-center gap-1 mt-0.5 animate-fade-in">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.name.message}</span>
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
            {language === "ko" ? "사내 이메일" : "CORPORATE EMAIL"} *
          </label>
          <input
            {...register("email", {
              required: language === "ko" ? "이메일을 입력해 주십시오." : "Corporate email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: language === "ko" ? "올바른 이메일 형식이 아닙니다." : "Invalid email format",
              },
            })}
            type="email"
            placeholder="operator@42dot.ai"
            className={`w-full bg-zinc-900 border rounded p-2 text-xs text-white outline-none transition-colors ${
              errors.email ? "border-brand-rose focus:border-brand-rose" : "border-panel-border focus:border-brand-cyan"
            }`}
          />
          {errors.email && (
            <p className="text-[10px] text-brand-rose flex items-center gap-1 mt-0.5 animate-fade-in">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Department */}
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
            {language === "ko" ? "소속 부서" : "DEPARTMENT / ORG"}
          </label>
          <input
            {...register("department")}
            type="text"
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
            {...register("role")}
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
          {...register("reason", {
            required: language === "ko" ? "신청 사유를 입력해 주십시오." : "Justification reason is required",
            minLength: { value: 5, message: "Min 5 characters" },
          })}
          rows={2}
          placeholder={language === "ko" ? "예: 강남구 로보택시 야간 운행 모니터링 및 비상 대응 담당" : "Describe operational mission requirements..."}
          className={`w-full bg-zinc-900 border rounded p-2 text-xs text-white outline-none resize-none transition-colors ${
            errors.reason ? "border-brand-rose focus:border-brand-rose" : "border-panel-border focus:border-brand-cyan"
          }`}
        />
        {errors.reason && (
          <p className="text-[10px] text-brand-rose flex items-center gap-1 mt-0.5 animate-fade-in">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{errors.reason.message}</span>
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2 py-3 bg-brand-cyan hover:bg-brand-cyan/90 text-black font-bold text-xs rounded transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <UserCheck className="w-4 h-4" />
        )}
        <span>
          {language === "ko" ? "가입 승인 신청서 제출" : "Submit Clearance Application"}
        </span>
      </button>
    </form>
  );
}
