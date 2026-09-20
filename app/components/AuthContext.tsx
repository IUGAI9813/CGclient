"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { RbacRole, useRbac } from "./RbacContext";

export interface SocUser {
  id: string;
  email: string;
  name: string;
  role: RbacRole;
  department: string;
  status: "ACTIVE" | "LOCKED";
  lastLoginAt: string;
  createdAt: string;
}

export interface PendingApproval {
  id: string;
  email: string;
  name: string;
  department: string;
  requestedRole: RbacRole;
  reason: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const defaultUsers: SocUser[] = [
  {
    id: "usr-cg-001",
    email: "admin@coreguard.io",
    name: "Alex S. (Lead Admin)",
    role: "admin",
    department: "SOC Cyber Defense & Safety Operations",
    status: "ACTIVE",
    lastLoginAt: "Just now",
    createdAt: "2026-01-10"
  },
  {
    id: "usr-cg-014",
    email: "sarah.k@coreguard.io",
    name: "Sarah Kim",
    role: "dispatcher",
    department: "Gangnam Fleet Dispatch Center",
    status: "ACTIVE",
    lastLoginAt: "18 min ago",
    createdAt: "2026-02-04"
  },
  {
    id: "usr-cg-029",
    email: "minjun.p@coreguard.io",
    name: "Min-Jun Park",
    role: "analyst",
    department: "Threat Intelligence & Anomaly Response",
    status: "ACTIVE",
    lastLoginAt: "1 hour ago",
    createdAt: "2026-03-12"
  },
  {
    id: "usr-cg-077",
    email: "david.c@coreguard.io",
    name: "David Cho",
    role: "technician",
    department: "Hangar Service Depot (Pangyo)",
    status: "ACTIVE",
    lastLoginAt: "3 hours ago",
    createdAt: "2026-04-20"
  }
];

const defaultPending: PendingApproval[] = [
  {
    id: "req-2026-091",
    email: "hyejin.lee@coreguard.io",
    name: "Hye-Jin Lee",
    department: "Autonomous Mobility Operations",
    requestedRole: "dispatcher",
    reason: "Assigned to night-shift emergency dispatch on Gangnam Robotaxi Zone A & B.",
    submittedAt: "14 min ago",
    status: "PENDING"
  },
  {
    id: "req-2026-088",
    email: "m.vance@infosec-audit.kr",
    name: "Marcus Vance",
    department: "Third-Party Automotive Red Team",
    requestedRole: "analyst",
    reason: "ISO/SAE 21434 compliance validation and OB-CAN diagnostic stream review.",
    submittedAt: "52 min ago",
    status: "PENDING"
  }
];

export interface AuthContextType {
  currentUser: SocUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  users: SocUser[];
  pendingApprovals: PendingApproval[];
  login: (email: string, role?: RbacRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  requestAccess: (data: {
    name: string;
    email: string;
    department: string;
    requestedRole: RbacRole;
    reason: string;
  }) => Promise<{ success: boolean; error?: string }>;
  approveUser: (id: string, assignedRole?: RbacRole) => void;
  rejectUser: (id: string, reason?: string) => void;
  addUserDirectly: (user: Omit<SocUser, "id" | "lastLoginAt" | "createdAt">) => void;
  toggleUserLock: (id: string) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setCurrentRole } = useRbac();
  const [currentUser, setCurrentUser] = useState<SocUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<SocUser[]>(defaultUsers);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(defaultPending);

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem("cg_auth_user");
      const savedUsers = localStorage.getItem("cg_auth_users_list");
      const savedPending = localStorage.getItem("cg_auth_pending_list");

      if (savedUsers) {
        try {
          setUsers(JSON.parse(savedUsers));
        } catch {}
      }
      if (savedPending) {
        try {
          setPendingApprovals(JSON.parse(savedPending));
        } catch {}
      }
      if (savedAuth) {
        try {
          const user = JSON.parse(savedAuth) as SocUser;
          if (user && user.id) {
            setCurrentUser(user);
            setIsAuthenticated(true);
            setCurrentRole(user.role);
          }
        } catch {}
      }
    } catch {
      // Ignore parse errors, keep initial defaults
    } finally {
      setIsAuthLoading(false);
    }
  }, [setCurrentRole]);

  const login = async (email: string, roleOverride?: RbacRole): Promise<{ success: boolean; error?: string }> => {
    // Check if user is in active users list
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser) {
      if (foundUser.status === "LOCKED") {
        return {
          success: false,
          error: "해당 계정은 보안 규정 위반 또는 관리자 조치로 인해 잠겨 있습니다 (ACCOUNT_LOCKED)."
        };
      }
      const updatedUser: SocUser = {
        ...foundUser,
        role: roleOverride || foundUser.role,
        lastLoginAt: "Just now"
      };
      setCurrentUser(updatedUser);
      setIsAuthenticated(true);
      setCurrentRole(updatedUser.role);
      localStorage.setItem("cg_auth_user", JSON.stringify(updatedUser));
      localStorage.setItem("coreguard_jwt_token", `cg_jwt_${updatedUser.id}_${Date.now()}`);
      return { success: true };
    }

    // Check if user is in pending approvals
    const isPending = pendingApprovals.find(
      (p) => p.email.toLowerCase() === email.toLowerCase() && p.status === "PENDING"
    );
    if (isPending) {
      return {
        success: false,
        error: "계정 가입 신청이 접수되었으나 현재 SOC 관리자의 승인 대기 중입니다 (STATUS: PENDING)."
      };
    }

    // If new test email not found, create demo session with requested role
    const demoUser: SocUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      email,
      name: email.split("@")[0],
      role: roleOverride || "dispatcher",
      department: "SOC Operations",
      status: "ACTIVE",
      lastLoginAt: "Just now",
      createdAt: new Date().toISOString().split("T")[0]
    };
    setCurrentUser(demoUser);
    setIsAuthenticated(true);
    setCurrentRole(demoUser.role);
    localStorage.setItem("cg_auth_user", JSON.stringify(demoUser));
    localStorage.setItem("coreguard_jwt_token", `cg_jwt_${demoUser.id}_${Date.now()}`);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("cg_auth_user");
    localStorage.removeItem("coreguard_jwt_token");
  };

  const requestAccess = async (data: {
    name: string;
    email: string;
    department: string;
    requestedRole: RbacRole;
    reason: string;
  }): Promise<{ success: boolean; error?: string }> => {
    // Check if already registered
    const exists = users.some((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      return { success: false, error: "이미 등록된 이메일 주소입니다. 로그인해 주십시오." };
    }

    const newPending: PendingApproval = {
      id: `req-${Date.now()}`,
      ...data,
      submittedAt: "Just now",
      status: "PENDING"
    };

    const updated = [newPending, ...pendingApprovals];
    setPendingApprovals(updated);
    localStorage.setItem("cg_auth_pending_list", JSON.stringify(updated));
    return { success: true };
  };

  const approveUser = (id: string, assignedRole?: RbacRole) => {
    const target = pendingApprovals.find((p) => p.id === id);
    if (!target) return;

    const newUser: SocUser = {
      id: `usr-soc-${Date.now().toString().slice(-4)}`,
      email: target.email,
      name: target.name,
      role: assignedRole || target.requestedRole,
      department: target.department,
      status: "ACTIVE",
      lastLoginAt: "Never",
      createdAt: new Date().toISOString().split("T")[0]
    };

    const updatedUsers = [newUser, ...users];
    const updatedPending = pendingApprovals.filter((p) => p.id !== id);

    setUsers(updatedUsers);
    setPendingApprovals(updatedPending);
    localStorage.setItem("cg_auth_users_list", JSON.stringify(updatedUsers));
    localStorage.setItem("cg_auth_pending_list", JSON.stringify(updatedPending));
  };

  const rejectUser = (id: string) => {
    const updatedPending = pendingApprovals.filter((p) => p.id !== id);
    setPendingApprovals(updatedPending);
    localStorage.setItem("cg_auth_pending_list", JSON.stringify(updatedPending));
  };

  const addUserDirectly = (userData: Omit<SocUser, "id" | "lastLoginAt" | "createdAt">) => {
    const newUser: SocUser = {
      ...userData,
      id: `usr-man-${Date.now().toString().slice(-4)}`,
      lastLoginAt: "Never",
      createdAt: new Date().toISOString().split("T")[0]
    };

    const updated = [newUser, ...users];
    setUsers(updated);
    localStorage.setItem("cg_auth_users_list", JSON.stringify(updated));
  };

  const toggleUserLock = (id: string) => {
    const updated = users.map((u) => {
      if (u.id === id) {
        return {
          ...u,
          status: u.status === "ACTIVE" ? ("LOCKED" as const) : ("ACTIVE" as const)
        };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem("cg_auth_users_list", JSON.stringify(updated));
  };

  const deleteUser = (id: string) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    localStorage.setItem("cg_auth_users_list", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAuthLoading,
        users,
        pendingApprovals,
        login,
        logout,
        requestAccess,
        approveUser,
        rejectUser,
        addUserDirectly,
        toggleUserLock,
        deleteUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
