"use client";

import React, { useState } from "react";
import { 
  KeyRound, 
  Lock, 
  Unlock,
  Fingerprint, 
  FileCode, 
  CheckCircle2, 
  Copy, 
  Plus,
  Users,
  UserCheck,
  UserX,
  Search,
  Trash2,
  Clock,
  Building,
  UserPlus
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";
import { RbacRole } from "../RbacContext";

export default function IamAuthView() {
  const { 
    users, 
    pendingApprovals, 
    approveUser, 
    rejectUser, 
    addUserDirectly, 
    toggleUserLock, 
    deleteUser 
  } = useAuth();
  const { language } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState<"users" | "jwt" | "clients" | "mtls">("users");
  const [copied, setCopied] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Direct Add Operator state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserDept, setNewUserDept] = useState("SOC Gangnam Operations");
  const [newUserRole, setNewUserRole] = useState<RbacRole>("dispatcher");

  // Approval role override map: requestId -> assignedRole
  const [approvalRoleMap, setApprovalRoleMap] = useState<Record<string, RbacRole>>({});

  // Sample JWT tokens
  const sampleTokens = {
    dispatcher: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjQyZG90LWttcy1zb2MtYXV0aC0yMDI2In0.eyJpc3MiOiJodHRwczovL2F1dGguNDJkb3QuYWkvb2F1dGgvdjIiLCJzdWIiOiJvcGVyYXRvcl9hbGV4X3MiLCJhdWQiOlsiaHR0cHM6Ly9hcGkuNDJkb3QuYWkvdjEvZmxlZXQiLCJodHRwczovL2FwaS40MmRvdC5haS92MS90ZWxlbWV0cnkiXSwicm9sZXMiOlsiU09DX0FETUlOIiwiRElTUEFUQ0hFUiJdLCJ2ZWhpY2xlX3Njb3BlIjoiR0FOR05BTV9ESVNUUklDVF9BTEwiLCJzY29wZXMiOlsicmVhZDpmbGVldCIsIndyaXRlOmZsZWV0Iiwid3JpdGU6ZW1lcmdlbmN5X3N0b3AiLCJvdGE6ZGlzcGF0Y2giXSwiZXhwIjoxNzk4OTk0NDAwLCJpYXQiOjE3OTg5OTA4MDAsImp0aSI6ImE0MmY4Y2ItZTA5OS00MTNmLWEyMDItNDJkb3RhMTJhIn0.SIGNATURE_CRYPTOGRAPHICALLY_VERIFIED_BY_KMS",
    vehicle_device: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjQyZG90LWttcy1tdGxzLXZlaC0yMDI2In0.eyJpc3MiOiJodHRwczovL2F1dGguNDJkb3QuYWkvdjIvdGVsZW1ldHJ5Iiwic3ViIjoiVkVILTQyLTAxMiIsImF1ZCI6Imh0dHBzOi8vYXBpLjQyZG90LmFpL3YxL3RlbGVtZXRyeS9pbmdlc3QiLCJyb2xlcyI6WyJBVVRPTk9NT1VTX1ZFSElDTEUiXSwiY2FuX2J1c19tYXNrIjoiMHgwQTItMHhGRkYiLCJzY29wZXMiOlsiaW5nZXN0OnRlbGVtZXRyeSIsImNhbjpyYXdfc3RyZWFtIl0sImV4cCI6MTc5ODk5NDQwMCwiaWF0IjoxNzk4OTkwODAwfQ.SIGNATURE_CRYPTOGRAPHICALLY_VERIFIED_BY_KMS"
  };

  const [rawToken, setRawToken] = useState(sampleTokens.dispatcher);
  const [selectedProfile, setSelectedProfile] = useState<"dispatcher" | "vehicle_device">("dispatcher");

  // OAuth 2.0 Registered Clients
  const [oauthClients] = useState([
    {
      id: "client-soc-portal",
      name: "42dot Gangnam SOC Command Console",
      clientId: "42dot_client_soc_web_0991",
      grantTypes: ["authorization_code", "refresh_token"],
      scopes: ["read:fleet", "write:fleet", "write:emergency_stop", "ota:dispatch"],
      authFlow: "PKCE + OIDC standard",
      status: "ACTIVE"
    },
    {
      id: "client-vehicle-edge",
      name: "AV Telematics On-board Edge Gateway",
      clientId: "42dot_client_av_edge_node",
      grantTypes: ["client_credentials", "mTLS_cert_bind"],
      scopes: ["ingest:telemetry", "can:raw_stream"],
      authFlow: "mTLS + OAuth 2.0 Token Exchange",
      status: "ACTIVE"
    },
    {
      id: "client-city-v2x",
      name: "Seoul Metropolitan Smart City V2X Relay",
      clientId: "42dot_client_seoul_v2x_ext",
      grantTypes: ["client_credentials"],
      scopes: ["read:traffic_advisories", "ingest:signal_state"],
      authFlow: "Signed JWT Client Assertion",
      status: "ACTIVE"
    }
  ]);

  // mTLS Fleet Certificates
  const [mtlsCerts, setMtlsCerts] = useState([
    {
      id: "cert-01",
      vehicleId: "VEH-42-012",
      subject: "CN=VEH-42-012.devices.42dot.ai, O=42dot Inc, OU=Autonomous SDV",
      issuer: "42dot Intermediate Fleet CA - G3",
      fingerprint: "SHA256: 4A:21:CB:8D:9E:2A:7F:34:B8:12:89:12:FA:11:09:A1",
      validTo: "2027-12-31",
      status: "VALID"
    },
    {
      id: "cert-02",
      vehicleId: "VEH-42-089",
      subject: "CN=VEH-42-089.devices.42dot.ai, O=42dot Inc, OU=Autonomous SDV",
      issuer: "42dot Intermediate Fleet CA - G3",
      fingerprint: "SHA256: 8D:3E:71:2C:A7:A0:22:F5:11:AA:BC:01:99:22:18:FE",
      validTo: "2026-11-15",
      status: "EXPIRING_SOON"
    },
    {
      id: "cert-03",
      vehicleId: "VEH-42-005",
      subject: "CN=VEH-42-005.devices.42dot.ai, O=42dot Inc, OU=Autonomous SDV",
      issuer: "42dot Intermediate Fleet CA - G3",
      fingerprint: "SHA256: 3B:C8:82:DA:EF:21:00:44:A1:02:88:FF:10:99:32:00",
      validTo: "2027-08-20",
      status: "VALID"
    },
    {
      id: "cert-04",
      vehicleId: "VEH-42-104 (Decommissioned)",
      subject: "CN=VEH-42-104.devices.42dot.ai, O=42dot Inc, OU=Autonomous SDV",
      issuer: "42dot Intermediate Fleet CA - G3",
      fingerprint: "SHA256: 1D:22:FA:45:E3:1A:78:B0:88:99:AA:01:11:22:33:44",
      validTo: "2026-04-10",
      status: "REVOKED"
    }
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProfileChange = (profile: "dispatcher" | "vehicle_device") => {
    setSelectedProfile(profile);
    setRawToken(sampleTokens[profile]);
  };

  const handleRevokeMtls = (id: string) => {
    setMtlsCerts(prev => prev.map(c => c.id === id ? { ...c, status: "REVOKED" } : c));
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    addUserDirectly({
      name: newUserName,
      email: newUserEmail,
      department: newUserDept,
      role: newUserRole,
      status: "ACTIVE"
    });

    setActionFeedback(
      language === "ko"
        ? `신규 운영자 ${newUserName} (${newUserRole.toUpperCase()}) 등록이 완료되었습니다.`
        : `Operator ${newUserName} (${newUserRole.toUpperCase()}) successfully registered.`
    );
    setTimeout(() => setActionFeedback(null), 4000);

    setNewUserName("");
    setNewUserEmail("");
    setShowAddModal(false);
  };

  // Parse JWT parts safely for demo
  const getParsedToken = () => {
    try {
      const parts = rawToken.split(".");
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      return { header, payload, isValid: true };
    } catch {
      return {
        header: { alg: "RS256", typ: "JWT", kid: "42dot-kms-soc-auth-2026" },
        payload: {
          iss: "https://auth.42dot.ai/oauth/v2",
          sub: "operator_alex_s",
          roles: ["SOC_ADMIN", "DISPATCHER"],
          scopes: ["read:fleet", "write:fleet", "write:emergency_stop", "ota:dispatch"]
        },
        isValid: true
      };
    }
  };

  const parsed = getParsedToken();

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Registered Operators */}
        <div className="cyber-panel p-4 rounded relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                {language === "ko" ? "인가 운영자 총원" : "Authorized Personnel"}
              </span>
              <span className="text-xl font-bold text-white tracking-tight block mt-1">
                {users.length} {language === "ko" ? "명" : "Active"}
              </span>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-panel-border text-brand-cyan">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-400 flex items-center justify-between">
            <span>{language === "ko" ? "정상 인가 상태:" : "Status:"}</span>
            <span className="text-brand-emerald font-bold">{users.filter(u => u.status === "ACTIVE").length} ACTIVE</span>
          </div>
        </div>

        {/* Card 2: Pending Approvals Queue */}
        <div className="cyber-panel p-4 rounded relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                {language === "ko" ? "가입 심사 대기열" : "Pending Sign-Offs"}
              </span>
              <span className={`text-xl font-bold tracking-tight block mt-1 ${
                pendingApprovals.length > 0 ? "text-amber-400 animate-pulse" : "text-white"
              }`}>
                {pendingApprovals.length} {language === "ko" ? "건" : "Requests"}
              </span>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-panel-border text-amber-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-400 flex items-center justify-between">
            <span>{language === "ko" ? "관리자 서명 필요:" : "Action Required:"}</span>
            <span className={pendingApprovals.length > 0 ? "text-amber-400 font-bold" : "text-zinc-500"}>
              {pendingApprovals.length > 0 ? "REVIEW REQUIRED" : "CLEAR"}
            </span>
          </div>
        </div>

        {/* Card 3: IdP Engine */}
        <div className="cyber-panel p-4 rounded relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Identity Provider (IdP)</span>
              <span className="text-xl font-bold text-brand-cyan tracking-tight block mt-1">
                42dot OIDC Engine
              </span>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-panel-border text-brand-cyan">
              <KeyRound className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-400 flex items-center justify-between">
            <span>Compliance:</span>
            <span className="text-brand-emerald font-bold">OAuth 2.1 / OIDC</span>
          </div>
        </div>

        {/* Card 4: Revocation Endpoint */}
        <div className="cyber-panel p-4 rounded relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Fleet PKI Endpoint</span>
              <span className="text-xl font-bold text-brand-emerald tracking-tight block mt-1">
                OCSP / CRL Synced
              </span>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-panel-border text-brand-emerald">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-400 flex items-center justify-between">
            <span>mTLS CA:</span>
            <span className="text-zinc-300 font-bold">42dot Fleet G3</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-panel-border space-x-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab("users")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === "users"
              ? "border-brand-cyan text-white bg-zinc-900/50"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Users className="w-4 h-4 text-brand-cyan" />
          <span>{language === "ko" ? "운영자 계정 및 승인 관리" : "Operators & Clearance Approvals"}</span>
          {pendingApprovals.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse font-mono font-bold">
              {pendingApprovals.length} PENDING
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("jwt")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === "jwt"
              ? "border-brand-cyan text-white bg-zinc-900/50"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <FileCode className="w-4 h-4 text-brand-cyan" />
          <span>Interactive JWT & Claims Inspector</span>
        </button>

        <button
          onClick={() => setActiveSubTab("clients")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === "clients"
              ? "border-brand-cyan text-white bg-zinc-900/50"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <KeyRound className="w-4 h-4 text-brand-cyan" />
          <span>OAuth 2.0 Clients & Grant Types</span>
        </button>

        <button
          onClick={() => setActiveSubTab("mtls")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === "mtls"
              ? "border-brand-cyan text-white bg-zinc-900/50"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Fingerprint className="w-4 h-4 text-brand-cyan" />
          <span>Fleet mTLS Certificate Authority (PKI)</span>
        </button>
      </div>

      {/* SUBTAB 0: OPERATORS & APPROVAL WORKFLOW */}
      {activeSubTab === "users" && (
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
                  <span>{language === "ko" ? "SOC 운영자 접근 권한 신청 심사" : "Operator Clearance & Access Requests"}</span>
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
                {pendingApprovals.map((req) => {
                  const assignedRole = approvalRoleMap[req.id] || req.requestedRole;
                  return (
                    <div
                      key={req.id}
                      className="p-4 bg-zinc-900/40 border border-panel-border hover:border-zinc-700 rounded transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-white">{req.name}</span>
                          <span className="text-xs text-zinc-400 font-mono">({req.email})</span>
                          <span className="text-[9px] px-2 py-0.5 rounded font-bold border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 uppercase">
                            REQUESTED: {req.requestedRole}
                          </span>
                        </div>

                        <div className="text-[11px] text-zinc-300 bg-zinc-950/60 p-2.5 rounded border border-panel-border/60">
                          <strong className="text-zinc-500 text-[10px] uppercase block mb-1">
                            {language === "ko" ? "신청 사유 및 업무 목적 (Justification):" : "Operational Mission Justification:"}
                          </strong>
                          &quot;{req.reason}&quot;
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-[10px] text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3 text-zinc-400" />
                            {req.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            {language === "ko" ? `신청 일시: ${req.submittedAt}` : `Submitted: ${req.submittedAt}`}
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
                            onChange={(e) =>
                              setApprovalRoleMap({ ...approvalRoleMap, [req.id]: e.target.value as RbacRole })
                            }
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
                            onClick={() => {
                              approveUser(req.id, assignedRole);
                              setActionFeedback(
                                language === "ko"
                                  ? `${req.name} (${assignedRole.toUpperCase()}) 님의 가입 신청이 성공적으로 승인되었습니다.`
                                  : `${req.name} approved as ${assignedRole.toUpperCase()} successfully.`
                              );
                              setTimeout(() => setActionFeedback(null), 4000);
                            }}
                            className="px-3 py-1.5 bg-brand-emerald hover:bg-brand-emerald/90 text-black font-bold text-xs rounded transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{language === "ko" ? "승인 (Approve)" : "Approve"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(language === "ko" ? `${req.name} 님의 가입 신청을 반려하시겠습니까?` : `Reject clearance request for ${req.name}?`)) {
                                rejectUser(req.id);
                                setActionFeedback(
                                  language === "ko" ? `${req.name} 님의 신청이 반려되었습니다.` : `Application rejected.`
                                );
                                setTimeout(() => setActionFeedback(null), 3000);
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
                })}
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
                  {users
                    .filter(
                      (u) =>
                        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.department.toLowerCase().includes(userSearch.toLowerCase())
                    )
                    .map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white">{user.name}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{user.email}</div>
                        </td>
                        <td className="p-3 text-zinc-400 text-[11px]">{user.department}</td>
                        <td className="p-3">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded font-bold border ${
                              user.role === "admin"
                                ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
                                : user.role === "dispatcher"
                                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                                : user.role === "analyst"
                                ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                                : "border-purple-500/40 bg-purple-500/10 text-purple-400"
                            }`}
                          >
                            {user.role.toUpperCase()}
                          </span>
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
                              onClick={() => toggleUserLock(user.id)}
                              title={user.status === "ACTIVE" ? "Lock Account" : "Unlock Account"}
                              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                                user.status === "ACTIVE"
                                  ? "bg-zinc-900 border-panel-border text-zinc-400 hover:text-amber-400 hover:border-amber-500/40"
                                  : "bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30"
                              }`}
                            >
                              {user.status === "ACTIVE" ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(language === "ko" ? `${user.name} 계정을 삭제하시겠습니까?` : `Delete operator account ${user.name}?`)) {
                                  deleteUser(user.id);
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

          {/* Add Operator Modal Dialog */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-md bg-zinc-950 border border-panel-border rounded-lg p-6 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center border-b border-panel-border pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-brand-cyan" />
                    <span>{language === "ko" ? "신규 운영자 계정 직접 등록" : "Register New Operator"}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="text-zinc-500 hover:text-white text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddUserSubmit} className="space-y-3">
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
                      placeholder="sujin.kim@42dot.ai"
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
                      onClick={() => setShowAddModal(false)}
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
          )}
        </div>
      )}

      {/* SUBTAB 1: JWT & CLAIMS INSPECTOR */}
      {activeSubTab === "jwt" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Raw Token & Preset Selectors (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="cyber-panel p-4 rounded space-y-4">
              <div className="flex justify-between items-center border-b border-panel-border pb-3">
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Token Source</span>
                  <h2 className="text-sm font-bold text-white mt-1">Live Cryptographic Bearer Token</h2>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-panel-border hover:border-zinc-700 text-zinc-300 text-[10px] font-bold transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
                      <span className="text-brand-emerald">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy JWT</span>
                    </>
                  )}
                </button>
              </div>

              {/* Profile Preset Switcher */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Select Authenticated Subject Profile</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleProfileChange("dispatcher")}
                    className={`p-2.5 rounded border text-left transition-all ${
                      selectedProfile === "dispatcher"
                        ? "bg-zinc-900 border-brand-cyan text-white font-bold"
                        : "bg-zinc-950 border-panel-border text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Lead Dispatcher</div>
                    <div className="text-[9px] text-zinc-500 font-mono">operator_alex_s</div>
                  </button>

                  <button
                    onClick={() => handleProfileChange("vehicle_device")}
                    className={`p-2.5 rounded border text-left transition-all ${
                      selectedProfile === "vehicle_device"
                        ? "bg-zinc-900 border-brand-cyan text-white font-bold"
                        : "bg-zinc-950 border-panel-border text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Vehicle Edge Node</div>
                    <div className="text-[9px] text-zinc-500 font-mono">VEH-42-012</div>
                  </button>
                </div>
              </div>

              {/* Raw Token Textarea */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Raw Encoded Token (RFC 7519)</span>
                <textarea
                  value={rawToken}
                  onChange={(e) => setRawToken(e.target.value)}
                  rows={8}
                  className="w-full bg-zinc-950 border border-panel-border rounded p-2.5 text-[11px] text-zinc-300 font-mono break-all focus:border-zinc-700 outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="text-[10px] text-zinc-500 leading-relaxed font-mono">
                Tokens are cryptographically stamped with 42dot Hardware Security Module (HSM) keys using RS256 with 90-minute rotation schedules.
              </div>
            </div>
          </div>

          {/* Right: Decoded JSON Claims (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="cyber-panel p-4 rounded space-y-4">
              <div className="flex justify-between items-center border-b border-panel-border pb-3">
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Decoded Claims</span>
                  <h2 className="text-sm font-bold text-white mt-1">Payload &amp; Scopes Inspection</h2>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold border border-brand-emerald/30 bg-brand-emerald/10 text-brand-emerald flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SIGNATURE VALID</span>
                </span>
              </div>

              {/* Decoded Header */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                  <span>JOSE Header</span>
                  <span className="text-zinc-500">Algorithm &amp; Key ID</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded border border-panel-border text-[11px] font-mono text-brand-rose overflow-x-auto">
                  <pre>{JSON.stringify(parsed.header, null, 2)}</pre>
                </div>
              </div>

              {/* Decoded Payload */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                  <span>JWT Claims Set (Payload)</span>
                  <span className="text-zinc-500">Identity, Roles, &amp; Vehicle Scopes</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded border border-panel-border text-[11px] font-mono text-brand-cyan overflow-x-auto">
                  <pre>{JSON.stringify(parsed.payload, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: OAUTH 2.0 CLIENTS */}
      {activeSubTab === "clients" && (
        <div className="cyber-panel p-4 rounded space-y-4">
          <div className="flex justify-between items-center border-b border-panel-border pb-3">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Registered OAuth 2.0 Clients</span>
              <h2 className="text-sm font-bold text-white mt-1">Machine &amp; Operator Ingress Clients</h2>
            </div>
            <button
              onClick={() => alert("New OAuth client creation modal: Redirects to 42dot Developer Identity Portal.")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-cyan hover:bg-brand-cyan/85 text-black rounded text-[10px] font-bold uppercase transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3px]" />
              <span>Register New Client</span>
            </button>
          </div>

          <div className="space-y-3">
            {oauthClients.map((client) => (
              <div key={client.id} className="p-4 bg-zinc-900/40 border border-panel-border rounded space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-white">{client.name}</h3>
                    <div className="text-[10px] font-mono text-zinc-500 mt-0.5">Client ID: {client.clientId}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-brand-emerald/30 bg-brand-emerald/10 text-brand-emerald">
                    {client.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 block uppercase">Allowed Grant Types:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {client.grantTypes.map(gt => (
                        <span key={gt} className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300">
                          {gt}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 block uppercase">Authorized Scopes:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {client.scopes.map(scope => (
                        <span key={scope} className="px-2 py-0.5 rounded bg-zinc-950 border border-panel-border text-[10px] text-brand-cyan font-bold">
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-500 border-t border-panel-border/50 pt-2 flex justify-between">
                  <span>Enforcement: <strong className="text-zinc-400">{client.authFlow}</strong></span>
                  <span className="text-brand-cyan hover:underline cursor-pointer">Rotate Client Secret</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: FLEET MTLS CERTIFICATES */}
      {activeSubTab === "mtls" && (
        <div className="space-y-4">
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="flex justify-between items-center border-b border-panel-border pb-3">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Mutual TLS (mTLS) Fleet CA</span>
                <h2 className="text-sm font-bold text-white mt-1">On-board Vehicle Cryptographic Identities</h2>
              </div>
              <span className="text-[10px] font-bold text-brand-cyan border border-brand-cyan/20 bg-brand-cyan/5 px-2 py-0.5 rounded">
                Hardware Bound (HSM)
              </span>
            </div>

            <div className="space-y-3">
              {mtlsCerts.map((cert) => (
                <div key={cert.id} className="cyber-panel p-3.5 rounded border border-panel-border bg-zinc-950/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-brand-cyan" />
                      <span className="text-xs font-bold text-white">{cert.vehicleId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        cert.status === "VALID" 
                          ? "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30" 
                          : cert.status === "EXPIRING_SOON"
                          ? "text-brand-amber bg-brand-amber/10 border-brand-amber/30"
                          : "text-brand-rose bg-brand-rose/10 border-brand-rose/30"
                      }`}>
                        {cert.status}
                      </span>
                      {cert.status !== "REVOKED" && (
                        <button
                          onClick={() => handleRevokeMtls(cert.id)}
                          className="text-[10px] text-brand-rose hover:underline font-bold cursor-pointer"
                        >
                          Revoke Certificate
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-zinc-400 font-mono space-y-1">
                    <div>Subject: <span className="text-zinc-300">{cert.subject}</span></div>
                    <div>Fingerprint: <span className="text-zinc-500">{cert.fingerprint}</span></div>
                    <div className="flex justify-between text-[10px] text-zinc-500 pt-1">
                      <span>Issuer: {cert.issuer}</span>
                      <span>Valid Until: <strong className="text-zinc-300">{cert.validTo}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
