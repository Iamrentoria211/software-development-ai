import { useState } from "react"
import useAppStore from "../store/useAppStore"

export default function ProjectsPage() {
  const { projects, addProject, deleteProject, setActiveProject, setScreen } = useAppStore()
  const [showModal, setShowModal] = useState(false)
  const [showDeleteId, setShowDeleteId] = useState(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [menuOpenId, setMenuOpenId] = useState(null)

  const colors = [
    { bg: "bg-indigo-500/10", text: "text-indigo-400", accent: "bg-indigo-500" },
    { bg: "bg-green-500/10", text: "text-green-400", accent: "bg-green-500" },
    { bg: "bg-amber-500/10", text: "text-amber-400", accent: "bg-amber-500" },
    { bg: "bg-pink-500/10", text: "text-pink-400", accent: "bg-pink-500" },
    { bg: "bg-cyan-500/10", text: "text-cyan-400", accent: "bg-cyan-500" },
  ]

  const handleCreate = () => {
    if (!name.trim()) return
    const newProject = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
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

  const handleDelete = (id) => {
    deleteProject(id)
    setShowDeleteId(null)
    setMenuOpenId(null)
  }

  const projectToDelete = projects.find((p) => p.id === showDeleteId)

  return (
    <div className="h-full overflow-y-auto" onClick={() => setMenuOpenId(null)}>

      {/* Header */}
      <div className="px-8 pt-8 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My projects</h1>
          <p className="text-sm text-slate-500 mt-1">
            {projects.length === 0
              ? "No projects yet"
              : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
          </p>
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

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#111320] border border-[#1e2235] flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3d4266" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">No projects yet</p>
          <p className="text-xs text-slate-600 mb-5">Create your first project to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Create your first project
          </button>
        </div>
      )}

      {/* Table */}
      {projects.length > 0 && (
        <div className="px-8 pb-8">
          <div className="bg-[#111320] border border-[#1e2235] rounded-xl overflow-hidden">

            {/* Table header */}
            <div className="grid grid-cols-[2fr_3fr_1fr_1fr_40px] gap-4 px-5 py-3 border-b border-[#1e2235]">
              <span className="text-[10px] font-semibold text-[#3d4266] uppercase tracking-widest">Project</span>
              <span className="text-[10px] font-semibold text-[#3d4266] uppercase tracking-widest">Description</span>
              <span className="text-[10px] font-semibold text-[#3d4266] uppercase tracking-widest">Created</span>
              <span className="text-[10px] font-semibold text-[#3d4266] uppercase tracking-widest">Status</span>
              <span />
            </div>

            {/* Table rows */}
            {projects.map((project, i) => {
              const color = colors[i % colors.length]
              const done = Object.keys(project.sections || {}).length
              const initials = project.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()

              const statusLabel = done === 12 ? "Complete" : done === 0 ? "Not started" : "In progress"
              const statusStyle =
                done === 12
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : done === 0
                  ? "bg-[#1e2235] text-slate-500 border border-[#2a2d4a]"
                  : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"

              return (
                <div
                  key={project.id}
                  className="grid grid-cols-[2fr_3fr_1fr_1fr_40px] gap-4 px-5 py-4 border-b border-[#1e2235] last:border-0 hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Project name + icon */}
                  <div
                    className="flex items-center gap-3 cursor-pointer min-w-0"
                    onClick={() => handleOpen(project)}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${color.bg} ${color.text}`}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {project.name}
                      </p>
                      <p className="text-[10px] text-[#3d4266]">{done}/12 sections</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div
                    className="flex items-center cursor-pointer min-w-0"
                    onClick={() => handleOpen(project)}
                  >
                    <p className="text-xs text-slate-500 truncate">
                      {project.description || "No description provided."}
                    </p>
                  </div>

                  {/* Created date */}
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleOpen(project)}
                  >
                    <p className="text-xs text-slate-500">{project.createdAt}</p>
                  </div>

                  {/* Status badge */}
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleOpen(project)}
                  >
                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${statusStyle}`}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Actions menu */}
                  <div className="flex items-center justify-center relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setMenuOpenId(menuOpenId === project.id ? null : project.id)
                      }}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="5" r="1" fill="currentColor" />
                        <circle cx="12" cy="12" r="1" fill="currentColor" />
                        <circle cx="12" cy="19" r="1" fill="currentColor" />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    {menuOpenId === project.id && (
                      <div
                        className="absolute right-0 top-8 bg-[#1a1d2e] border border-[#2a2d4a] rounded-lg py-1 w-36 z-20 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => { handleOpen(project); setMenuOpenId(null) }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          Open
                        </button>
                        <div className="h-px bg-[#2a2d4a] my-1" />
                        <button
                          onClick={() => { setShowDeleteId(project.id); setMenuOpenId(null) }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
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
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

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

      {/* Delete confirmation */}
      {showDeleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111320] border border-red-500/30 rounded-xl p-6 w-[320px]">
            <h2 className="text-base font-semibold text-red-400 mb-2">Delete project?</h2>
            <p className="text-xs text-slate-500 mb-2">This will permanently delete</p>
            <div className="bg-[#1e2235] rounded-lg px-3 py-2 text-sm text-white font-medium mb-3">
              {projectToDelete?.name}
            </div>
            <p className="text-xs text-slate-500 mb-5">and all generated sections. This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteId(null)}
                className="flex-1 border border-[#2a2d4a] text-slate-400 text-sm rounded-lg py-2 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteId)}
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