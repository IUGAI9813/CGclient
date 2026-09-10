"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/app/components/LanguageContext";

export interface ApiKeyItem {
  id: string;
  name: string;
  created: string;
  status: string;
  type: string;
}

interface ApiKeyManagementWidgetProps {
  apiKeyList: ApiKeyItem[];
  onCreateApiKey: () => void;
  onRevokeKey: (id: string) => void;
}

export const ApiKeyManagementWidget: React.FC<ApiKeyManagementWidgetProps> = ({
  apiKeyList,
  onCreateApiKey,
  onRevokeKey,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="cyber-panel p-4 rounded space-y-4">
      <div className="border-b border-panel-border pb-3 flex justify-between items-center">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
            {language === "ko" ? "인증 키 관리" : "Credentials Management"}
          </span>
          <h2 className="text-sm font-bold text-white mt-1">{t("settings.api_title")}</h2>
        </div>
        <button
          onClick={onCreateApiKey}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-cyan hover:bg-brand-cyan/85 text-black rounded text-[10px] font-bold uppercase transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3px]" />
          {t("settings.api_create")}
        </button>
      </div>

      <p className="text-xs text-zinc-400">{t("settings.api_subtitle")}</p>

      <div className="space-y-3">
        {apiKeyList.map((key) => (
          <div
            key={key.id}
            className="flex justify-between items-center bg-zinc-900/40 border border-panel-border p-3 rounded"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    key.status === "ACTIVE" ? "bg-brand-emerald" : "bg-zinc-600"
                  }`}
                />
                {key.name}
              </span>
              <div className="flex gap-4 text-[9px] text-zinc-500">
                <span>
                  {language === "ko" ? "역할:" : "TYPE:"}{" "}
                  <strong className="text-zinc-400">
                    {key.type === "Ingress" && language === "ko"
                      ? "수신(Ingress)"
                      : key.type === "Egress" && language === "ko"
                      ? "송신(Egress)"
                      : key.type}
                  </strong>
                </span>
                <span>
                  {language === "ko" ? "생성일:" : "CREATED:"}{" "}
                  <strong className="text-zinc-400">{key.created}</strong>
                </span>
                <span>
                  ID: <strong className="text-zinc-400">{key.id}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                  key.status === "ACTIVE"
                    ? "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20"
                    : "text-zinc-500 bg-zinc-900 border-panel-border"
                }`}
              >
                {key.status === "ACTIVE"
                  ? language === "ko"
                    ? "활성"
                    : "ACTIVE"
                  : language === "ko"
                  ? "폐기됨"
                  : "REVOKED"}
              </span>

              {key.status === "ACTIVE" && (
                <button
                  onClick={() => onRevokeKey(key.id)}
                  className="p-1 rounded text-zinc-500 hover:text-brand-rose hover:bg-brand-rose/10 transition-colors cursor-pointer"
                  title={language === "ko" ? "토큰 철회" : "Revoke Token"}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
