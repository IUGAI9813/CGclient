import React, { useState } from "react";
import { UserCheck, UserX, Building, Clock } from "lucide-react";
import { PendingApproval } from "@/app/components/AuthContext";
import { RbacRole } from "@/app/components/RbacContext";
import { useLanguage } from "@/app/components/LanguageContext";

interface PendingApprovalItemProps {
  request: PendingApproval;
  onApprove: (id: string, assignedRole: RbacRole) => void;
  onReject: (id: string) => void;
}

export function PendingApprovalItem({ request, onApprove, onReject }: PendingApprovalItemProps) {
  const { language } = useLanguage();
  const [assignedRole, setAssignedRole] = useState<RbacRole>(request.requestedRole);

  return (
    <div className="p-4 bg-zinc-900/40 border border-panel-border hover:border-zinc-700 rounded transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="space-y-2 max-w-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-white">{request.name}</span>
          <span className="text-xs text-zinc-400 font-mono">({request.email})</span>
          <span className="text-[9px] px-2 py-0.5 rounded font-bold border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 uppercase">
            REQUESTED: {request.requestedRole}
          </span>
        </div>

        <div className="text-[11px] text-zinc-300 bg-zinc-950/60 p-2.5 rounded border border-panel-border/60">
          <strong className="text-zinc-500 text-[10px] uppercase block mb-1">
            {language === "ko" ? "신청 사유 및 업무 목적 (Justification):" : "Operational Mission Justification:"}
          </strong>
          &quot;{request.reason}&quot;
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[10px] text-zinc-500">
          <span className="flex items-center gap-1">
            <Building className="w-3 h-3 text-zinc-400" />
            {request.department}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-400" />
            {language === "ko" ? `신청 일시: ${request.submittedAt}` : `Submitted: ${request.submittedAt}`}
          </span>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0 bg-zinc-950 p-2.5 rounded border border-panel-border">
        <div className="space-y-1">
          <span className="text-[9px] text-zinc-500 uppercase font-bold block">
            {language === "ko" ? "인가 역할 지정" : "CONFIRM ROLE"}
          </span>
          <select
            value={assignedRole}
            onChange={(e) => setAssignedRole(e.target.value as RbacRole)}
            className="bg-zinc-900 border border-panel-border rounded text-xs text-white p-1 outline-none font-bold"
          >
            <option value="dispatcher">Dispatcher</option>
            <option value="analyst">Analyst</option>
            <option value="technician">Technician</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-3 sm:pt-0">
          <button
            type="button"
            onClick={() => onApprove(request.id, assignedRole)}
            className="px-3 py-1.5 bg-brand-emerald hover:bg-brand-emerald/90 text-black font-bold text-xs rounded transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.3)]"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{language === "ko" ? "승인 (Approve)" : "Approve"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  language === "ko"
                    ? `${request.name} 님의 가입 신청을 반려하시겠습니까?`
                    : `Reject clearance request for ${request.name}?`
                )
              ) {
                onReject(request.id);
              }
            }}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-brand-rose/20 text-zinc-400 hover:text-brand-rose border border-panel-border rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UserX className="w-3.5 h-3.5" />
            <span>{language === "ko" ? "반려 (Reject)" : "Reject"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
