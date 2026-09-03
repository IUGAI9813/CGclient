"use client";

import React, { useState, useEffect } from "react";
import { 
  Network, 
  Server, 
  Shield, 
  Activity, 
  Cpu, 
  Sliders, 
  Layers, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Play, 
  RefreshCw, 
  Search, 
  Plus, 
  Zap, 
  Lock, 
  Globe, 
  Timer,
  ChevronRight,
  Code
} from "lucide-react";

interface RouteDefinition {
  id: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "gRPC";
  upstream: string;
  authType: "OIDC_JWT" | "mTLS" | "API_KEY" | "PUBLIC";
  rateLimit: number; // RPM
  status: "ACTIVE" | "DEGRADED" | "MAINTENANCE";
  category: "Telemetry" | "Fleet Control" | "OTA" | "IAM" | "Partner";
  middleware: string[];
}

export default function GatewayView() {
  const [activeSubTab, setActiveSubTab] = useState<"routes" | "ratelimit" | "upstream" | "tester">("routes");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedRoute, setSelectedRoute] = useState<RouteDefinition | null>(null);

  // Live traffic simulation state
  const [simulatedRps, setSimulatedRps] = useState(3420);
  const [simulatedErrorRate, setSimulatedErrorRate] = useState(0.04);
  const [testMethod, setTestMethod] = useState<"GET" | "POST">("POST");
  const [testEndpoint, setTestEndpoint] = useState("/v1/fleet/control/emergency-stop");
  const [testAuthHeader, setTestAuthHeader] = useState("Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.42dot...");
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Upstream Circuit Breakers State
  const [upstreams, setUpstreams] = useState([
    {
      id: "up-telemetry",
      name: "telemetry-ingest-v2",
      k8sService: "telemetry-ingest.soc.svc.cluster.local:8080",
      pods: 12,
      latencyP95: "4.2 ms",
      errorRate: "0.01%",
      circuitState: "CLOSED", // CLOSED (Healthy), OPEN (Tripped), HALF_OPEN
      health: 99.99
    },
    {
      id: "up-fleet-ctrl",
      name: "fleet-coordinator-core",
      k8sService: "fleet-control.soc.svc.cluster.local:9090",
      pods: 8,
      latencyP95: "16.8 ms",
      errorRate: "0.03%",
      circuitState: "CLOSED",
      health: 99.96
    },
    {
      id: "up-iam-engine",
      name: "auth-identity-provider",
      k8sService: "iam-core.auth.svc.cluster.local:443",
      pods: 6,
      latencyP95: "8.1 ms",
      errorRate: "0.00%",
      circuitState: "CLOSED",
      health: 100.0
    },
    {
      id: "up-can-stream",
      name: "can-bus-grpc-bridge",
      k8sService: "can-bridge.telematics.svc.cluster.local:50051",
      pods: 4,
      latencyP95: "74.5 ms",
      errorRate: "3.40%",
      circuitState: "HALF_OPEN",
      health: 96.60
    },
    {
      id: "up-partner-v2x",
      name: "seoul-smartcity-v2x-relay",
      k8sService: "v2x-ext-relay.partner.svc.cluster.local:8443",
      pods: 2,
      latencyP95: "210.0 ms",
      errorRate: "42.10%",
      circuitState: "OPEN",
      health: 57.90
    }
  ]);

  // Route Registry
  const [routes, setRoutes] = useState<RouteDefinition[]>([
    {
      id: "rt-01",
      path: "/v1/telemetry/ingest",
      method: "POST",
      upstream: "telemetry-ingest.soc.svc.cluster.local:8080",
      authType: "mTLS",
      rateLimit: 60000,
      status: "ACTIVE",
      category: "Telemetry",
      middleware: ["mTLS-Validator", "Payload-Decompressor", "Kafka-Forwarder", "Rate-Limiter-Tier1"]
    },
    {
      id: "rt-02",
      path: "/v1/fleet/control/emergency-stop",
      method: "POST",
      upstream: "fleet-control.soc.svc.cluster.local:9090",
      authType: "OIDC_JWT",
      rateLimit: 120,
      status: "ACTIVE",
      category: "Fleet Control",
      middleware: ["OIDC-Token-Validator", "ABAC-Emergency-Guard", "KMS-Audit-Signer", "High-Priority-Queue"]
    },
    {
      id: "rt-03",
      path: "/v1/ota/campaigns/dispatch",
      method: "POST",
      upstream: "ota-manager.soc.svc.cluster.local:8081",
      authType: "OIDC_JWT",
      rateLimit: 300,
      status: "ACTIVE",
      category: "OTA",
      middleware: ["OAuth-Scope-Checker", "Binary-Hash-Verify", "Audit-Logger"]
    },
    {
      id: "rt-04",
      path: "/v1/fleet/vehicles",
      method: "GET",
      upstream: "fleet-control.soc.svc.cluster.local:9090",
      authType: "OIDC_JWT",
      rateLimit: 5000,
      status: "ACTIVE",
      category: "Fleet Control",
      middleware: ["JWT-Auth", "Response-Cache-TTL-3s", "Compress-Gzip"]
    },
    {
      id: "rt-05",
      path: "/v1/can-bus/stream",
      method: "gRPC",
      upstream: "can-bridge.telematics.svc.cluster.local:50051",
      authType: "mTLS",
      rateLimit: 120000,
      status: "DEGRADED",
      category: "Telemetry",
      middleware: ["mTLS-Verify", "CAN-Frame-Filter", "WSS-Tunnel"]
    },
    {
      id: "rt-06",
      path: "/v1/partner/traffic-advisory",
      method: "POST",
      upstream: "v2x-ext-relay.partner.svc.cluster.local:8443",
      authType: "API_KEY",
      rateLimit: 600,
      status: "MAINTENANCE",
      category: "Partner",
      middleware: ["API-Key-Validator", "Circuit-Breaker-Trip-Guard", "SLA-Quota-Tracker"]
    }
  ]);

  // Rate Limiting Tiers State
  const [rateTiers, setRateTiers] = useState([
    { id: "tier-fleet", name: "Autonomous Vehicle Fleet (mTLS)", limitRpm: 60000, burst: 5000, algorithm: "Token Bucket (Redis)", activeClients: 150 },
    { id: "tier-soc", name: "SOC Operator Dashboard (OIDC)", limitRpm: 10000, burst: 800, algorithm: "Sliding Window Log", activeClients: 24 },
    { id: "tier-partner", name: "External City V2X Partner (API Key)", limitRpm: 1200, burst: 100, algorithm: "Leaky Bucket", activeClients: 5 },
    { id: "tier-public", name: "Public Telematics Ingress", limitRpm: 300, burst: 20, algorithm: "Fixed Window Counter", activeClients: 1200 }
  ]);

  useEffect(() => {
    if (!selectedRoute && routes.length > 0) {
      setSelectedRoute(routes[0]);
    }
  }, [routes, selectedRoute]);

  const toggleCircuitBreaker = (upstreamId: string) => {
    setUpstreams(prev => prev.map(u => {
      if (u.id === upstreamId) {
        const nextState = u.circuitState === "CLOSED" ? "OPEN" : "CLOSED";
        return {
          ...u,
          circuitState: nextState,
          health: nextState === "OPEN" ? 0.0 : 99.9
        };
      }
      return u;
    }));
  };

  const handleRunMockRequest = () => {
    setIsTesting(true);
    setTestResult(null);

    setTimeout(() => {
      setIsTesting(false);
      const isBreakerOpen = testEndpoint.includes("traffic-advisory");
      if (isBreakerOpen) {
        setTestResult({
          status: 503,
          statusText: "Service Unavailable (Circuit Breaker Tripped)",
          latency: "1.2 ms",
          headers: {
            "x-tyk-gateway": "tyk-k8s-ingress-node-04",
            "x-ratelimit-limit": "600",
            "x-ratelimit-remaining": "599",
            "x-circuit-breaker": "OPEN_SHORT_CIRCUIT"
          },
          body: JSON.stringify({
            error: "UPSTREAM_CIRCUIT_OPEN",
            message: "Target service 'seoul-smartcity-v2x-relay' error rate exceeded threshold (42.1%). Request failed fast.",
            retry_after_seconds: 30
          }, null, 2)
        });
      } else {
        setTestResult({
          status: 200,
          statusText: "OK",
          latency: "14.8 ms",
          headers: {
            "content-type": "application/json; charset=utf-8",
            "x-tyk-gateway": "tyk-k8s-ingress-node-02",
            "x-auth-principal": "alex.s@42dot.ai",
            "x-auth-roles": "SOC_ADMIN,DISPATCHER",
            "x-ratelimit-limit": "10000",
            "x-ratelimit-remaining": "9842",
            "x-envoy-upstream-service-time": "12"
          },
          body: JSON.stringify({
            acknowledged: true,
            action: "EMERGENCY_OVERRIDE_ENGAGED",
            targetVehicle: "VEH-42-012",
            auditSignature: "sha256:7f8842bc1944da09...",
            timestamp: new Date().toISOString()
          }, null, 2)
        });
      }
    }, 450);
  };

  const filteredRoutes = routes.filter(r => {
    const matchesSearch = r.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.upstream.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "GET": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "POST": return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
      case "PUT": return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "DELETE": return "text-rose-400 bg-rose-500/10 border-rose-500/30";
      case "gRPC": return "text-purple-400 bg-purple-500/10 border-purple-500/30";
      default: return "text-zinc-400 bg-zinc-800 border-zinc-700";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Top API Gateway Status Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="cyber-panel p-4 rounded relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Gateway Core Engine</span>
              <span className="text-xl font-bold text-white tracking-tight block mt-1 flex items-center gap-2">
                Tyk / Envoy Proxy
                <span className="inline-block w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></span>
              </span>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-brand-cyan/40 text-brand-cyan">
              <Network className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-400 flex items-center justify-between">
            <span>Cluster Status:</span>
            <span className="text-brand-emerald font-bold">6/6 Pods Healthy</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="cyber-panel p-4 rounded relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Ingress Throughput</span>
              <span className="text-xl font-bold text-white tracking-tight block mt-1">
                {simulatedRps.toLocaleString()} <span className="text-xs text-zinc-500 font-normal">req/s</span>
              </span>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-panel-border text-brand-emerald">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-400 flex items-center justify-between">
            <span>P99 Proxy Overhead:</span>
            <span className="text-brand-cyan font-bold">1.4 ms</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="cyber-panel p-4 rounded relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Gateway Error Rate</span>
              <span className="text-xl font-bold text-white tracking-tight block mt-1">
                {simulatedErrorRate}%
              </span>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-panel-border text-brand-amber">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-400 flex items-center justify-between">
            <span>4xx: 0.03% | 5xx: 0.01%</span>
            <span className="text-brand-emerald font-bold">Normal</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="cyber-panel p-4 rounded relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">API Platform SLA</span>
              <span className="text-xl font-bold text-brand-emerald tracking-tight block mt-1">
                99.995%
              </span>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-panel-border text-brand-cyan">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-400 flex items-center justify-between">
            <span>Global Monthly Budget:</span>
            <span className="text-zinc-300 font-bold">2.1m remaining</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-panel-border space-x-2">
        <button
          onClick={() => setActiveSubTab("routes")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeSubTab === "routes"
              ? "border-brand-cyan text-white bg-zinc-900/50"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Layers className="w-4 h-4 text-brand-cyan" />
          <span>Route Registry & Governance ({routes.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("ratelimit")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeSubTab === "ratelimit"
              ? "border-brand-cyan text-white bg-zinc-900/50"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Sliders className="w-4 h-4 text-brand-cyan" />
          <span>Rate Limiting & Traffic Policies</span>
        </button>

        <button
          onClick={() => setActiveSubTab("upstream")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeSubTab === "upstream"
              ? "border-brand-cyan text-white bg-zinc-900/50"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Server className="w-4 h-4 text-brand-cyan" />
          <span>Service Mesh & Circuit Breakers</span>
        </button>

        <button
          onClick={() => setActiveSubTab("tester")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeSubTab === "tester"
              ? "border-brand-cyan text-white bg-zinc-900/50"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Play className="w-4 h-4 text-brand-cyan" />
          <span>Interactive Gateway Request Tester</span>
        </button>
      </div>

      {/* SUBTAB 1: ROUTES */}
      {activeSubTab === "routes" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route List (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="cyber-panel p-3 rounded flex flex-col sm:flex-row items-center gap-3 justify-between bg-zinc-950/40">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter endpoints by URI or upstream..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-panel-border rounded pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-brand-cyan"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
                {["ALL", "Telemetry", "Fleet Control", "OTA", "Partner"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-1 text-[10px] font-bold rounded border transition-colors ${
                      selectedCategory === cat
                        ? "bg-brand-cyan/20 border-brand-cyan text-brand-cyan"
                        : "bg-zinc-900 border-panel-border text-zinc-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredRoutes.map((route) => {
                const isSelected = selectedRoute?.id === route.id;
                return (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRoute(route)}
                    className={`cyber-panel p-3.5 rounded cursor-pointer transition-all border ${
                      isSelected
                        ? "border-brand-cyan bg-zinc-900/80 shadow-[inset_3px_0_0_#06b6d4]"
                        : "hover:border-zinc-700 bg-zinc-950/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getMethodBadge(route.method)}`}>
                          {route.method}
                        </span>
                        <span className="text-xs font-bold text-white tracking-wide">{route.path}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {route.rateLimit.toLocaleString()} RPM
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          route.status === "ACTIVE" 
                            ? "text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/30" 
                            : route.status === "DEGRADED"
                            ? "text-brand-amber bg-brand-amber/10 border border-brand-amber/30"
                            : "text-brand-rose bg-brand-rose/10 border border-brand-rose/30"
                        }`}>
                          {route.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-400">
                      <div className="flex items-center gap-2 truncate max-w-sm">
                        <Server className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate text-zinc-400 font-mono">{route.upstream}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <Lock className="w-3 h-3 text-brand-cyan" />
                        <span>{route.authType}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Route Details Panel (1 Col) */}
          <div className="lg:col-span-1">
            {selectedRoute ? (
              <div className="cyber-panel p-4 rounded space-y-4 sticky top-4">
                <div className="border-b border-panel-border pb-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Endpoint Inspector</span>
                    <h3 className="text-xs font-bold text-white mt-1 break-all">{selectedRoute.path}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getMethodBadge(selectedRoute.method)}`}>
                    {selectedRoute.method}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-bold">Upstream Target Service (k8s)</span>
                    <div className="mt-1 p-2 bg-zinc-950 border border-panel-border rounded text-zinc-300 font-mono break-all">
                      {selectedRoute.upstream}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-bold">Authentication Mechanism</span>
                    <div className="mt-1 flex items-center justify-between p-2 bg-zinc-950 border border-panel-border rounded">
                      <span className="text-white font-bold">{selectedRoute.authType}</span>
                      <Shield className="w-3.5 h-3.5 text-brand-cyan" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-bold">Active Middleware Chain ({selectedRoute.middleware.length})</span>
                    <div className="mt-1 space-y-1">
                      {selectedRoute.middleware.map((mw, idx) => (
                        <div key={idx} className="flex items-center justify-between p-1.5 bg-zinc-950 border border-panel-border rounded text-[11px] text-zinc-300">
                          <span className="flex items-center gap-1.5">
                            <span className="text-[9px] text-brand-cyan font-bold">{idx + 1}.</span>
                            {mw}
                          </span>
                          <CheckCircle2 className="w-3 h-3 text-brand-emerald" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-panel-border flex gap-2">
                    <button 
                      onClick={() => {
                        setTestEndpoint(selectedRoute.path);
                        setTestMethod(selectedRoute.method === "gRPC" ? "POST" : selectedRoute.method as any);
                        setActiveSubTab("tester");
                      }}
                      className="flex-1 py-1.5 bg-brand-cyan/20 border border-brand-cyan hover:bg-brand-cyan/30 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Test in Sandbox
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="cyber-panel p-6 rounded text-center text-zinc-500 text-xs">
                Select an endpoint to inspect its routing parameters & middleware stack.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: RATE LIMITING */}
      {activeSubTab === "ratelimit" && (
        <div className="space-y-6">
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="flex justify-between items-center border-b border-panel-border pb-3">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Traffic Governance</span>
                <h2 className="text-sm font-bold text-white mt-1">Client Tier Rate Limiting & Quota Allocations</h2>
              </div>
              <span className="text-[10px] text-brand-emerald font-bold border border-brand-emerald/30 bg-brand-emerald/10 px-2 py-0.5 rounded">
                REDIS TOKEN BUCKET ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rateTiers.map((tier) => (
                <div key={tier.id} className="cyber-panel p-4 rounded border border-panel-border space-y-3 bg-zinc-950/40">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold text-white">{tier.name}</h3>
                      <span className="text-[10px] text-zinc-500">{tier.algorithm}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-zinc-900 border border-panel-border text-zinc-400 rounded">
                      {tier.activeClients} Active Nodes
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">Rate Limit:</span>
                      <span className="text-brand-cyan font-bold">{tier.limitRpm.toLocaleString()} req/min</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-cyan h-full rounded-full" style={{ width: "68%" }}></div>
                    </div>

                    <div className="flex justify-between text-[10px] text-zinc-500 pt-1">
                      <span>Max Burst Quota: <strong className="text-zinc-300">{tier.burst} req</strong></span>
                      <span>On 429: <strong className="text-zinc-300">Retry-After: 5s</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: UPSTREAM SERVICE MESH */}
      {activeSubTab === "upstream" && (
        <div className="space-y-4">
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="flex justify-between items-center border-b border-panel-border pb-3">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Service Mesh Resilience</span>
                <h2 className="text-sm font-bold text-white mt-1">Upstream Microservices & Circuit Breaker Triggers</h2>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                Envoy Outlier Detection: Enabled
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-950 border-b border-panel-border text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="p-3">Upstream Service</th>
                    <th className="p-3">k8s Cluster Address</th>
                    <th className="p-3 text-center">Pods</th>
                    <th className="p-3 text-center">P95 Latency</th>
                    <th className="p-3 text-center">Error Rate</th>
                    <th className="p-3 text-center">Circuit State</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-panel-border bg-zinc-950/20">
                  {upstreams.map((up) => (
                    <tr key={up.id} className="hover:bg-zinc-900/30">
                      <td className="p-3 font-bold text-white">{up.name}</td>
                      <td className="p-3 text-zinc-400 font-mono text-[11px]">{up.k8sService}</td>
                      <td className="p-3 text-center font-bold text-zinc-300">{up.pods}</td>
                      <td className="p-3 text-center text-brand-cyan font-bold">{up.latencyP95}</td>
                      <td className={`p-3 text-center font-bold ${
                        parseFloat(up.errorRate) > 5 ? "text-brand-rose" : "text-brand-emerald"
                      }`}>
                        {up.errorRate}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          up.circuitState === "CLOSED"
                            ? "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30"
                            : up.circuitState === "HALF_OPEN"
                            ? "text-brand-amber bg-brand-amber/10 border-brand-amber/30 animate-pulse"
                            : "text-brand-rose bg-brand-rose/10 border-brand-rose/30"
                        }`}>
                          {up.circuitState}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => toggleCircuitBreaker(up.id)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded border transition-colors ${
                            up.circuitState === "CLOSED"
                              ? "bg-zinc-900 border-panel-border text-zinc-400 hover:text-brand-rose hover:border-brand-rose"
                              : "bg-brand-emerald/20 border-brand-emerald text-brand-emerald hover:bg-brand-emerald/30"
                          }`}
                        >
                          {up.circuitState === "CLOSED" ? "Force Trip" : "Reset Breaker"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: INTERACTIVE REQUEST TESTER */}
      {activeSubTab === "tester" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Form */}
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="border-b border-panel-border pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Sandbox Execution</span>
                <h2 className="text-sm font-bold text-white mt-1">API Gateway Request Simulator</h2>
              </div>
              <span className="text-[10px] text-brand-cyan font-bold border border-brand-cyan/30 px-2 py-0.5 rounded">
                SIMULATED PROXY
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex gap-2">
                <select
                  value={testMethod}
                  onChange={(e) => setTestMethod(e.target.value as any)}
                  className="bg-zinc-950 border border-panel-border text-white rounded px-3 py-2 outline-none font-bold"
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                </select>

                <input
                  type="text"
                  value={testEndpoint}
                  onChange={(e) => setTestEndpoint(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-panel-border rounded px-3 py-2 text-white font-mono outline-none focus:border-brand-cyan"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase block font-bold mb-1">Authorization Header</label>
                <input
                  type="text"
                  value={testAuthHeader}
                  onChange={(e) => setTestAuthHeader(e.target.value)}
                  className="w-full bg-zinc-950 border border-panel-border rounded px-3 py-2 text-zinc-300 font-mono text-[11px] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase block font-bold mb-1">JSON Payload Body</label>
                <textarea
                  rows={5}
                  defaultValue={JSON.stringify({
                    vehicleId: "VEH-42-012",
                    action: "EMERGENCY_STOP",
                    reason: "CAN_INJECTION_ALERT_TRIGGERED",
                    operatorNote: "Immediate remote override via Gangnam SOC"
                  }, null, 2)}
                  className="w-full bg-zinc-950 border border-panel-border rounded p-3 text-zinc-300 font-mono text-[11px] outline-none"
                />
              </div>

              <button
                onClick={handleRunMockRequest}
                disabled={isTesting}
                className="w-full py-2.5 bg-brand-cyan text-black hover:bg-cyan-400 font-bold rounded text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dispatching via Tyk Ingress...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-black" />
                    <span>Send Gateway Request</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Response Output */}
          <div className="cyber-panel p-4 rounded space-y-4">
            <div className="border-b border-panel-border pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Live Gateway Output</span>
                <h2 className="text-sm font-bold text-white mt-1">Response Headers & Payload</h2>
              </div>
              {testResult && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  testResult.status === 200 
                    ? "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30" 
                    : "text-brand-rose bg-brand-rose/10 border-brand-rose/30"
                }`}>
                  HTTP {testResult.status} {testResult.statusText} ({testResult.latency})
                </span>
              )}
            </div>

            {testResult ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block font-bold">Response Headers (Gateway + Upstream)</span>
                  <div className="mt-1 p-2 bg-zinc-950 border border-panel-border rounded font-mono text-[11px] text-zinc-400 space-y-0.5">
                    {Object.entries(testResult.headers).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-zinc-500">{k}:</span>
                        <span className="text-zinc-200">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block font-bold">Response Body</span>
                  <pre className="mt-1 p-3 bg-zinc-950 border border-panel-border rounded font-mono text-[11px] text-brand-cyan overflow-x-auto">
                    {testResult.body}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-zinc-600 text-xs space-y-2">
                <Code className="w-8 h-8 text-zinc-700" />
                <span>Click "Send Gateway Request" to test proxy routing & response latency.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
