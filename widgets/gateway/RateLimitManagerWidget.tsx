import React from "react";
import { RateLimitTier } from "@/entities/gateway/model/types";
import { TierCard } from "@/entities/gateway/ui/TierCard";

interface RateLimitManagerWidgetProps {
  tiers: RateLimitTier[];
}

export const RateLimitManagerWidget: React.FC<RateLimitManagerWidgetProps> = ({ tiers }) => {
  return (
    <div className="space-y-6">
      <div className="cyber-panel p-4 rounded space-y-4">
        <div className="flex justify-between items-center border-b border-panel-border pb-3">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Traffic Governance</span>
            <h2 className="text-sm font-bold text-white mt-1">Client Tier Rate Limiting & Quota Allocations</h2>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded">
            REDIS TOKEN BUCKET ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
        </div>
      </div>
    </div>
  );
};
