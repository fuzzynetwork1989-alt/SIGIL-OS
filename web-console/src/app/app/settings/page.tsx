'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Check, Loader2, LogOut, KeyRound } from 'lucide-react'
import { api, getStoredUser, clearSession, HealthResponse } from '@/lib/api'

const API_URL_KEY = 'sigil.apiUrl'
const DEFAULT_API_URL = 'http://localhost:8000'

export default function SettingsPage() {
  const router = useRouter()
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL)
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [healthError, setHealthError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const user = getStoredUser()

  useEffect(() => {
    setApiUrl(localStorage.getItem(API_URL_KEY) || DEFAULT_API_URL)
  }, [])

  const checkHealth = async (url?: string) => {
    try {
      const res = await fetch(`${(url ?? apiUrl).replace(/\/+$/, '')}/health`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setHealth(await res.json())
      setHealthError(null)
    } catch {
      setHealth(null)
      setHealthError(`Cannot reach ${(url ?? apiUrl)}/health`)
    }
  }

  useEffect(() => {
    checkHealth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = async () => {
    setSaving(true)
    localStorage.setItem(API_URL_KEY, apiUrl.replace(/\/+$/, ''))
    await checkHealth()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    api.logout()
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/app/home')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Connection and account</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 space-y-4"
        >
          <h3 className="text-lg font-semibold text-white">Kernel connection</h3>
          <div>
            <label className="text-sm text-gray-300 block mb-2">API server URL</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saved ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Checking…' : saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
          <div className="text-sm">
            {health ? (
              <span className="text-green-300">
                Connected — kernel v{health.version}, provider {health.llm_provider}, database {health.database}
              </span>
            ) : (
              <span className="text-red-300">{healthError ?? 'Checking…'}</span>
            )}
          </div>
          <p className="text-xs text-gray-400">
            Stored in this browser and used for all API calls. NEXT_PUBLIC_API_URL
            env var takes lower priority than this setting.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 space-y-4"
        >
          <h3 className="text-lg font-semibold text-white">Account</h3>
          {user && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Email</span>
                <span className="text-white">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Name</span>
                <span className="text-white">{user.full_name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Subscription tier</span>
                <span className="text-white capitalize">{user.subscription_tier}</span>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.push('/app/api-keys')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              API keys
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
