import { Policy, PolicyFleetVehicle } from "./types";

export const defaultPolicyFleetVehicles: PolicyFleetVehicle[] = [
  { id: "VEH-42-012", type: "Robotaxi", location: "Gangnam 3rd Ave", district: "강남구", districtCode: "1168000000" },
  { id: "VEH-42-089", type: "Shuttle", location: "Hangar Standby", district: "용산구", districtCode: "1117000000" },
  { id: "VEH-42-005", type: "Robotaxi", location: "Gangnam Station", district: "강남구", districtCode: "1168000000" },
  { id: "VEH-42-104", type: "Delivery Pod", location: "Teheran-ro Street", district: "강남구", districtCode: "1168000000" },
  { id: "VEH-42-067", type: "Robotaxi", location: "Pangyo Blvd", district: "성남시 분당구 (판교)", districtCode: "4113500000" },
  { id: "VEH-42-132", type: "Shuttle", location: "Yeoksam Subway", district: "강남구", districtCode: "1168000000" },
  { id: "VEH-42-111", type: "Robotaxi", location: "Samseong Center", district: "송파구", districtCode: "1171000000" },
  { id: "VEH-42-150", type: "Delivery Pod", location: "Pangyo Valley Depot", district: "성남시 분당구 (판교)", districtCode: "4113500000" },
];

export const defaultPolicies: Policy[] = [
  {
    id: "pol-1",
    name: "강남구 테헤란로 배송 안전 구역",
    cityName: "서울특별시",
    districtCodes: ["1168000000"],
    districtNames: ["강남구"],
    action: "ACT_RAISE_INCIDENT",
    priority: 10,
    startTime: "08:00",
    endTime: "20:00",
    vehicles: ["VEH-42-104", "VEH-42-012"],
    status: "ACTIVE",
    violationsCount: 3
  },
  {
    id: "pol-2",
    name: "강남/서초 광역 순찰 및 비상 제어 구역",
    cityName: "서울특별시",
    districtCodes: ["1168000000", "1165000000"],
    districtNames: ["강남구", "서초구"],
    action: "ACT_LIMIT_SPEED",
    priority: 20,
    startTime: null,
    endTime: null,
    vehicles: ["VEH-42-005", "VEH-42-132", "VEH-42-067"],
    status: "ACTIVE",
    violationsCount: 0
  },
  {
    id: "pol-3",
    name: "판교 테크노밸리 자율주행 특구",
    cityName: "경기도",
    districtCodes: ["4113500000"],
    districtNames: ["성남시 분당구 (판교)"],
    action: "ACT_WARN_DRIVER",
    priority: 15,
    startTime: null,
    endTime: null,
    vehicles: ["VEH-42-067", "VEH-42-150"],
    status: "ACTIVE",
    violationsCount: 1
  }
];
