import React, { useState } from "react";
import {
  Cpu,
  Sliders,
  X,
  ShieldCheck,
  MapPin,
  Activity,
  Trash2,
  RefreshCw,
  KeyRound,
  CheckCircle2
} from "lucide-react";
import { FleetVehicle } from "@/entities/fleet/model/types";
import { getTypeLabel } from "@/entities/fleet/model/mock-data";
import { useLanguage } from "@/app/components/LanguageContext";

interface VehicleDetailDrawerProps {
  vehicle: FleetVehicle | null;
  onClose: () => void;
  onOpenSpeedModal: (v: FleetVehicle) => void;
  onLocationChange: (id: string, location: string) => void;
  onDecommission: (id: string) => void;
  onRenewCertificate?: (vehicleId: string) => void;
}

export function VehicleDetailDrawer({
  vehicle,
  onClose,
  onOpenSpeedModal,
  onLocationChange,
  onDecommission,
  onRenewCertificate
}: VehicleDetailDrawerProps) {
  const { t, language } = useLanguage();
  const [isRenewingCert, setIsRenewingCert] = useState(false);
  const [certSuccessMsg, setCertSuccessMsg] = useState<string | null>(null);

  if (!vehicle) return null;

  const handleRenewCert = async () => {
    setIsRenewingCert(true);
    setCertSuccessMsg(null);
    // Имитация сетевого запроса на бэкенд для выпуска нового X.509 сертификата (+1 год)
    await new Promise((resolve) => setTimeout(resolve, 650));
    setIsRenewingCert(false);
    setCertSuccessMsg(t("fleet.cert_success"));
    if (onRenewCertificate) {
      onRenewCertificate(vehicle.id);
    }
    setTimeout(() => setCertSuccessMsg(null), 4500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-[var(--panel-bg)] border-l border-panel-border h-full shadow-2xl z-10 flex flex-col animate-slide-left">
        {/* Drawer Header */}
        <div className="p-4 border-b border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-brand-cyan font-bold bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20">
                {vehicle.id}
              </span>
              <span className="text-[10px] text-[var(--muted-text)]">
                {getTypeLabel(vehicle.type, language)}
              </span>
            </div>
            <h2 className="text-base font-bold text-[var(--foreground)] mt-1.5 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-cyan" />
              <span>{language === "ko" ? "실시간 텔레메트리 링크" : "Real-time Telematics Link"}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenSpeedModal(vehicle)}
              className="px-3 py-1.5 rounded bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan hover:text-white dark:hover:text-black text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{language === "ko" ? "속도 제어" : "Speed"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--panel-header-bg)] border border-panel-border transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 scrollbar-thin">
          {/* Key Indicators Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
              <span className="text-[9px] text-[var(--muted-text)] uppercase block">
                {language === "ko" ? "배터리 잔량" : "Battery"}
              </span>
              <span className="font-bold text-[var(--foreground)] mt-0.5 block tabular-nums">
                {vehicle.battery}%
              </span>
            </div>
            <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
              <span className="text-[9px] text-[var(--muted-text)] uppercase block">
                {language === "ko" ? "현재 주행속도" : "Current Speed"}
              </span>
              <span className="font-bold text-brand-cyan mt-0.5 block tabular-nums">
                {vehicle.speed} km/h
              </span>
            </div>
            <div className="bg-[var(--panel-header-bg)] p-3 rounded border border-panel-border">
              <span className="text-[9px] text-[var(--muted-text)] uppercase block">
                {language === "ko" ? "인가 속도 제한" : "Speed Governor"}
              </span>
              <span className="font-bold text-brand-amber mt-0.5 block tabular-nums">
                {vehicle.speedLimit} km/h
              </span>
            </div>
          </div>

          {/* Sensor Stack Diagnostics */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-cyan" />
              <span>
                {language === "ko"
                  ? "센서 스택 자가진단 (Sensor Diagnostics)"
                  : "Sensor Stack Diagnostics"}
              </span>
            </span>

            <div className="space-y-2">
              {/* LiDAR */}
              <div className="flex justify-between items-center bg-[var(--panel-header-bg)] p-2.5 rounded border border-panel-border text-xs">
                <div>
                  <span className="font-bold text-[var(--foreground)] block">
                    {language === "ko" ? "LiDAR 어레이 센서" : "LiDAR Arrays"}
                  </span>
                  <span className="text-[10px] text-[var(--muted-text)]">
                    Solid-State 128ch Pulse Return
                  </span>
                </div>
                <span
                  className={`font-bold text-[10px] px-2 py-0.5 rounded border ${
                    vehicle.lidar === "SECURE"
                      ? "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30"
                      : "text-brand-rose bg-brand-rose/10 border-brand-rose/30 animate-pulse"
                  }`}
                >
                  {vehicle.lidar === "SECURE" ? t("fleet.sensors_ok") : t("fleet.sensors_deg")}
                </span>
              </div>

              {/* RADAR */}
              <div className="flex justify-between items-center bg-[var(--panel-header-bg)] p-2.5 rounded border border-panel-border text-xs">
                <div>
                  <span className="font-bold text-[var(--foreground)] block">
                    {language === "ko" ? "Radar 송수신 레이더" : "Radar Ingress"}
                  </span>
                  <span className="text-[10px] text-[var(--muted-text)]">
                    77GHz Millimeter Wave Scanner
                  </span>
                </div>
                <span
                  className={`font-bold text-[10px] px-2 py-0.5 rounded border ${
                    vehicle.radar === "SECURE"
                      ? "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30"
                      : "text-brand-amber bg-brand-amber/10 border-brand-amber/30"
                  }`}
                >
                  {vehicle.radar === "SECURE" ? t("fleet.sensors_ok") : t("fleet.sensors_deg")}
                </span>
              </div>

              {/* CAMERA */}
              <div className="flex justify-between items-center bg-[var(--panel-header-bg)] p-2.5 rounded border border-panel-border text-xs">
                <div>
                  <span className="font-bold text-[var(--foreground)] block">
                    {language === "ko" ? "카메라 서라운드 비전" : "Surround Cameras"}
                  </span>
                  <span className="text-[10px] text-[var(--muted-text)]">
                    8x HD Autonomous Vision Rig
                  </span>
                </div>
                <span
                  className={`font-bold text-[10px] px-2 py-0.5 rounded border ${
                    vehicle.camera === "SECURE"
                      ? "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30"
                      : "text-brand-rose bg-brand-rose/10 border-brand-rose/30"
                  }`}
                >
                  {vehicle.camera === "SECURE" ? t("fleet.sensors_ok") : t("fleet.sensors_off")}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Deployment Zone Dropdown */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-cyan" />
              <span>{language === "ko" ? "할당된 배치 권역 (Zone)" : "Assigned Deployment Zone"}</span>
            </span>
            <select
              value={vehicle.location}
              onChange={(e) => onLocationChange(vehicle.id, e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-panel-border rounded-md p-2 text-xs text-[var(--foreground)] focus:border-brand-cyan outline-none cursor-pointer font-medium"
            >
              <option value="Gangnam Station">강남역 (Zone A)</option>
              <option value="Gangnam 3rd Ave">강남 3대로 (Zone B)</option>
              <option value="Teheran-ro Street">테헤란로 (Zone C)</option>
              <option value="Yeoksam Subway">역삼역 (Zone D)</option>
              <option value="Samseong Center">삼성 센터 (Zone E)</option>
              <option value="Pangyo Blvd">판교대로 (판교 지역)</option>
              <option value="Pangyo Valley Depot">판교 밸리 기지 (정비고)</option>
              <option value="Hangar Standby">정비고 대기 (유지보수)</option>
            </select>
          </div>

          {/* V2X Latency Sparkline */}
          <div className="bg-[var(--panel-header-bg)] border border-panel-border rounded-lg p-3.5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-brand-cyan" />
                <span>
                  {language === "ko"
                    ? "V2X 무선 통신 지연 시간 (최근 5분)"
                    : "V2X Latency (Last 5 Mins)"}
                </span>
              </span>
              <span className="text-brand-cyan font-bold tabular-nums">평균 14.1ms</span>
            </div>
            <div className="h-14 w-full flex items-end pt-1">
              <svg
                className="w-full h-full text-zinc-300 dark:text-zinc-800"
                viewBox="0 0 160 40"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,20 L20,18 L40,25 L60,12 L80,15 L100,32 L120,10 L140,15 L160,18"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                />
                <circle cx="160" cy="18" r="3.5" fill="#0284c7" />
              </svg>
            </div>
          </div>

          {/* Firmware Info */}
          <div className="flex justify-between items-center text-xs p-3 bg-[var(--panel-header-bg)] rounded-md border border-panel-border">
            <span className="text-[var(--muted-text)] font-medium">
              {language === "ko" ? "현재 펌웨어 버전" : "Firmware Version"}
            </span>
            <span className="font-mono font-bold text-[var(--foreground)]">{vehicle.ota}</span>
          </div>

          {/* mTLS Device Certificate & Rotation Card */}
          <div className="bg-[var(--panel-header-bg)] border border-panel-border rounded-lg p-3.5 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-emerald" />
                <span>{t("fleet.cert_title")}</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold border text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30">
                {t("fleet.cert_valid")}
              </span>
            </div>

            <div className="space-y-1.5 text-[10px] font-mono text-[var(--muted-text)] bg-[var(--panel-bg)] p-2.5 rounded border border-panel-border">
              <div className="flex justify-between">
                <span>Fingerprint:</span>
                <span className="text-[var(--foreground)] font-bold">SHA256: 8d3e...7a02</span>
              </div>
              <div className="flex justify-between">
                <span>Issuer:</span>
                <span className="text-[var(--foreground)]">CoreGuard-Root-CA</span>
              </div>
              <div className="flex justify-between">
                <span>Valid:</span>
                <span className="text-brand-emerald">2027-09-11 (365d)</span>
              </div>
            </div>

            {certSuccessMsg && (
              <div className="flex items-center gap-1.5 p-2 bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald text-[11px] rounded animate-fade-in font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{certSuccessMsg}</span>
              </div>
            )}

            <button
              onClick={handleRenewCert}
              disabled={isRenewingCert}
              className="w-full px-3 py-2 rounded bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan hover:text-white dark:hover:text-black text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <KeyRound className={`w-3.5 h-3.5 ${isRenewingCert ? "animate-spin" : ""}`} />
              <span>
                {isRenewingCert ? t("fleet.cert_renewing") : t("fleet.cert_renew")}
              </span>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-panel-border bg-[var(--panel-header-bg)] flex justify-between items-center">
          <button
            onClick={() => onDecommission(vehicle.id)}
            className="px-3 py-1.5 rounded border border-panel-border text-[var(--muted-text)] hover:text-brand-rose hover:bg-brand-rose/10 hover:border-brand-rose text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{language === "ko" ? "차량 폐기" : "Decommission"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                alert(
                  language === "ko"
                    ? `${vehicle.id}에 대한 강제 OTA 업데이트 신호를 전송했습니다.`
                    : `Dispatched OTA signal for ${vehicle.id}`
                )
              }
              className="px-3 py-1.5 rounded border border-panel-border bg-[var(--panel-bg)] hover:bg-[var(--panel-header-bg)] text-[var(--foreground)] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>FORCE OTA</span>
            </button>
            <button
              onClick={() => onOpenSpeedModal(vehicle)}
              className="px-4 py-1.5 rounded bg-brand-cyan hover:opacity-90 text-white dark:text-black text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{language === "ko" ? "속도 제한 설정" : "Set Speed"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
