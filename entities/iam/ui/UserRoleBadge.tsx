import React from "react";
import { RbacRole } from "@/app/components/RbacContext";

interface UserRoleBadgeProps {
  role: RbacRole;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const getBadgeStyle = () => {
    switch (role) {
      case "admin":
        return "border-rose-500/40 bg-rose-500/10 text-rose-400";
      case "dispatcher":
        return "border-cyan-500/40 bg-cyan-500/10 text-cyan-400";
      case "analyst":
        return "border-amber-500/40 bg-amber-500/10 text-amber-400";
      default:
        return "border-purple-500/40 bg-purple-500/10 text-purple-400";
    }
  };

  return (
    <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${getBadgeStyle()}`}>
      {role.toUpperCase()}
    </span>
  );
}
