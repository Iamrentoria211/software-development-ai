import { useState } from "react"
import useAppStore from "../store/useAppStore"

const WORKSPACE_ITEMS = [
  {
    id: "projects",
    label: "Projects",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "templates",
    label: "Templates",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    id: "blueprints",
    label: "Blueprints",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    id: "askai",
    label: "Ask AI",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    badge: "New",
  },
]

const TOOLS_ITEMS = [
  {
    id: "techradar",
    label: "Tech radar",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
  },
  {
    id: "stackcompare",
    label: "Stack compare",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    id: "costestimator",
    label: "Cost estimator",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
]

const GENERAL_ITEMS = [
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
  {
    id: "changelog",
    label: "Changelog",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: "feedback",
    label: "Feedback",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const { setScreen, screen } = useAppStore()
  const [workspaceOpen, setWorkspaceOpen] = useState(true)
  const [toolsOpen, setToolsOpen] = useState(true)

  const NavButton = ({ item }) => (
    <button
      onClick={() => setScreen(item.id)}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors mb-0.5 ${
        screen === item.id
          ? "bg-indigo-500/10 text-indigo-400"
          : "text-slate-400 hover:bg-white/5 hover:text-slate-300"
      }`}
    >
      <span className={screen === item.id ? "text-indigo-400" : "text-slate-500"}>
        {item.icon}
      </span>
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge && (
        <span className="text-[9px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </button>
  )

  const DropdownSection = ({ label, icon, isOpen, onToggle, items }) => (
    <>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-slate-300 transition-colors mb-0.5"
      >
        <span className="text-slate-500">{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <div className="ml-3 border-l border-[#1e2235] pl-1 mb-1">
          {items.map((item) => (
            <NavButton key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  )

  return (
    <aside className="w-[196px] bg-[#0a0c17] border-r border-[#1e2235] flex flex-col flex-shrink-0 overflow-hidden">

      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#1e2235]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">DevBlueprint</p>
            <p className="text-[10px] text-[#3d4266] mt-0.5">AI dev consultant</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="px-2 pt-3 pb-1 flex-1 overflow-y-auto min-h-0">

        {/* Workspace dropdown */}
        <DropdownSection
          label="Workspace"
          isOpen={workspaceOpen}
          onToggle={() => setWorkspaceOpen((v) => !v)}
          items={WORKSPACE_ITEMS}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          }
        />

        {/* Tools dropdown */}
        <DropdownSection
          label="Tools"
          isOpen={toolsOpen}
          onToggle={() => setToolsOpen((v) => !v)}
          items={TOOLS_ITEMS}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
            </svg>
          }
        />

      </div>

      {/* General */}
      <div className="px-2 py-2 border-t border-[#1e2235]">
        <p className="text-[10px] font-semibold text-[#3d4266] uppercase tracking-widest px-2 mb-1.5">
          General
        </p>
        {GENERAL_ITEMS.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </div>

      {/* Account */}
      <div className="px-2 py-2 border-t border-[#1e2235]">
        <button
          onClick={() => setScreen("account")}
          className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors ${
            screen === "account" ? "bg-indigo-500/10" : "hover:bg-white/5"
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className={`text-xs font-medium truncate ${screen === "account" ? "text-indigo-300" : "text-slate-300"}`}>
              My account
            </p>
            <p className="text-[10px] text-[#3d4266] truncate">Julius Rentoria</p>
          </div>
        </button>
      </div>

    </aside>
  )
}