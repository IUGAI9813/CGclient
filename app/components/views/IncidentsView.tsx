"use client";

import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Play, 
  Check, 
  Trash2, 
  Terminal, 
  ShieldAlert, 
  Sliders, 
  Info,
  ChevronRight,
  Eye,
  AlertCircle
} from "lucide-react";

interface Incident {
  id: string;
  vehicleId: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
  status: "ACTIVE" | "TRIAGED" | "RESOLVED";
  timestamp: string;
  description: string;
}

interface IncidentsViewProps {
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
  selectedIncidentFromDashboard: Incident | null;
  clearSelectedIncidentFromDashboard: () => void;
  panicMode: boolean;
}

export default function IncidentsView({
  incidents,
  setIncidents,
  selectedIncidentFromDashboard,
  clearSelectedIncidentFromDashboard,
  panicMode
}: IncidentsViewProps) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Sync with incident selected from Dashboard
  useEffect(() => {
    if (selectedIncidentFromDashboard) {
      setSelectedIncident(selectedIncidentFromDashboard);
      clearSelectedIncidentFromDashboard();
    } else if (!selectedIncident && incidents.length > 0) {
      setSelectedIncident(incidents[0]);
    }
  }, [selectedIncidentFromDashboard, incidents]);

  const handleUpdateStatus = (id: string, newStatus: "ACTIVE" | "TRIAGED" | "RESOLVED") => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Filter logic
  const filteredIncidents = incidents.filter(inc => {
    const matchesSeverity = severityFilter === "ALL" || inc.severity === severityFilter;
    const matchesStatus = statusFilter === "ALL" || inc.status === statusFilter;
    const matchesSearch = inc.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inc.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inc.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  // Mock CAN Bus dump for details
  const getMockCanBusDump = (vehicleId: string) => {
    return [
      { id: "0x120", dlc: 8, data: "0F 00 22 C0 FF A2 03 EC", desc: "Steering Angle Sensor (Valid)" },
      { id: "0x13A", dlc: 8, data: "22 4A 10 00 A2 EE 12 00", desc: "Wheel Speed Telemetry" },
      { id: "0x0A2", dlc: 4, data: "FF FF FF FF", desc: "CRITICAL: Brakes Actuator Override Injection", suspect: true },
      { id: "0x2C4", dlc: 8, data: "00 00 00 00 00 00 00 00", desc: "Gear Position Telemetry (Null)" },
    ];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in font-mono">
      {/* Incident List panel (Left 2 Columns) */}
      <div className="lg:col-span-2 flex flex-col space-y-4">
        {/* Controls header */}
        <div className="cyber-panel p-4 rounded space-y-3">
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by incident ID, vehicle ID, anomaly..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-panel-border rounded pl-9 pr-4 py-2 text-xs text-zinc-200 outline-none focus:border-zinc-600 transition-colors"
              />
            </div>
            
            {/* Severity Filters */}
            <div className="flex gap-1.5 flex-wrap">
              {["ALL", "CRITICAL", "HIGH", "MEDIUM", "INFO"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                    severityFilter === sev
                      ? "bg-brand-cyan/15 text-brand-cyan border-brand-cyan"
                      : "bg-zinc-900 text-zinc-400 border-panel-border hover:text-white"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-zinc-500 border-t border-panel-border/50 pt-2 flex-wrap gap-2">
            <span>SHOWING: <strong className="text-zinc-300">{filteredIncidents.length}</strong> anomalies matching rules</span>
            <div className="flex items-center gap-2">
              <span>STATUS FILTER:</span>
              <div className="flex gap-1">
                {["ALL", "ACTIVE", "TRIAGED", "RESOLVED"].map((stat) => (
                  <button
                    key={stat}
                    onClick={() => setStatusFilter(stat)}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      statusFilter === stat
                        ? "bg-zinc-800 text-white border border-zinc-700"
                        : "bg-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {stat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Incidents Table / List */}
        <div className="cyber-panel rounded overflow-hidden flex-1 max-h-[500px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-950/80 border-b border-panel-border text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                <th className="p-3">Incident ID</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Security Threat Class</th>
                <th className="p-3 text-center">Severity</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Detected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-panel-border/50 bg-zinc-950/10">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-zinc-500 font-mono">
                    NO ACTIVE SAFETY INCIDENTS DETECTED FOR SELECTED FILTER CRITERIA
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => {
                  const isSelected = selectedIncident?.id === inc.id;
                  const isCrit = inc.severity === "CRITICAL" || panicMode;
                  
                  return (
                    <tr
                      key={inc.id}
                      onClick={() => setSelectedIncident(inc)}
                      className={`cursor-pointer hover:bg-zinc-900/40 transition-colors ${
                        isSelected ? "bg-zinc-900/70 border-l-2 border-brand-cyan" : ""
                      }`}
                    >
                      <td className="p-3 font-bold text-zinc-300">{inc.id}</td>
                      <td className="p-3 text-zinc-400">{inc.vehicleId}</td>
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        {isCrit && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-ping"></span>
                        )}
                        {inc.type}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          isCrit
                            ? "text-brand-rose bg-brand-rose/10 border border-brand-rose/25"
                            : inc.severity === "HIGH"
                            ? "text-brand-amber bg-brand-amber/10 border border-brand-amber/25"
                            : "text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/25"
                        }`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase ${
                          inc.status === "ACTIVE"
                            ? "text-brand-rose animate-pulse"
                            : inc.status === "TRIAGED"
                            ? "text-brand-amber"
                            : "text-zinc-500"
                        }`}>
                          {inc.status}
                        </span>
                      </td>
                      <td className="p-3 text-right text-zinc-500 text-[10px]">{inc.timestamp}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Details Sidebar Drawer (Right 1 Column) */}
      <div className="flex flex-col">
        {selectedIncident ? (
          <div className="cyber-panel rounded flex flex-col flex-1 p-4 space-y-4 bg-zinc-950/40 relative overflow-hidden">
            {/* Header info */}
            <div className="border-b border-panel-border pb-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Incident Dossier</span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                  selectedIncident.status === "ACTIVE" ? "bg-brand-rose/20 text-brand-rose" : "bg-zinc-800 text-zinc-400"
                }`}>
                  {selectedIncident.id}
                </span>
              </div>
              <h2 className="text-sm font-bold text-white mt-1.5 flex items-center gap-1.5">
                <AlertTriangle className={`w-4 h-4 ${
                  selectedIncident.severity === "CRITICAL" ? "text-brand-rose animate-pulse" : "text-brand-amber"
                }`} />
                {selectedIncident.type}
              </h2>
              <span className="text-[10px] text-zinc-400 block mt-1">
                AFFECTED INSTANCE: <strong className="text-brand-cyan">{selectedIncident.vehicleId}</strong>
              </span>
            </div>

            {/* Description detail */}
            <div className="text-xs bg-zinc-900/50 p-3 rounded border border-panel-border text-zinc-300 leading-relaxed font-mono">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Description</span>
              {selectedIncident.description}
            </div>

            {/* Raw Security Payload (CAN bus frame dump) */}
            <div className="flex-1 flex flex-col min-h-[160px] bg-black border border-panel-border rounded p-3 text-[10px] font-mono">
              <div className="flex justify-between items-center text-zinc-500 border-b border-panel-border pb-1.5 mb-2 font-bold">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-brand-cyan" />
                  RAW OB-CAN BUS INGRESS FRAME
                </span>
                <span className="text-brand-rose animate-pulse">ANOMALY HIGH</span>
              </div>
              
              <div className="space-y-1 overflow-y-auto flex-1 max-h-[140px] text-zinc-400">
                {getMockCanBusDump(selectedIncident.vehicleId).map((frame, index) => (
                  <div 
                    key={index}
                    className={`p-1.5 rounded flex flex-col gap-0.5 border ${
                      frame.suspect 
                        ? "bg-brand-rose/5 border-brand-rose/20 text-brand-rose" 
                        : "border-transparent text-zinc-400"
                    }`}
                  >
                    <div className="flex justify-between font-bold">
                      <span>{frame.id} (DLC: {frame.dlc})</span>
                      <span className="text-[8px] font-normal uppercase opacity-75">{frame.desc}</span>
                    </div>
                    <div className="text-xs tracking-wider font-semibold font-mono whitespace-nowrap overflow-x-auto">
                      {frame.data}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Dispatch Actions Buttons */}
            <div className="space-y-2 border-t border-panel-border pt-4">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">DISPATCH RESPONSE CONTROL</span>
              
              <div className="grid grid-cols-2 gap-2">
                {selectedIncident.status === "ACTIVE" && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedIncident.id, "TRIAGED")}
                    className="flex items-center justify-center gap-1.5 p-2 rounded bg-brand-amber/10 border border-brand-amber/30 text-brand-amber text-[10px] font-bold uppercase hover:bg-brand-amber/25 transition-all"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    TRIAGE ALERT
                  </button>
                )}

                {selectedIncident.status !== "RESOLVED" && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedIncident.id, "RESOLVED")}
                    className="flex items-center justify-center gap-1.5 p-2 rounded bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald text-[10px] font-bold uppercase hover:bg-brand-emerald/25 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    RESOLVE ALERT
                  </button>
                )}
              </div>

              {/* Dangerous Override Triggers */}
              <div className="border border-brand-rose/25 bg-brand-rose/5 rounded p-2.5 space-y-2">
                <span className="text-[8px] text-brand-rose font-bold uppercase tracking-widest block flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 animate-pulse" /> FAIL-SAFE OVERRIDES (IMMEDIATE DEPLOY)
                </span>
                
                <div className="grid grid-cols-1 gap-1.5">
                  <button 
                    onClick={() => alert(`CRITICAL EMERGENCY SIGNAL BROADCAST TO ${selectedIncident.vehicleId}: FORCING EMERGENCY STOP.`)}
                    className="w-full p-2 bg-brand-rose text-black text-[9px] font-bold uppercase hover:bg-brand-rose/80 rounded transition-all tracking-wider text-center"
                  >
                    FORCE EMERGENCY STOP (VEH SAFE-STOP)
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="cyber-panel rounded flex-1 flex flex-col items-center justify-center p-8 text-zinc-500 text-xs text-center border-dashed">
            <Info className="w-8 h-8 text-zinc-600 mb-2" />
            <span>Select an incident from the security roster to inspect raw payload and dispatch fail-safes.</span>
          </div>
        )}
      </div>
    </div>
  );
}
