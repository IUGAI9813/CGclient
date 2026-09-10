import React from "react";
import { Plus } from "lucide-react";
import { OAuthClient } from "@/entities/iam/model/types";

interface ClientAppsWidgetProps {
  clients: OAuthClient[];
  onRegisterClientClick?: () => void;
}

export function ClientAppsWidget({ clients, onRegisterClientClick }: ClientAppsWidgetProps) {
  const handleRegister = () => {
    if (onRegisterClientClick) {
      onRegisterClientClick();
    } else {
      alert("New OAuth client creation modal: Redirects to 42dot Developer Identity Portal.");
    }
  };

  return (
    <div className="cyber-panel p-4 rounded space-y-4">
      <div className="flex justify-between items-center border-b border-panel-border pb-3">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
            Registered OAuth 2.0 Clients
          </span>
          <h2 className="text-sm font-bold text-white mt-1">Machine &amp; Operator Ingress Clients</h2>
        </div>
        <button
          onClick={handleRegister}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-cyan hover:bg-brand-cyan/85 text-black rounded text-[10px] font-bold uppercase transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3px]" />
          <span>Register New Client</span>
        </button>
      </div>

      <div className="space-y-3">
        {clients.map((client) => (
          <div key={client.id} className="p-4 bg-zinc-900/40 border border-panel-border rounded space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xs font-bold text-white">{client.name}</h3>
                <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                  Client ID: {client.clientId}
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-brand-emerald/30 bg-brand-emerald/10 text-brand-emerald">
                {client.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase">Allowed Grant Types:</span>
                <div className="flex flex-wrap gap-1.5">
                  {client.grantTypes.map((gt) => (
                    <span key={gt} className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300">
                      {gt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase">Authorized Scopes:</span>
                <div className="flex flex-wrap gap-1.5">
                  {client.scopes.map((scope) => (
                    <span
                      key={scope}
                      className="px-2 py-0.5 rounded bg-zinc-950 border border-panel-border text-[10px] text-brand-cyan font-bold"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 border-t border-panel-border/50 pt-2 flex justify-between">
              <span>
                Enforcement: <strong className="text-zinc-400">{client.authFlow}</strong>
              </span>
              <span className="text-brand-cyan hover:underline cursor-pointer">Rotate Client Secret</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
