export type ThresholdScope = "GLOBAL" | "VEHICLE_TYPE" | "POLICY";

export type VehicleType = "ROBOTAXI" | "SHUTTLE" | "DELIVERY";

export type TemporalStatus = "CURRENT" | "FUTURE" | "HISTORICAL";

export interface ThresholdRule {
  id: string;
  name: string;
  description: string;
  scope: ThresholdScope;
  targetId: string; // "GLOBAL", "ROBOTAXI", "SHUTTLE", "DELIVERY", or policy ID "pol-1"
  targetName: string;
  
  // Temporal timeline state (Current active vs Future scheduled vs Historical archive)
  temporalStatus: TemporalStatus;
  version?: string; // e.g. "v2.1", "v1.0"
  effectiveDate?: string; // e.g. "2026-09-09"
  changeReason?: string; // e.g. "Monsoon weather sensor calibration"
  
  // Metric thresholds: Warning & Critical levels
  batteryWarn: number; // %
  batteryCrit: number; // %
  
  latencyWarn: number; // ms (RTT)
  latencyCrit: number; // ms (RTT)
  
  lidarPpsWarn: number; // k points/s
  lidarPpsCrit: number; // k points/s
  
  speedWarn: number; // km/h
  speedCrit: number; // km/h
  
  canErrorWarn: number; // frame error rate/s
  canErrorCrit: number; // frame error rate/s
  
  // Timeframe scheduling (corresponds to DB columns START_TIME, END_TIME)
  startTime: string | null;
  endTime: string | null;
  isActive: boolean;
  
  updatedBy: string;
  updatedAt: string;
}

export interface MetricDefinition {
  key: "battery" | "latency" | "lidar" | "speed" | "canError";
  name: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  warnKey: keyof ThresholdRule;
  critKey: keyof ThresholdRule;
  invertCrit: boolean; // if true, lower is more critical (like battery & lidar)
}
