import React from "react";
import { Fingerprint } from "lucide-react";
import { MtlsCert } from "@/entities/iam/model/types";

interface MtlsCertWidgetProps {
  certs: MtlsCert[];
  onRevokeCert: (id: string) => void;
}

export function MtlsCertWidget({ certs, onRevokeCert }: MtlsCertWidgetProps) {
  return (
    <div className="space-y-4">
      <div className="cyber-panel p-4 rounded space-y-4">
        <div className="flex justify-between items-center border-b border-panel-border pb-3">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              Mutual TLS (mTLS) Fleet CA
            </span>
            <h2 className="text-sm font-bold text-white mt-1">On-board Vehicle Cryptographic Identities</h2>
          </div>
          <span className="text-[10px] font-bold text-brand-cyan border border-brand-cyan/20 bg-brand-cyan/5 px-2 py-0.5 rounded">
            Hardware Bound (HSM)
          </span>
        </div>

        <div className="space-y-3">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="cyber-panel p-3.5 rounded border border-panel-border bg-zinc-950/40 space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-brand-cyan" />
                  <span className="text-xs font-bold text-white">{cert.vehicleId}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      cert.status === "VALID"
                        ? "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30"
                        : cert.status === "EXPIRING_SOON"
                        ? "text-brand-amber bg-brand-amber/10 border-brand-amber/30"
                        : "text-brand-rose bg-brand-rose/10 border-brand-rose/30"
                    }`}
                  >
                    {cert.status}
                  </span>
                  {cert.status !== "REVOKED" && (
                    <button
                      onClick={() => onRevokeCert(cert.id)}
                      className="text-[10px] text-brand-rose hover:underline font-bold cursor-pointer"
                    >
                      Revoke Certificate
                    </button>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 font-mono space-y-1">
                <div>
                  Subject: <span className="text-zinc-300">{cert.subject}</span>
                </div>
                <div>
                  Fingerprint: <span className="text-zinc-500">{cert.fingerprint}</span>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 pt-1">
                  <span>Issuer: {cert.issuer}</span>
                  <span>
                    Valid Until: <strong className="text-zinc-300">{cert.validTo}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
