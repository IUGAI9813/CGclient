export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "gRPC";

export type AuthMechanism = "OIDC_JWT" | "mTLS" | "API_KEY" | "PUBLIC";

export type RouteStatus = "ACTIVE" | "DEGRADED" | "MAINTENANCE";

export type RouteCategory = "ALL" | "Telemetry" | "Fleet Control" | "OTA" | "IAM" | "Partner";

export interface RouteDefinition {
  id: string;
  path: string;
  method: HttpMethod;
  upstream: string;
  authType: AuthMechanism;
  rateLimit: number; // RPM
  status: RouteStatus;
  category: "Telemetry" | "Fleet Control" | "OTA" | "IAM" | "Partner";
  middleware: string[];
}

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface UpstreamService {
  id: string;
  name: string;
  k8sService: string;
  pods: number;
  latencyP95: string;
  errorRate: string;
  circuitState: CircuitState;
  health: number;
}

export interface RateLimitTier {
  id: string;
  name: string;
  limitRpm: number;
  burst: number;
  algorithm: string;
  activeClients: number;
}

export interface GatewayKpiStats {
  engineName: string;
  podsCount: string;
  ingressRps: number;
  p99Latency: string;
  errorRate: number;
  errorBreakdown: string;
  slaPercent: number;
  monthlyBudgetRemaining: string;
}

export interface GatewayTestResponse {
  status: number;
  statusText: string;
  latency: string;
  headers: Record<string, string>;
  body: string;
}
