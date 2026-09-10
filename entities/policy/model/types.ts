export type PolicyAction =
  | "ACT_RAISE_INCIDENT"
  | "ACT_FORCE_STOP"
  | "ACT_LIMIT_SPEED"
  | "ACT_WARN_DRIVER";

export type PolicyStatus = "ACTIVE" | "INACTIVE";

export interface Policy {
  id: string;
  name: string;
  cityName: string;
  districtCodes: string[];
  districtNames: string[];
  action: PolicyAction;
  priority: number;
  startTime: string | null;
  endTime: string | null;
  vehicles: string[];
  status: PolicyStatus;
  violationsCount: number;
}

export interface PolicyFleetVehicle {
  id: string;
  type: string;
  location: string;
  district: string;
  districtCode: string;
}
