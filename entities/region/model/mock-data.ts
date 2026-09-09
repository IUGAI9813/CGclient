import { AdminRegion } from "./types";

export const defaultAdminRegions: AdminRegion[] = [
  // ==========================================
  // 서울특별시 (Seoul Special City)
  // ==========================================
  {
    regionCode: "1168000000",
    cityName: "서울특별시",
    districtName: "강남구",
    subDistrictName: "역삼/삼성/논현/대치",
    boundaryPolygon: [
      { x: 140, y: 150 },
      { x: 280, y: 150 },
      { x: 280, y: 300 },
      { x: 140, y: 300 },
    ],
    center: { x: 210, y: 225 },
    isActive: true,
  },
  {
    regionCode: "1165000000",
    cityName: "서울특별시",
    districtName: "서초구",
    subDistrictName: "서초/반포/양재",
    boundaryPolygon: [
      { x: 20, y: 150 },
      { x: 140, y: 150 },
      { x: 140, y: 300 },
      { x: 20, y: 300 },
    ],
    center: { x: 80, y: 225 },
    isActive: true,
  },
  {
    regionCode: "1171000000",
    cityName: "서울특별시",
    districtName: "송파구",
    subDistrictName: "잠실/가락/문정",
    boundaryPolygon: [
      { x: 280, y: 150 },
      { x: 420, y: 150 },
      { x: 420, y: 300 },
      { x: 280, y: 300 },
    ],
    center: { x: 350, y: 225 },
    isActive: true,
  },
  {
    regionCode: "1117000000",
    cityName: "서울특별시",
    districtName: "용산구",
    subDistrictName: "이태원/한남/이촌",
    boundaryPolygon: [
      { x: 140, y: 30 },
      { x: 280, y: 30 },
      { x: 280, y: 140 },
      { x: 140, y: 140 },
    ],
    center: { x: 210, y: 85 },
    isActive: true,
  },
  {
    regionCode: "1144000000",
    cityName: "서울특별시",
    districtName: "마포구",
    subDistrictName: "상암/합정/공덕",
    boundaryPolygon: [
      { x: 20, y: 30 },
      { x: 140, y: 30 },
      { x: 140, y: 140 },
      { x: 20, y: 140 },
    ],
    center: { x: 80, y: 85 },
    isActive: true,
  },
  {
    regionCode: "1120000000",
    cityName: "서울특별시",
    districtName: "성동구",
    subDistrictName: "성수/왕십리/옥수",
    boundaryPolygon: [
      { x: 280, y: 30 },
      { x: 420, y: 30 },
      { x: 420, y: 140 },
      { x: 280, y: 140 },
    ],
    center: { x: 350, y: 85 },
    isActive: true,
  },
  {
    regionCode: "1156000000",
    cityName: "서울특별시",
    districtName: "영등포구",
    subDistrictName: "여의도/당산/문래",
    boundaryPolygon: [
      { x: 20, y: 140 },
      { x: 120, y: 140 },
      { x: 120, y: 220 },
      { x: 20, y: 220 },
    ],
    center: { x: 70, y: 180 },
    isActive: true,
  },

  // ==========================================
  // 경기도 (Gyeonggi-do Autonomous Testing Hubs)
  // ==========================================
  {
    regionCode: "4113500000",
    cityName: "경기도",
    districtName: "성남시 분당구 (판교)",
    subDistrictName: "판교테크노밸리/백현/삼평",
    boundaryPolygon: [
      { x: 320, y: 140 },
      { x: 480, y: 140 },
      { x: 480, y: 260 },
      { x: 320, y: 260 },
    ],
    center: { x: 400, y: 200 },
    isActive: true,
  },
  {
    regionCode: "4111000000",
    cityName: "경기도",
    districtName: "수원시 영통구",
    subDistrictName: "광교/영통/매탄",
    boundaryPolygon: [
      { x: 320, y: 260 },
      { x: 480, y: 260 },
      { x: 480, y: 340 },
      { x: 320, y: 340 },
    ],
    center: { x: 400, y: 300 },
    isActive: true,
  },
];
