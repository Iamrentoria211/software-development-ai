import useAppStore from "./store/useAppStore"
import Sidebar from "./components/Sidebar"
import ProjectsPage from "./pages/ProjectsPage"
import ProjectDetailPage from "./pages/ProjectDetailPage"
import BlueprintPage from "./pages/BlueprintPage"
import TemplatesPage from "./pages/TemplatesPage"
import AskAIPage from "./pages/AskAIPage"
import TechRadarPage from "./pages/TechRadarPage"
import StackComparePage from "./pages/StackComparePage"
import BlueprintsPage from "./pages/BlueprintsPage"

export default function App() {
  const screen = useAppStore((s) => s.screen)

  return (
    <div className="flex h-screen bg-[#0d0f18] text-slate-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-hidden">
        {screen === "projects" && <ProjectsPage />}
        {screen === "detail" && <ProjectDetailPage />}
        {screen === "blueprint" && <BlueprintPage />}
        {screen === "templates" && <TemplatesPage />}
        {screen === "askai" && <AskAIPage />}
        {screen === "techradar" && <TechRadarPage />}
        {screen === "stackcompare" && <StackComparePage />}
        {screen === "blueprints" && <BlueprintsPage />}
      </main>
    </div>
  )
}