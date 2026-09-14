import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { RbacRole } from "@/app/components/RbacContext";
import { useLanguage } from "@/app/components/LanguageContext";
import { SocUser } from "@/app/components/AuthContext";

interface AddOperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: Omit<SocUser, "id" | "lastLoginAt" | "createdAt">) => void;
}

export function AddOperatorModal({ isOpen, onClose, onAddUser }: AddOperatorModalProps) {
  const { language } = useLanguage();
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserDept, setNewUserDept] = useState("SOC Gangnam Operations");
  const [newUserRole, setNewUserRole] = useState<RbacRole>("dispatcher");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    onAddUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      department: newUserDept.trim(),
      role: newUserRole,
      status: "ACTIVE"
    });

    setNewUserName("");
    setNewUserEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono">
      <div className="w-full max-w-md bg-zinc-950 border border-panel-border rounded-lg p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-panel-border pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-brand-cyan" />
            <span>{language === "ko" ? "신규 운영자 계정 직접 등록" : "Register New Operator"}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 font-bold uppercase">
              {language === "ko" ? "운영자 성명" : "NAME"} *
            </label>
            <input
              type="text"
              required
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="e.g. Su-Jin Kim"
              className="w-full bg-zinc-900 border border-panel-border rounded p-2 text-xs text-white outline-none focus:border-brand-cyan"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 font-bold uppercase">
              {language === "ko" ? "사내 이메일" : "EMAIL"} *
            </label>
            <input
              type="email"
              required
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="sujin.kim@coreguard.io"
              className="w-full bg-zinc-900 border border-panel-border rounded p-2 text-xs text-white outline-none focus:border-brand-cyan"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 font-bold uppercase">
              {language === "ko" ? "소속 부서" : "DEPARTMENT"}
            </label>
            <input
              type="text"
              value={newUserDept}
              onChange={(e) => setNewUserDept(e.target.value)}
              className="w-full bg-zinc-900 border border-panel-border rounded p-2 text-xs text-white outline-none focus:border-brand-cyan"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 font-bold uppercase">
              {language === "ko" ? "부여 역할 (Clearance Role)" : "ASSIGNED ROLE"}
            </label>
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value as RbacRole)}
              className="w-full bg-zinc-900 border border-panel-border rounded p-2 text-xs text-brand-cyan font-bold outline-none"
            >
              <option value="dispatcher">Dispatcher (플릿 관제/지령)</option>
              <option value="analyst">Analyst (보안 및 CAN 분석)</option>
              <option value="technician">Technician (정비고/센서 보수)</option>
              <option value="admin">Administrator (전체 관리자)</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded text-xs font-bold cursor-pointer"
            >
              {language === "ko" ? "취소" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-brand-cyan hover:bg-brand-cyan/90 text-black rounded text-xs font-bold cursor-pointer"
            >
              {language === "ko" ? "등록 완료" : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
