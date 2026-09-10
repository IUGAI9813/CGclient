import { RbacRole } from "@/app/components/RbacContext";

export type IamSubTab = "users" | "jwt" | "clients" | "mtls";

export interface OAuthClient {
  id: string;
  name: string;
  clientId: string;
  grantTypes: string[];
  scopes: string[];
  authFlow: string;
  status: "ACTIVE" | "INACTIVE" | "REVOKED";
}

export interface MtlsCert {
  id: string;
  vehicleId: string;
  subject: string;
  issuer: string;
  fingerprint: string;
  validTo: string;
  status: "VALID" | "EXPIRING_SOON" | "REVOKED";
}

export interface JwtProfileTokens {
  dispatcher: string;
  vehicle_device: string;
}
