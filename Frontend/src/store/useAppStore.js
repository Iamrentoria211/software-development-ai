import { create } from "zustand"

const SECTIONS = [
  "Tech stack",
  "Folder structure",
  "SDLC",
  "Security practices",
  "Best practices",
  "CI/CD guide",
  "Roadmap",
  "Database schema",
  "API design",
  "Testing strategy",
  "Timeline",
  "Team structure",
]

const useAppStore = create((set, get) => ({
  // Navigation
  screen: "projects",
  setScreen: (screen) => set({ screen }),

  // Projects
  projects: [],
  activeProjectId: null,

  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      activeProjectId:
        state.activeProjectId === id ? null : state.activeProjectId,
    })),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  getActiveProject: () => {
    const { projects, activeProjectId } = get()
    return projects.find((p) => p.id === activeProjectId) || null
  },

  setActiveProject: (id) => set({ activeProjectId: id }),

  // Blueprint sections
  activeSection: "Tech stack",
  setActiveSection: (section) => set({ activeSection: section }),

  sections: SECTIONS,
}))

export default useAppStore