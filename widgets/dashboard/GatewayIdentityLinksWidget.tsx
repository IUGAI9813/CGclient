import React from "react";
import { Network, KeyRound, ArrowUpRight } from "lucide-react";

interface GatewayIdentityLinksWidgetProps {
  onNavigateToTab: (tab: string) => void;
}

export function GatewayIdentityLinksWidget({ onNavigateToTab }: GatewayIdentityLinksWidgetProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
      {/* Tyk Ingress Control Plane */}
      <div
        onClick={() => onNavigateToTab("gateway")}
        className="cyber-panel p-3.5 rounded cursor-pointer hover:border-brand-cyan/60 transition-all flex items-center justify-between bg-[var(--panel-bg)] group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[var(--panel-header-bg)] border border-panel-border text-brand-cyan group-hover:border-brand-cyan">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">
              Tyk Ingress Control Plane
            </span>
            <div className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2 mt-0.5">
              <span>3,420 req/s Ingress</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30">
                SLA 99.995%
              </span>
            </div>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-brand-cyan transition-colors" />
      </div>

      {/* OIDC / PKI Identity State */}
      <div
        onClick={() => onNavigateToTab("iam")}
        className="cyber-panel p-3.5 rounded cursor-pointer hover:border-brand-cyan/60 transition-all flex items-center justify-between bg-[var(--panel-bg)] group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[var(--panel-header-bg)] border border-panel-border text-brand-emerald group-hover:border-brand-emerald">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">
              OIDC / PKI Identity State
            </span>
            <div className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2 mt-0.5">
              <span>148 Vehicles mTLS Active</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
                RS256 KMS Validated
              </span>
            </div>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-brand-emerald transition-colors" />
      </div>
    </div>
  );
}
