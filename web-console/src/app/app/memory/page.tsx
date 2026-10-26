'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface Memory {
  id: string
  type: string
  content: string
  confidence: number
  tags: string[]
  created_at: string
}

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadMemories()
  }, [])

  const loadMemories = async () => {
    try {
      setLoading(true)
      const data = await api.getMemories()
      setMemories(data)
    } catch (err) {
      setError('Failed to load memories')
      console.error('Memory loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadMemories()
      return
    }

    try {
      const results = await api.searchMemory({ query: searchQuery })
      setMemories(results.results)
    } catch (err) {
      setError('Search failed')
      console.error('Search error:', err)
    }
  }

  const getMemoryTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      episodic: 'bg-blue-500',
      semantic: 'bg-green-500',
      procedural: 'bg-purple-500',
      temporal: 'bg-yellow-500',
      preference: 'bg-pink-500',
    }
    return colors[type] || 'bg-slate-500'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Memory</h1>
        <p className="text-slate-400">Manage your cognitive memory and knowledge</p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search memories..."
          className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={handleSearch}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Search
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-slate-400">Loading memories...</div>
      ) : memories.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
          <p className="text-slate-400">No memories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-purple-500 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`${getMemoryTypeColor(memory.type)} text-white text-xs px-2 py-1 rounded`}>
                  {memory.type}
                </span>
                <span className="text-slate-400 text-xs">
                  Confidence: {(memory.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-white text-sm mb-4 line-clamp-3">{memory.content}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {memory.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-slate-400 text-xs">
                {new Date(memory.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}