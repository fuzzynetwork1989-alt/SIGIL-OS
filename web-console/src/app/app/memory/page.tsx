'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Search, Calendar, Tag, Heart, ArrowLeft, Trash2, Download, Plus } from 'lucide-react'

export default function MemoryPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const handleDownloadMemory = (memory: typeof memories[0]) => {
    const data = JSON.stringify(memory, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${memory.title.replace(/\s+/g, '_')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDeleteMemory = (id: number) => {
    if (confirm('Are you sure you want to delete this memory?')) {
      console.log('Delete memory:', id)
      // TODO: Implement actual delete logic
    }
  }

  const memories = [
    {
      id: 1,
      title: 'Trip to Japan Planning',
      content: 'User wants to visit Tokyo, Kyoto, and Osaka. Interested in cherry blossom season.',
      date: '2024-03-15',
      tags: ['travel', 'japan', 'planning'],
    },
    {
      id: 2,
      title: 'Python Learning Journey',
      content: 'User is learning Python for data science. Currently working on pandas and numpy.',
      date: '2024-03-10',
      tags: ['learning', 'python', 'data-science'],
    },
    {
      id: 3,
      title: 'Cooking Preferences',
      content: 'User prefers Italian cuisine, vegetarian options, and enjoys experimenting with spices.',
      date: '2024-03-05',
      tags: ['cooking', 'preferences', 'food'],
    },
    {
      id: 4,
      title: 'Work Goals',
      content: 'User wants to transition to software engineering. Currently learning React and Node.js.',
      date: '2024-02-28',
      tags: ['career', 'programming', 'goals'],
    },
  ]

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || memory.tags.includes(selectedFilter)
    return matchesSearch && matchesFilter
  })

  const allTags = Array.from(new Set(memories.flatMap(m => m.tags)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Memories</h1>
            <p className="text-gray-400">What SIGIL remembers about you</p>
          </div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search memories..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500 relative z-20"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all cursor-pointer relative z-20">
              <Plus className="w-4 h-4" />
              Add Memory
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer relative z-20 ${
                selectedFilter === 'all'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-purple-300 hover:bg-white/20'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedFilter(tag)}
                className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer relative z-20 ${
                  selectedFilter === tag
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-purple-300 hover:bg-white/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Memory Cards */}
        <div className="space-y-4">
          {filteredMemories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all relative z-10"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{memory.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{memory.content}</p>
                  <div className="flex items-center gap-4 text-xs text-purple-300">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {memory.date}
                    </div>
                    <div className="flex gap-2">
                      {memory.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadMemory(memory)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMemory(memory.id)}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors cursor-pointer relative z-30"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredMemories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Heart className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-purple-300">No memories found</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
