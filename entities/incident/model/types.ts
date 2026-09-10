export type IncidentSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
export type IncidentStatus = "ACTIVE" | "TRIAGED" | "RESOLVED";

export interface Incident {
  id: string;
  vehicleId: string;
  type: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  timestamp: string;
  description: string;
}

export interface CanBusDumpFrame {
  id: string;
  dlc: number;
  data: string;
  desc: string;
  suspect?: boolean;
}

export interface IncidentNote {
  operator: string;
  text: string;
  time: string;
}
