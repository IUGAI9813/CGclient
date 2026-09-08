"use client";

import React, { useState, useEffect } from "react";
import {
  RouteDefinition,
  UpstreamService,
  RateLimitTier,
  GatewayKpiStats,
  HttpMethod,
  GatewayTestResponse,
} from "@/entities/gateway/model/types";
import {
  defaultGatewayKpis,
  defaultRoutes,
  defaultUpstreams,
  defaultRateTiers,
} from "@/entities/gateway/model/mock-data";
import { GatewayKpiGrid } from "@/widgets/gateway/GatewayKpiGrid";
import { GatewaySubNav, GatewaySubTab } from "@/widgets/gateway/GatewaySubNav";
import { RouteRegistryWidget } from "@/widgets/gateway/RouteRegistryWidget";
import { RateLimitManagerWidget } from "@/widgets/gateway/RateLimitManagerWidget";
import { UpstreamMeshWidget } from "@/widgets/gateway/UpstreamMeshWidget";
import { GatewayRequestTesterWidget } from "@/widgets/gateway/GatewayRequestTesterWidget";

export default function GatewayView() {
  const [activeSubTab, setActiveSubTab] = useState<GatewaySubTab>("routes");
  const [routes] = useState<RouteDefinition[]>(defaultRoutes);
  const [selectedRoute, setSelectedRoute] = useState<RouteDefinition | null>(defaultRoutes[0] || null);
  const [upstreams, setUpstreams] = useState<UpstreamService[]>(defaultUpstreams);
  const [rateTiers] = useState<RateLimitTier[]>(defaultRateTiers);
  const [kpis] = useState<GatewayKpiStats>(defaultGatewayKpis);

  // Live sandbox tester state
  const [testMethod, setTestMethod] = useState<HttpMethod>("POST");
  const [testEndpoint, setTestEndpoint] = useState("/v1/fleet/control/emergency-stop");
  const [testAuthHeader, setTestAuthHeader] = useState("Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.42dot...");
  const [testPayload, setTestPayload] = useState(
    JSON.stringify(
      {
        vehicleId: "VEH-42-012",
        reason: "OBSTACLE_DETECTED_URGENT",
        initiator: "soc-operator-04",
      },
      null,
      2
    )
  );
  const [testResult, setTestResult] = useState<GatewayTestResponse | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (!selectedRoute && routes.length > 0) {
      // setSelectedRoute(routes[0]);
    }
  }, [routes, selectedRoute]);

  const toggleCircuitBreaker = (upstreamId: string) => {
    setUpstreams((prev) =>
      prev.map((u) => {
        if (u.id === upstreamId) {
          const nextState = u.circuitState === "CLOSED" ? "OPEN" : "CLOSED";
          return {
            ...u,
            circuitState: nextState,
            health: nextState === "OPEN" ? 0.0 : 99.9,
          };
        }
        return u;
      })
    );
  };

  const handleOpenInTester = (route: RouteDefinition) => {
    setTestMethod(route.method === "gRPC" ? "POST" : route.method);
    setTestEndpoint(route.path);
    setActiveSubTab("tester");
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
            "x-circuit-breaker": "OPEN_SHORT_CIRCUIT",
          },
          body: JSON.stringify(
            {
              error: "UPSTREAM_CIRCUIT_OPEN",
              message:
                "Target service 'seoul-smartcity-v2x-relay' error rate exceeded threshold (42.1%). Request failed fast.",
              retry_after_seconds: 30,
            },
            null,
            2
          ),
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
            "x-envoy-upstream-service-time": "12",
          },
          body: JSON.stringify(
            {
              acknowledged: true,
              action: "EMERGENCY_OVERRIDE_ENGAGED",
              targetVehicle: "VEH-42-012",
              auditSignature: "sha256:7f8842bc1944da09...",
              timestamp: new Date().toISOString(),
            },
            null,
            2
          ),
        });
      }
    }, 450);
  };

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Top API Gateway KPI Metrics Grid */}
      <GatewayKpiGrid stats={kpis} />

      {/* Sub-tab Navigation */}
      <GatewaySubNav
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
        routesCount={routes.length}
      />

      {/* Tab Panels */}
      {activeSubTab === "routes" && (
        <RouteRegistryWidget
          routes={routes}
          selectedRoute={selectedRoute}
          onSelectRoute={setSelectedRoute}
          onOpenTester={handleOpenInTester}
        />
      )}

      {activeSubTab === "ratelimit" && (
        <RateLimitManagerWidget tiers={rateTiers} />
      )}

      {activeSubTab === "upstream" && (
        <UpstreamMeshWidget
          upstreams={upstreams}
          onToggleCircuit={toggleCircuitBreaker}
        />
      )}

      {activeSubTab === "tester" && (
        <GatewayRequestTesterWidget
          method={testMethod}
          onMethodChange={setTestMethod}
          endpoint={testEndpoint}
          onEndpointChange={setTestEndpoint}
          authHeader={testAuthHeader}
          onAuthHeaderChange={setTestAuthHeader}
          payload={testPayload}
          onPayloadChange={setTestPayload}
          isTesting={isTesting}
          onRunTest={handleRunMockRequest}
          response={testResult}
        />
      )}
    </div>
  );
}
