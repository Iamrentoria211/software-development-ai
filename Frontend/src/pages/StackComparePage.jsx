import { useState } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"

const API_URL = "http://localhost:8000"

const PRESET_COMPARISONS = [
  {
    label: "React vs Vue vs Svelte",
    techs: ["React", "Vue.js", "Svelte"],
    useCase: "Frontend web development",
    category: "Frontend",
  },
  {
    label: "Next.js vs Nuxt vs SvelteKit",
    techs: ["Next.js", "Nuxt.js", "SvelteKit"],
    useCase: "Full-stack web framework",
    category: "Frontend",
  },
  {
    label: "FastAPI vs Django vs Flask",
    techs: ["FastAPI", "Django", "Flask"],
    useCase: "Python backend API development",
    category: "Backend",
  },
  {
    label: "Node.js vs Bun vs Deno",
    techs: ["Node.js", "Bun", "Deno"],
    useCase: "JavaScript runtime for backend",
    category: "Backend",
  },
  {
    label: "PostgreSQL vs MySQL vs MongoDB",
    techs: ["PostgreSQL", "MySQL", "MongoDB"],
    useCase: "General purpose database",
    category: "Database",
  },
  {
    label: "Supabase vs Firebase vs PlanetScale",
    techs: ["Supabase", "Firebase", "PlanetScale"],
    useCase: "Backend as a service",
    category: "Database",
  },
  {
    label: "React Native vs Flutter vs Expo",
    techs: ["React Native", "Flutter", "Expo"],
    useCase: "Cross-platform mobile development",
    category: "Mobile",
  },
  {
    label: "Docker vs Podman vs Kubernetes",
    techs: ["Docker", "Podman", "Kubernetes"],
    useCase: "Container and orchestration",
    category: "DevOps",
  },
  {
    label: "Vercel vs Netlify vs Railway",
    techs: ["Vercel", "Netlify", "Railway"],
    useCase: "Web app deployment",
    category: "DevOps",
  },
  {
    label: "Prisma vs Drizzle vs SQLAlchemy",
    techs: ["Prisma", "Drizzle", "SQLAlchemy"],
    useCase: "ORM for database access",
    category: "Backend",
  },
]

const CATEGORIES = ["All", "Frontend", "Backend", "Database", "Mobile", "DevOps"]

const TECH_SUGGESTIONS = [
  "React", "Vue.js", "Angular", "Svelte", "Next.js", "Nuxt.js",
  "FastAPI", "Django", "Flask", "Express.js", "NestJS", "Laravel",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Supabase", "Firebase",
  "React Native", "Flutter", "Expo", "Swift", "Kotlin",
  "Docker", "Kubernetes", "Vercel", "AWS", "Railway", "Render",
]

export default function StackComparePage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [techs, setTechs] = useState(["", ""])
  const [useCase, setUseCase] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [techInput, setTechInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeTechIndex, setActiveTechIndex] = useState(null)

  const filteredPresets = PRESET_COMPARISONS.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  )

  const handleTechChange = (index, value) => {
    const updated = [...techs]
    updated[index] = value
    setTechs(updated)
  }

  const addTech = () => {
    if (techs.length < 4) setTechs([...techs, ""])
  }

  const removeTech = (index) => {
    if (techs.length > 2) {
      setTechs(techs.filter((_, i) => i !== index))
    }
  }

  const loadPreset = (preset) => {
    setTechs(preset.techs)
    setUseCase(preset.useCase)
    setResult(null)
    setError(null)
  }

  const handleCompare = async () => {
    const validTechs = techs.filter((t) => t.trim())
    if (validTechs.length < 2) return
    setResult(null)
    setError(null)
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/stackcompare`, {
        technologies: validTechs,
        use_case: useCase || "general development",
      })
      setResult(res.data)
      setHistory((prev) => [
        { techs: validTechs, useCase: useCase || "general", result: res.data },
        ...prev.slice(0, 3),
      ])
    } catch {
      setError("Failed to compare. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  const suggestions = TECH_SUGGESTIONS.filter(
    (s) =>
      s.toLowerCase().includes(techInput.toLowerCase()) &&
      !techs.includes(s)
  )

  return (
    <div className="h-full flex overflow-hidden">

      {/* Left panel */}
      <div className="w-[280px] flex-shrink-0 border-r border-[#1e2235] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-5 py-5 border-b border-[#1e2235]">
          <h1 className="text-base font-bold text-white mb-1">Stack compare</h1>
          <p className="text-xs text-slate-500">Compare 2–4 technologies side by side</p>
        </div>

        {/* Compare form */}
        <div className="px-4 py-4 border-b border-[#1e2235]">
          <p className="text-[10px] font-semibold text-[#3d4266] uppercase tracking-widest mb-3">
            Technologies
          </p>

          {/* Tech inputs */}
          <div className="flex flex-col gap-2 mb-3">
            {techs.map((tech, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={tech}
                    onChange={(e) => handleTechChange(i, e.target.value)}
                    onFocus={() => { setActiveTechIndex(i); setShowSuggestions(true) }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    placeholder={`Technology ${i + 1}`}
                    className="w-full bg-[#111320] border border-[#1e2235] rounded-lg px-3 py-2 text-xs text-white placeholder-[#3d4266] focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  {/* Suggestions dropdown */}
                  {showSuggestions && activeTechIndex === i && tech.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1d2e] border border-[#2a2d4a] rounded-lg py-1 z-20 max-h-32 overflow-y-auto">
                      {TECH_SUGGESTIONS.filter(
                        (s) => s.toLowerCase().includes(tech.toLowerCase()) && !techs.includes(s)
                      ).slice(0, 5).map((s) => (
                        <button
                          key={s}
                          onMouseDown={() => { handleTechChange(i, s); setShowSuggestions(false) }}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {techs.length > 2 && (
                  <button
                    onClick={() => removeTech(i)}
                    className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add tech button */}
          {techs.length < 4 && (
            <button
              onClick={addTech}
              className="w-full text-xs text-slate-500 hover:text-indigo-400 border border-dashed border-[#2a2d4a] hover:border-indigo-500/40 rounded-lg py-2 flex items-center justify-center gap-1.5 transition-colors mb-3"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add technology
            </button>
          )}

          {/* Use case */}
          <p className="text-[10px] font-semibold text-[#3d4266] uppercase tracking-widest mb-2">
            Use case <span className="normal-case font-normal text-slate-600">(optional)</span>
          </p>
          <input
            type="text"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            placeholder="e.g. building a SaaS app"
            className="w-full bg-[#111320] border border-[#1e2235] rounded-lg px-3 py-2 text-xs text-white placeholder-[#3d4266] focus:outline-none focus:border-indigo-500 transition-colors mb-3"
          />

          {/* Compare button */}
          <button
            onClick={handleCompare}
            disabled={techs.filter((t) => t.trim()).length < 2 || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
                Compare
              </>
            )}
          </button>
        </div>

        {/* Presets */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-3">
            <p className="text-[10px] font-semibold text-[#3d4266] uppercase tracking-widest mb-2">
              Quick compare
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-indigo-600 text-white"
                      : "bg-[#111320] border border-[#1e2235] text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {filteredPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => loadPreset(preset)}
                className="w-full text-left bg-[#111320] hover:bg-[#1a1d2e] border border-[#1e2235] hover:border-indigo-500/30 rounded-lg px-3 py-2.5 mb-1.5 transition-all"
              >
                <p className="text-xs text-slate-300 font-medium mb-1">{preset.label}</p>
                <p className="text-[10px] text-slate-600">{preset.useCase}</p>
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="border-t border-[#1e2235] px-4 py-3">
            <p className="text-[10px] font-semibold text-[#3d4266] uppercase tracking-widest mb-2">
              Recent
            </p>
            {history.map((item, i) => (
              <button
                key={i}
                onClick={() => { setTechs(item.techs); setUseCase(item.useCase); setResult(item.result) }}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors mb-0.5"
              >
                <p className="text-xs text-slate-400 truncate">{item.techs.join(" vs ")}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto min-w-0">

        {/* Empty state */}
        {!result && !loading && !error && (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-[#111320] border border-[#1e2235] flex items-center justify-center mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3d4266" strokeWidth="1.5">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-white mb-2">Compare any technologies</h2>
            <p className="text-sm text-slate-500 mb-6 max-w-sm">
              Enter 2–4 technologies on the left or pick a preset comparison to get a detailed side-by-side analysis
            </p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-md">
              {PRESET_COMPARISONS.slice(0, 4).map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => loadPreset(preset)}
                  className="text-left bg-[#111320] hover:bg-[#1a1d2e] border border-[#1e2235] hover:border-indigo-500/30 rounded-xl px-4 py-3 transition-all"
                >
                  <p className="text-xs text-slate-300 font-medium mb-1">{preset.label}</p>
                  <p className="text-[10px] text-slate-600">{preset.useCase}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 animate-pulse">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-white mb-1">Comparing technologies...</p>
            <p className="text-xs text-slate-500">Gemini is analyzing the comparison</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="p-8">
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-4">
              {error}
            </div>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="px-8 py-6">

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                {result.technologies.map((tech, i) => (
                  <span key={tech}>
                    <span className="text-xl font-bold text-white">{tech}</span>
                    {i < result.technologies.length - 1 && (
                      <span className="text-slate-600 mx-2">vs</span>
                    )}
                  </span>
                ))}
              </div>
              {result.use_case && (
                <p className="text-sm text-slate-500">For: {result.use_case}</p>
              )}
            </div>

            {/* Winner banner */}
            {result.winner && (
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-5 py-4 mb-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/30 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Recommended for your use case</p>
                  <p className="text-base font-bold text-indigo-300">{result.winner}</p>
                </div>
              </div>
            )}

            {/* Scores grid */}
            {result.scores && (
              <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: `repeat(${result.technologies.length}, 1fr)` }}>
                {result.technologies.map((tech) => {
                  const techScores = result.scores[tech]
                  if (!techScores) return null
                  const isWinner = tech === result.winner
                  return (
                    <div
                      key={tech}
                      className={`bg-[#111320] border rounded-xl p-4 ${
                        isWinner ? "border-indigo-500/40" : "border-[#1e2235]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-white">{tech}</p>
                        {isWinner && (
                          <span className="text-[9px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                            Winner
                          </span>
                        )}
                      </div>
                      {Object.entries(techScores).map(([key, value]) => (
                        <div key={key} className="mb-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-[10px] text-slate-500 capitalize">{key.replace(/_/g, " ")}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{value}/10</span>
                          </div>
                          <div className="h-1 bg-[#1e2235] rounded-full">
                            <div
                              className={`h-full rounded-full transition-all ${isWinner ? "bg-indigo-500" : "bg-slate-600"}`}
                              style={{ width: `${value * 10}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Detailed analysis */}
            <div className="bg-[#111320] border border-[#1e2235] rounded-xl p-6">
              <div className="prose prose-invert max-w-none
                prose-headings:text-white prose-headings:font-semibold
                prose-h2:text-base prose-h2:mt-5 prose-h2:mb-3
                prose-h3:text-sm prose-h3:mt-4 prose-h3:mb-2
                prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-sm
                prose-li:text-slate-300 prose-li:text-sm
                prose-strong:text-white
                prose-code:text-indigo-300 prose-code:bg-[#0d0f18] prose-code:px-1 prose-code:rounded">
                <ReactMarkdown>{result.analysis}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}