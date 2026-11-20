'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BarChart3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { api, UsageSummary } from '@/lib/api'

export default function UsageStatsPage() {
  const router = useRouter()
  const [usage, setUsage] = useState<UsageSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .getUsage()
      .then(setUsage)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load usage')
      )
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/app/home')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Usage Statistics</h1>
            <p className="text-gray-400">Token consumption reported by the kernel</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        {usage && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Total tokens (30d)', value: usage.total_tokens.toLocaleString() },
                { label: 'Subscription tier', value: usage.tier },
                {
                  label: 'Monthly limit',
                  value:
                    usage.monthly_token_limit != null
                      ? usage.monthly_token_limit.toLocaleString()
                      : 'Unlimited',
                },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10"
                >
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-sm text-purple-200">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {usage.monthly_token_limit != null && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
                <div className="flex justify-between text-sm text-purple-200 mb-2">
                  <span>Allowance used</span>
                  <span>{usage.percent_used}%</span>
                </div>
                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${Math.min(100, usage.percent_used)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-300" />
                Usage by model
              </h2>
              {usage.by_model.length === 0 ? (
                <p className="text-purple-200 text-sm">
                  No usage recorded in the last {usage.period_days} days.
                </p>
              ) : (
                <div className="space-y-3">
                  {usage.by_model.map((m) => (
                    <div key={m.model} className="flex justify-between text-sm">
                      <span className="text-white">{m.model}</span>
                      <span className="text-purple-200">
                        {m.tokens.toLocaleString()} tokens · {m.requests} requests
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
