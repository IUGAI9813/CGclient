import React from "react";
import { RateLimitTier } from "../model/types";

interface TierCardProps {
  tier: RateLimitTier;
}

export const TierCard: React.FC<TierCardProps> = ({ tier }) => {
  return (
    <div className="rate-tier-card">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xs font-bold text-white">{tier.name}</h3>
          <span className="text-[10px] text-zinc-500">{tier.algorithm}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-zinc-900 border border-panel-border text-zinc-400 rounded">
          {tier.activeClients} Active Nodes
        </span>
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-400">Rate Limit:</span>
          <span className="text-cyan-400 font-bold">{tier.limitRpm.toLocaleString()} req/min</span>
        </div>
        <div className="rate-tier-bar-track">
          <div className="rate-tier-bar-fill" style={{ width: "68%" }}></div>
        </div>

        <div className="flex justify-between text-[10px] text-zinc-500 pt-1">
          <span>Max Burst Quota: <strong className="text-zinc-300">{tier.burst} req</strong></span>
          <span>On 429: <strong className="text-zinc-300">Retry-After: 5s</strong></span>
        </div>
      </div>
    </div>
  );
};
