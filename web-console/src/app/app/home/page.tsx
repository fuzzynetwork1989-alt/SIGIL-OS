'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  MessageSquare,
  Database,
  Layers,
  Activity,
  ArrowRight,
} from 'lucide-react'
import {
  api,
  HealthResponse,
  UsageSummary,
  Conversation,
  MemoryItem,
  Mission,
  SigilUser,
  getStoredUser,
} from '@/lib/api'

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<SigilUser | null>(null)
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [usage, setUsage] = useState<UsageSummary | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [memories, setMemories] = useState<MemoryItem[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setUser(getStoredUser())
    let cancelled = false
    const load = async () => {
      const results = await Promise.allSettled([
        api.health(),
        api.getUsage(),
        api.listConversations(),
        api.listMemories(),
        api.listMissions(),
      ])
      if (cancelled) return
      const [h, u, c, m, mi] = results
      if (h.status === 'fulfilled') setHealth(h.value)
      if (u.status === 'fulfilled') setUsage(u.value)
      if (c.status === 'fulfilled') setConversations(c.value)
      if (m.status === 'fulfilled') setMemories(m.value)
      if (mi.status === 'fulfilled') setMissions(mi.value)
      if (results.every((r) => r.status === 'rejected')) {
        setError('Cannot reach the SIGIL kernel at ' + process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const quickActions = [
    { icon: MessageSquare, label: 'Chat', route: '/app/chat' },
    { icon: Database, label: 'Memory', route: '/app/memory' },
    { icon: Layers, label: 'Missions', route: '/app/home#missions' },
    { icon: Activity, label: 'Usage', route: '/app/usage' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {greeting}
            {user?.full_name ? `, ${user.full_name}` : ''}
          </h1>
          <p className="text-purple-200 mt-1">
            {health
              ? `Kernel v${health.version} · ${health.llm_provider} · database ${health.database}`
              : 'Kernel unreachable'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Conversations', value: conversations.length },
            { label: 'Memories', value: memories.length },
            { label: 'Missions', value: missions.length },
            {
              label: 'Tokens (30d)',
              value: usage ? usage.total_tokens.toLocaleString() : '—',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10"
            >
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-purple-200">{s.label}</div>
            </div>
          ))}
        </div>

        {usage?.monthly_token_limit != null && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
            <div className="flex justify-between text-sm text-purple-200 mb-2">
              <span>Monthly token allowance</span>
              <span>
                {usage.percent_used}% of {usage.monthly_token_limit.toLocaleString()}
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${Math.min(100, usage.percent_used)}%` }}
              />
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Quick actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((a) => (
              <motion.button
                key={a.label}
                whileHover={{ scale: 1.03 }}
                onClick={() => router.push(a.route)}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10 text-left hover:bg-white/20 transition-colors cursor-pointer"
              >
                <a.icon className="w-6 h-6 text-purple-300 mb-2" />
                <div className="text-white font-medium">{a.label}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent conversations
          </h2>
          <div className="space-y-3">
            {conversations.slice(0, 5).map((c) => (
              <button
                key={c.id}
                onClick={() => router.push('/app/chat')}
                className="w-full text-left bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-white font-medium">
                    {c.title || 'Untitled conversation'}
                  </div>
                  <div className="text-sm text-purple-200">
                    {new Date(c.updated_at).toLocaleString()}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-300" />
              </button>
            ))}
            {conversations.length === 0 && (
              <p className="text-purple-200 text-sm">
                No conversations yet — start one in Chat.
              </p>
            )}
          </div>
        </div>

        <div id="missions">
          <h2 className="text-xl font-semibold text-white mb-4">Missions</h2>
          <div className="grid gap-3">
            {missions.map((m) => (
              <div
                key={m.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{m.name}</span>
                  <span className="text-xs text-purple-200">{m.status}</span>
                </div>
                {m.description && (
                  <p className="text-sm text-purple-200 mb-2">{m.description}</p>
                )}
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${Math.min(100, Math.max(0, m.progress))}%` }}
                  />
                </div>
              </div>
            ))}
            {missions.length === 0 && (
              <p className="text-purple-200 text-sm">No missions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
