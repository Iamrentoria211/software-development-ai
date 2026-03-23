import { useState } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"

const API_URL = "http://localhost:8000"

const CATEGORIES = ["All", "Frontend", "Backend", "Database", "DevOps", "Mobile", "AI/ML"]

const POPULAR_TECHS = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "Vue.js", category: "Frontend" },
  { name: "Svelte", category: "Frontend" },
  { name: "FastAPI", category: "Backend" },
  { name: "Node.js", category: "Backend" },
  { name: "Django", category: "Backend" },
  { name: "Laravel", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "Supabase", category: "Database" },
  { name: "Redis", category: "Database" },
  { name: "Docker", category: "DevOps" },
  { name: "Kubernetes", category: "DevOps" },
  { name: "GitHub Actions", category: "DevOps" },
  { name: "Vercel", category: "DevOps" },
  { name: "React Native", category: "Mobile" },
  { name: "Flutter", category: "Mobile" },
  { name: "Expo", category: "Mobile" },
  { name: "Tauri", category: "Mobile" },
  { name: "LangChain", category: "AI/ML" },
  { name: "OpenAI API", category: "AI/ML" },
  { name: "Hugging Face", category: "AI/ML" },
  { name: "Ollama", category: "AI/ML" },
]

const RING_CONFIG = {
  Adopt: {
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    dot: "bg-green-500",
    desc: "Proven, safe to use in production",
  },
  Trial: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    dot: "bg-blue-500",
    desc: "Worth pursuing, use on low-risk projects",
  },
  Assess: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dot: "bg-amber-500",
    desc: "Explore to understand how it affects you",
  },
  Hold: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    dot: "bg-red-500",
    desc: "Proceed with caution",
  },
}

export default function TechRadarPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedTech, setSelectedTech] = useState(null)
  const [customTech, setCustomTech] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  const filteredTechs = POPULAR_TECHS.filter((t) => {
    const matchesCategory = activeCategory === "All" || t.category === activeCategory
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const analyze = async (techName) => {
    setSelectedTech(techName)
    setResult(null)
    setError(null)
    setLoading(true)

    try {
      const res = await axios.post(`${API_URL}/techradar`, { technology: techName })
      setResult(res.data)
      setHistory((prev) => {
        const exists = prev.find((h) => h.technology === techName)
        if (exists) return prev
        return [res.data, ...prev.slice(0, 4)]
      })
    } catch {
      setError("Failed to analyze. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  const handleCustomSearch = (e) => {
    e.preventDefault()
    if (customTech.trim()) {
      analyze(customTech.trim())
      setCustomTech("")
    }
  }

  return (
    <div className="h-full flex overflow-hidden">

      {/* Left panel */}
      <div className="w-[260px] flex-shrink-0 border-r border-[#1e2235] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-5 py-5 border-b border-[#1e2235]">
          <h1 className="text-base font-bold text-white mb-1">Tech radar</h1>
          <p className="text-xs text-slate-500">Evaluate any technology before adopting it</p>
        </div>

        {/* Custom search */}
        <div className="px-4 py-3 border-b border-[#1e2235]">
          <form onSubmit={handleCustomSearch} className="flex gap-2">
            <input
              type="text"
              value={customTech}
              onChange={(e) => setCustomTech(e.target.value)}
              placeholder="Type any technology..."
              className="flex-1 min-w-0 bg-[#111320] border border-[#1e2235] rounded-lg px-3 py-2 text-xs text-white placeholder-[#3d4266] focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!customTech.trim() || loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-3 py-2 rounded-lg transition-colors flex-shrink-0"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>

        {/* Category filter */}
        <div className="px-4 py-3 border-b border-[#1e2235] flex flex-wrap gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-[#111320] border border-[#1e2235] text-slate-500 hover:text-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tech list */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 py-2">
            <p className="text-[10px] font-semibold text-[#3d4266] uppercase tracking-widest px-2 mb-2">
              Popular technologies
            </p>
            {filteredTechs.map((tech) => {
              const isSelected = selectedTech === tech.name
              const historyItem = history.find((h) => h.technology === tech.name)
              const ring = historyItem?.ring
              const ringConfig = ring ? RING_CONFIG[ring] : null

              return (
                <button
                  key={tech.name}
                  onClick={() => analyze(tech.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors mb-0.5 ${
                    isSelected
                      ? "bg-indigo-500/10 border border-indigo-500/20"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {ringConfig ? (
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ringConfig.dot}`} />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2a2d4a] flex-shrink-0" />
                    )}
                    <span className={`text-xs truncate ${isSelected ? "text-indigo-300 font-medium" : "text-slate-400"}`}>
                      {tech.name}
                    </span>
                  </div>
                  {ringConfig && (
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${ringConfig.bg} ${ringConfig.color} border ${ringConfig.border}`}>
                      {ring}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="border-t border-[#1e2235] px-3 py-3">
            <p className="text-[10px] font-semibold text-[#3d4266] uppercase tracking-widest px-2 mb-2">
              Recent
            </p>
            {history.map((item) => {
              const ringConfig = RING_CONFIG[item.ring]
              return (
                <button
                  key={item.technology}
                  onClick={() => { setSelectedTech(item.technology); setResult(item) }}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors mb-0.5"
                >
                  <span className="text-xs text-slate-400 truncate">{item.technology}</span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${ringConfig.bg} ${ringConfig.color} border ${ringConfig.border}`}>
                    {item.ring}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Right panel — result */}
      <div className="flex-1 overflow-y-auto min-w-0">

        {/* Empty state */}
        {!selectedTech && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-[#111320] border border-[#1e2235] flex items-center justify-center mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3d4266" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-white mb-2">Select a technology to evaluate</h2>
            <p className="text-sm text-slate-500 mb-6 max-w-sm">
              Get an Adopt / Trial / Assess / Hold recommendation powered by Gemini
            </p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {Object.entries(RING_CONFIG).map(([ring, config]) => (
                <div key={ring} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border ${config.bg} ${config.border}`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dot}`} />
                  <div className="text-left">
                    <p className={`text-xs font-semibold ${config.color}`}>{ring}</p>
                    <p className="text-[10px] text-slate-500">{config.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 animate-pulse">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-white mb-1">Analyzing {selectedTech}...</p>
            <p className="text-xs text-slate-500">Gemini is evaluating this technology</p>
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

            {/* Tech header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{result.technology}</h2>
                <div className="flex items-center gap-3">
                  {(() => {
                    const config = RING_CONFIG[result.ring]
                    return (
                      <span className={`flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full border ${config.bg} ${config.color} ${config.border}`}>
                        <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                        {result.ring}
                      </span>
                    )
                  })()}
                  <span className="text-xs text-slate-500">{RING_CONFIG[result.ring]?.desc}</span>
                </div>
              </div>
            </div>

            {/* Score cards */}
            {result.scores && (
              <div className="grid grid-cols-4 gap-3 mb-6">
                {Object.entries(result.scores).map(([key, value]) => (
                  <div key={key} className="bg-[#111320] border border-[#1e2235] rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-indigo-400 mb-1">{value}<span className="text-sm text-slate-500">/10</span></p>
                    <p className="text-[10px] text-slate-500 capitalize">{key}</p>
                    <div className="mt-2 h-1 bg-[#1e2235] rounded-full">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${value * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Analysis content */}
            <div className="bg-[#111320] border border-[#1e2235] rounded-xl p-6">
              <div className="prose prose-invert max-w-none
                prose-headings:text-white prose-headings:font-semibold
                prose-h2:text-base prose-h3:text-sm
                prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-sm
                prose-li:text-slate-300 prose-li:text-sm
                prose-strong:text-white
                prose-code:text-indigo-300">
                <ReactMarkdown>{result.analysis}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}