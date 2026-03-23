import useAppStore from "../store/useAppStore"

const SECTIONS = [
  "Tech stack", "Folder structure", "SDLC", "Security practices",
  "Best practices", "CI/CD guide", "Roadmap", "Database schema",
  "API design", "Testing strategy", "Timeline", "Team structure",
]

export default function BlueprintsPage() {
  const { projects, setActiveProject, setActiveSection, setScreen } = useAppStore()

  const projectsWithContent = projects.filter(
    (p) => Object.keys(p.sections || {}).length > 0
  )

  const totalSections = projects.reduce(
    (acc, p) => acc + Object.keys(p.sections || {}).length, 0
  )

  const colors = [
    { bg: "bg-indigo-500/10", text: "text-indigo-400" },
    { bg: "bg-green-500/10", text: "text-green-400" },
    { bg: "bg-amber-500/10", text: "text-amber-400" },
    { bg: "bg-pink-500/10", text: "text-pink-400" },
    { bg: "bg-cyan-500/10", text: "text-cyan-400" },
  ]

  const handleOpenSection = (project, section) => {
    setActiveProject(project.id)
    setActiveSection(section)
    setScreen("blueprint")
  }

  return (
    <div className="h-full overflow-y-auto">

      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-[#1e2235]">
        <h1 className="text-2xl font-bold text-white mb-1">Blueprints</h1>
        <p className="text-sm text-slate-500">All generated blueprint content across your projects</p>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-xs text-slate-400">
              <span className="font-semibold text-white">{projects.length}</span> projects
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-slate-400">
              <span className="font-semibold text-white">{totalSections}</span> sections generated
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-400">
              <span className="font-semibold text-white">{projectsWithContent.length}</span> projects with content
            </span>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {projectsWithContent.length === 0 && (
        <div className="flex flex-col items-center justify-center h-96 text-center px-8">
          <div className="w-14 h-14 rounded-2xl bg-[#111320] border border-[#1e2235] flex items-center justify-center mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3d4266" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <p className="text-base font-semibold text-white mb-2">No blueprints generated yet</p>
          <p className="text-sm text-slate-500 mb-6 max-w-sm">
            Create a project and generate blueprint sections to see them here
          </p>
          <button
            onClick={() => setScreen("projects")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Go to Projects
          </button>
        </div>
      )}

      {/* Projects with blueprints */}
      <div className="px-8 py-6 flex flex-col gap-8">
        {projectsWithContent.map((project, pi) => {
          const color = colors[pi % colors.length]
          const done = Object.keys(project.sections || {}).length
          const initials = project.name
            .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

          return (
            <div key={project.id}>

              {/* Project header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${color.bg} ${color.text}`}>
                    {initials}
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">{project.name}</h2>
                    <p className="text-[10px] text-slate-500">{done}/12 sections · Created {project.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setActiveProject(project.id); setScreen("detail") }}
                    className="text-xs text-slate-500 hover:text-indigo-400 border border-[#1e2235] hover:border-indigo-500/30 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    View project
                  </button>
                  <button
                    onClick={() => {
                      const content = Object.entries(project.sections || {})
                        .map(([s, c]) => `# ${s}\n\n${c}`)
                        .join("\n\n---\n\n")
                      const blob = new Blob([content], { type: "text/plain" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `${project.name.replace(/\s+/g, "_")}_blueprint.txt`
                      a.click()
                    }}
                    className="text-xs text-slate-500 hover:text-green-400 border border-[#1e2235] hover:border-green-500/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download all
                  </button>
                </div>
              </div>

              {/* Sections grid */}
              <div className="grid grid-cols-3 gap-2">
                {SECTIONS.map((section) => {
                  const content = project.sections?.[section]
                  if (!content) return (
                    <div
                      key={section}
                      className="bg-[#0a0c17] border border-dashed border-[#1e2235] rounded-xl px-4 py-3 flex items-center gap-2.5 opacity-40"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2a2d4a] flex-shrink-0" />
                      <span className="text-xs text-slate-600">{section}</span>
                    </div>
                  )

                  return (
                    <button
                      key={section}
                      onClick={() => handleOpenSection(project, section)}
                      className="bg-[#111320] hover:bg-[#1a1d2e] border border-[#1e2235] hover:border-indigo-500/30 rounded-xl px-4 py-3 flex items-start gap-2.5 text-left transition-all group"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-300 group-hover:text-indigo-300 transition-colors mb-1">
                          {section}
                        </p>
                        <p className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed">
                          {content.slice(0, 80).replace(/[#*`]/g, "")}...
                        </p>
                      </div>
                      <svg
                        width="10" height="10" viewBox="0 0 24 24" fill="none"
                        stroke="#3d4266" strokeWidth="2"
                        className="flex-shrink-0 mt-1 group-hover:stroke-indigo-400 transition-colors"
                      >
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>
                  )
                })}
              </div>

              {/* Divider */}
              <div className="mt-8 h-px bg-[#1e2235]" />
            </div>
          )
        })}
      </div>
    </div>
  )
}