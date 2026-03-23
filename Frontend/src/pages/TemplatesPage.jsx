import { useState } from "react"
import useAppStore from "../store/useAppStore"

const TEMPLATES = [
  {
    id: "food-delivery",
    name: "Food Delivery App",
    category: "Mobile",
    color: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
    icon: "🍔",
    description: "A mobile food delivery platform connecting customers with local restaurants featuring real-time order tracking, payment integration, and restaurant management dashboard.",
    tags: ["React Native", "Node.js", "PostgreSQL", "Stripe"],
  },
  {
    id: "saas-starter",
    name: "SaaS Starter",
    category: "Web",
    color: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
    icon: "🚀",
    description: "A multi-tenant SaaS application with subscription billing, user authentication, team management, and an admin dashboard.",
    tags: ["React", "FastAPI", "PostgreSQL", "Stripe"],
  },
  {
    id: "ecommerce",
    name: "E-Commerce Store",
    category: "Web",
    color: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
    icon: "🛒",
    description: "A full-featured multi-vendor e-commerce platform with product catalog, shopping cart, order management, and payment processing.",
    tags: ["Next.js", "Node.js", "MongoDB", "PayMongo"],
  },
  {
    id: "rest-api",
    name: "REST API Backend",
    category: "API",
    color: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    icon: "⚡",
    description: "A scalable REST API backend with authentication, rate limiting, caching, API versioning, and comprehensive documentation.",
    tags: ["FastAPI", "PostgreSQL", "Redis", "Docker"],
  },
  {
    id: "lms",
    name: "Learning Management System",
    category: "Web",
    color: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
    icon: "📚",
    description: "An online learning platform with course creation, video streaming, student progress tracking, quizzes, and certificate generation.",
    tags: ["React", "Django", "PostgreSQL", "AWS S3"],
  },
  {
    id: "clinic",
    name: "Clinic Management System",
    category: "Web",
    color: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
    icon: "🏥",
    description: "A health clinic management system with patient records, appointment scheduling, doctor management, and billing.",
    tags: ["React", "Node.js", "PostgreSQL", "Twilio"],
  },
  {
    id: "pos",
    name: "Point of Sale System",
    category: "Desktop",
    color: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
    icon: "🏪",
    description: "A POS system for retail businesses with inventory management, sales tracking, receipt printing, and daily reports.",
    tags: ["Electron", "React", "SQLite", "Node.js"],
  },
  {
    id: "barangay",
    name: "Barangay Management System",
    category: "Web",
    color: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20" },
    icon: "🏛️",
    description: "A local government unit management system for barangay records, resident information, certificate requests, blotter management, and event tracking.",
    tags: ["React", "Laravel", "MySQL", "PDF generation"],
  },
  {
    id: "chat-app",
    name: "Real-time Chat App",
    category: "Mobile",
    color: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
    icon: "💬",
    description: "A real-time messaging application with direct messages, group chats, file sharing, push notifications, and online presence indicators.",
    tags: ["React Native", "Node.js", "Socket.io", "MongoDB"],
  },
  {
    id: "inventory",
    name: "Inventory Management",
    category: "Web",
    color: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
    icon: "📦",
    description: "A warehouse inventory system with stock tracking, purchase orders, supplier management, barcode scanning, and low-stock alerts.",
    tags: ["React", "FastAPI", "PostgreSQL", "Redis"],
  },
  {
    id: "portfolio",
    name: "Developer Portfolio",
    category: "Web",
    color: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
    icon: "🎨",
    description: "A modern developer portfolio website with project showcase, blog, skills section, contact form, and CMS for easy content updates.",
    tags: ["Next.js", "Tailwind CSS", "Sanity CMS", "Vercel"],
  },
  {
    id: "hr-system",
    name: "HR Management System",
    category: "Web",
    color: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
    icon: "👥",
    description: "A human resources management system with employee records, attendance tracking, payroll processing, leave management, and performance reviews.",
    tags: ["React", "Django", "PostgreSQL", "Celery"],
  },
]

const CATEGORIES = ["All", "Web", "Mobile", "API", "Desktop"]

export default function TemplatesPage() {
  const { addProject, setActiveProject, setScreen } = useAppStore()
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [projectName, setProjectName] = useState("")
  const [customDescription, setCustomDescription] = useState("")

  const filtered = TEMPLATES.filter((t) => {
    const matchesCategory = activeCategory === "All" || t.category === activeCategory
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    setProjectName(template.name)
    setCustomDescription(template.description)
  }

  const handleCreate = () => {
    if (!projectName.trim()) return
    const newProject = {
      id: Date.now().toString(),
      name: projectName.trim(),
      description: customDescription.trim(),
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      sections: {},
      templateId: selectedTemplate.id,
    }
    addProject(newProject)
    setSelectedTemplate(null)
    setProjectName("")
    setCustomDescription("")
    setActiveProject(newProject.id)
    setScreen("detail")
  }

  return (
    <div className="h-full overflow-y-auto">

      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Templates</h1>
        <p className="text-sm text-slate-500">
          Start from a pre-built template and generate your blueprint instantly
        </p>
      </div>

      {/* Search + filters */}
      <div className="px-8 mb-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-[#111320] border border-[#1e2235] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-[#3d4266] focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-[#111320] border border-[#1e2235] text-slate-400 hover:text-slate-300 hover:border-[#2a2d4a]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="px-8 mb-4">
        <p className="text-xs text-slate-600">
          {filtered.length} template{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" && ` in ${activeCategory}`}
          {search && ` matching "${search}"`}
        </p>
      </div>

      {/* Templates grid */}
      <div className="px-8 pb-8 grid grid-cols-3 gap-4">
        {filtered.map((template) => (
          <div
            key={template.id}
            className="bg-[#111320] border border-[#1e2235] hover:border-indigo-500/30 rounded-xl p-5 cursor-pointer transition-all group"
            onClick={() => handleSelectTemplate(template)}
          >
            {/* Icon + category */}
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${template.color.bg} border ${template.color.border}`}>
                {template.icon}
              </div>
              <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${template.color.bg} ${template.color.text} border ${template.color.border}`}>
                {template.category}
              </span>
            </div>

            {/* Name + description */}
            <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
              {template.name}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
              {template.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-[#1e2235] text-slate-500 border border-[#2a2d4a] px-2 py-0.5 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Use button - appears on hover */}
            <div className="mt-4 pt-4 border-t border-[#1e2235] opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Click to use this template</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#111320] border border-[#1e2235] flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3d4266" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-400 mb-1">No templates found</p>
            <p className="text-xs text-slate-600">Try a different search or category</p>
          </div>
        )}
      </div>

      {/* Use template modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111320] border border-[#1e2235] rounded-xl p-6 w-[480px]">

            {/* Template info */}
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${selectedTemplate.color.bg} border ${selectedTemplate.color.border}`}>
                {selectedTemplate.icon}
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Using template</p>
                <h2 className="text-base font-semibold text-white">{selectedTemplate.name}</h2>
              </div>
            </div>

            <div className="h-px bg-[#1e2235] mb-5" />

            {/* Project name */}
            <label className="text-xs text-slate-500 block mb-1">Project name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-[#0d0f18] border border-[#2a2d4a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#3d4266] focus:outline-none focus:border-indigo-500 mb-4 transition-colors"
              autoFocus
            />

            {/* Description */}
            <label className="text-xs text-slate-500 block mb-1">
              Project description
              <span className="text-[#3d4266] ml-2">— pre-filled from template, feel free to edit</span>
            </label>
            <textarea
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              rows={4}
              className="w-full bg-[#0d0f18] border border-[#2a2d4a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#3d4266] focus:outline-none focus:border-indigo-500 mb-5 resize-none transition-colors"
            />

            {/* Tags preview */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {selectedTemplate.tags.map((tag) => (
                <span key={tag} className="text-[10px] bg-[#1e2235] text-slate-500 border border-[#2a2d4a] px-2 py-0.5 rounded-md">
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { setSelectedTemplate(null); setProjectName(""); setCustomDescription("") }}
                className="flex-1 bg-transparent border border-[#2a2d4a] text-slate-400 text-sm rounded-lg py-2.5 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!projectName.trim()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg py-2.5 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Create from template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}