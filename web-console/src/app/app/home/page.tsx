'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface DashboardStats {
  activeProcesses: number
  totalMemories: number
  pendingApprovals: number
  systemHealth: number
}

interface ActivityItem {
  id: string
  type: string
  description: string
  timestamp: string
}

export default function AppHomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      // Real API calls to fetch dashboard data
      const [statsResponse, activitiesResponse] = await Promise.all([
        api.get<DashboardStats>('/dashboard/stats'),
        api.get<ActivityItem[]>('/dashboard/activities')
      ])
      setStats(statsResponse)
      setActivities(activitiesResponse)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
        <p className="text-red-400">{error}</p>
        <button
          onClick={loadDashboardData}
          className="mt-2 text-red-300 hover:text-red-200 underline"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <p className="text-slate-400">No dashboard data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to NEXORA Omega</h1>
        <p className="text-slate-400">Your cognitive operating system workspace</p>
      </div>

      {/* Real Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-slate-400 text-sm mb-1">Active Processes</h3>
          <p className="text-2xl font-bold text-white">{stats.activeProcesses}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-slate-400 text-sm mb-1">Total Memories</h3>
          <p className="text-2xl font-bold text-white">{stats.totalMemories}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-slate-400 text-sm mb-1">Pending Approvals</h3>
          <p className="text-2xl font-bold text-white">{stats.pendingApprovals}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-slate-400 text-sm mb-1">System Health</h3>
          <p className="text-2xl font-bold text-green-400">{stats.systemHealth}%</p>
        </div>
      </div>

      {/* Real Recent Activity */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        {activities.length === 0 ? (
          <p className="text-slate-400">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded">
                <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.description}</p>
                  <p className="text-slate-400 text-xs">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real Quick Actions */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/app/chat'}
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors"
          >
            <span className="text-2xl block mb-2">💬</span>
            <span className="text-sm">Start Chat</span>
          </button>
          <button
            onClick={() => window.location.href = '/app/cognitive-processes'}
            className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg transition-colors"
          >
            <span className="text-2xl block mb-2">🧠</span>
            <span className="text-sm">New Process</span>
          </button>
          <button
            onClick={() => window.location.href = '/app/artifacts'}
            className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg transition-colors"
          >
            <span className="text-2xl block mb-2">📦</span>
            <span className="text-sm">Create Artifact</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    cognitive_process: '🧠',
    memory: '💾',
    tool: '🔧',
    capability: '🔐',
    approval: '✅',
    error: '❌',
  }
  return icons[type] || '📋'
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minutes ago`
  if (hours < 24) return `${hours} hours ago`
  return `${days} days ago`
}