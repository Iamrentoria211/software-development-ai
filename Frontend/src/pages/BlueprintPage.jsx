import { useState } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import useAppStore from "../store/useAppStore"

const SECTIONS = [
  "Tech stack", "Folder structure", "SDLC", "Security practices",
  "Best practices", "CI/CD guide", "Roadmap", "Database schema",
  "API design", "Testing strategy", "Timeline", "Team structure",
]

const API_URL = "http://localhost:8000"

export default function BlueprintPage() {
  const { getActiveProject, updateProject, setScreen, setActiveSection, activeSection } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const project = getActiveProject()

  if (!project) {
    setScreen("projects")
    return null
  }

  const currentContent = project.sections?.[activeSection]
  const done = Object.keys(project.sections || {}).length

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(`${API_URL}/blueprint`, {
        project_name: project.name,
        project_description: project.description,
        section: activeSection,
      })
      updateProject(project.id, {
        sections: {
          ...project.sections,
          [activeSection]: res.data.content,
        },
      })
    } catch (err) {
      setError("Failed to generate. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const content = Object.entries(project.sections || {})
      .map(([section, content]) => `# ${section}\n\n${content}`)
      .join("\n\n---\n\n")
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${project.name.replace(/\s+/g, "_")}_blueprint.txt`
    a.click()
  }

  return (
    <div className="h-full flex overflow-hidden">

      {/* Section sidebar */}
      <div className="w-[168px] bg-[#0a0c17] border-r border-[#1e2235] flex flex-col flex-shrink-0">
        {/* Back button */}
        <div className="p-3 border-b border-[#1e2235]">
          <button
            onClick={() => setScreen("detail")}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-400 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </button>
        </div>

        <p className="text-[10px] font-semibold text-[#3d4266] uppercase tracking-widest px-3 pt-3 pb-2">
          Sections
        </p>

        <div className="flex-1 overflow-y-auto">
          {SECTIONS.map((section) => {
            const isDone = project.sections?.[section]
            const isActive = section === activeSection
            return (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left border-l-2 transition-colors text-xs ${
                  isActive
                    ? "bg-indigo-500/5 border-indigo-500 text-indigo-300 font-medium"
                    : isDone
                    ? "border-transparent text-green-400 hover:bg-white/5"
                    : "border-transparent text-slate-500 hover:bg-white/5"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  isActive ? "bg-indigo-500" : isDone ? "bg-green-500" : "bg-[#2a2d4a]"
                }`} />
                {section}
              </button>
            )
          })}
        </div>

        {/* Progress */}
        <div className="p-2.5 border-t border-[#1e2235]">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-slate-500">Progress</span>
            <span className="text-green-400 font-medium">{done}/12</span>
          </div>
          <div className="h-1 bg-[#1e2235] rounded-full">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${(done / 12) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Content header */}
        <div className="px-6 py-4 border-b border-[#1e2235] flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-white">{activeSection}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{project.name}</p>
          </div>
          <div className="flex gap-2">
            {done > 0 && (
              <button
                onClick={handleDownload}
                className="text-xs bg-[#1e2235] hover:bg-[#2a2d4a] border border-[#2a2d4a] text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
              >
                Download all
              </button>
            )}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              {loading ? "Generating..." : currentContent ? "Regenerate" : "Generate"}
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-4 mb-4">
              {error}
            </div>
          )}

          {loading && (
            <div className="bg-[#111320] border border-[#1e2235] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                <p className="text-indigo-400 text-sm">Generating {activeSection}...</p>
              </div>
              <div className="h-1.5 bg-[#1e2235] rounded-full">
                <div className="h-full bg-indigo-500 rounded-full animate-pulse w-2/3" />
              </div>
            </div>
          )}

          {!loading && currentContent && (
            <div className="prose prose-invert max-w-none
              prose-headings:text-white prose-headings:font-semibold
              prose-h2:text-lg prose-h3:text-base
              prose-p:text-slate-300 prose-p:leading-relaxed prose-p:break-words
              prose-li:text-slate-300 prose-li:leading-relaxed
              prose-strong:text-white prose-code:text-indigo-300
              prose-pre:bg-[#0a0c17] prose-pre:border prose-pre:border-[#1e2235]
              overflow-hidden break-words">
              <ReactMarkdown>{currentContent}</ReactMarkdown>
            </div>
          )}

          {!loading && !currentContent && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-12 h-12 rounded-xl bg-[#111320] border border-[#1e2235] flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3d4266" strokeWidth="1.5">
                  <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-400 mb-1">Not generated yet</p>
              <p className="text-xs text-slate-600 mb-5">Click Generate to create this section with AI</p>
              <button
                onClick={handleGenerate}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
              >
                Generate {activeSection}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}