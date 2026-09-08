import React from "react";
import { Shield, CheckCircle2, Play } from "lucide-react";
import { RouteDefinition } from "@/entities/gateway/model/types";
import { MethodBadge } from "@/entities/gateway/ui/MethodBadge";

interface EndpointInspectorProps {
  route: RouteDefinition | null;
  onOpenTester: (route: RouteDefinition) => void;
}

export const EndpointInspector: React.FC<EndpointInspectorProps> = ({ route, onOpenTester }) => {
  if (!route) {
    return (
      <div className="cyber-panel p-6 rounded text-center text-zinc-500 text-xs">
        Select an endpoint to inspect its routing parameters & middleware stack.
      </div>
    );
  }

  return (
    <div className="cyber-panel endpoint-inspector-card space-y-4">
      <div className="border-b border-panel-border pb-3 flex justify-between items-start">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Endpoint Inspector</span>
          <h3 className="text-xs font-bold text-white mt-1 break-all">{route.path}</h3>
        </div>
        <MethodBadge method={route.method} />
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase block font-bold">Upstream Target Service (k8s)</span>
          <div className="mt-1 p-2 bg-zinc-950 border border-panel-border rounded text-zinc-300 font-mono break-all">
            {route.upstream}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-zinc-500 uppercase block font-bold">Authentication Mechanism</span>
          <div className="mt-1 flex items-center justify-between p-2 bg-zinc-950 border border-panel-border rounded">
            <span className="text-white font-bold">{route.authType}</span>
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        </div>

        <div>
          <span className="text-[10px] text-zinc-500 uppercase block font-bold">
            Active Middleware Chain ({route.middleware.length})
          </span>
          <div className="mt-1 space-y-1">
            {route.middleware.map((mw, idx) => (
              <div key={idx} className="middleware-chain-row">
                <span className="flex items-center gap-1.5">
                  <span className="text-[9px] text-cyan-400 font-bold">{idx + 1}.</span>
                  {mw}
                </span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-panel-border">
          <button
            onClick={() => onOpenTester(route)}
            className="w-full py-2 bg-brand-cyan/20 border border-brand-cyan hover:bg-brand-cyan/30 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            Test in Sandbox
          </button>
        </div>
      </div>
    </div>
  );
};
