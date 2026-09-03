"use client";

import React, { useState } from "react";
import { 
  KeyRound, 
  ShieldCheck, 
  Lock, 
  Fingerprint, 
  FileCode, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Plus, 
  Trash2, 
  Shield, 
  Sliders,
  ExternalLink,
  Search
} from "lucide-react";

export default function IamAuthView() {
  const [activeSubTab, setActiveSubTab] = useState<"jwt" | "clients" | "mtls">("jwt");
  const [copied, setCopied] = useState(false);

  // Sample JWT tokens
  const sampleTokens = {
    dispatcher: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjQyZG90LWttcy1zb2MtYXV0aC0yMDI2In0.eyJpc3MiOiJodHRwczovL2F1dGguNDJkb3QuYWkvb2F1dGgvdjIiLCJzdWIiOiJvcGVyYXRvcl9hbGV4X3MiLCJhdWQiOlsiaHR0cHM6Ly9hcGkuNDJkb3QuYWkvdjEvZmxlZXQiLCJodHRwczovL2FwaS40MmRvdC5haS92MS90ZWxlbWV0cnkiXSwicm9sZXMiOlsiU09DX0FETUlOIiwiRElTUEFUQ0hFUiJdLCJ2ZWhpY2xlX3Njb3BlIjoiR0FOR05BTV9ESVNUUklDVF9BTEwiLCJzY29wZXMiOlsicmVhZDpmbGVldCIsIndyaXRlOmZsZWV0Iiwid3JpdGU6ZW1lcmdlbmN5X3N0b3AiLCJvdGE6ZGlzcGF0Y2giXSwiZXhwIjoxNzk4OTk0NDAwLCJpYXQiOjE3OTg5OTA4MDAsImp0aSI6ImE0MmY4Y2ItZTA5OS00MTNmLWEyMDItNDJkb3RhMTJhIn0.SIGNATURE_CRYPTOGRAPHICALLY_VERIFIED_BY_KMS",
    vehicle_device: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjQyZG90LWttcy1tdGxzLXZlaC0yMDI2In0.eyJpc3MiOiJodHRwczovL2F1dGguNDJkb3QuYWkvdjIvdGVsZW1ldHJ5Iiwic3ViIjoiVkVILTQyLTAxMiIsImF1ZCI6Imh0dHBzOi8vYXBpLjQyZG90LmFpL3YxL3RlbGVtZXRyeS9pbmdlc3QiLCJyb2xlcyI6WyJBVVRPTk9NT1VTX1ZFSElDTEUiXSwiY2FuX2J1c19tYXNrIjoiMHgwQTItMHhGRkYiLCJzY29wZXMiOlsiaW5nZXN0OnRlbGVtZXRyeSIsImNhbjpyYXdfc3RyZWFtIl0sImV4cCI6MTc5ODk5NDQwMCwiaWF0IjoxNzk4OTkwODAwfQ.SIGNATURE_CRYPTOGRAPHICALLY_VERIFIED_BY_KMS"
  };

  const [rawToken, setRawToken] = useState(sampleTokens.dispatcher);
  const [selectedProfile, setSelectedProfile] = useState<"dispatcher" | "vehicle_device">("dispatcher");

  // OAuth 2.0 Registered Clients
  const [oauthClients, setOauthClients] = useState([
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

  // Parse JWT parts safely for demo
  const getParsedToken = () => {
    try {
      const parts = rawToken.split(".");
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      return { header, payload, isValid: true };
    } catch (e) {
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
        {/* Card 1 */}
        <div className="cyber-panel p-4 rounded relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Identity Provider (IdP)</span>
              <span className="text-xl font-bold text-white tracking-tight block mt-1">
                42dot OIDC Engine
              </span>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-panel-border text-brand-cyan">
              <KeyRound className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-400 flex items-center justify-between">
            <span>Protocol Compliance:</span>
            <span className="text-brand-emerald font-bold">OAuth 2.1 / OIDC Core</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="cyber-panel p-4 rounded relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Active PKI Certificates</span>
              <span className="text-xl font-bold text-white tracking-tight block mt-1">
                148 / 150 <span className="text-xs text-zinc-500 font-normal">Vehicles</span>
              </span>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-panel-border text-brand-emerald">
              <Fingerprint className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-400 flex items-center justify-between">
            <span>mTLS Strict Handshake:</span>
            <span className="text-brand-emerald font-bold">ENFORCED</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="cyber-panel p-4 rounded relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">KMS Key Signatures</span>
              <span className="text-xl font-bold text-white tracking-tight block mt-1">
                RSA-4096 / HSM
              </span>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-panel-border text-brand-cyan">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-400 flex items-center justify-between">
            <span>Auto-Rotation Schedule:</span>
            <span className="text-zinc-300 font-bold">Every 90 Days</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="cyber-panel p-4 rounded relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Revocation Endpoint</span>
              <span className="text-xl font-bold text-brand-emerald tracking-tight block mt-1">
                OCSP / CRL Synced
              </span>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-panel-border text-brand-emerald">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-400 flex items-center justify-between">
            <span>Cache Expiry (TTL):</span>
            <span className="text-zinc-300 font-bold">60 seconds</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-panel-border space-x-2">
        <button
          onClick={() => setActiveSubTab("jwt")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
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
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
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
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeSubTab === "mtls"
              ? "border-brand-cyan text-white bg-zinc-900/50"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Fingerprint className="w-4 h-4 text-brand-cyan" />
          <span>Fleet mTLS Certificate Authority (PKI)</span>
        </button>
      </div>

      {/* SUBTAB 1: JWT & CLAIMS INSPECTOR */}
      {activeSubTab === "jwt" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Raw Token & Preset Selectors (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="cyber-panel p-4 rounded space-y-4">
              <div className="flex justify-between items-center border-b border-panel-border pb-3">
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Token Source</span>
                  <h2 className="text-sm font-bold text-white mt-1">Encoded JWT String</h2>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[10px] px-2 py-1 bg-zinc-900 border border-panel-border hover:border-zinc-700 text-zinc-300 rounded"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? "COPIED" : "COPY"}
                </button>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-bold mb-2">Preset Authentication Profiles</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleProfileChange("dispatcher")}
                    className={`p-2.5 rounded border text-left text-xs transition-colors ${
                      selectedProfile === "dispatcher"
                        ? "bg-brand-cyan/15 border-brand-cyan text-white font-bold"
                        : "bg-zinc-950 border-panel-border text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="text-[11px] font-bold">SOC Dispatcher</div>
                    <div className="text-[9px] text-zinc-500">Human Operator OIDC Token</div>
                  </button>

                  <button
                    onClick={() => handleProfileChange("vehicle_device")}
                    className={`p-2.5 rounded border text-left text-xs transition-colors ${
                      selectedProfile === "vehicle_device"
                        ? "bg-brand-cyan/15 border-brand-cyan text-white font-bold"
                        : "bg-zinc-950 border-panel-border text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="text-[11px] font-bold">AV Robotaxi Node</div>
                    <div className="text-[9px] text-zinc-500">Device Client Credentials</div>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-bold mb-1">Raw Encoded Token Input</span>
                <textarea
                  rows={9}
                  value={rawToken}
                  onChange={(e) => setRawToken(e.target.value)}
                  className="w-full bg-zinc-950 border border-panel-border rounded p-3 text-xs text-brand-cyan font-mono outline-none focus:border-brand-cyan leading-relaxed break-all"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-brand-emerald/10 border border-brand-emerald/30 rounded text-xs text-brand-emerald">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  KMS Cryptographic Signature: VALID
                </span>
                <span className="text-[10px] font-bold font-mono">RS256</span>
              </div>
            </div>
          </div>

          {/* Right: Decoded Header, Payload Claims, Scopes (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Decoded Header */}
            <div className="cyber-panel p-4 rounded space-y-3">
              <div className="flex justify-between items-center border-b border-panel-border pb-2">
                <span className="text-[10px] text-brand-rose font-bold uppercase tracking-wider">HEADER: Algorithm & Key ID</span>
                <span className="text-[10px] text-zinc-500">JOSE Header</span>
              </div>
              <pre className="p-3 bg-zinc-950 border border-panel-border rounded text-xs text-rose-400 font-mono overflow-x-auto">
                {JSON.stringify(parsed.header, null, 2)}
              </pre>
            </div>

            {/* Decoded Payload */}
            <div className="cyber-panel p-4 rounded space-y-3">
              <div className="flex justify-between items-center border-b border-panel-border pb-2">
                <span className="text-[10px] text-brand-cyan font-bold uppercase tracking-wider">PAYLOAD: Identity & Claims (DATA)</span>
                <span className="text-[10px] text-zinc-500">RFC 7519 Compliant</span>
              </div>
              <pre className="p-3 bg-zinc-950 border border-panel-border rounded text-xs text-cyan-300 font-mono overflow-x-auto">
                {JSON.stringify(parsed.payload, null, 2)}
              </pre>
            </div>

            {/* Evaluated Effective Permissions */}
            <div className="cyber-panel p-4 rounded space-y-3">
              <span className="text-[10px] text-brand-emerald font-bold uppercase tracking-wider block">
                Evaluated Effective Scopes & Capabilities
              </span>
              <div className="flex flex-wrap gap-2">
                {(parsed.payload.scopes || []).map((scope: string) => (
                  <span key={scope} className="px-2.5 py-1 bg-zinc-900 border border-panel-border text-brand-emerald text-xs rounded font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {scope}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: OAUTH 2.0 CLIENTS */}
      {activeSubTab === "clients" && (
        <div className="space-y-4">
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="flex justify-between items-center border-b border-panel-border pb-3">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Client Applications</span>
                <h2 className="text-sm font-bold text-white mt-1">OAuth 2.0 & OIDC Registered Client Apps</h2>
              </div>
              <button 
                onClick={() => alert("Creating new OAuth 2.0 Client credentials...")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-cyan text-black hover:bg-cyan-400 rounded text-xs font-bold uppercase transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Register New Client
              </button>
            </div>

            <div className="space-y-3">
              {oauthClients.map((client) => (
                <div key={client.id} className="cyber-panel p-4 rounded border border-panel-border bg-zinc-950/40 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white">{client.name}</h3>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        Client ID: <span className="text-brand-cyan font-bold">{client.clientId}</span>
                      </div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded font-bold text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/30">
                      {client.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block font-bold">Allowed Grant Types</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {client.grantTypes.map(gt => (
                          <span key={gt} className="px-2 py-0.5 bg-zinc-900 border border-panel-border text-zinc-300 rounded text-[10px]">
                            {gt}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block font-bold">Authentication Flow</span>
                      <span className="text-zinc-300 block mt-1 text-[11px]">{client.authFlow}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block font-bold">Assigned Scopes</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {client.scopes.map(s => (
                          <span key={s} className="px-2 py-0.5 bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan rounded text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: MTLS FLEET CERTS */}
      {activeSubTab === "mtls" && (
        <div className="space-y-4">
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="flex justify-between items-center border-b border-panel-border pb-3">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Public Key Infrastructure (PKI)</span>
                <h2 className="text-sm font-bold text-white mt-1">Autonomous Vehicle mTLS X.509 Device Certificates</h2>
              </div>
              <span className="text-[10px] text-brand-emerald font-bold border border-brand-emerald/30 bg-brand-emerald/10 px-2 py-0.5 rounded">
                CA ENGINE OPERATIONAL
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
