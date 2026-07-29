"use client";

import React, { useState } from "react";
import { 
  Database, 
  Search, 
  Download, 
  ShieldCheck, 
  Terminal, 
  ExternalLink,
  ChevronRight,
  Filter
} from "lucide-react";

export default function AuditView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [hoveredHash, setHoveredHash] = useState<string | null>(null);

  const initialLogs = [
    { id: "LOG-239120", time: "22:58:14", level: "SECURITY", actor: "alex.s@42dot.ai", action: "Dispatcher Console Login Successful", source: "10.42.9.11", hash: "8d3e712ca7a022f" },
    { id: "LOG-239119", time: "22:57:42", level: "INFO", actor: "SYSTEM", action: "OTA Payload Cryptographic Verification Signed", source: "seoul-sub-04", hash: "9f9a88cd72b012b" },
    { id: "LOG-239118", time: "22:56:01", level: "WARN", actor: "VEH-42-012", action: "Anomaly Detected: Packet Jitter LIDAR_3 > 45ms", source: "AV-Ingress-12", hash: "2e11d044f51bc7a" },
    { id: "LOG-239117", time: "22:54:19", level: "INFO", actor: "SYSTEM", action: "Active Telemetry Sync: Database Heartbeat Complete", source: "db-cluster-node-02", hash: "7a22dc89fe51a34" },
    { id: "LOG-239116", time: "22:50:33", level: "SECURITY", actor: "maria.k@42dot.ai", action: "Remote Speed Restriction Policy Modified", source: "10.42.9.18", hash: "3bc882daef21004" },
    { id: "LOG-239115", time: "22:48:11", level: "ERROR", actor: "VEH-42-089", action: "Telemetry Dropout: Loss of V2X Frame sync (LiDAR offline)", source: "AV-Ingress-89", hash: "1d22fa45e31a78b" },
    { id: "LOG-239114", time: "22:42:01", level: "INFO", actor: "SYSTEM", action: "Automatic Hangar Sleep state triggered for VEH-42-089", source: "depot-controller", hash: "4a21cb8d9e2a7f3" },
    { id: "LOG-239113", time: "22:38:50", level: "SECURITY", actor: "SYSTEM", action: "API Access Key 'Ingest-Agent-AV' Revoked due to age policy", source: "auth-server", hash: "e234ab8d88fae12" },
  ];

  const filteredLogs = initialLogs.filter(log => {
    const matchesSearch = log.actor.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "ALL" || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "SECURITY": return "text-brand-cyan bg-brand-cyan/10 border-brand-cyan/25";
      case "ERROR": return "text-brand-rose bg-brand-rose/10 border-brand-rose/25";
      case "WARN": return "text-brand-amber bg-brand-amber/10 border-brand-amber/25";
      default: return "text-zinc-400 bg-zinc-900 border-panel-border";
    }
  };

  return (
    <div className="space-y-4 animate-fade-in font-mono">
      {/* Search Header Controls */}
      <div className="cyber-panel p-4 rounded space-y-3 bg-zinc-950/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search audit trail by operator, action code, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-panel-border rounded pl-9 pr-4 py-2 text-xs text-zinc-200 outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="flex gap-1.5 overflow-x-auto">
              {["ALL", "SECURITY", "ERROR", "WARN", "INFO"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-2.5 py-1.5 rounded text-[10px] font-bold border transition-colors ${
                    levelFilter === lvl
                      ? "bg-brand-cyan/15 text-brand-cyan border-brand-cyan"
                      : "bg-zinc-900 text-zinc-400 border-panel-border hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => alert("Preparing cryptographically signed CSV audit download...")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-panel-border hover:border-zinc-700 text-zinc-300 hover:text-white rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ml-auto"
            >
              <Download className="w-3.5 h-3.5" />
              EXPORT CSV
            </button>
          </div>
        </div>
      </div>

      {/* Main Audit Logs Table */}
      <div className="cyber-panel rounded overflow-hidden">
        <div className="p-3 border-b border-panel-border bg-zinc-950 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-brand-cyan" />
            <span className="text-xs font-bold text-white tracking-widest uppercase">KMS-Secured Immutable Audit Trail</span>
          </div>
          <span className="text-[9px] text-zinc-500 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" /> SHA-256 CRYPTO-VALIDATED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-950/70 border-b border-panel-border text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                <th className="p-3">Log ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Level</th>
                <th className="p-3">Actor / Agent</th>
                <th className="p-3">Action Description</th>
                <th className="p-3">Origin Node</th>
                <th className="p-3 text-right">Verification Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-panel-border/30 bg-zinc-950/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500">
                    NO LOGS FOUND MATCHING SPECIFIED CRITERIA
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="p-3 font-bold text-zinc-400">{log.id}</td>
                    <td className="p-3 text-zinc-500 tabular-nums">{log.time}</td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-zinc-300">{log.actor}</td>
                    <td className="p-3 text-white max-w-xs truncate" title={log.action}>
                      {log.action}
                    </td>
                    <td className="p-3 text-zinc-500">{log.source}</td>
                    <td className="p-3 text-right relative">
                      <div 
                        className="inline-flex items-center gap-1 cursor-pointer hover:text-brand-emerald select-none"
                        onMouseEnter={() => setHoveredHash(log.id)}
                        onMouseLeave={() => setHoveredHash(null)}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
                        <span className="text-[10px] text-zinc-600 font-mono underline hover:text-brand-emerald">{log.hash}...</span>
                        
                        {hoveredHash === log.id && (
                          <div className="absolute right-3 bottom-8 bg-zinc-900 border border-zinc-700 rounded p-2 text-[9px] w-48 shadow-xl text-left z-20 text-zinc-300 font-mono">
                            <div className="text-brand-emerald font-bold border-b border-panel-border pb-1 mb-1">
                              &bull; Signature Verified
                            </div>
                            <div className="space-y-0.5 text-[8px]">
                              <div>KMS KEY: 42dot-HSM-09</div>
                              <div>ALGO: ECDSA_SHA_256</div>
                              <div className="break-all text-zinc-500">FULL: {log.hash}ef3a82dc77ea102ab23d8c112b</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Retro CLI log viewer mock container at the bottom */}
      <div className="cyber-panel p-4 rounded bg-black/60 space-y-2">
        <div className="flex items-center gap-2 border-b border-panel-border pb-2 text-zinc-500 text-[10px]">
          <Terminal className="w-4 h-4 text-brand-cyan" />
          <span>COREGUARD LIVE ENCRYPTED SYSLOG STREAM [TLS 1.3]</span>
        </div>
        <div className="font-mono text-[9px] text-brand-emerald/90 space-y-1 max-h-[100px] overflow-y-auto leading-relaxed">
          <div>[SEC-INGRESS-01] TLS Connection handshaking with VEH-42-005: OK</div>
          <div>[SEC-INGRESS-01] Ephemeral keys negotiated: ECDHE-ECDSA-AES128-GCM-SHA256</div>
          <div>[KMS-SIGNER-04] Cryptographic digest verified for audit event LOG-239120. Ingress marked clean.</div>
          <div>[DB-SYNC-SERVICE] Heartbeat tick committed (index: 1048220, shard: AP-NORTHEAST-2)</div>
        </div>
      </div>
    </div>
  );
}
