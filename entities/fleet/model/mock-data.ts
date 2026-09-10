import { FleetVehicle } from "./types";

export const defaultFleetList: FleetVehicle[] = [
  {
    id: "VEH-42-012",
    type: "Robotaxi",
    status: "warning",
    battery: 74,
    speed: 42,
    lidar: "DEGRADED",
    radar: "SECURE",
    camera: "SECURE",
    ota: "v2.4.1",
    location: "Gangnam 3rd Ave",
    speedLimit: 60
  },
  {
    id: "VEH-42-089",
    type: "Shuttle",
    status: "critical",
    battery: 18,
    speed: 0,
    lidar: "OFFLINE",
    radar: "DEGRADED",
    camera: "OFFLINE",
    ota: "v2.3.9",
    location: "Hangar Standby",
    speedLimit: 40
  },
  {
    id: "VEH-42-005",
    type: "Robotaxi",
    status: "secure",
    battery: 92,
    speed: 55,
    lidar: "SECURE",
    radar: "SECURE",
    camera: "SECURE",
    ota: "v2.4.1",
    location: "Gangnam Station",
    speedLimit: 80
  },
  {
    id: "VEH-42-104",
    type: "Delivery Pod",
    status: "secure",
    battery: 85,
    speed: 12,
    lidar: "SECURE",
    radar: "SECURE",
    camera: "SECURE",
    ota: "v2.4.1",
    location: "Teheran-ro Street",
    speedLimit: 30
  },
  {
    id: "VEH-42-067",
    type: "Robotaxi",
    status: "secure",
    battery: 59,
    speed: 48,
    lidar: "SECURE",
    radar: "SECURE",
    camera: "SECURE",
    ota: "v2.4.1",
    location: "Pangyo Blvd",
    speedLimit: 60
  },
  {
    id: "VEH-42-132",
    type: "Shuttle",
    status: "secure",
    battery: 64,
    speed: 38,
    lidar: "SECURE",
    radar: "SECURE",
    camera: "SECURE",
    ota: "v2.4.0",
    location: "Yeoksam Subway",
    speedLimit: 50
  },
  {
    id: "VEH-42-111",
    type: "Robotaxi",
    status: "secure",
    battery: 41,
    speed: 45,
    lidar: "SECURE",
    radar: "SECURE",
    camera: "SECURE",
    ota: "v2.4.1",
    location: "Samseong Center",
    speedLimit: 70
  },
  {
    id: "VEH-42-150",
    type: "Delivery Pod",
    status: "secure",
    battery: 89,
    speed: 14,
    lidar: "SECURE",
    radar: "SECURE",
    camera: "SECURE",
    ota: "v2.4.1",
    location: "Pangyo Valley Depot",
    speedLimit: 30
  }
];

export const getLocationLabel = (loc: string, language: string) => {
  if (language !== "ko") return loc;
  switch (loc) {
    case "Gangnam Station":
      return "강남역 (Zone A)";
    case "Gangnam 3rd Ave":
      return "강남 3대로 (Zone B)";
    case "Teheran-ro Street":
      return "테헤란로 (Zone C)";
    case "Yeoksam Subway":
      return "역삼역 (Zone D)";
    case "Samseong Center":
      return "삼성 센터 (Zone E)";
    case "Pangyo Blvd":
      return "판교대로 (판교 지역)";
    case "Pangyo Valley Depot":
      return "판교 밸리 기지 (정비고)";
    case "Hangar Standby":
      return "정비고 대기 (유지보수)";
    default:
      return loc;
  }
};

export const getTypeLabel = (type: string, language: string) => {
  if (language !== "ko") return type;
  if (type === "Robotaxi") return "로보택시";
  if (type === "Shuttle") return "셔틀";
  if (type === "Delivery Pod") return "배달 포드";
  return type;
};
