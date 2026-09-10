import React, { useState } from "react";
import { MapPin, X, Globe, Search, Check } from "lucide-react";
import { Policy } from "@/entities/policy/model/types";
import { defaultAdminRegions } from "@/entities/region/model/mock-data";
import { defaultPolicyFleetVehicles } from "@/entities/policy/model/mock-data";
import { useLanguage } from "@/app/components/LanguageContext";

interface PolicyEditModalProps {
  isOpen: boolean;
  policy: Partial<Policy> | null;
  onClose: () => void;
  onSave: (policy: Policy) => void;
}

export function PolicyEditModal({ isOpen, policy, onClose, onSave }: PolicyEditModalProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<Partial<Policy> | null>(policy);
  const [districtSearchQuery, setDistrictSearchQuery] = useState("");

  // Sync state with incoming prop
  React.useEffect(() => {
    setFormData(policy);
  }, [policy]);

  if (!isOpen || !formData) return null;

  const toggleDistrictSelection = (districtCode: string) => {
    const currentCodes = formData.districtCodes || [];
    const isSelected = currentCodes.includes(districtCode);
    const nextCodes = isSelected
      ? currentCodes.filter((c) => c !== districtCode)
      : [...currentCodes, districtCode];

    const nextNames = defaultAdminRegions
      .filter((r) => nextCodes.includes(r.regionCode))
      .map((r) => r.districtName);

    setFormData({
      ...formData,
      districtCodes: nextCodes,
      districtNames: nextNames
    });
  };

  const handleSelectAllDistricts = () => {
    const targetCity = formData.cityName || "서울특별시";
    const cityRegions = defaultAdminRegions.filter((r) => r.cityName === targetCity);
    setFormData({
      ...formData,
      districtCodes: cityRegions.map((r) => r.regionCode),
      districtNames: cityRegions.map((r) => r.districtName)
    });
  };

  const handleClearAllDistricts = () => {
    setFormData({
      ...formData,
      districtCodes: [],
      districtNames: []
    });
  };

  const toggleVehicleSelection = (vehId: string) => {
    const currentVehicles = formData.vehicles || [];
    const updated = currentVehicles.includes(vehId)
      ? currentVehicles.filter((id) => id !== vehId)
      : [...currentVehicles, vehId];
    setFormData({ ...formData, vehicles: updated });
  };

  const handleSelectAllVehicles = () => {
    setFormData({ ...formData, vehicles: defaultPolicyFleetVehicles.map((v) => v.id) });
  };

  const handleDeselectAllVehicles = () => {
    setFormData({ ...formData, vehicles: [] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert(language === "ko" ? "정책 이름을 입력하십시오." : "Please enter a policy name.");
      return;
    }
    if (!formData.districtCodes || formData.districtCodes.length === 0) {
      alert(
        language === "ko"
          ? "최소 1개 이상의 관제 행정구역(시/군/구)을 선택하십시오."
          : "Please select at least one administrative district."
      );
      return;
    }

    const finalPolicy: Policy = {
      id: formData.id || `pol-${Date.now()}`,
      name: formData.name.trim(),
      cityName: formData.cityName || "서울특별시",
      districtCodes: formData.districtCodes,
      districtNames: formData.districtNames || [],
      action: formData.action || "ACT_RAISE_INCIDENT",
      priority: formData.priority || 10,
      startTime: formData.startTime || null,
      endTime: formData.endTime || null,
      vehicles: formData.vehicles || [],
      status: "ACTIVE",
      violationsCount: formData.violationsCount || 0
    };

    onSave(finalPolicy);
  };

  const filteredRegions = defaultAdminRegions.filter(
    (r) =>
      r.cityName === (formData.cityName || "서울특별시") &&
      (districtSearchQuery.trim() === "" ||
        r.districtName.toLowerCase().includes(districtSearchQuery.toLowerCase()) ||
        (r.subDistrictName && r.subDistrictName.toLowerCase().includes(districtSearchQuery.toLowerCase())))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-[var(--panel-bg)] border border-panel-border rounded-xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-4 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-base font-bold text-[var(--foreground)]">
              {formData.id?.startsWith("pol-")
                ? language === "ko"
                  ? "보안 정책 편집 (Edit Policy)"
                  : "Edit Security Policy"
                : language === "ko"
                ? "신규 보안 정책 등록 (New Policy)"
                : "Create New Security Policy"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--panel-header-bg)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto flex-1 scrollbar-thin">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Column 1: Metadata & Rules */}
            <div className="space-y-4">
              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[var(--foreground)] block">
                  {t("policies.name_label")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                  placeholder={
                    language === "ko"
                      ? "예: 강남구 테헤란로 배송 안전 구역"
                      : "e.g. Gangnam Teheran-ro Safe Bounds"
                  }
                  className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-2 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none"
                />
              </div>

              {/* City Selection */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[var(--foreground)] flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>{t("policies.city_label")}</span>
                  </span>
                  <span className="text-[10px] text-brand-cyan font-mono">TB_ADMIN_REGIONS</span>
                </label>
                <select
                  value={formData.cityName || "서울특별시"}
                  onChange={(e) => {
                    const newCity = e.target.value;
                    const cityRegions = defaultAdminRegions.filter((r) => r.cityName === newCity);
                    const firstRegion = cityRegions[0];
                    setFormData((prev) =>
                      prev
                        ? {
                            ...prev,
                            cityName: newCity,
                            districtCodes: firstRegion ? [firstRegion.regionCode] : [],
                            districtNames: firstRegion ? [firstRegion.districtName] : []
                          }
                        : null
                    );
                  }}
                  className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-2 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none font-medium cursor-pointer"
                >
                  <option value="서울특별시">서울특별시 (Seoul Special City)</option>
                  <option value="경기도">경기도 (Gyeonggi-do Hubs)</option>
                </select>
              </div>

              {/* Action & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--foreground)] block">
                    {t("policies.action_label")}
                  </label>
                  <select
                    value={formData.action || "ACT_RAISE_INCIDENT"}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev ? { ...prev, action: e.target.value as Policy["action"] } : null
                      )
                    }
                    className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-2 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none cursor-pointer"
                  >
                    <option value="ACT_RAISE_INCIDENT">{t("policies.action_raise")}</option>
                    <option value="ACT_FORCE_STOP">{t("policies.action_stop")}</option>
                    <option value="ACT_LIMIT_SPEED">{t("policies.action_limit")}</option>
                    <option value="ACT_WARN_DRIVER">{t("policies.action_warn")}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--foreground)] block">
                    {t("policies.priority_label")} (1-100)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.priority || 10}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev ? { ...prev, priority: parseInt(e.target.value) || 10 } : null
                      )
                    }
                    className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-2 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none font-mono"
                  />
                </div>
              </div>

              {/* Time Window */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-[var(--foreground)]">
                    {t("policies.time_window")}
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => (prev ? { ...prev, startTime: null, endTime: null } : null))
                    }
                    className="text-[10px] text-brand-cyan hover:underline cursor-pointer"
                  >
                    24/7 (Always Active)
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={formData.startTime || ""}
                    onChange={(e) =>
                      setFormData((prev) => (prev ? { ...prev, startTime: e.target.value || null } : null))
                    }
                    className="bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none font-mono"
                  />
                  <input
                    type="time"
                    value={formData.endTime || ""}
                    onChange={(e) =>
                      setFormData((prev) => (prev ? { ...prev, endTime: e.target.value || null } : null))
                    }
                    className="bg-[var(--input-bg)] border border-panel-border rounded-md px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none font-mono"
                  />
                </div>
              </div>

              {/* Bound Vehicles */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-[var(--foreground)]">
                    {t("policies.vehicles_label")}
                  </label>
                  <div className="flex gap-2 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={handleSelectAllVehicles}
                      className="text-brand-cyan hover:underline cursor-pointer"
                    >
                      {t("policies.all_vehicles")}
                    </button>
                    <span className="text-[var(--muted-text)]">|</span>
                    <button
                      type="button"
                      onClick={handleDeselectAllVehicles}
                      className="text-[var(--muted-text)] hover:underline cursor-pointer"
                    >
                      {t("policies.none_vehicles")}
                    </button>
                  </div>
                </div>

                <div className="border border-panel-border rounded-md bg-[var(--panel-header-bg)] p-2 max-h-[140px] overflow-y-auto space-y-1 scrollbar-thin">
                  {defaultPolicyFleetVehicles.map((veh) => {
                    const isChecked = formData.vehicles?.includes(veh.id) || false;
                    return (
                      <label
                        key={veh.id}
                        className="flex items-center justify-between p-1.5 rounded hover:bg-[var(--panel-bg)] cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleVehicleSelection(veh.id)}
                            className="accent-brand-cyan rounded"
                          />
                          <span className="font-mono font-bold text-[var(--foreground)]">{veh.id}</span>
                          <span className="text-[10px] text-[var(--muted-text)]">
                            {veh.type} &bull; {veh.district}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Column 2: Administrative Districts Multi-select */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-[var(--foreground)]">
                  {t("policies.districts_label")} ({formData.districtCodes?.length || 0} selected)
                </label>
                <div className="flex gap-2 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={handleSelectAllDistricts}
                    className="text-brand-cyan hover:underline cursor-pointer"
                  >
                    {language === "ko" ? "전체 선택" : "Select All"}
                  </button>
                  <span className="text-[var(--muted-text)]">|</span>
                  <button
                    type="button"
                    onClick={handleClearAllDistricts}
                    className="text-[var(--muted-text)] hover:underline cursor-pointer"
                  >
                    {language === "ko" ? "초기화" : "Clear"}
                  </button>
                </div>
              </div>

              {/* Search filter for districts */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[var(--muted-text)] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={districtSearchQuery}
                  onChange={(e) => setDistrictSearchQuery(e.target.value)}
                  placeholder={
                    language === "ko" ? "구/군 검색 (예: 강남구, 서초구)..." : "Search district..."
                  }
                  className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md pl-8 pr-3 py-1.5 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none"
                />
              </div>

              {/* Districts Grid */}
              <div className="border border-panel-border rounded-md bg-[var(--panel-header-bg)] p-2 max-h-[340px] overflow-y-auto grid grid-cols-2 gap-1.5 scrollbar-thin">
                {filteredRegions.map((reg) => {
                  const isChecked = formData.districtCodes?.includes(reg.regionCode) || false;
                  return (
                    <div
                      key={reg.regionCode}
                      onClick={() => toggleDistrictSelection(reg.regionCode)}
                      className={`p-2 rounded border cursor-pointer transition-all flex items-center justify-between text-xs ${
                        isChecked
                          ? "bg-brand-cyan/15 border-brand-cyan text-brand-cyan font-bold"
                          : "bg-[var(--panel-bg)] border-panel-border text-[var(--foreground)] hover:border-panel-border-hover"
                      }`}
                    >
                      <div className="truncate">
                        <span className="block truncate">{reg.districtName}</span>
                        {reg.subDistrictName && (
                          <span className="text-[9px] text-[var(--muted-text)] block truncate">
                            {reg.subDistrictName}
                          </span>
                        )}
                      </div>
                      {isChecked && <Check className="w-3.5 h-3.5 shrink-0 text-brand-cyan" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-panel-border flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-panel-border bg-[var(--panel-bg)] hover:bg-[var(--panel-header-bg)] text-[var(--foreground)] text-xs font-semibold transition-colors cursor-pointer"
            >
              {t("policies.cancel")}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-brand-cyan hover:opacity-90 text-white dark:text-black text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {t("policies.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
