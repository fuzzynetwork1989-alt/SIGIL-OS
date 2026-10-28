'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BarChart3, Clock, DollarSign, MessageSquare, TrendingUp, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function UsageStatsPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState('month')

  const stats = {
    totalMessages: 1234,
    totalTokens: 2456789,
    totalCost: 12.34,
    avgCostPerMessage: 0.01,
    dailyUsage: [
      { date: 'Mon', messages: 145, tokens: 234567 },
      { date: 'Tue', messages: 167, tokens: 2890123 },
      { date: 'Wed', messages: 132, tokens: 2109876 },
      { date: 'Thu', messages: 189, tokens: 3456789 },
      { date: 'Fri', messages: 156, tokens: 2876543 },
      { date: 'Sat', messages: 98, tokens: 1876543 },
      { date: 'Sun', messages: 147, tokens: 2654321 },
    ],
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
            <h1 className="text-3xl font-bold text-white mb-2">Usage Statistics</h1>
            <p className="text-gray-400">Track your API usage and costs</p>
          </div>
        </div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          {['day', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl text-sm transition-all cursor-pointer relative z-20 ${
                timeRange === range
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-purple-300 hover:bg-white/20'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30"
          >
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400 text-sm">Total Messages</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalMessages.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30"
          >
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Total Tokens</span>
            </div>
            <p className="text-3xl font-bold text-white">{(stats.totalTokens / 1000000).toFixed(2)}M</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30"
          >
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-gray-400 text-sm">Total Cost</span>
            </div>
            <p className="text-3xl font-bold text-white">${stats.totalCost.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-500/30"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <span className="text-gray-400 text-sm">Avg Cost/Msg</span>
            </div>
            <p className="text-3xl font-bold text-white">${stats.avgCostPerMessage.toFixed(3)}</p>
          </motion.div>
        </div>

        {/* Daily Usage Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Daily Usage</h3>
          </div>

          <div className="space-y-4">
            {stats.dailyUsage.map((day, index) => (
              <div key={day.date} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white">{day.date}</span>
                  <span className="text-purple-300">{day.messages} messages</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(day.tokens / 4000000) * 100}%` }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cost Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Cost Breakdown</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
              <span className="text-white">GPT-4</span>
              <span className="text-purple-300">$8.45</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
              <span className="text-white">GPT-4 Turbo</span>
              <span className="text-purple-300">$2.89</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
              <span className="text-white">Claude 3</span>
              <span className="text-purple-300">$1.00</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
