"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Lock, RefreshCw, AlertCircle } from "lucide-react";
import { useAuth } from "../AuthContext";
import { RbacRole } from "../RbacContext";
import { useLanguage } from "../LanguageContext";

export interface LoginFormData {
  email: string;
  password: string;
  role: RbacRole;
}

interface LoginFormProps {
  onError: (error: string | null) => void;
}

export default function LoginForm({ onError }: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const { language } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "admin@42dot.ai",
      password: "••••••••",
      role: "admin",
    },
  });

  const onFormSubmit = async (data: LoginFormData) => {
    onError(null);

    const result = await login(data.email, data.role);

    if (result.success) {
      router.push("/");
    } else {
      onError(result.error || "Authentication failed. Please check credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 font-mono">
      {/* Email Field */}
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
          {language === "ko" ? "운영자 사내 이메일" : "OPERATOR CORPORATE EMAIL"}
        </label>
        <div className="relative">
          <input
            {...register("email", {
              required: language === "ko" ? "이메일을 입력해 주십시오." : "Corporate email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: language === "ko" ? "올바른 이메일 형식이 아닙니다." : "Invalid corporate email format",
              },
            })}
            type="email"
            placeholder="operator@42dot.ai"
            className={`w-full bg-zinc-900 border rounded p-2.5 text-xs text-white outline-none transition-colors ${errors.email ? "border-brand-rose focus:border-brand-rose" : "border-panel-border focus:border-brand-cyan"
              }`}
          />
        </div>
        {errors.email && (
          <p className="text-[10px] text-brand-rose flex items-center gap-1 mt-0.5 animate-fade-in">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{errors.email.message}</span>
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
            {language === "ko" ? "비밀번호 / HSM 챌린지 핀" : "PASSWORD / HSM PIN"}
          </label>
          <span className="text-[9px] text-zinc-600">SHA-256 / BCrypt</span>
        </div>
        <div className="relative">
          <input
            {...register("password", {
              required: language === "ko" ? "비밀번호를 입력해 주십시오." : "Password or HSM PIN is required",
              minLength: {
                value: 4,
                message: language === "ko" ? "최소 4자 이상 입력해 주십시오." : "Minimum 4 characters required",
              },
            })}
            type="password"
            placeholder="••••••••"
            className={`w-full bg-zinc-900 border rounded p-2.5 text-xs text-white outline-none transition-colors font-mono ${errors.password ? "border-brand-rose focus:border-brand-rose" : "border-panel-border focus:border-brand-cyan"
              }`}
          />
        </div>
        {errors.password && (
          <p className="text-[10px] text-brand-rose flex items-center gap-1 mt-0.5 animate-fade-in">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{errors.password.message}</span>
          </p>
        )}
      </div>


      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2 py-3 bg-brand-cyan hover:bg-brand-cyan/90 text-black font-bold text-xs rounded transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Lock className="w-4 h-4" />
        )}
        <span>
          {isSubmitting
            ? (language === "ko" ? "인증 토큰 서명 중..." : "Validating Token via KMS...")
            : (language === "ko" ? "관제 콘솔 로그인" : "Authenticate & Access Console")}
        </span>
      </button>
    </form>
  );
}
