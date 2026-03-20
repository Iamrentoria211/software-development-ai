import { useState } from "react"
import useAppStore from "../store/useAppStore"

const SECTIONS = [
  "Tech stack", "Folder structure", "SDLC", "Security practices",
  "Best practices", "CI/CD guide", "Roadmap", "Database schema",
  "API design", "Testing strategy", "Timeline", "Team structure",
]

export default function ProjectDetailPage() {
  const { getActiveProject, deleteProject, setScreen, setActiveSection } = useAppStore()
  const [showDelete, setShowDelete] = useState(false)
  const project = getActiveProject()

  if (!project) {
    setScreen("projects")
    return null
  }

  const done = Object.keys(project.sections || {}).length
  const progress = Math.round((done / 12) * 100)

  const handleDelete = () => {
    deleteProject(project.id)
    setScreen("projects")
  }

  const handleOpenSection = (section) => {
    setActiveSection(section)
    setScreen("blueprint")
  }

  const colors = [
    { bg: "bg-indigo-500/10", text: "text-indigo-400" },
    { bg: "bg-green-500/10", text: "text-green-400" },
    { bg: "bg-amber-500/10", text: "text-amber-400" },
    { bg: "bg-pink-500/10", text: "text-pink-400" },
    { bg: "bg-cyan-500/10", text: "text-cyan-400" },
  ]

  const projectIndex = useAppStore.getState().projects.findIndex(p => p.id === project.id)
  const color = colors[projectIndex % colors.length]
  const initials = project.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-8 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-5 text-xs">
          <button onClick={() => setScreen("projects")} className="text-slate-500 hover:text-indigo-400 transition-colors">
            Projects
          </button>
          <span className="text-[#2a2d4a]">/</span>
          <span className="text-slate-300">{project.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0 ${color.bg} ${color.text}`}>
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white mb-1">{project.name}</h1>
              <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
                {project.description || "No description provided."}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => { setActiveSection("Tech stack"); setScreen("blueprint") }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Open blueprint
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Meta */}
        <div className="flex gap-6 py-3 border-t border-b border-[#1e2235] mb-5 text-xs text-slate-500">
          <span>Created <span className="text-slate-300 font-medium">{project.createdAt}</span></span>
          <span>Model <span className="text-slate-300 font-medium">Gemini 2.5 Flash</span></span>
          <span>Sections <span className="text-slate-300 font-medium">{done}/12 generated</span></span>
        </div>

        {/* Progress */}
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Blueprint progress</p>
        <div className="bg-[#111320] border border-[#1e2235] rounded-xl p-4 mb-5 flex items-center gap-4">
          {/* Circle */}
          <div className="relative w-14 h-14 flex-shrink-0">
            <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
              <circle cx="28" cy="28" r="22" fill="none" stroke="#1e2235" strokeWidth="5" />
              <circle
                cx="28" cy="28" r="22" fill="none"
                stroke={done === 12 ? "#22c55e" : "#6366f1"}
                strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${done === 12 ? "text-green-400" : "text-indigo-400"}`}>
              {progress}%
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-1">
              {done === 12 ? "Blueprint complete!" : done === 0 ? "Not started yet" : `${done} of 12 sections generated`}
            </p>
            <p className="text-xs text-slate-500">
              {done === 12 ? "All sections generated. Ready to export." : "Click a section below or open the blueprint to generate."}
            </p>
          </div>
          {done === 12 && (
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
              Export all
            </button>
          )}
        </div>

        {/* Sections grid */}
        <div className="grid grid-cols-3 gap-2">
          {SECTIONS.map((section) => {
            const isDone = project.sections?.[section]
            return (
              <button
                key={section}
                onClick={() => handleOpenSection(section)}
                className="bg-[#111320] border border-[#1e2235] hover:border-[#2a2d4a] rounded-lg px-3 py-2.5 flex items-center gap-2 text-left transition-colors"
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? "bg-green-500/20 border border-green-500/50" : "bg-[#1e2235] border border-[#2a2d4a]"}`}>
                  {isDone && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs truncate ${isDone ? "text-green-400" : "text-slate-400"}`}>
                  {section}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Delete confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111320] border border-red-500/30 rounded-xl p-6 w-[320px]">
            <h2 className="text-base font-semibold text-red-400 mb-2">Delete project?</h2>
            <p className="text-xs text-slate-500 mb-2">This will permanently delete</p>
            <div className="bg-[#1e2235] rounded-lg px-3 py-2 text-sm text-white font-medium mb-3">
              {project.name}
            </div>
            <p className="text-xs text-slate-500 mb-5">and all generated sections. This cannot be undone.</p>
            <div className="flex gap-3">
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