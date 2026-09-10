import { OAuthClient, MtlsCert, JwtProfileTokens } from "./types";

export const defaultSampleTokens: JwtProfileTokens = {
  dispatcher:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjQyZG90LWttcy1zb2MtYXV0aC0yMDI2In0.eyJpc3MiOiJodHRwczovL2F1dGguNDJkb3QuYWkvb2F1dGgvdjIiLCJzdWIiOiJvcGVyYXRvcl9hbGV4X3MiLCJhdWQiOlsiaHR0cHM6Ly9hcGkuNDJkb3QuYWkvdjEvZmxlZXQiLCJodHRwczovL2FwaS40MmRvdC5haS92MS90ZWxlbWV0cnkiXSwicm9sZXMiOlsiU09DX0FETUlOIiwiRElTUEFUQ0hFUiJdLCJ2ZWhpY2xlX3Njb3BlIjoiR0FOR05BTV9ESVNUUklDVF9BTEwiLCJzY29wZXMiOlsicmVhZDpmbGVldCIsIndyaXRlOmZsZWV0Iiwid3JpdGU6ZW1lcmdlbmN5X3N0b3AiLCJvdGE6ZGlzcGF0Y2giXSwiZXhwIjoxNzk4OTk0NDAwLCJpYXQiOjE3OTg5OTA4MDAsImp0aSI6ImE0MmY4Y2ItZTA5OS00MTNmLWEyMDItNDJkb3RhMTJhIn0.SIGNATURE_CRYPTOGRAPHICALLY_VERIFIED_BY_KMS",
  vehicle_device:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjQyZG90LWttcy1tdGxzLXZlaC0yMDI2In0.eyJpc3MiOiJodHRwczovL2F1dGguNDJkb3QuYWkvb2F1dGgvdjIvdGVsZW1ldHJ5Iiwic3ViIjoiVkVILTQyLTAxMiIsImF1ZCI6Imh0dHBzOi8vYXBpLjQyZG90LmFpL3YxL3RlbGVtZXRyeS9pbmdlc3QiLCJyb2xlcyI6WyJBVVRPTk9NT1VTX1ZFSElDTEUiXSwiY2FuX2J1c19tYXNrIjoiMHgwQTItMHhGRkYiLCJzY29wZXMiOlsiaW5nZXN0OnRlbGVtZXRyeSIsImNhbjpyYXdfc3RyZWFtIl0sImV4cCI6MTc5ODk5NDQwMCwiaWF0IjoxNzk4OTkwODAwfQ.SIGNATURE_CRYPTOGRAPHICALLY_VERIFIED_BY_KMS"
};

export const defaultOauthClients: OAuthClient[] = [
  {
    id: "client-soc-portal",
    name: "42dot Gangnam SOC Command Console",
    clientId: "42dot_client_soc_web_0991",
    grantTypes: ["authorization_code", "refresh_token"],
    scopes: ["read:fleet", "write:fleet", "write:emergency_stop", "ota:dispatch"],
    authFlow: "PKCE + OIDC standard",
    status: "ACTIVE"
  },
  {
    id: "client-vehicle-edge",
    name: "AV Telematics On-board Edge Gateway",
    clientId: "42dot_client_av_edge_node",
    grantTypes: ["client_credentials", "mTLS_cert_bind"],
    scopes: ["ingest:telemetry", "can:raw_stream"],
    authFlow: "mTLS + OAuth 2.0 Token Exchange",
    status: "ACTIVE"
  },
  {
    id: "client-city-v2x",
    name: "Seoul Metropolitan Smart City V2X Relay",
    clientId: "42dot_client_seoul_v2x_ext",
    grantTypes: ["client_credentials"],
    scopes: ["read:traffic_advisories", "ingest:signal_state"],
    authFlow: "Signed JWT Client Assertion",
    status: "ACTIVE"
  }
];

export const defaultMtlsCerts: MtlsCert[] = [
  {
    id: "cert-01",
    vehicleId: "VEH-42-012",
    subject: "CN=VEH-42-012.devices.42dot.ai, O=42dot Inc, OU=Autonomous SDV",
    issuer: "42dot Intermediate Fleet CA - G3",
    fingerprint: "SHA256: 4A:21:CB:8D:9E:2A:7F:34:B8:12:89:12:FA:11:09:A1",
    validTo: "2027-12-31",
    status: "VALID"
  },
  {
    id: "cert-02",
    vehicleId: "VEH-42-089",
    subject: "CN=VEH-42-089.devices.42dot.ai, O=42dot Inc, OU=Autonomous SDV",
    issuer: "42dot Intermediate Fleet CA - G3",
    fingerprint: "SHA256: 8D:3E:71:2C:A7:A0:22:F5:11:AA:BC:01:99:22:18:FE",
    validTo: "2026-11-15",
    status: "EXPIRING_SOON"
  },
  {
    id: "cert-03",
    vehicleId: "VEH-42-005",
    subject: "CN=VEH-42-005.devices.42dot.ai, O=42dot Inc, OU=Autonomous SDV",
    issuer: "42dot Intermediate Fleet CA - G3",
    fingerprint: "SHA256: 3B:C8:82:DA:EF:21:00:44:A1:02:88:FF:10:99:32:00",
    validTo: "2027-08-20",
    status: "VALID"
  },
  {
    id: "cert-04",
    vehicleId: "VEH-42-104 (Decommissioned)",
    subject: "CN=VEH-42-104.devices.42dot.ai, O=42dot Inc, OU=Autonomous SDV",
    issuer: "42dot Intermediate Fleet CA - G3",
    fingerprint: "SHA256: 1D:22:FA:45:E3:1A:78:B0:88:99:AA:01:11:22:33:44",
    validTo: "2026-04-10",
    status: "REVOKED"
  }
];
