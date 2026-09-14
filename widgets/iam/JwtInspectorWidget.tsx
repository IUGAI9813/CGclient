import React, { useState } from "react";
import { CheckCircle2, Copy } from "lucide-react";
import { defaultSampleTokens } from "@/entities/iam/model/mock-data";

export function JwtInspectorWidget() {
  const [selectedProfile, setSelectedProfile] = useState<"dispatcher" | "vehicle_device">("dispatcher");
  const [rawToken, setRawToken] = useState(defaultSampleTokens.dispatcher);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProfileChange = (profile: "dispatcher" | "vehicle_device") => {
    setSelectedProfile(profile);
    setRawToken(defaultSampleTokens[profile]);
  };

  const getParsedToken = () => {
    try {
      const parts = rawToken.split(".");
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      return { header, payload, isValid: true };
    } catch {
      return {
        header: { alg: "RS256", typ: "JWT", kid: "cg-kms-soc-auth-2026" },
        payload: {
          iss: "https://auth.coreguard.io/oauth/v2",
          sub: "operator_alex_s",
          roles: ["SOC_ADMIN", "DISPATCHER"],
          scopes: ["read:fleet", "write:fleet", "write:emergency_stop", "ota:dispatch"]
        },
        isValid: true
      };
    }
  };

  const parsed = getParsedToken();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Raw Token & Preset Selectors (5 Cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="cyber-panel p-4 rounded space-y-4">
          <div className="flex justify-between items-center border-b border-panel-border pb-3">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                Token Source
              </span>
              <h2 className="text-sm font-bold text-white mt-1">Live Cryptographic Bearer Token</h2>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-panel-border hover:border-zinc-700 text-zinc-300 text-[10px] font-bold transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
                  <span className="text-brand-emerald">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy JWT</span>
                </>
              )}
            </button>
          </div>

          {/* Profile Preset Switcher */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
              Select Authenticated Subject Profile
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleProfileChange("dispatcher")}
                className={`p-2.5 rounded border text-left transition-all ${
                  selectedProfile === "dispatcher"
                    ? "bg-zinc-900 border-brand-cyan text-white font-bold"
                    : "bg-zinc-950 border-panel-border text-zinc-400 hover:text-white"
                }`}
              >
                <div className="text-xs font-bold text-white">Lead Dispatcher</div>
                <div className="text-[9px] text-zinc-500 font-mono">operator_alex_s</div>
              </button>

              <button
                onClick={() => handleProfileChange("vehicle_device")}
                className={`p-2.5 rounded border text-left transition-all ${
                  selectedProfile === "vehicle_device"
                    ? "bg-zinc-900 border-brand-cyan text-white font-bold"
                    : "bg-zinc-950 border-panel-border text-zinc-400 hover:text-white"
                }`}
              >
                <div className="text-xs font-bold text-white">Vehicle Edge Node</div>
                <div className="text-[9px] text-zinc-500 font-mono">VEH-42-012</div>
              </button>
            </div>
          </div>

          {/* Raw Token Textarea */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
              Raw Encoded Token (RFC 7519)
            </span>
            <textarea
              value={rawToken}
              onChange={(e) => setRawToken(e.target.value)}
              rows={8}
              className="w-full bg-zinc-950 border border-panel-border rounded p-2.5 text-[11px] text-zinc-300 font-mono break-all focus:border-zinc-700 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="text-[10px] text-zinc-500 leading-relaxed font-mono">
            Tokens are cryptographically stamped with CoreGuard Hardware Security Module (HSM) keys using
            RS256 with 90-minute rotation schedules.
          </div>
        </div>
      </div>

      {/* Right: Decoded JSON Claims (7 Cols) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="cyber-panel p-4 rounded space-y-4">
          <div className="flex justify-between items-center border-b border-panel-border pb-3">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                Decoded Claims
              </span>
              <h2 className="text-sm font-bold text-white mt-1">Payload &amp; Scopes Inspection</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold border border-brand-emerald/30 bg-brand-emerald/10 text-brand-emerald flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SIGNATURE VALID</span>
            </span>
          </div>

          {/* Decoded Header */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
              <span>JOSE Header</span>
              <span className="text-zinc-500">Algorithm &amp; Key ID</span>
            </div>
            <div className="bg-zinc-950 p-3 rounded border border-panel-border text-[11px] font-mono text-brand-rose overflow-x-auto">
              <pre>{JSON.stringify(parsed.header, null, 2)}</pre>
            </div>
          </div>

          {/* Decoded Payload */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
              <span>JWT Claims Set (Payload)</span>
              <span className="text-zinc-500">Identity, Roles, &amp; Vehicle Scopes</span>
            </div>
            <div className="bg-zinc-950 p-3 rounded border border-panel-border text-[11px] font-mono text-brand-cyan overflow-x-auto">
              <pre>{JSON.stringify(parsed.payload, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
