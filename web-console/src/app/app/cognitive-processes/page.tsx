'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface CognitiveProcess {
  id: string
  intent: string
  state: string
  created_at: string
  updated_at: string
}

export default function CognitiveProcessesPage() {
  const [processes, setProcesses] = useState<CognitiveProcess[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProcesses()
  }, [])

  const loadProcesses = async () => {
    try {
      setLoading(true)
      const data = await api.getCognitiveProcesses()
      setProcesses(data)
    } catch (err) {
      setError('Failed to load cognitive processes')
      console.error('Cognitive processes loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePause = async (processId: string) => {
    try {
      await api.pauseCognitiveProcess(processId)
      loadProcesses()
    } catch (err) {
      setError('Failed to pause process')
      console.error('Pause error:', err)
    }
  }

  const handleResume = async (processId: string) => {
    try {
      await api.resumeCognitiveProcess(processId)
      loadProcesses()
    } catch (err) {
      setError('Failed to resume process')
      console.error('Resume error:', err)
    }
  }

  const handleCancel = async (processId: string) => {
    try {
      await api.cancelCognitiveProcess(processId)
      loadProcesses()
    } catch (err) {
      setError('Failed to cancel process')
      console.error('Cancel error:', err)
    }
  }

  const getStateColor = (state: string) => {
    const colors: Record<string, string> = {
      running: 'bg-green-500',
      paused: 'bg-yellow-500',
      completed: 'bg-blue-500',
      failed: 'bg-red-500',
      dormant: 'bg-slate-500',
    }
    return colors[state] || 'bg-slate-500'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Cognitive Processes</h1>
        <p className="text-slate-400">Manage and monitor your cognitive processes</p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-slate-400">Loading cognitive processes...</div>
      ) : processes.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
          <p className="text-slate-400">No cognitive processes found</p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="text-left text-slate-300 font-medium p-4">Intent</th>
                <th className="text-left text-slate-300 font-medium p-4">State</th>
                <th className="text-left text-slate-300 font-medium p-4">Created</th>
                <th className="text-left text-slate-300 font-medium p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr key={process.id} className="border-t border-slate-700">
                  <td className="p-4 text-white">{process.intent}</td>
                  <td className="p-4">
                    <span className={`${getStateColor(process.state)} text-white text-xs px-2 py-1 rounded`}>
                      {process.state}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">
                    {new Date(process.created_at).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {process.state === 'running' && (
                        <button
                          onClick={() => handlePause(process.id)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Pause
                        </button>
                      )}
                      {process.state === 'paused' && (
                        <button
                          onClick={() => handleResume(process.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Resume
                        </button>
                      )}
                      {(process.state === 'running' || process.state === 'paused') && (
                        <button
                          onClick={() => handleCancel(process.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}