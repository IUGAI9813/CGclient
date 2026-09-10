"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CheckCircle2 } from "lucide-react";
import { FleetVehicle } from "@/entities/fleet/model/types";
import { defaultFleetList } from "@/entities/fleet/model/mock-data";
import { FleetFilterBar } from "@/features/fleet/filter-vehicles/ui/FleetFilterBar";
import { SpeedLimitModal } from "@/features/fleet/speed-governor/ui/SpeedLimitModal";
import { FleetKpiBanner } from "@/widgets/fleet/FleetKpiBanner";
import { FleetTableWidget } from "@/widgets/fleet/FleetTableWidget";
import { FleetGridWidget } from "@/widgets/fleet/FleetGridWidget";
import { VehicleDetailDrawer } from "@/widgets/fleet/VehicleDetailDrawer";
import { useLanguage } from "../LanguageContext";

interface FleetViewProps {
  panicMode: boolean;
}

export default function FleetView({ panicMode }: FleetViewProps) {
  const { language } = useLanguage();
  const [fleetList, setFleetList] = useState<FleetVehicle[]>(defaultFleetList);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [isSpeedModalOpen, setIsSpeedModalOpen] = useState(false);
  const [speedApplyFeedback, setSpeedApplyFeedback] = useState<string | null>(null);

  // Filters & View Mode
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isSpeedModalOpen) {
          setIsSpeedModalOpen(false);
        } else if (selectedVehicle) {
          setSelectedVehicle(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSpeedModalOpen, selectedVehicle]);

  const handleSelectVehicle = (veh: FleetVehicle) => {
    setSelectedVehicle(veh);
    setSpeedApplyFeedback(null);
  };

  const handleOpenSpeedModal = (veh: FleetVehicle) => {
    setSelectedVehicle(veh);
    setIsSpeedModalOpen(true);
  };

  const handleApplySpeedLimit = async (newLimit: number) => {
    if (!selectedVehicle) return;
    await new Promise((resolve) => setTimeout(resolve, 400));
    setFleetList((prev) =>
      prev.map((veh) => (veh.id === selectedVehicle.id ? { ...veh, speedLimit: newLimit } : veh))
    );
    setSelectedVehicle((prev) => (prev ? { ...prev, speedLimit: newLimit } : null));
    setIsSpeedModalOpen(false);
    setSpeedApplyFeedback(
      language === "ko"
        ? `${selectedVehicle.id} 속도 제한이 ${newLimit} km/h로 적용되었습니다 (ECU 동기화 완료).`
        : `Speed limit for ${selectedVehicle.id} applied at ${newLimit} km/h (ECU Synced).`
    );
    setTimeout(() => setSpeedApplyFeedback(null), 4000);
  };

  const handleLocationChange = (id: string, location: string) => {
    setFleetList((prev) => prev.map((veh) => (veh.id === id ? { ...veh, location } : veh)));
    if (selectedVehicle && selectedVehicle.id === id) {
      setSelectedVehicle({ ...selectedVehicle, location });
    }
  };

  const handleDecommission = (id: string) => {
    const checkMsg =
      language === "ko"
        ? `경고: ${id} 차량을 폐기하고 보안 키를 철회하시겠습니까? 이 차량은 클라우드 연결에서 분리됩니다.`
        : `WARNING: Are you sure you want to decommission and revoke security keys for ${id}? This vehicle will disconnect from cloud links.`;
    if (confirm(checkMsg)) {
      setFleetList((prev) => prev.filter((veh) => veh.id !== id));
      setSelectedVehicle(null);
    }
  };

  // Filtered fleet
  const filteredFleet = useMemo(() => {
    return fleetList.filter((veh) => {
      const matchesSearch =
        veh.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        veh.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "ALL" || veh.type === typeFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "CRITICAL" && (veh.status === "critical" || panicMode)) ||
        (statusFilter === "WARNING" && veh.status === "warning" && !panicMode) ||
        (statusFilter === "SECURE" && veh.status === "secure" && !panicMode);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [fleetList, searchQuery, typeFilter, statusFilter, panicMode]);

  // KPI Metrics
  const totalCount = fleetList.length;
  const criticalCount = fleetList.filter((v) => v.status === "critical" || panicMode).length;
  const warningCount = fleetList.filter((v) => v.status === "warning" && !panicMode).length;
  const secureCount = fleetList.filter((v) => v.status === "secure" && !panicMode).length;
  const avgBattery = Math.round(
    fleetList.reduce((acc, v) => acc + v.battery, 0) / (fleetList.length || 1)
  );

  return (
    <div className="space-y-4 animate-fade-in font-sans">
      {/* 1. Header & KPI Metrics */}
      <FleetKpiBanner
        totalCount={totalCount}
        secureCount={secureCount}
        criticalCount={criticalCount}
        warningCount={warningCount}
        avgBattery={avgBattery}
      />

      {/* Speed Apply Success Notification */}
      {speedApplyFeedback && (
        <div className="flex items-center gap-2 p-3 bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald text-xs rounded-lg animate-fade-in font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-emerald" />
          <span>{speedApplyFeedback}</span>
        </div>
      )}

      {/* 2. Search & Filters Bar */}
      <FleetFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 3. Main Fleet Content: Table or Grid */}
      {viewMode === "table" ? (
        <FleetTableWidget
          vehicles={filteredFleet}
          selectedVehicle={selectedVehicle}
          panicMode={panicMode}
          onSelectVehicle={handleSelectVehicle}
          onOpenSpeedModal={handleOpenSpeedModal}
        />
      ) : (
        <FleetGridWidget
          vehicles={filteredFleet}
          selectedVehicle={selectedVehicle}
          panicMode={panicMode}
          onSelectVehicle={handleSelectVehicle}
        />
      )}

      {/* 4. Telemetry Slide-over Drawer */}
      <VehicleDetailDrawer
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        onOpenSpeedModal={handleOpenSpeedModal}
        onLocationChange={handleLocationChange}
        onDecommission={handleDecommission}
      />

      {/* 5. Speed Governor Override Modal */}
      <SpeedLimitModal
        isOpen={isSpeedModalOpen}
        vehicle={selectedVehicle}
        onClose={() => setIsSpeedModalOpen(false)}
        onApply={handleApplySpeedLimit}
      />
    </div>
  );
}
