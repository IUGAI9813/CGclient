"use client";

import React, { useState, useMemo } from "react";
import { Play } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { RouteDefinition, RouteCategory } from "@/entities/gateway/model/types";
import { MethodBadge } from "@/entities/gateway/ui/MethodBadge";
import { StatusBadge } from "@/entities/gateway/ui/StatusBadge";
import { RouteFilterBar } from "@/features/gateway/filter-routes/ui/RouteFilterBar";
import { DataTable } from "@/shared/ui/data-table/DataTable";

interface RouteRegistryWidgetProps {
  routes: RouteDefinition[];
  selectedRoute: RouteDefinition | null;
  onSelectRoute: (route: RouteDefinition) => void;
  onOpenTester: (route: RouteDefinition) => void;
}

export const RouteRegistryWidget: React.FC<RouteRegistryWidgetProps> = ({
  routes,
  selectedRoute,
  onSelectRoute,
  onOpenTester,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RouteCategory>("ALL");

  const filteredRoutes = useMemo(() => {
    return routes.filter((r) => {
      const matchesSearch =
        r.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.upstream.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === "ALL" || r.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [routes, searchQuery, selectedCategory]);

  const columns = useMemo<ColumnDef<RouteDefinition>[]>(
    () => [
      {
        accessorKey: "method",
        header: "Method",
        size: 80,
        cell: ({ row }) => <MethodBadge method={row.original.method} />,
      },
      {
        accessorKey: "path",
        header: "Route Path",
        cell: ({ row }) => {
          const route = row.original;
          return (
            <div>
              <span className="font-semibold text-xs text-[var(--foreground)] font-mono block">
                {route.path}
              </span>
              <span className="text-[11px] text-[var(--muted-text)] font-mono">
                {route.upstream}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        size: 110,
        cell: ({ row }) => (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--panel-header-bg)] border border-panel-border text-[var(--foreground)]">
            {row.original.category}
          </span>
        ),
      },
      {
        accessorKey: "rateLimit",
        header: "Rate Limit",
        size: 100,
        cell: ({ row }) => (
          <span className="text-xs font-mono text-[var(--foreground)]">
            {row.original.rateLimit.toLocaleString()}{" "}
            <span className="text-[10px] text-[var(--muted-text)]">RPM</span>
          </span>
        ),
      },
      {
        accessorKey: "authType",
        header: "Auth",
        size: 110,
        cell: ({ row }) => (
          <span className="text-xs text-[var(--muted-text)] font-mono">
            {row.original.authType}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        size: 90,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <StatusBadge status={row.original.status} />
          </div>
        ),
      },
      {
        id: "actions",
        header: () => null,
        size: 70,
        enableSorting: false,
        cell: ({ row }) => {
          const route = row.original;
          return (
            <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onOpenTester(route)}
                className="px-2.5 py-1 bg-[var(--panel-header-bg)] hover:bg-brand-cyan/15 hover:text-brand-cyan border border-panel-border text-xs font-medium rounded transition-colors flex items-center gap-1 cursor-pointer text-[var(--muted-text)]"
                title="Test in sandbox"
              >
                <Play className="w-3 h-3 text-brand-cyan" />
                <span>Test</span>
              </button>
            </div>
          );
        },
      },
    ],
    [onOpenTester]
  );

  return (
    <div className="space-y-3 font-sans">
      <RouteFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="cyber-panel rounded-lg overflow-hidden border border-panel-border">
        <DataTable
          data={filteredRoutes}
          columns={columns}
          selectedRowId={selectedRoute?.id}
          getRowId={(r) => r.id}
          onRowClick={onSelectRoute}
          enableSorting={true}
          emptyMessage="No matching endpoints found."
        />
      </div>
    </div>
  );
};

