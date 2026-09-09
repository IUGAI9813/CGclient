"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type RbacRole = "admin" | "dispatcher" | "analyst" | "technician";

export type NavTabId =
  | "dashboard"
  | "gateway"
  | "iam"
  | "incidents"
  | "thresholds"
  | "policies"
  | "fleet"
  | "audit"
  | "settings";

export type RbacAction = "emergencyStop" | "forceOta" | "editPolicy" | "viewRawCan";

export const allNavTabIds: NavTabId[] = [
  "dashboard",
  "gateway",
  "iam",
  "incidents",
  "thresholds",
  "policies",
  "fleet",
  "audit",
  "settings"
];

export const allRbacActions: RbacAction[] = [
  "emergencyStop",
  "forceOta",
  "editPolicy",
  "viewRawCan"
];

const defaultPagePermissions: Record<RbacRole, Record<NavTabId, boolean>> = {
  admin: {
    dashboard: true,
    gateway: true,
    iam: true,
    incidents: true,
    thresholds: true,
    policies: true,
    fleet: true,
    audit: true,
    settings: true
  },
  dispatcher: {
    dashboard: true,
    gateway: false,
    iam: false,
    incidents: true,
    thresholds: false,
    policies: true,
    fleet: true,
    audit: true,
    settings: false
  },
  analyst: {
    dashboard: true,
    gateway: true,
    iam: false,
    incidents: true,
    thresholds: true,
    policies: true,
    fleet: true,
    audit: true,
    settings: false
  },
  technician: {
    dashboard: true,
    gateway: false,
    iam: false,
    incidents: false,
    thresholds: false,
    policies: false,
    fleet: true,
    audit: true,
    settings: false
  }
};

const defaultActionPermissions: Record<RbacRole, Record<RbacAction, boolean>> = {
  admin: { emergencyStop: true, forceOta: true, editPolicy: true, viewRawCan: true },
  dispatcher: { emergencyStop: true, forceOta: false, editPolicy: false, viewRawCan: true },
  analyst: { emergencyStop: false, forceOta: false, editPolicy: false, viewRawCan: true },
  technician: { emergencyStop: false, forceOta: true, editPolicy: false, viewRawCan: false }
};

export interface RbacContextType {
  currentRole: RbacRole;
  setCurrentRole: (role: RbacRole) => void;
  pagePermissions: Record<RbacRole, Record<NavTabId, boolean>>;
  actionPermissions: Record<RbacRole, Record<RbacAction, boolean>>;
  canAccessTab: (tabId: string, role?: RbacRole) => boolean;
  canPerformAction: (action: RbacAction, role?: RbacRole) => boolean;
  togglePagePermission: (role: RbacRole, tabId: NavTabId) => void;
  toggleActionPermission: (role: RbacRole, action: RbacAction) => void;
}

const RbacContext = createContext<RbacContextType | undefined>(undefined);

export function RbacProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRoleState] = useState<RbacRole>("admin");
  const [pagePermissions, setPagePermissions] = useState<Record<RbacRole, Record<NavTabId, boolean>>>(defaultPagePermissions);
  const [actionPermissions, setActionPermissions] = useState<Record<RbacRole, Record<RbacAction, boolean>>>(defaultActionPermissions);

  useEffect(() => {
    const saved = localStorage.getItem("cg_active_role") as RbacRole | null;
    if (saved && ["admin", "dispatcher", "analyst", "technician"].includes(saved)) {
      queueMicrotask(() => {
        setCurrentRoleState(saved);
      });
    }
  }, []);

  const setCurrentRole = (role: RbacRole) => {
    setCurrentRoleState(role);
    localStorage.setItem("cg_active_role", role);
  };

  const canAccessTab = (tabId: string, role?: RbacRole): boolean => {
    const targetRole = role || currentRole;
    return !!pagePermissions[targetRole]?.[tabId as NavTabId];
  };

  const canPerformAction = (action: RbacAction, role?: RbacRole): boolean => {
    const targetRole = role || currentRole;
    return !!actionPermissions[targetRole]?.[action];
  };

  const togglePagePermission = (role: RbacRole, tabId: NavTabId) => {
    setPagePermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [tabId]: !prev[role][tabId]
      }
    }));
  };

  const toggleActionPermission = (role: RbacRole, action: RbacAction) => {
    setActionPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [action]: !prev[role][action]
      }
    }));
  };

  return (
    <RbacContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        pagePermissions,
        actionPermissions,
        canAccessTab,
        canPerformAction,
        togglePagePermission,
        toggleActionPermission
      }}
    >
      {children}
    </RbacContext.Provider>
  );
}

export function useRbac(): RbacContextType {
  const context = useContext(RbacContext);
  if (!context) {
    throw new Error("useRbac must be used within an RbacProvider");
  }
  return context;
}
