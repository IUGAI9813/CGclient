import React, { useState } from "react";
import { UserCheck, Users, Search, Plus, CheckCircle2, Lock, Unlock, Trash2 } from "lucide-react";
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
    <div className="space-y-6">
      {actionFeedback && (
        <div className="p-3 bg-brand-emerald/10 border border-brand-emerald/40 rounded text-xs text-brand-emerald flex items-center gap-2 animate-fade-in font-bold">
          <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Section 1: Pending Approvals Queue */}
      <div className="cyber-panel p-4 rounded space-y-3 bg-zinc-950/40">
        <div className="flex justify-between items-center border-b border-panel-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                {language === "ko" ? "신규 가입 심사 대기열" : "Pending Registration Approval Queue"}
              </span>
              {pendingApprovals.length > 0 && (
                <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                  {pendingApprovals.length} {language === "ko" ? "건 승인 대기" : "AWAITING SIGNOFF"}
                </span>
              )}
            </div>
            <h2 className="text-sm font-bold text-white mt-1 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-brand-cyan" />
              <span>
                {language === "ko"
                  ? "SOC 운영자 접근 권한 신청 심사"
                  : "Operator Clearance & Access Requests"}
              </span>
            </h2>
          </div>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="p-6 text-center text-zinc-500 text-xs border border-dashed border-panel-border rounded bg-zinc-900/10 flex flex-col items-center justify-center gap-1.5">
            <CheckCircle2 className="w-6 h-6 text-brand-emerald mb-1" />
            <span className="font-bold text-zinc-300">
              {language === "ko" ? "대기 중인 가입 신청이 없습니다" : "All Registration Requests Resolved"}
            </span>
            <span className="text-[11px] text-zinc-500">
              {language === "ko"
                ? "모든 신규 운영자 계정이 승인되었거나 처리 완료되었습니다."
                : "No pending clearance applications require administrator sign-off."}
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingApprovals.map((req) => (
              <PendingApprovalItem
                key={req.id}
                request={req}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Active Operators Directory */}
      <div className="cyber-panel p-4 rounded space-y-4 bg-zinc-950/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-panel-border pb-3">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              {language === "ko" ? "등록 계정 관리" : "Security Operations Center Personnel Directory"}
            </span>
            <h2 className="text-sm font-bold text-white mt-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-cyan" />
              <span>{language === "ko" ? "SOC 인가 운영자 디렉토리" : "Authorized Operator Accounts"}</span>
              <span className="text-xs text-zinc-500 font-normal">({users.length} registered)</span>
            </h2>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder={language === "ko" ? "이름, 이메일, 부서 검색..." : "Filter by name, email, department..."}
                className="w-full bg-zinc-900 border border-panel-border rounded pl-8 pr-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-brand-cyan"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-brand-cyan hover:bg-brand-cyan/90 text-black text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer shrink-0 shadow-[0_0_12px_rgba(0,229,255,0.25)]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3px]" />
              <span>{language === "ko" ? "운영자 직접 등록" : "Add Operator"}</span>
            </button>
          </div>
        </div>

        {/* Operators Table */}
        <div className="overflow-x-auto border border-panel-border rounded">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-950 border-b border-panel-border text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                <th className="p-3">{language === "ko" ? "운영자 식별자 / 성명" : "Operator Name / ID"}</th>
                <th className="p-3">{language === "ko" ? "소속 부서" : "Department"}</th>
                <th className="p-3">{language === "ko" ? "인가 역할 (Role)" : "RBAC Role"}</th>
                <th className="p-3 text-center">{language === "ko" ? "계정 상태" : "Status"}</th>
                <th className="p-3">{language === "ko" ? "마지막 접속" : "Last Login"}</th>
                <th className="p-3 text-right">{language === "ko" ? "관리 조치" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-panel-border bg-zinc-950/20">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-white">{user.name}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{user.email}</div>
                  </td>
                  <td className="p-3 text-zinc-400 text-[11px]">{user.department}</td>
                  <td className="p-3">
                    <UserRoleBadge role={user.role} />
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold border inline-flex items-center gap-1 ${
                        user.status === "ACTIVE"
                          ? "border-brand-emerald/40 bg-brand-emerald/10 text-brand-emerald"
                          : "border-rose-500/40 bg-rose-500/10 text-rose-400 animate-pulse"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === "ACTIVE" ? "bg-brand-emerald" : "bg-rose-500"
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-400 font-mono text-[11px]">{user.lastLoginAt}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleLock(user.id)}
                        title={user.status === "ACTIVE" ? "Lock Account" : "Unlock Account"}
                        className={`p-1.5 rounded border transition-colors cursor-pointer ${
                          user.status === "ACTIVE"
                            ? "bg-zinc-900 border-panel-border text-zinc-400 hover:text-amber-400 hover:border-amber-500/40"
                            : "bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30"
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
                        className="p-1.5 rounded bg-zinc-900 border border-panel-border text-zinc-500 hover:text-brand-rose hover:border-brand-rose/40 transition-colors cursor-pointer"
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
