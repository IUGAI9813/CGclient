import React from "react";
import { Code } from "lucide-react";
import { GatewayTestResponse } from "@/entities/gateway/model/types";

interface ResponseViewerProps {
  response: GatewayTestResponse | null;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({ response }) => {
  return (
    <div className="cyber-panel p-4 rounded space-y-4">
      <div className="border-b border-panel-border pb-3 flex justify-between items-center">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Live Gateway Output</span>
          <h2 className="text-sm font-bold text-white mt-1">Response Headers & Payload</h2>
        </div>
        {response && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
              response.status === 200
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                : "text-rose-400 bg-rose-500/10 border-rose-500/30"
            }`}
          >
            HTTP {response.status} {response.statusText} ({response.latency})
          </span>
        )}
      </div>

      {response ? (
        <div className="space-y-3 text-xs">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block font-bold">
              Response Headers (Gateway + Upstream)
            </span>
            <div className="tester-headers-list mt-1 space-y-0.5">
              {Object.entries(response.headers).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-zinc-500">{k}:</span>
                  <span className="text-zinc-200">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-zinc-500 uppercase block font-bold">Response Body</span>
            <pre className="tester-code-box mt-1 text-cyan-400">
              {response.body}
            </pre>
          </div>
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-zinc-600 text-xs space-y-2">
          <Code className="w-8 h-8 text-zinc-700" />
          <span>Click &quot;Send Gateway Request&quot; to test proxy routing & response latency.</span>
        </div>
      )}
    </div>
  );
};
