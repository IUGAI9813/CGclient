"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Incident, IncidentStatus } from "@/entities/incident/model/types";
import { IncidentFilterBar } from "@/features/incident/filter-incidents/ui/IncidentFilterBar";
import { IncidentKpiBanner } from "@/widgets/incident/IncidentKpiBanner";
import { IncidentTableWidget } from "@/widgets/incident/IncidentTableWidget";
import { IncidentDossierDrawer } from "@/widgets/incident/IncidentDossierDrawer";

interface IncidentsViewProps {
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
  selectedIncidentFromDashboard: Incident | null;
  clearSelectedIncidentFromDashboard: () => void;
  panicMode: boolean;
}

export default function IncidentsView({
  incidents,
  setIncidents,
  selectedIncidentFromDashboard,
  clearSelectedIncidentFromDashboard,
  panicMode
}: IncidentsViewProps) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sync with incident selected from Dashboard
  useEffect(() => {
    if (selectedIncidentFromDashboard) {
      queueMicrotask(() => {
        setSelectedIncident(selectedIncidentFromDashboard);
        clearSelectedIncidentFromDashboard();
      });
    }
  }, [selectedIncidentFromDashboard, clearSelectedIncidentFromDashboard]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedIncident) {
        setSelectedIncident(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIncident]);

  const handleUpdateStatus = (id: string, newStatus: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: newStatus } : inc))
    );
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Filter logic
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchesSeverity = severityFilter === "ALL" || inc.severity === severityFilter;
      const matchesStatus = statusFilter === "ALL" || inc.status === statusFilter;
      const matchesSearch =
        inc.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSeverity && matchesStatus && matchesSearch;
    });
  }, [incidents, severityFilter, statusFilter, searchQuery]);

  // KPI Metrics
  const totalCount = incidents.length;
  const criticalCount = incidents.filter(
    (i) => (i.severity === "CRITICAL" || panicMode) && i.status !== "RESOLVED"
  ).length;
  const activeCount = incidents.filter((i) => i.status === "ACTIVE").length;
  const resolvedCount = incidents.filter((i) => i.status === "RESOLVED").length;

  return (
    <div className="space-y-4 animate-fade-in font-sans">
      {/* 1. Header & KPI Metrics Banner */}
      <IncidentKpiBanner
        totalCount={totalCount}
        criticalCount={criticalCount}
        activeCount={activeCount}
        resolvedCount={resolvedCount}
      />

      {/* 2. Search & Severity / Status Filters */}
      <IncidentFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        severityFilter={severityFilter}
        onSeverityFilterChange={setSeverityFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* 3. Incidents Data Table */}
      <IncidentTableWidget
        incidents={filteredIncidents}
        selectedIncident={selectedIncident}
        panicMode={panicMode}
        onSelectIncident={setSelectedIncident}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* 4. Incident Dossier Slide-Over Drawer */}
      <IncidentDossierDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
