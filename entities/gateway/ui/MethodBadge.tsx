import React from "react";
import { HttpMethod } from "../model/types";

interface MethodBadgeProps {
  method: HttpMethod;
  className?: string;
}

export const MethodBadge: React.FC<MethodBadgeProps> = ({ method, className = "" }) => {
  const methodClassMap: Record<HttpMethod, string> = {
    GET: "method-badge-get",
    POST: "method-badge-post",
    PUT: "method-badge-put",
    DELETE: "method-badge-delete",
    gRPC: "method-badge-grpc",
  };

  const badgeClass = methodClassMap[method] || "text-zinc-400 bg-zinc-800 border-zinc-700";

  return (
    <span className={`method-badge ${badgeClass} ${className}`}>
      {method}
    </span>
  );
};
