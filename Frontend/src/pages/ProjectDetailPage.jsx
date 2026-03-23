import { useState } from "react"
import useAppStore from "../store/useAppStore"

const SECTIONS = [
  "Tech stack", "Folder structure", "SDLC", "Security practices",
  "Best practices", "CI/CD guide", "Roadmap", "Database schema",
  "API design", "Testing strategy", "Timeline", "Team structure",
]

export default function ProjectDetailPage() {
  const { projects, getActiveProject, deleteProject, setScreen, setActiveSection } = useAppStore()
  const [showDelete, setShowDelete] = useState(false)
  const project = getActiveProject()

  if (!project) {
    setScreen("projects")
    return null
  }

  const done = Object.keys(project.sections || {}).length
  const progress = Math.round((done / 12) * 100)

  const colors = [
    { bg: "bg-indigo-500/10", text: "text-indigo-400", ring: "ring-indigo-500/30" },
    { bg: "bg-green-500/10", text: "text-green-400", ring: "ring-green-500/30" },
    { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/30" },
    { bg: "bg-pink-500/10", text: "text-pink-400", ring: "ring-pink-500/30" },
    { bg: "bg-cyan-500/10", text: "text-cyan-400", ring: "ring-cyan-500/30" },
  ]

  const projectIndex = projects.findIndex((p) => p.id === project.id)
  const color = colors[projectIndex % colors.length]
  const initials = project.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleDelete = () => {
    deleteProject(project.id)
    setScreen("projects")
  }

  const handleOpenSection = (section) => {
    setActiveSection(section)
    setScreen("blueprint")
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-8 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-xs">
          <button
            onClick={() => setScreen("projects")}
            className="text-slate-500 hover:text-indigo-400 transition-colors"
          >
            Projects
          </button>
          <span className="text-[#2a2d4a]">/</span>
          <span className="text-slate-300">{project.name}</span>
        </div>

        {/* Header card */}
        <div className="bg-[#111320] border border-[#1e2235] rounded-xl p-6 mb-4">
          <div className="flex items-start justify-between gap-6">

            {/* Left: icon + info */}
            <div className="flex items-start gap-4 min-w-0">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 ring-1 ${color.bg} ${color.text} ${color.ring}`}>
                {initials}
              </div>
              <div className="min-w-0 pt-1">
                <h1 className="text-xl font-bold text-white mb-1.5 leading-tight">
                  {project.name}
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {project.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2 flex-shrink-0 pt-1">
              <button
                onClick={() => { setActiveSection("Tech stack"); setScreen("blueprint") }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
                Open blueprint
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="flex items-center gap-2 bg-transparent hover:bg-red-500/10 border border-[#2a2d4a] hover:border-red-500/40 text-slate-400 hover:text-red-400 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                </svg>
                Delete
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-6 mt-5 pt-5 border-t border-[#1e2235]">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Created <span className="text-slate-300 font-medium ml-1">{project.createdAt}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
              Model <span className="text-slate-300 font-medium ml-1">Gemini 2.5 Flash</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
              Sections <span className={`font-medium ml-1 ${done === 12 ? "text-green-400" : "text-indigo-400"}`}>{done}/12 generated</span>
            </div>
          </div>
        </div>

        {/* Progress card */}
        <div className="bg-[#111320] border border-[#1e2235] rounded-xl p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Blueprint progress
            </p>
            {done === 12 && (
              <button className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export all
              </button>
            )}
          </div>

          <div className="flex items-center gap-8">
            {/* Circle progress */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#1e2235" strokeWidth="5" />
                <circle
                  cx="32" cy="32" r="26"
                  fill="none"
                  stroke={done === 12 ? "#22c55e" : "#6366f1"}
                  strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${done === 12 ? "text-green-400" : "text-indigo-400"}`}>
                {progress}%
              </span>
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-white mb-1">
                {done === 12
                  ? "Blueprint complete!"
                  : done === 0
                  ? "Not started yet"
                  : `${done} of 12 sections generated`}
              </p>
              <p className="text-xs text-slate-500 mb-3">
                {done === 12
                  ? "All sections have been generated. Your blueprint is ready to export."
                  : "Click any section below or open the blueprint to start generating."}
              </p>
              {/* Progress bar */}
              <div className="h-1.5 bg-[#1e2235] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${done === 12 ? "bg-green-500" : "bg-indigo-500"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sections grid */}
        <div className="bg-[#111320] border border-[#1e2235] rounded-xl p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
            Sections
          </p>
          <div className="grid grid-cols-4 gap-2">
            {SECTIONS.map((section) => {
              const isDone = project.sections?.[section]
              return (
                <button
                  key={section}
                  onClick={() => handleOpenSection(section)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                    isDone
                      ? "bg-green-500/5 border-green-500/20 hover:border-green-500/40"
                      : "bg-[#0d0f18] border-[#1e2235] hover:border-indigo-500/30 hover:bg-indigo-500/5"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDone
                      ? "bg-green-500/20 border border-green-500/50"
                      : "bg-[#1e2235] border border-[#2a2d4a]"
                  }`}>
                    {isDone && (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-xs font-medium ${isDone ? "text-green-400" : "text-slate-400"}`}>
                    {section}
                  </span>
                  {!isDone && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3d4266" strokeWidth="2" className="ml-auto flex-shrink-0">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>

      </div>

      {/* Delete confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111320] border border-red-500/30 rounded-xl p-6 w-[320px]">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-white mb-1">Delete project?</h2>
            <p className="text-xs text-slate-500 mb-3">
              This will permanently delete <span className="text-white font-medium">{project.name}</span> and all {done} generated sections. This cannot be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 border border-[#2a2d4a] text-slate-400 text-sm rounded-lg py-2 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg py-2 transition-colors"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}