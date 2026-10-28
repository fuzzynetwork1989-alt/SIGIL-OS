'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Key, Eye, EyeOff, Copy, Trash2, Plus, RefreshCw, Save, Check, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ApiKeysPage() {
  const router = useRouter()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'OpenAI API Key', provider: 'openai', key: '', lastUsed: 'Never' },
    { id: 2, name: 'Anthropic API Key', provider: 'anthropic', key: '', lastUsed: 'Never' },
  ])

  useEffect(() => {
    const savedKeys = localStorage.getItem('sigil_api_keys')
    if (savedKeys) {
      const parsed = JSON.parse(savedKeys)
      setApiKeys(apiKeys.map(key => ({
        ...key,
        key: parsed[key.provider] || '',
      })))
    }
  }, [])

  const toggleKeyVisibility = (id: number) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const copyKey = (key: string) => {
    if (key) navigator.clipboard.writeText(key)
  }

  const handleSave = async () => {
    setSaving(true)
    const keysToSave = apiKeys.reduce((acc, key) => {
      if (key.key) acc[key.provider] = key.key
      return acc
    }, {} as Record<string, string>)
    localStorage.setItem('sigil_api_keys', JSON.stringify(keysToSave))
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleKeyChange = (id: number, value: string) => {
    setApiKeys(apiKeys.map(key => key.id === id ? { ...key, key: value } : key))
  }

  const handleDeleteKey = (id: number) => {
    setApiKeys(apiKeys.map(key => key.id === id ? { ...key, key: '' } : key))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push('/app/settings')} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-20">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">API Keys</h1>
            <p className="text-gray-400">Configure your LLM provider API keys</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
          <p className="text-blue-400 text-sm">
            <strong>Enable Real AI:</strong> Add your OpenAI or Anthropic API key to enable real AI responses. Keys are stored locally.
          </p>
        </motion.div>

        <div className="space-y-4">
          {apiKeys.map((apiKey, index) => (
            <motion.div key={apiKey.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Key className="w-5 h-5 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">{apiKey.name}</h3>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm capitalize">{apiKey.provider}</span>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <input type={showKeys[apiKey.id] ? 'text' : 'password'} value={apiKey.key} onChange={(e) => handleKeyChange(apiKey.id, e.target.value)} placeholder="Enter your API key..." className="flex-1 bg-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-purple-500 border border-white/20 cursor-pointer relative z-20" />
                    <button onClick={() => toggleKeyVisibility(apiKey.id)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30">
                      {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => copyKey(apiKey.key)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400">Last used: {apiKey.lastUsed}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDeleteKey(apiKey.id)} className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors cursor-pointer relative z-30">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer relative z-20">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save API Keys'}
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-yellow-500/10 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30">
          <p className="text-yellow-400 text-sm"><strong>Security Note:</strong> API keys are stored locally in your browser. Never share your API keys.</p>
        </motion.div>
      </div>
    </div>
  )
}
