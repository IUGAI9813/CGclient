import React, { useState, useMemo } from "react";
import { RouteDefinition, RouteCategory } from "@/entities/gateway/model/types";
import { RouteCard } from "@/entities/gateway/ui/RouteCard";
import { RouteFilterBar } from "@/features/gateway/filter-routes/ui/RouteFilterBar";
import { EndpointInspector } from "@/features/gateway/inspect-route/ui/EndpointInspector";

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Route List (2 Columns) */}
      <div className="lg:col-span-2 space-y-4">
        <RouteFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="space-y-2">
          {filteredRoutes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              isSelected={selectedRoute?.id === route.id}
              onSelect={onSelectRoute}
            />
          ))}
          {filteredRoutes.length === 0 && (
            <div className="cyber-panel p-8 rounded text-center text-zinc-500 text-xs">
              No matching endpoints found for &ldquo;{searchQuery}&rdquo;.
            </div>
          )}
        </div>
      </div>

      {/* Route Details Panel (1 Column) */}
      <div className="lg:col-span-1">
        <EndpointInspector route={selectedRoute} onOpenTester={onOpenTester} />
      </div>
    </div>
  );
};
