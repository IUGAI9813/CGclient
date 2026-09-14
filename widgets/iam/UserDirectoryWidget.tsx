import React, { useState } from "react";
import { UserCheck, Search, Plus, CheckCircle2, Lock, Unlock, Trash2 } from "lucide-react";
import { SocUser, PendingApproval } from "@/app/components/AuthContext";
import { RbacRole } from "@/app/components/RbacContext";
import { useLanguage } from "@/app/components/LanguageContext";
import { UserRoleBadge } from "@/entities/iam/ui/UserRoleBadge";
import { PendingApprovalItem } from "@/features/iam/request-access/ui/PendingApprovalItem";
import { AddOperatorModal } from "@/features/iam/add-operator/ui/AddOperatorModal";

interface UserDirectoryWidgetProps {
  users: SocUser[];
  pendingApprovals: PendingApproval[];
  actionFeedback: string | null;
  onApprove: (id: string, assignedRole: RbacRole) => void;
  onReject: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onAddUser: (userData: Omit<SocUser, "id" | "lastLoginAt" | "createdAt">) => void;
}

export function UserDirectoryWidget({
  users,
  pendingApprovals,
  actionFeedback,
  onApprove,
  onReject,
  onToggleLock,
  onDeleteUser,
  onAddUser
}: UserDirectoryWidgetProps) {
  const { language } = useLanguage();
  const [userSearch, setUserSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.department.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-4 font-sans">
      {actionFeedback && (
        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-xs text-emerald-400 flex items-center gap-2 animate-fade-in font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Section 1: Pending Approvals Queue (only show if pending or clean banner) */}
      {pendingApprovals.length > 0 && (
        <div className="cyber-panel p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>
                {language === "ko"
                  ? `가입 심사 대기열 (${pendingApprovals.length}건)`
                  : `Pending Approvals (${pendingApprovals.length})`}
              </span>
            </h2>
          </div>

          <div className="space-y-2">
            {pendingApprovals.map((req) => (
              <PendingApprovalItem
                key={req.id}
                request={req}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Active Operators Directory */}
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--muted-text)]" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder={language === "ko" ? "이름, 이메일, 부서 검색..." : "Filter by name, email, department..."}
              className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md pl-8.5 pr-3 py-1.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus:border-brand-cyan outline-none transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-brand-cyan hover:opacity-90 text-white dark:text-black text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5px]" />
            <span>{language === "ko" ? "운영자 등록" : "Add Operator"}</span>
          </button>
        </div>

        {/* Operators Table */}
        <div className="cyber-panel rounded-lg overflow-hidden border border-panel-border">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--panel-header-bg)] border-b border-panel-border text-[var(--muted-text)] text-[10px] uppercase font-bold tracking-wider">
                <th className="p-3">{language === "ko" ? "운영자" : "Operator"}</th>
                <th className="p-3">{language === "ko" ? "소속 부서" : "Department"}</th>
                <th className="p-3">{language === "ko" ? "역할 (Role)" : "Role"}</th>
                <th className="p-3 text-center">{language === "ko" ? "상태" : "Status"}</th>
                <th className="p-3">{language === "ko" ? "마지막 접속" : "Last Login"}</th>
                <th className="p-3 text-right">{language === "ko" ? "관리" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-panel-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--panel-header-bg)] transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-xs text-[var(--foreground)]">{user.name}</div>
                    <div className="text-[11px] text-[var(--muted-text)] font-mono">{user.email}</div>
                  </td>
                  <td className="p-3 text-[var(--muted-text)] text-xs">{user.department}</td>
                  <td className="p-3">
                    <UserRoleBadge role={user.role} />
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-medium inline-flex items-center gap-1 ${
                        user.status === "ACTIVE"
                          ? "text-brand-emerald"
                          : "text-brand-rose"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === "ACTIVE" ? "bg-brand-emerald" : "bg-brand-rose"
                        }`}
                      />
                      {user.status === "ACTIVE" ? (language === "ko" ? "정상" : "Active") : (language === "ko" ? "잠김" : "Locked")}
                    </span>
                  </td>
                  <td className="p-3 text-[var(--muted-text)] font-mono text-xs">{user.lastLoginAt}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onToggleLock(user.id)}
                        title={user.status === "ACTIVE" ? "Lock Account" : "Unlock Account"}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                          user.status === "ACTIVE"
                            ? "text-[var(--muted-text)] hover:text-brand-amber hover:bg-[var(--panel-header-bg)]"
                            : "text-brand-amber hover:bg-brand-amber/10"
                        }`}
                      >
                        {user.status === "ACTIVE" ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              language === "ko"
                                ? `${user.name} 계정을 삭제하시겠습니까?`
                                : `Delete operator account ${user.name}?`
                            )
                          ) {
                            onDeleteUser(user.id);
                          }
                        }}
                        title="Delete Account"
                        className="p-1 rounded text-[var(--muted-text)] hover:text-brand-rose hover:bg-brand-rose/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddOperatorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddUser={onAddUser}
      />
    </div>
  );
}

