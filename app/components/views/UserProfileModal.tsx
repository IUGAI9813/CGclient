"use client";

import React from "react";
import { 
  User, 
  ShieldCheck, 
  Building2, 
  Mail, 
  KeyRound, 
  LogOut, 
  X, 
  CheckCircle2,
  Clock
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { useRbac, RbacRole } from "../RbacContext";
import { useLanguage } from "../LanguageContext";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { currentUser, logout } = useAuth();
  const { currentRole, setCurrentRole } = useRbac();
  const { language } = useLanguage();

  if (!isOpen) return null;

  const handleLogout = () => {
    onClose();
    logout();
  };

  const getRoleLabel = (role: RbacRole) => {
    switch (role) {
      case "admin":
        return language === "ko" ? "Administrator (전체 관리자)" : "Administrator (Full Access)";
      case "dispatcher":
        return language === "ko" ? "Lead Dispatcher (플릿 관제/비상정지)" : "Lead Dispatcher (Fleet & Emergency)";
      case "analyst":
        return language === "ko" ? "Security Analyst (보안 분석)" : "Security Analyst (Threat & Anomaly)";
      case "technician":
        return language === "ko" ? "Technician (정비/진단)" : "Technician (Diagnostics & Depot)";
      default:
        return role;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
      <div className="relative w-full max-w-sm bg-[var(--panel-bg)] border border-panel-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-panel-border bg-[var(--panel-header-bg)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-[var(--foreground)]">
              {language === "ko" ? "운영자 프로필" : "Operator Profile"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--panel-bg)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Avatar & Main Info */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-panel-border">
            <div className="w-12 h-12 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-sm font-bold text-brand-cyan shadow-inner shrink-0">
              {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "SA"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[var(--foreground)] truncate">
                  {currentUser?.name || "Alex S."}
                </h3>
                <span className="flex items-center gap-1 text-[10px] text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/20 px-1.5 py-0.5 rounded font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-[var(--muted-text)] truncate mt-0.5">
                {currentUser?.email || "admin@coreguard.io"}
              </p>
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5 text-[var(--muted-text)]">
              <Building2 className="w-4 h-4 shrink-0 mt-0.5 text-brand-cyan" />
              <div>
                <span className="text-[10px] uppercase font-mono block text-[var(--muted-text)]">
                  {language === "ko" ? "소속 부서" : "Department"}
                </span>
                <span className="text-[var(--foreground)] font-medium">
                  {currentUser?.department || "SOC Cyber Defense & Safety Operations"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-[var(--muted-text)] pt-1">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-brand-cyan" />
              <div className="flex-1">
                <span className="text-[10px] uppercase font-mono block text-[var(--muted-text)]">
                  {language === "ko" ? "운영 권한 (RBAC)" : "Clearance Role"}
                </span>
                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value as RbacRole)}
                  className="mt-1 w-full bg-[var(--input-bg)] border border-panel-border rounded px-2.5 py-1.5 text-xs text-[var(--foreground)] font-medium outline-none focus:border-brand-cyan cursor-pointer"
                >
                  <option value="admin">Administrator (전체 관리자)</option>
                  <option value="dispatcher">Lead Dispatcher (플릿 관제)</option>
                  <option value="analyst">Security Analyst (보안 분석)</option>
                  <option value="technician">Technician (정비/진단)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-[var(--muted-text)] pt-1">
              <Clock className="w-4 h-4 shrink-0 text-brand-cyan" />
              <div>
                <span className="text-[10px] uppercase font-mono block text-[var(--muted-text)]">
                  {language === "ko" ? "세션 시작" : "Session Active"}
                </span>
                <span className="text-[var(--foreground)] font-mono text-[11px]">
                  {currentUser?.lastLoginAt || "Just now"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-panel-border flex flex-col gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 px-3 bg-brand-rose/10 hover:bg-brand-rose/20 text-brand-rose border border-brand-rose/30 hover:border-brand-rose/50 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{language === "ko" ? "로그아웃 (Sign Out)" : "Log Out"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
