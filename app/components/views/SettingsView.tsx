"use client";

import React, { useState } from "react";
import { 
  Settings, 
  Users, 
  Key, 
  Lock, 
  Check, 
  X, 
  Plus, 
  ShieldAlert, 
  ShieldCheck,
  RefreshCw,
  Trash2,
  Sliders,
  Activity,
  FileCode,
  Code
} from "lucide-react";

export default function SettingsView() {
  const [activeSubTab, setActiveSubTab] = useState("rbac");
  const [apiKeyList, setApiKeyList] = useState([
    { id: "key-1", name: "seoul-gangnam-telemetry-ingest", created: "2026-05-12", status: "ACTIVE", type: "Ingress" },
    { id: "key-2", name: "california-hq-dashboard-mirror", created: "2026-06-01", status: "ACTIVE", type: "Egress" },
    { id: "key-3", name: "hangar-diag-technician-probe", created: "2026-07-20", status: "REVOKED", type: "Diagnostic" }
  ]);

  // RBAC Permission Grid State
  const [rbacMatrix, setRbacMatrix] = useState({
    admin: { emergencyStop: true, forceOta: true, editPolicy: true, viewRawCan: true },
    dispatcher: { emergencyStop: true, forceOta: false, editPolicy: false, viewRawCan: true },
    analyst: { emergencyStop: false, forceOta: false, editPolicy: false, viewRawCan: true },
    technician: { emergencyStop: false, forceOta: true, editPolicy: false, viewRawCan: false },
  });

  // Safe Mode Options Toggles
  const [overrides, setOverrides] = useState({
    remoteTakeover: true,
    mfaBrakeOverride: true,
    doubleAcknowledge: false,
    level4Override: true
  });

  // Alert Threshold Rules State
  const [thresholds, setThresholds] = useState({
    batteryWarn: 30,
    batteryCrit: 15,
    latencyWarn: 100,
    latencyCrit: 200,
    lidarPpsWarn: 400,
    lidarPpsCrit: 200,
  });

  const toggleRbac = (role: keyof typeof rbacMatrix, permission: string) => {
    setRbacMatrix(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !((prev[role] as any)[permission])
      }
    }));
  };

  const toggleOverride = (key: keyof typeof overrides) => {
    setOverrides(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCreateApiKey = () => {
    const keyName = prompt("Enter description/identifier for new Ingest API Key:");
    if (!keyName) return;

    const newKey = {
      id: `key-${Date.now()}`,
      name: keyName,
      created: new Date().toISOString().split("T")[0],
      status: "ACTIVE",
      type: "Ingress"
    };
    setApiKeyList(prev => [...prev, newKey]);
  };

  const handleRevokeKey = (id: string) => {
    setApiKeyList(prev => prev.map(k => k.id === id ? { ...k, status: "REVOKED" } : k));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in font-mono">
      {/* Sub navigation sidebar */}
      <div className="lg:col-span-1 flex flex-col space-y-2">
        <button
          onClick={() => setActiveSubTab("rbac")}
          className={`w-full text-left p-3 rounded font-mono text-xs border transition-all flex items-center gap-2.5 ${
            activeSubTab === "rbac"
              ? "bg-zinc-900 border-brand-cyan text-white font-bold"
              : "bg-transparent text-zinc-400 border-panel-border hover:bg-zinc-900/50 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4 text-brand-cyan" />
          <span>Role-Based Access (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("policies")}
          className={`w-full text-left p-3 rounded font-mono text-xs border transition-all flex items-center gap-2.5 ${
            activeSubTab === "policies"
              ? "bg-zinc-900 border-brand-cyan text-white font-bold"
              : "bg-transparent text-zinc-400 border-panel-border hover:bg-zinc-900/50 hover:text-white"
          }`}
        >
          <Lock className="w-4 h-4 text-brand-cyan" />
          <span>Global Failsafe Policies</span>
        </button>

        <button
          onClick={() => setActiveSubTab("keys")}
          className={`w-full text-left p-3 rounded font-mono text-xs border transition-all flex items-center gap-2.5 ${
            activeSubTab === "keys"
              ? "bg-zinc-900 border-brand-cyan text-white font-bold"
              : "bg-transparent text-zinc-400 border-panel-border hover:bg-zinc-900/50 hover:text-white"
          }`}
        >
          <Key className="w-4 h-4 text-brand-cyan" />
          <span>API Credentials Matrix</span>
        </button>

        <button
          onClick={() => setActiveSubTab("abac")}
          className={`w-full text-left p-3 rounded font-mono text-xs border transition-all flex items-center gap-2.5 ${
            activeSubTab === "abac"
              ? "bg-zinc-900 border-brand-cyan text-white font-bold"
              : "bg-transparent text-zinc-400 border-panel-border hover:bg-zinc-900/50 hover:text-white"
          }`}
        >
          <FileCode className="w-4 h-4 text-brand-cyan" />
          <span>ABAC & OPA Policy Engine</span>
        </button>

        <button
          onClick={() => setActiveSubTab("thresholds")}
          className={`w-full text-left p-3 rounded font-mono text-xs border transition-all flex items-center gap-2.5 ${
            activeSubTab === "thresholds"
              ? "bg-zinc-900 border-brand-cyan text-white font-bold"
              : "bg-transparent text-zinc-400 border-panel-border hover:bg-zinc-900/50 hover:text-white"
          }`}
        >
          <Sliders className="w-4 h-4 text-brand-cyan" />
          <span>Alert Threshold Rules</span>
        </button>
      </div>

      {/* Settings Action Content (Right 3 Columns) */}
      <div className="lg:col-span-3">
        {/* RBAC Role-Permission Grid */}
        {activeSubTab === "rbac" && (
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="border-b border-panel-border pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Security Rule Configurations</span>
                <h2 className="text-sm font-bold text-white mt-1">SOC Role Permission Matrix</h2>
              </div>
              <span className="text-[10px] text-brand-cyan font-bold border border-brand-cyan/20 bg-brand-cyan/5 px-2 py-0.5 rounded">
                RBAC ACTIVE
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-950 border-b border-panel-border text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="p-3">Role Descriptor</th>
                    <th className="p-3 text-center">EMERGENCY STOP</th>
                    <th className="p-3 text-center">FORCE OTA</th>
                    <th className="p-3 text-center">EDIT ACCESS POLICIES</th>
                    <th className="p-3 text-center">VIEW RAW OB-CAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-panel-border bg-zinc-950/20">
                  {/* ADMIN */}
                  <tr>
                    <td className="p-3 font-bold text-zinc-300">SOC Administrator</td>
                    {["emergencyStop", "forceOta", "editPolicy", "viewRawCan"].map((perm) => (
                      <td key={perm} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={(rbacMatrix.admin as any)[perm]}
                          onChange={() => toggleRbac("admin", perm)}
                          className="w-4 h-4 cursor-pointer accent-brand-cyan rounded border-zinc-700 bg-zinc-900"
                        />
                      </td>
                    ))}
                  </tr>
                  {/* LEAD DISPATCHER */}
                  <tr>
                    <td className="p-3 font-bold text-zinc-300">SOC Lead Dispatcher</td>
                    {["emergencyStop", "forceOta", "editPolicy", "viewRawCan"].map((perm) => (
                      <td key={perm} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={(rbacMatrix.dispatcher as any)[perm]}
                          onChange={() => toggleRbac("dispatcher", perm)}
                          className="w-4 h-4 cursor-pointer accent-brand-cyan rounded border-zinc-700 bg-zinc-900"
                        />
                      </td>
                    ))}
                  </tr>
                  {/* ANALYST */}
                  <tr>
                    <td className="p-3 font-bold text-zinc-300">Security Analyst</td>
                    {["emergencyStop", "forceOta", "editPolicy", "viewRawCan"].map((perm) => (
                      <td key={perm} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={(rbacMatrix.analyst as any)[perm]}
                          onChange={() => toggleRbac("analyst", perm)}
                          className="w-4 h-4 cursor-pointer accent-brand-cyan rounded border-zinc-700 bg-zinc-900"
                        />
                      </td>
                    ))}
                  </tr>
                  {/* TECHNICIAN */}
                  <tr>
                    <td className="p-3 font-bold text-zinc-300">Hangar Depot Tech</td>
                    {["emergencyStop", "forceOta", "editPolicy", "viewRawCan"].map((perm) => (
                      <td key={perm} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={(rbacMatrix.technician as any)[perm]}
                          onChange={() => toggleRbac("technician", perm)}
                          className="w-4 h-4 cursor-pointer accent-brand-cyan rounded border-zinc-700 bg-zinc-900"
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-zinc-900/40 border border-panel-border rounded p-3 text-[10px] text-zinc-500 leading-relaxed">
              <strong>* ACCESS NOTE:</strong> Permitting dangerous overrides (e.g. Emergency stop override or edit policy overrides) instantly logs cryptographic session tokens into the HSM cluster and forces MFA re-validation on deployment.
            </div>
          </div>
        )}

        {/* Global Failsafe Policies */}
        {activeSubTab === "policies" && (
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="border-b border-panel-border pb-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Policy Management</span>
              <h2 className="text-sm font-bold text-white mt-1">Autonomous Fleet Safety Overrides</h2>
            </div>

            <div className="space-y-4">
              {/* Option 1 */}
              <div className="flex items-center justify-between bg-zinc-900/40 border border-panel-border p-3.5 rounded">
                <div className="space-y-1 pr-6">
                  <span className="text-xs font-bold text-white block">Allow V2X Remote Vehicle Control Ingress</span>
                  <p className="text-[10px] text-zinc-500 font-mono">Permits SOC operator to override vehicle steering/brake controls under emergency state.</p>
                </div>
                <button 
                  onClick={() => toggleOverride("remoteTakeover")}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                    overrides.remoteTakeover ? "bg-brand-emerald justify-end" : "bg-zinc-800 justify-start"
                  }`}
                >
                  <span className="bg-black w-4 h-4 rounded-full shadow-md"></span>
                </button>
              </div>

              {/* Option 2 */}
              <div className="flex items-center justify-between bg-zinc-900/40 border border-panel-border p-3.5 rounded">
                <div className="space-y-1 pr-6">
                  <span className="text-xs font-bold text-white block">Force Hardware MFA Prompt on Emergency Braking</span>
                  <p className="text-[10px] text-zinc-500 font-mono">Forces dispatchers to touch security token before triggering remote stops.</p>
                </div>
                <button 
                  onClick={() => toggleOverride("mfaBrakeOverride")}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                    overrides.mfaBrakeOverride ? "bg-brand-emerald justify-end" : "bg-zinc-800 justify-start"
                  }`}
                >
                  <span className="bg-black w-4 h-4 rounded-full shadow-md"></span>
                </button>
              </div>

              {/* Option 3 */}
              <div className="flex items-center justify-between bg-zinc-900/40 border border-panel-border p-3.5 rounded">
                <div className="space-y-1 pr-6">
                  <span className="text-xs font-bold text-white block">Require Double-Signature for System Fail-safe</span>
                  <p className="text-[10px] text-zinc-500 font-mono">Two dispatchers must sign the override package simultaneously to broadcast.</p>
                </div>
                <button 
                  onClick={() => toggleOverride("doubleAcknowledge")}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                    overrides.doubleAcknowledge ? "bg-brand-emerald justify-end" : "bg-zinc-800 justify-start"
                  }`}
                >
                  <span className="bg-black w-4 h-4 rounded-full shadow-md"></span>
                </button>
              </div>

              {/* Option 4 */}
              <div className="flex items-center justify-between bg-zinc-900/40 border border-panel-border p-3.5 rounded">
                <div className="space-y-1 pr-6">
                  <span className="text-xs font-bold text-white block">Enable Autonomous Level 4 Override Bounds</span>
                  <p className="text-[10px] text-zinc-500 font-mono">Permits AVs to override standard routing paths to dodge local security hazards.</p>
                </div>
                <button 
                  onClick={() => toggleOverride("level4Override")}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                    overrides.level4Override ? "bg-brand-emerald justify-end" : "bg-zinc-800 justify-start"
                  }`}
                >
                  <span className="bg-black w-4 h-4 rounded-full shadow-md"></span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* API Credentials */}
        {activeSubTab === "keys" && (
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="border-b border-panel-border pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Credentials Management</span>
                <h2 className="text-sm font-bold text-white mt-1">Autonomous Ingestion Auth Credentials</h2>
              </div>
              <button 
                onClick={handleCreateApiKey}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-cyan hover:bg-brand-cyan/85 text-black rounded text-[10px] font-bold uppercase transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                CREATE TOKEN
              </button>
            </div>

            <div className="space-y-3">
              {apiKeyList.map((key) => (
                <div key={key.id} className="flex justify-between items-center bg-zinc-900/40 border border-panel-border p-3 rounded">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${key.status === "ACTIVE" ? "bg-brand-emerald" : "bg-zinc-600"}`}></span>
                      {key.name}
                    </span>
                    <div className="flex gap-4 text-[9px] text-zinc-500">
                      <span>TYPE: <strong className="text-zinc-400">{key.type}</strong></span>
                      <span>CREATED: <strong className="text-zinc-400">{key.created}</strong></span>
                      <span>ID: <strong className="text-zinc-400">{key.id}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      key.status === "ACTIVE" 
                        ? "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20" 
                        : "text-zinc-500 bg-zinc-900 border-panel-border"
                    }`}>
                      {key.status}
                    </span>

                    {key.status === "ACTIVE" && (
                      <button 
                        onClick={() => handleRevokeKey(key.id)}
                        className="p-1 rounded text-zinc-500 hover:text-brand-rose hover:bg-brand-rose/10 transition-colors"
                        title="Revoke Token"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Threshold Rules */}
        {activeSubTab === "thresholds" && (
          <div className="cyber-panel p-4 rounded space-y-6">
            <div className="border-b border-panel-border pb-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Rule Engine</span>
              <h2 className="text-sm font-bold text-white mt-1">Operational Telemetry Alert Thresholds</h2>
            </div>

            <div className="space-y-6">
              {/* Battery Threshold */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-cyan" />
                    MINIMUM VEHICLE BATTERY MARGIN
                  </span>
                  <span className="text-zinc-500 text-[10px]">CRIT: {thresholds.batteryCrit}% | WARN: {thresholds.batteryWarn}%</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-900/40 border border-panel-border p-3 rounded space-y-2">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>WARNING LEVEL (%)</span>
                      <span className="text-brand-amber font-bold">{thresholds.batteryWarn}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="50" 
                      value={thresholds.batteryWarn} 
                      onChange={(e) => setThresholds(prev => ({ ...prev, batteryWarn: parseInt(e.target.value) }))}
                      className="w-full accent-brand-amber cursor-pointer bg-zinc-950"
                    />
                  </div>

                  <div className="bg-zinc-900/40 border border-panel-border p-3 rounded space-y-2">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>CRITICAL LEVEL (%)</span>
                      <span className="text-brand-rose font-bold">{thresholds.batteryCrit}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="25" 
                      value={thresholds.batteryCrit} 
                      onChange={(e) => setThresholds(prev => ({ ...prev, batteryCrit: parseInt(e.target.value) }))}
                      className="w-full accent-brand-rose cursor-pointer bg-zinc-950"
                    />
                  </div>
                </div>
              </div>

              {/* V2X Latency Threshold */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-cyan" />
                    MAXIMUM V2X ROUND-TRIP LATENCY (RTT)
                  </span>
                  <span className="text-zinc-500 text-[10px]">CRIT: {thresholds.latencyCrit}ms | WARN: {thresholds.latencyWarn}ms</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-900/40 border border-panel-border p-3 rounded space-y-2">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>WARNING LEVEL (MS)</span>
                      <span className="text-brand-amber font-bold">{thresholds.latencyWarn} ms</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="150" 
                      value={thresholds.latencyWarn} 
                      onChange={(e) => setThresholds(prev => ({ ...prev, latencyWarn: parseInt(e.target.value) }))}
                      className="w-full accent-brand-amber cursor-pointer bg-zinc-950"
                    />
                  </div>

                  <div className="bg-zinc-900/40 border border-panel-border p-3 rounded space-y-2">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>CRITICAL LEVEL (MS)</span>
                      <span className="text-brand-rose font-bold">{thresholds.latencyCrit} ms</span>
                    </div>
                    <input 
                      type="range" 
                      min="100" 
                      max="300" 
                      value={thresholds.latencyCrit} 
                      onChange={(e) => setThresholds(prev => ({ ...prev, latencyCrit: parseInt(e.target.value) }))}
                      className="w-full accent-brand-rose cursor-pointer bg-zinc-950"
                    />
                  </div>
                </div>
              </div>

              {/* LiDAR Ingest Threshold */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-cyan" />
                    MINIMUM LIDAR INGEST STREAM RATE (PPS)
                  </span>
                  <span className="text-zinc-500 text-[10px]">CRIT: {thresholds.lidarPpsCrit}k/s | WARN: {thresholds.lidarPpsWarn}k/s</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-900/40 border border-panel-border p-3 rounded space-y-2">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>WARNING BOUND (k points/s)</span>
                      <span className="text-brand-amber font-bold">{thresholds.lidarPpsWarn}k / s</span>
                    </div>
                    <input 
                      type="range" 
                      min="300" 
                      max="500" 
                      value={thresholds.lidarPpsWarn} 
                      onChange={(e) => setThresholds(prev => ({ ...prev, lidarPpsWarn: parseInt(e.target.value) }))}
                      className="w-full accent-brand-amber cursor-pointer bg-zinc-950"
                    />
                  </div>

                  <div className="bg-zinc-900/40 border border-panel-border p-3 rounded space-y-2">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>CRITICAL BOUND (k points/s)</span>
                      <span className="text-brand-rose font-bold">{thresholds.lidarPpsCrit}k / s</span>
                    </div>
                    <input 
                      type="range" 
                      min="100" 
                      max="300" 
                      value={thresholds.lidarPpsCrit} 
                      onChange={(e) => setThresholds(prev => ({ ...prev, lidarPpsCrit: parseInt(e.target.value) }))}
                      className="w-full accent-brand-rose cursor-pointer bg-zinc-950"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-panel-border pt-4">
              <button 
                onClick={() => alert("Reverting overrides to KMS default signature values.")}
                className="px-3 py-1.5 rounded bg-zinc-900 border border-panel-border hover:border-zinc-700 text-zinc-400 hover:text-white text-[10px] font-bold uppercase transition-all"
              >
                RESET DEFAULTS
              </button>
              <button 
                onClick={() => alert("Broadcasting new operational alert policy rules to all Edge ADCU agents...")}
                className="px-3 py-1.5 rounded bg-brand-cyan hover:bg-brand-cyan/90 text-black text-[10px] font-bold uppercase transition-all"
              >
                DEPLOY POLICY RULES
              </button>
            </div>
          </div>
        )}

        {/* ABAC & OPA (Open Policy Agent) Policy Engine */}
        {activeSubTab === "abac" && (
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="border-b border-panel-border pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Policy-as-Code Engine</span>
                <h2 className="text-sm font-bold text-white mt-1">Attribute-Based Access Control (ABAC & Rego)</h2>
              </div>
              <span className="text-[10px] text-brand-emerald font-bold border border-brand-emerald/30 bg-brand-emerald/10 px-2 py-0.5 rounded">
                OPA v0.68 COMPILED
              </span>
            </div>

            {/* ABAC Rules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-zinc-950/60 border border-panel-border rounded space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-white">POL-01: Emergency Braking Overrides</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30 rounded font-bold">ACTIVE</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-mono">
                  Allow <span className="text-brand-cyan">POST /v1/fleet/control/emergency-stop</span> ONLY IF:
                </p>
                <div className="space-y-1 text-[10px] text-zinc-400 font-mono bg-zinc-900/60 p-2 rounded border border-panel-border">
                  <div>• Subject: <span className="text-zinc-200">role == 'DISPATCHER' && mfa == true</span></div>
                  <div>• Environment: <span className="text-zinc-200">location == 'Gangnam_SOC'</span></div>
                  <div>• Resource: <span className="text-zinc-200">vehicle.state in ['AUTONOMOUS_RUN', 'EMERGENCY']</span></div>
                </div>
              </div>

              <div className="p-3.5 bg-zinc-950/60 border border-panel-border rounded space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-white">POL-02: Direct OB-CAN Streaming</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30 rounded font-bold">ACTIVE</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-mono">
                  Allow <span className="text-brand-cyan">gRPC /v1/can-bus/stream</span> ONLY IF:
                </p>
                <div className="space-y-1 text-[10px] text-zinc-400 font-mono bg-zinc-900/60 p-2 rounded border border-panel-border">
                  <div>• Subject: <span className="text-zinc-200">clearance &gt;= 3 && pki_cert == 'VALID'</span></div>
                  <div>• Environment: <span className="text-zinc-200">time_window == 'MAINTENANCE_HOURS' || threat == 'CRITICAL'</span></div>
                  <div>• Resource: <span className="text-zinc-200">bus_mask in ['0x0A2', '0x0F0']</span></div>
                </div>
              </div>
            </div>

            {/* Live OPA Rego Code Viewer */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white font-bold flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-brand-cyan" />
                  Live Open Policy Agent (Rego) Definition
                </span>
                <span className="text-[10px] text-zinc-500">package soc.authz.fleet</span>
              </div>

              <pre className="p-3.5 bg-zinc-950 border border-panel-border rounded text-xs text-brand-cyan font-mono overflow-x-auto leading-relaxed">
{`package soc.authz.fleet

default allow = false

# Rule: Emergency Remote Control Overrides
allow {
    input.action.method == "POST"
    input.action.path == "/v1/fleet/control/emergency-stop"
    input.subject.role == "DISPATCHER"
    input.subject.mfa_verified == true
    input.environment.soc_location == "Gangnam_SOC"
    input.resource.vehicle_status == "CRITICAL_ANOMALY"
}

# Rule: OTA Campaign Execution Guard
allow {
    input.action.path == "/v1/ota/campaigns/dispatch"
    input.subject.clearance_level >= 4
    input.subject.scopes[_] == "ota:dispatch"
    input.environment.fleet_threat_level != "CRITICAL" # OTA blocked during critical threat
}`}
              </pre>
            </div>

            <div className="p-3 bg-brand-cyan/5 border border-brand-cyan/20 rounded flex items-center justify-between text-xs">
              <span className="text-zinc-400 text-[11px]">
                OPA Policies are evaluated in &lt; 0.8ms at the API Gateway Envoy WASM filter layer before hitting upstream services.
              </span>
              <button 
                onClick={() => alert("Simulating OPA Policy Evaluation against current SOC Operator claims: RESULT = ALLOW (200)")}
                className="px-3 py-1 bg-brand-cyan text-black rounded text-[10px] font-bold uppercase transition-colors shrink-0 ml-4 cursor-pointer"
              >
                Evaluate Policy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
