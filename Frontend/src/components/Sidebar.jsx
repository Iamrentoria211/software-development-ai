import useAppStore from "../store/useAppStore"

const NAV_ITEMS = [
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
]

export default function Sidebar() {
  const { projects, activeProjectId, setActiveProject, setScreen, screen } = useAppStore()

  const colors = [
    { bg: "bg-indigo-500/10", text: "text-indigo-400" },
    { bg: "bg-green-500/10", text: "text-green-400" },
    { bg: "bg-amber-500/10", text: "text-amber-400" },
    { bg: "bg-pink-500/10", text: "text-pink-400" },
    { bg: "bg-cyan-500/10", text: "text-cyan-400" },
  ]

  const handleProjectClick = (project) => {
    setActiveProject(project.id)
    setScreen("detail")
  }

  const totalSections = projects.reduce(
    (acc, p) => acc + Object.keys(p.sections || {}).length,
    0
  )

  const completedProjects = projects.filter(
    (p) => Object.keys(p.sections || {}).length === 12
  ).length

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

      {/* Nav items */}
      <div className="px-2 pt-3 pb-1">
        <p className="text-[10px] font-semibold text-[#3d4266] uppercase tracking-widest px-2 mb-1.5">
          Menu
        </p>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
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
            {item.label}
          </button>
        ))}
      </div>

      <div className="px-2 mt-1">
        <div className="h-px bg-[#1e2235]" />
      </div>

      {/* Recent projects */}
      <div className="flex-1 overflow-y-auto px-2 pt-3">
        <p className="text-[10px] font-semibold text-[#3d4266] uppercase tracking-widest px-2 mb-1.5">
          Recent projects
        </p>

        {projects.length === 0 ? (
          <p className="text-[11px] text-[#2a2d4a] px-2 py-1">No projects yet</p>
        ) : (
          projects.slice(0, 6).map((project, i) => {
            const color = colors[i % colors.length]
            const done = Object.keys(project.sections || {}).length
            const isActive = project.id === activeProjectId
            const initials = project.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()

            return (
              <button
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors mb-0.5 ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-300"
                    : "hover:bg-white/5"
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${color.bg} ${color.text}`}>
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-[11px] font-medium truncate ${isActive ? "text-indigo-300" : "text-slate-400"}`}>
                    {project.name}
                  </p>
                  <p className="text-[10px] text-[#3d4266]">{done}/12</p>
                </div>
                {done === 12 && (
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                )}
              </button>
            )
          })
        )}
      </div>

      {/* New project button */}
      <div className="p-2 border-t border-[#1e2235]">
        <button
          onClick={() => setScreen("projects")}
          className="w-full border border-dashed border-[#2a2d4a] hover:border-indigo-500/40 hover:bg-indigo-500/5 text-[#3d4266] hover:text-indigo-400 text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New project
        </button>
      </div>

      {/* Stats */}
      <div className="px-2 pb-2">
        <div className="grid grid-cols-3 gap-1">
          {[
            { value: projects.length, label: "Projects" },
            { value: totalSections, label: "Sections" },
            { value: completedProjects, label: "Done" },
          ].map((s) => (
            <div key={s.label} className="bg-[#111320] rounded-md py-1.5 text-center">
              <p className="text-indigo-400 text-sm font-bold">{s.value}</p>
              <p className="text-[#3d4266] text-[9px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}