export type SensorHealthState = "SECURE" | "DEGRADED" | "OFFLINE";

export interface FleetVehicle {
  id: string;
  type: string;
  status: string;
  battery: number;
  speed: number;
  lidar: string;
  radar: string;
  camera: string;
  ota: string;
  location: string;
  speedLimit: number;
}
