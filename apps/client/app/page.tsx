import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useHabitStore } from "../store/useHabitStore";

// View components
import { Onboarding } from "../components/Onboarding";
import { Dashboard } from "../components/Dashboard";
import { HabitEngine } from "../components/HabitEngine";
import { CognitiveAnalytics } from "../components/CognitiveAnalytics";
import { TrophyRoom } from "../components/TrophyRoom";
import { WellnessLogger } from "../components/WellnessLogger";
import { FocusTimer } from "../components/FocusTimer";
import { UserProfile } from "../components/UserProfile";
import { UserSettings } from "../components/UserSettings";
import { NeuroCircadianLab } from "../components/NeuroCircadianLab";

export default function Home() {
  const {
    currentView,
    setView,
    weeklyFocus,
    userLevel,
    userName,
    appTheme,
    syncToSystemTheme,
    updateSettings
  } = useHabitStore();

  React.useEffect(() => {
    if (!syncToSystemTheme) return;

    const getSystemThemeMapping = () => {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return isDark ? "ambient-green" : "cyber-orange";
    };

    // Apply initially
    const targetTheme = getSystemThemeMapping();
    if (appTheme !== targetTheme) {
      updateSettings({ appTheme: targetTheme });
    }

    // Set up listener for system runtime theme variations
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const updatedTheme = getSystemThemeMapping();
      updateSettings({ appTheme: updatedTheme });
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    } else {
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [syncToSystemTheme, appTheme, updateSettings]);

  return (
    <div className={`min-h-screen bg-[#111415] text-[#e1e3e4] flex flex-col font-sans selection:bg-[#95d4b3]/30 theme-${appTheme}`}>
      
      {/* Header Block with Subtitle */}
      <header className="sticky top-0 z-40 bg-[#111415]/95 border-b border-[#323536] px-4 py-3 sm:px-6 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          {/* Logo Icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#95d4b3] to-[#e9c176] flex items-center justify-center text-[#2f3133] shadow-md">
            <span className="material-symbols-outlined text-lg font-bold">local_fire_department</span>
          </div>
          <div>
            <h1 className="font-display font-extrabold text-base tracking-tight text-[#e1e3e4]">HabitFlow AI</h1>
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#95d4b3] block">Ambient Wellness System</span>
          </div>
        </div>

        {/* Quick Screen View Selector */}
        {currentView !== "welcome" && (
          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-[#1d2021] rounded-xl border border-[#44474a]/40">
            {[
              { id: "dashboard", label: "Focus Panel", icon: "offline_bolt" },
              { id: "timer", label: "Focus Timer", icon: "schedule" },
              { id: "habits", label: "Habit Stack", icon: "cognition" },
              { id: "cognitive", label: "Neuro Analysis", icon: "psychology" },
              { id: "trophy", label: "Trophy XP", icon: "trophy" },
              { id: "logger", label: "Health Log", icon: "water_drop" }
            ].map((screen) => (
              <button
                key={screen.id}
                id={`screen-selector-${screen.id}`}
                type="button"
                onClick={() => setView(screen.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer border-none ${
                  currentView === screen.id 
                    ? "bg-[#323536] text-[#95d4b3]" 
                    : "text-[#c5c6ca] hover:bg-[#323536]/40 hover:text-white bg-transparent"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{screen.icon}</span>
                <span>{screen.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Profile & Settings Navigation Badge */}
        <div className="flex items-center gap-2">
          {/* Quick Config Button */}
          <button
            id="header-shortcut-settings-btn"
            type="button"
            onClick={() => setView("settings")}
            className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
              currentView === "settings"
                ? "bg-[#323536] text-[#95d4b3] border-[#95d4b3]"
                : "bg-[#1d2021]/80 hover:bg-[#323536]/80 text-[#c5c6ca] hover:text-white border-[#44474a]/30"
            }`}
            title="Focus Engine Config"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>

          {/* Quick Profile/Level Badge */}
          <button
            id="header-shortcut-profile-btn"
            type="button"
            onClick={() => setView("profile")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-left font-mono cursor-pointer ${
              currentView === "profile"
                ? "bg-[#323536] text-[#95d4b3] border-[#95d4b3]"
                : "bg-[#1d2021]/80 hover:bg-[#323536]/60 border-[#44474a]/30"
            }`}
          >
            <span className="text-xs">⚡</span>
            <div>
              <span className={`text-[10px] block font-bold leading-none ${currentView === "profile" ? "text-[#95d4b3]" : "text-[#c5c6ca]"}`}>
                Level {userLevel}
              </span>
              <span className="text-[9px] text-[#8f9194] leading-none">
                {userName} (You)
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* Main Core Full-Stack Page Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Sidebar (Desktop Only) */}
        {currentView !== "welcome" && (
          <aside className="w-full md:w-64 bg-[#191c1d]/60 border-r border-[#323536] p-5 shrink-0 space-y-6 hidden md:block">
            {/* User Recovery Score Ring indicator */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-[#1d2021]/60 to-[#12533a]/15 border border-[#12533a]/20">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[9px] text-[#8f9194] uppercase tracking-wider">RECOVERY STATE</span>
                <span className="text-xs text-[#95d4b3]">Stable</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#95d4b3]/60 flex items-center justify-center font-display font-extrabold text-[#95d4b3] bg-[#111415] text-sm">
                  85%
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#e1e3e4]">Circadian Ready</h4>
                  <p className="text-[10px] text-[#c5c6ca] leading-tight">Melatonin optimal. 1.2 hours sunlight logged.</p>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <nav className="space-y-1">
              <span className="text-[10px] font-mono text-[#8f9194] uppercase tracking-widest block pl-2 mb-2">SYSTEM UTILITIES</span>
              
              {[
                { id: "dashboard", label: "Daily Rituals Portal", icon: "home" },
                { id: "timer", label: "Deep Work Tunnel", icon: "schedule" },
                { id: "habits", label: "Morning & Evening Stack", icon: "cognition" },
                { id: "cognitive", label: "Neurological Records", icon: "psychology" },
                { id: "lab", label: "Neuro-Circadian Lab", icon: "science" },
                { id: "trophy", label: "Trophy Room & XP", icon: "trophy" },
                { id: "logger", label: "Biomarker Entry", icon: "water_drop" },
                { id: "profile", label: "Identity & Baselines", icon: "person" },
                { id: "settings", label: "Focus Engine Config", icon: "settings" }
              ].map((item) => (
                <button
                  key={item.id}
                  id={`sidebar-link-${item.id}`}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer border-none ${
                    currentView === item.id
                      ? "bg-[#12533a]/30 text-[#95d4b3] border-l-2 border-[#95d4b3]"
                      : "text-[#c5c6ca] hover:bg-[#323536]/40 hover:text-white bg-transparent"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="pt-4 border-t border-[#323536]">
              <button
                id="sidebar-log-quick-btn"
                type="button"
                onClick={() => setView("logger")}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#95d4b3]/15 to-[#e9c176]/15 hover:bg-gradient-to-r hover:from-[#95d4b3]/25 hover:to-[#e9c176]/25 border border-[#95d4b3]/30 text-[#e1e3e4] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xs">add</span>
                LOG BIOPARAMETER
              </button>
            </div>
          </aside>
        )}

        {/* Viewport Core Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {currentView === "welcome" && <Onboarding />}
              {currentView === "dashboard" && <Dashboard />}
              {currentView === "habits" && <HabitEngine />}
              {currentView === "cognitive" && <CognitiveAnalytics />}
              {currentView === "trophy" && <TrophyRoom />}
              {currentView === "logger" && <WellnessLogger />}
              {currentView === "timer" && <FocusTimer />}
              {currentView === "profile" && <UserProfile />}
              {currentView === "settings" && <UserSettings />}
              {currentView === "lab" && <NeuroCircadianLab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom Nav (Mobile/Tablet Only) */}
      {currentView !== "welcome" && (
        <nav className="sticky bottom-0 z-40 bg-[#191c1d]/95 border-t border-[#323536] py-2.5 px-2 grid grid-cols-9 md:hidden text-center backdrop-blur-md text-[10px]">
          {[
            { id: "dashboard", label: "Rituals", icon: "home" },
            { id: "timer", label: "Deep", icon: "schedule" },
            { id: "habits", label: "Stacks", icon: "cognition" },
            { id: "cognitive", label: "Neuro", icon: "psychology" },
            { id: "lab", label: "Lab", icon: "science" },
            { id: "trophy", label: "Trophy", icon: "trophy" },
            { id: "logger", label: "Log", icon: "water_drop" },
            { id: "profile", label: "Profile", icon: "person" },
            { id: "settings", label: "Config", icon: "settings" }
          ].map((screen) => (
            <button
              key={screen.id}
              id={`mobile-nav-btn-${screen.id}`}
              type="button"
              onClick={() => setView(screen.id)}
              className={`flex flex-col items-center justify-center gap-1 cursor-pointer bg-transparent border-none ${
                currentView === screen.id ? "text-[#95d4b3]" : "text-[#8f9194] hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{screen.icon}</span>
              <span className="text-[9px] font-semibold leading-none">{screen.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Branding and disclaimer footer */}
      <footer className="py-4 px-6 border-t border-[#323536] text-center text-[10px] text-[#8f9194] space-y-1">
        <p>HabitFlow AI is an ambient wellness and behavioral design feedback panel. Synchrony protocol stable.</p>
        <p className="font-mono text-[9px] tracking-widest text-[#95d4b3]">UTC DEPLOYMENT OK • NO TELEMETRY LEAK</p>
      </footer>
    </div>
  );
}
