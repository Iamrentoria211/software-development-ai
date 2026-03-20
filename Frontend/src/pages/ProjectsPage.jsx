import { useState } from "react"
import useAppStore from "../store/useAppStore"

export default function ProjectsPage() {
  const { projects, addProject, setActiveProject, setScreen } = useAppStore()
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const colors = [
    { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30" },
    { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
    { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
    { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/30" },
    { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  ]

  const handleCreate = () => {
    if (!name.trim()) return
    const newProject = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      sections: {},
    }
    addProject(newProject)
    setName("")
    setDescription("")
    setShowModal(false)
  }

  const handleOpen = (project) => {
    setActiveProject(project.id)
    setScreen("detail")
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My projects</h1>
          <p className="text-sm text-slate-500 mt-1">Click a project to view its blueprint</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New project
        </button>
      </div>

      {/* Grid */}
      <div className="px-8 pb-8 grid grid-cols-2 gap-4">
        {projects.map((project, i) => {
          const color = colors[i % colors.length]
          const done = Object.keys(project.sections || {}).length
          const progress = Math.round((done / 12) * 100)
          const initials = project.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

          return (
            <div
              key={project.id}
              onClick={() => handleOpen(project)}
              className="bg-[#111320] border border-[#1e2235] hover:border-[#2a2d4a] rounded-xl p-5 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${color.bg} ${color.text}`}>
                  {initials}
                </div>
                <span className="text-[#2a2d4a] text-lg">···</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{project.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                {project.description || "No description provided."}
              </p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500">
                  {done === 12 ? "Complete" : done === 0 ? "Not started" : "In progress"}
                </span>
                <span className={`text-[10px] font-medium ${done === 12 ? "text-green-400" : "text-indigo-400"}`}>
                  {done}/12
                </span>
              </div>
              <div className="h-1 bg-[#1e2235] rounded-full">
                <div
                  className={`h-full rounded-full transition-all ${done === 12 ? "bg-green-500" : "bg-indigo-500"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )
        })}

        {/* New project card */}
        <div
          onClick={() => setShowModal(true)}
          className="bg-[#0a0c17] border border-dashed border-[#2a2d4a] hover:border-indigo-500/40 rounded-xl p-5 cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[160px] transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-[#1e2235] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5080" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <p className="text-xs text-[#3d4266]">New project</p>
        </div>
      </div>

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111320] border border-[#1e2235] rounded-xl p-6 w-[420px]">
            <h2 className="text-base font-semibold text-white mb-4">Create new project</h2>

            <label className="text-xs text-slate-500 block mb-1">Project name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="e.g. Food Delivery App"
              className="w-full bg-[#0d0f18] border border-[#2a2d4a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#3d4266] focus:outline-none focus:border-indigo-500 mb-4 transition-colors"
              autoFocus
            />

            <label className="text-xs text-slate-500 block mb-1">Project description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project idea in detail. The more specific you are, the better the blueprint."
              rows={4}
              className="w-full bg-[#0d0f18] border border-[#2a2d4a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#3d4266] focus:outline-none focus:border-indigo-500 mb-5 resize-none transition-colors"
            />

            <div className="flex gap-3">
              <button
                onClick={() => { setShowModal(false); setName(""); setDescription("") }}
                className="flex-1 bg-transparent border border-[#2a2d4a] text-slate-400 text-sm rounded-lg py-2.5 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg py-2.5 transition-colors"
              >
                Create project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}