import { useState, useRef, useEffect } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import useAppStore from "../store/useAppStore"

const API_URL = "http://localhost:8000"

const SUGGESTIONS = [
  "What's the best database for a real-time chat app?",
  "How do I structure a microservices backend?",
  "What's the difference between REST and GraphQL?",
  "How do I implement JWT authentication?",
  "What tech stack should I use for a SaaS app?",
  "How do I design a scalable API?",
]

export default function AskAIPage() {
  const { getActiveProject } = useAppStore()
  const project = getActiveProject()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const userMessage = text || input.trim()
    if (!userMessage) return

    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setLoading(true)

    try {
      const res = await axios.post(`${API_URL}/ask`, {
        message: userMessage,
        project_context: project
          ? `Project: ${project.name}. Description: ${project.description}`
          : null,
        history: messages.slice(-6),
      })
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.answer },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Make sure the backend is running." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => setMessages([])

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-8 py-5 border-b border-[#1e2235] flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white">Ask AI</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {project
              ? `Context: ${project.name} — answers will be tailored to your project`
              : "Ask any development question — create a project for context-aware answers"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {project && (
            <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="text-xs text-indigo-400 font-medium">{project.name}</span>
            </div>
          )}
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-xs text-slate-500 hover:text-slate-300 border border-[#2a2d4a] hover:border-[#3a3d5a] px-3 py-1.5 rounded-lg transition-colors"
            >
              Clear chat
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6">

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-white mb-2">Ask me anything about development</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-md">
              I can help with architecture decisions, tech stack choices, best practices, security, deployment, and more.
            </p>

            {/* Suggestion chips */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-xl">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="text-left bg-[#111320] hover:bg-[#1a1d2e] border border-[#1e2235] hover:border-indigo-500/30 rounded-xl px-4 py-3 text-xs text-slate-400 hover:text-slate-300 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 mb-6 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
              msg.role === "user"
                ? "bg-indigo-600"
                : "bg-[#1e2235] border border-[#2a2d4a]"
            }`}>
              {msg.role === "user" ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                  <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
              )}
            </div>

            {/* Bubble */}
            <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-sm"
                  : "bg-[#111320] border border-[#1e2235] text-slate-300 rounded-tl-sm"
              }`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-invert max-w-none prose-sm
                    prose-p:text-slate-300 prose-p:leading-relaxed prose-p:my-1
                    prose-headings:text-white prose-headings:font-semibold
                    prose-li:text-slate-300 prose-strong:text-white
                    prose-code:text-indigo-300 prose-code:bg-[#0d0f18] prose-code:px-1 prose-code:rounded
                    prose-pre:bg-[#0d0f18] prose-pre:border prose-pre:border-[#1e2235]">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3 mb-6">
            <div className="w-7 h-7 rounded-full bg-[#1e2235] border border-[#2a2d4a] flex items-center justify-center flex-shrink-0 mt-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </div>
            <div className="bg-[#111320] border border-[#1e2235] rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="px-8 py-4 border-t border-[#1e2235] flex-shrink-0">
        <div className="flex items-end gap-3 bg-[#111320] border border-[#1e2235] focus-within:border-indigo-500/50 rounded-xl px-4 py-3 transition-colors">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Ask anything about development... (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder-[#3d4266] focus:outline-none resize-none leading-relaxed"
            style={{ maxHeight: "120px", overflowY: "auto" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-[#3d4266] mt-2 text-center">
          Powered by Gemini 2.5 Flash · Enter to send · Shift+Enter for new line
        </p>
      </div>

    </div>
  )
}