export interface AdminRegion {
  regionCode: string; // e.g. "1168000000" (PK from TB_ADMIN_REGIONS)
  cityName: string; // e.g. "서울특별시", "경기도"
  districtName: string; // e.g. "강남구", "용산구", "서초구"
  subDistrictName?: string | null; // e.g. "역삼1동"
  boundaryPolygon: { x: number; y: number }[]; // Coordinates for SVG / KakaoMap polygon rendering
  center: { x: number; y: number }; // Center coordinate for labels / zooming
  isActive: boolean;
}
