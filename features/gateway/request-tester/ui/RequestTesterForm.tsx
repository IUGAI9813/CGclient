import React from "react";
import { Play, RefreshCw } from "lucide-react";
import { HttpMethod } from "@/entities/gateway/model/types";

interface RequestTesterFormProps {
  method: HttpMethod;
  onMethodChange: (method: HttpMethod) => void;
  endpoint: string;
  onEndpointChange: (endpoint: string) => void;
  authHeader: string;
  onAuthHeaderChange: (header: string) => void;
  payload: string;
  onPayloadChange: (payload: string) => void;
  isTesting: boolean;
  onSubmit: () => void;
}

export const RequestTesterForm: React.FC<RequestTesterFormProps> = ({
  method,
  onMethodChange,
  endpoint,
  onEndpointChange,
  authHeader,
  onAuthHeaderChange,
  payload,
  onPayloadChange,
  isTesting,
  onSubmit,
}) => {
  return (
    <div className="cyber-panel p-4 rounded space-y-4">
      <div className="border-b border-panel-border pb-3 flex justify-between items-center">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Sandbox Execution</span>
          <h2 className="text-sm font-bold text-white mt-1">API Gateway Request Simulator</h2>
        </div>
        <span className="text-[10px] text-cyan-400 font-bold border border-cyan-400/30 px-2 py-0.5 rounded">
          SIMULATED PROXY
        </span>
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex gap-2">
          <select
            value={method}
            onChange={(e) => onMethodChange(e.target.value as HttpMethod)}
            className="tester-input font-bold bg-zinc-950 cursor-pointer"
          >
            <option value="POST">POST</option>
            <option value="GET">GET</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <input
            type="text"
            value={endpoint}
            onChange={(e) => onEndpointChange(e.target.value)}
            className="flex-1 tester-input"
            placeholder="/v1/..."
          />
        </div>

        <div>
          <label className="text-[10px] text-zinc-500 uppercase block font-bold mb-1">Authorization Header</label>
          <input
            type="text"
            value={authHeader}
            onChange={(e) => onAuthHeaderChange(e.target.value)}
            className="w-full tester-input text-[11px] text-zinc-300"
          />
        </div>

        <div>
          <label className="text-[10px] text-zinc-500 uppercase block font-bold mb-1">JSON Payload Body</label>
          <textarea
            rows={5}
            value={payload}
            onChange={(e) => onPayloadChange(e.target.value)}
            className="w-full tester-input text-[11px] text-zinc-300 resize-y"
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={isTesting}
          className="w-full py-2.5 bg-brand-cyan text-black hover:bg-cyan-400 font-bold rounded text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isTesting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Dispatching via Tyk Ingress...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-black" />
              <span>Send Gateway Request</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
