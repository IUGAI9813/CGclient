"use client";

import React, { useState, useEffect } from "react";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Compass, 
  FileText, 
  Settings, 
  Bell, 
  ChevronRight, 
  MapPin, 
  Network, 
  KeyRound, 
  SlidersHorizontal, 
  ShieldCheck,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { useRbac, RbacRole, allNavTabIds } from "./RbacContext";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";
import AuthModal from "./views/AuthModal";

interface ConsoleLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  threatLevel: "NORMAL" | "ELEVATED" | "CRITICAL";
  setThreatLevel: (level: "NORMAL" | "ELEVATED" | "CRITICAL") => void;
  panicMode: boolean;
  setPanicMode: (panic: boolean) => void;
  children: React.ReactNode;
  incidentCount: number;
}

export default function ConsoleLayout({
  activeTab,
  setActiveTab,
  threatLevel,
  setThreatLevel,
  panicMode,
  setPanicMode,
  children,
  incidentCount
}: ConsoleLayoutProps) {
  const { language, setLanguage, t } = useLanguage();
  const { currentRole, setCurrentRole, canAccessTab } = useRbac();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [utcTime, setUtcTime] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Seoul - Gangnam SOC");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const locale = language === "ko" ? "ko-KR" : "en-US";
      setCurrentTime(now.toLocaleTimeString(locale, { hour12: false }) + `.${String(now.getMilliseconds()).padStart(3, "0")}`);
      setUtcTime(now.toUTCString().replace("GMT", "UTC"));
    };

    updateTime();
    const interval = setInterval(updateTime, 45);
    return () => clearInterval(interval);
  }, [language]);

  const navItems = [
    { id: "dashboard", label: t("nav.dashboard"), icon: Activity, badge: null },
    { id: "gateway", label: t("nav.gateway"), icon: Network, badge: "6/6 UP", badgeColor: "bg-brand-emerald" },
    { id: "iam", label: t("nav.iam"), icon: KeyRound, badge: "OIDC", badgeColor: "bg-brand-cyan" },
    { id: "incidents", label: t("nav.incidents"), icon: AlertTriangle, badge: incidentCount > 0 ? incidentCount : null, badgeColor: "bg-brand-rose" },
    { id: "thresholds", label: t("nav.thresholds"), icon: SlidersHorizontal, badge: "RULES", badgeColor: "bg-brand-cyan" },
    { id: "policies", label: t("nav.policies"), icon: ShieldCheck, badge: "GEOZONES", badgeColor: "bg-brand-cyan" },
    { id: "fleet", label: t("nav.fleet"), icon: Compass, badge: "148/150", badgeColor: "bg-brand-cyan" },
    { id: "audit", label: t("nav.audit"), icon: FileText, badge: null },
    { id: "settings", label: t("nav.settings"), icon: Settings, badge: null },
  ];

  const visibleNavItems = navItems.filter((item) => canAccessTab(item.id));

  useEffect(() => {
    if (!canAccessTab(activeTab)) {
      const firstAllowed = allNavTabIds.find((id) => canAccessTab(id)) || "dashboard";
      setActiveTab(firstAllowed);
    }
  }, [currentRole, activeTab, canAccessTab, setActiveTab]);

  return (
    <div className={`min-h-screen flex flex-col select-none bg-[var(--background)] text-[var(--foreground)] ${panicMode ? "border-2 border-brand-rose animate-pulse-glow" : ""}`}>
      {/* Panic Mode Top Warning Banner */}
      {panicMode && (
        <div className="bg-brand-rose text-black py-1.5 px-4 font-mono text-xs font-bold tracking-widest text-center flex items-center justify-center gap-2 animate-pulse">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span>{t("layout.emergency")}</span>
          <AlertTriangle className="w-4 h-4 animate-bounce" />
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-1 flex-row overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`cyber-panel border-y-0 border-l-0 flex flex-col justify-between transition-all duration-300 ${
            sidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div>
            {/* Logo and System Ident */}
            <div className="p-4 border-b border-panel-border flex items-center justify-between">
              {!sidebarCollapsed ? (
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-brand-cyan animate-pulse" />
                    <h1 className="text-sm font-bold tracking-wider text-white">COREGUARD</h1>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono tracking-widest block mt-0.5">
                    {t("layout.subtitle")}
                  </span>
                </div>
              ) : (
                <Shield className="w-5 h-5 text-brand-cyan mx-auto" />
              )}
            </div>

            {/* Active Threat Matrix Level Banner */}
            {!sidebarCollapsed && (
              <div className="p-3 bg-zinc-950 border-b border-panel-border">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-zinc-500">{t("layout.threat")}</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
                    threatLevel === "CRITICAL" ? "bg-brand-rose/20 text-brand-rose border border-brand-rose/40 animate-pulse" :
                    threatLevel === "ELEVATED" ? "bg-brand-amber/20 text-brand-amber border border-brand-amber/40" :
                    "bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/40"
                  }`}>
                    {threatLevel}
                  </span>
                </div>
              </div>
            )}

            {/* Navigation links */}
            <nav className="p-2 space-y-1">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded font-mono text-xs tracking-wide transition-all group ${
                      isActive 
                        ? "bg-brand-cyan/15 text-brand-cyan border-l-2 border-brand-cyan font-bold shadow-sm" 
                        : "text-zinc-500 hover:text-[var(--foreground)] hover:bg-[var(--panel-header-bg)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-brand-cyan" : "text-zinc-500 group-hover:text-zinc-400"
                      }`} />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && item.badge && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white ${item.badgeColor || "bg-zinc-800"}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Profile & Footer Collapser */}
          <div className="border-t border-panel-border bg-[var(--panel-header-bg)]/40">
            {/* User section with active role switcher */}
            {!sidebarCollapsed ? (
              <div className="p-3 border-b border-panel-border flex items-center justify-between gap-2 font-mono">
                <div 
                  className="w-8 h-8 rounded-full bg-[var(--panel-header-bg)] border border-panel-border flex items-center justify-center text-xs font-bold text-brand-cyan shadow-inner shrink-0 cursor-pointer hover:border-brand-cyan"
                  onClick={() => setShowAuthModal(true)}
                  title="Switch Account / Sign In"
                >
                  {currentRole === "admin" ? "SA" : currentRole === "dispatcher" ? "LD" : currentRole === "analyst" ? "AN" : "TC"}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-bold text-[var(--foreground)] truncate" title={currentUser?.email}>
                    {currentUser?.name || "Alex S."}
                  </span>
                  <select
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value as RbacRole)}
                    className="bg-[var(--input-bg)] border border-panel-border rounded text-[9px] text-brand-cyan font-bold uppercase tracking-wider py-0.5 px-1 mt-0.5 outline-none cursor-pointer focus:border-brand-cyan"
                    title="Switch Active Operator Role to test RBAC restrictions"
                  >
                    <option value="admin">SOC Admin</option>
                    <option value="dispatcher">Lead Dispatcher</option>
                    <option value="analyst">Security Analyst</option>
                    <option value="technician">Hangar Tech</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setShowAuthModal(true);
                  }}
                  title={language === "ko" ? "로그아웃" : "Sign Out"}
                  className="p-1.5 text-zinc-500 hover:text-brand-rose hover:bg-brand-rose/10 rounded border border-transparent hover:border-brand-rose/30 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="p-2 border-b border-panel-border flex justify-center">
                <div 
                  className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-brand-cyan shadow-inner cursor-pointer"
                  title={`Active Role: ${currentRole.toUpperCase()}`}
                  onClick={() => setShowAuthModal(true)}
                >
                  {currentRole === "admin" ? "SA" : currentRole === "dispatcher" ? "LD" : currentRole === "analyst" ? "AN" : "TC"}
                </div>
              </div>
            )}

            {/* Sidebar toggle and emergency state buttons */}
            <div className="flex items-center justify-between p-2">
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5 rounded hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors"
                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? "" : "rotate-180"}`} />
              </button>

              {!sidebarCollapsed && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      if (panicMode) {
                        setPanicMode(false);
                        setThreatLevel("NORMAL");
                      } else {
                        setPanicMode(true);
                        setThreatLevel("CRITICAL");
                      }
                    }}
                    className={`p-1 px-2 rounded border font-mono text-[9px] font-bold tracking-tighter uppercase transition-all ${
                      panicMode 
                        ? "bg-brand-emerald text-black border-brand-emerald hover:bg-brand-emerald/80"
                        : "bg-brand-rose/10 text-brand-rose border-brand-rose/30 hover:bg-brand-rose/20"
                    }`}
                  >
                    {panicMode ? t("layout.reset_soc") : t("layout.test_panic")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)] text-[var(--foreground)] relative transition-colors duration-300">
          {/* Top Header */}
          <header className="h-14 border-b border-panel-border bg-[var(--panel-bg)] backdrop-blur-md flex items-center justify-between px-6 z-10">
            {/* Breadcrumbs and Path */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
                <span>SOC</span>
                <span>/</span>
                <span>REG_KST</span>
                <span>/</span>
                <span className="text-[var(--foreground)] font-bold">{selectedRegion.split(" ")[0]}</span>
                <span>/</span>
                <span className="text-brand-cyan font-bold">{activeTab}</span>
              </div>
            </div>

            {/* Central Live Ticker (when alert is active) */}
            <div className="flex-1 max-w-lg mx-6 hidden lg:block">
              <div className="border border-panel-border bg-[var(--panel-header-bg)] rounded px-3 py-1 flex items-center gap-2.5 font-mono text-[11px] overflow-hidden">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse"></span>
                <span className="text-zinc-500 uppercase tracking-wider font-bold">{t("layout.timeline")}</span>
                <span className="text-[var(--foreground)] truncate tracking-wide animate-pulse-slow">
                  {panicMode 
                    ? t("layout.timeline_panic") 
                    : t("layout.timeline_normal")}
                </span>
              </div>
            </div>

            {/* Header Right Stats and Actions */}
            <div className="flex items-center gap-4 font-mono">
              {/* Region Select */}
              <div className="relative flex items-center bg-[var(--panel-header-bg)] border border-panel-border rounded px-2.5 py-1 text-xs">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 mr-1.5" />
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-transparent border-none outline-none font-mono text-[var(--foreground)] pr-4 appearance-none cursor-pointer text-[11px]"
                >
                  <option value="Seoul - Gangnam SOC">{t("layout.region.seoul")}</option>
                  <option value="Seoul - Pangyo Valley">{t("layout.region.pangyo")}</option>
                  <option value="California - Cupertino Dev">{t("layout.region.california")}</option>
                </select>
                <ChevronRight className="w-3 h-3 text-zinc-500 pointer-events-none absolute right-2.5 rotate-90" />
              </div>

              {/* Language Switcher */}
              <div className="flex border border-panel-border rounded overflow-hidden text-[9px] font-bold">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-2 py-1.5 transition-all ${
                    language === "en"
                      ? "bg-brand-cyan text-black"
                      : "bg-[var(--panel-header-bg)] text-zinc-500 hover:text-[var(--foreground)]"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("ko")}
                  className={`px-2 py-1.5 transition-all ${
                    language === "ko"
                      ? "bg-brand-cyan text-black"
                      : "bg-[var(--panel-header-bg)] text-zinc-500 hover:text-[var(--foreground)]"
                  }`}
                >
                  KO
                </button>
              </div>

              {/* Theme Switcher (Light / Dark Mode) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-panel-border bg-[var(--panel-header-bg)] hover:border-panel-border-hover text-xs font-bold transition-all cursor-pointer shadow-sm"
                title={theme === "dark" ? "라이트 모드로 전환 (Switch to Light Mode)" : "다크 모드로 전환 (Switch to Dark Mode)"}
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px] text-zinc-300">LIGHT</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-brand-cyan" />
                    <span className="text-[10px] text-zinc-600">DARK</span>
                  </>
                )}
              </button>

              {/* Precise Time indicators */}
              <div className="hidden sm:flex flex-col text-right pr-2">
                <span className="text-xs font-bold text-[var(--foreground)] tracking-wider tabular-nums">{currentTime}</span>
                <span className="text-[9px] text-zinc-500 tabular-nums">{utcTime}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-l border-panel-border pl-4">
                <button className="p-1.5 rounded bg-[var(--panel-header-bg)] border border-panel-border hover:border-panel-border-hover text-zinc-500 hover:text-[var(--foreground)] transition-all relative">
                  <Bell className="w-4 h-4" />
                  {incidentCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-rose rounded-full animate-pulse"></span>
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Main Subview Content Scrollable */}
          <main className="flex-1 overflow-y-auto p-6 relative map-grid">
            {children}
          </main>

          {/* Footer Bar */}
          <footer className="h-8 border-t border-panel-border bg-[var(--panel-bg)] flex items-center justify-between px-6 font-mono text-[10px] text-zinc-500 z-10">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span className={`w-1.5 h-1.5 rounded-full ${panicMode ? "bg-brand-rose animate-ping" : "bg-brand-emerald"}`}></span>
                {t("layout.cloud_link")} <span className="font-bold text-white">{t("layout.cloud_secure")}</span>
              </span>
              <span className="hidden md:inline">|</span>
              <span className="hidden md:inline">
                {t("layout.api_status")} <span className="text-brand-emerald font-bold">100% UP</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span>{t("layout.db_cluster")} <span className="text-zinc-400 font-bold">{t("layout.db_replicated")}</span></span>
              <span>|</span>
              <span>{t("layout.ver")} <span className="text-zinc-400 font-bold">v3.4.12-PROD</span></span>
            </div>
          </footer>
        </div>
      </div>

      {/* Authentication Gateway Modal */}
      <AuthModal
        isOpen={!isAuthenticated || showAuthModal}
        onClose={() => setShowAuthModal(false)}
        canClose={isAuthenticated}
      />
    </div>
  );
}
