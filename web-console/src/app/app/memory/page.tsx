'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Database } from 'lucide-react'
import { api, MemoryItem } from '@/lib/api'

const CATEGORIES = ['episodic', 'semantic', 'preference', 'mission', 'fact']

export default function MemoryPage() {
  const router = useRouter()
  const [memories, setMemories] = useState<MemoryItem[]>([])
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('semantic')
  const [importance, setImportance] = useState(0.5)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    try {
      setMemories(await api.listMemories())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load memories')
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setBusy(true)
    try {
      await api.createMemory(content.trim(), category, importance)
      setContent('')
      setImportance(0.5)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save memory')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/app/home')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Memory</h1>
            <p className="text-gray-400">What the kernel remembers about you</p>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10 space-y-4"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Something worth remembering…"
            rows={2}
            required
            className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:border-purple-500 placeholder-purple-300 resize-none"
          />
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white/10 text-white px-3 py-2 rounded-xl border border-white/20"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-purple-200 flex-1 min-w-[200px]">
              Importance
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={importance}
                onChange={(e) => setImportance(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="w-10 text-right">{Math.round(importance * 100)}%</span>
            </label>
            <button
              type="submit"
              disabled={busy || !content.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {busy ? 'Saving…' : 'Remember'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {memories.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-purple-300" />
                <span className="text-xs uppercase tracking-wide text-purple-300">
                  {m.category}
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  {new Date(m.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-white">{m.content}</p>
              <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${Math.round(m.importance * 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Importance {Math.round(m.importance * 100)}%
              </p>
            </motion.div>
          ))}
          {memories.length === 0 && !error && (
            <p className="text-purple-200 text-sm text-center py-8">
              No memories stored yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
