'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Key, Eye, EyeOff, Copy, Trash2, Plus, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ApiKeysPage() {
  const router = useRouter()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'OpenAI API Key', provider: 'openai', key: 'sk-...masked', lastUsed: '2 hours ago' },
    { id: 2, name: 'Anthropic API Key', provider: 'anthropic', key: 'sk-ant...masked', lastUsed: '1 day ago' },
  ])

  const toggleKeyVisibility = (id: number) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/app/settings')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">API Keys</h1>
            <p className="text-gray-400">Manage your API keys for different providers</p>
          </div>
        </div>

        {/* Add New Key */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all cursor-pointer relative z-20">
            <Plus className="w-4 h-4" />
            Add API Key
          </button>
        </motion.div>

        {/* API Keys List */}
        <div className="space-y-4">
          {apiKeys.map((apiKey, index) => (
            <motion.div
              key={apiKey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 relative z-10"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Key className="w-5 h-5 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">{apiKey.name}</h3>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm capitalize">
                      {apiKey.provider}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1 bg-white/10 rounded-lg px-4 py-2 font-mono text-sm">
                      {showKeys[apiKey.id] ? apiKey.key : '•••••••••••••••••••••••••••••••••'}
                    </div>
                    <button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30"
                    >
                      {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => copyKey(apiKey.key)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400">Last used: {apiKey.lastUsed}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors cursor-pointer relative z-30">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30"
        >
          <p className="text-yellow-400 text-sm">
            <strong>Security Note:</strong> API keys are stored locally and encrypted. Never share your API keys with anyone.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
