'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface Workspace {
  id: string
  name: string
  tenant_id: string
  created_at: string
  updated_at: string
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')

  useEffect(() => {
    loadWorkspaces()
  }, [])

  const loadWorkspaces = async () => {
    try {
      setLoading(true)
      const data = await api.getWorkspaces()
      setWorkspaces(data)
    } catch (err) {
      setError('Failed to load workspaces')
      console.error('Workspaces loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return

    try {
      await api.createWorkspace({ name: newWorkspaceName })
      setNewWorkspaceName('')
      setShowCreateModal(false)
      loadWorkspaces()
    } catch (err) {
      setError('Failed to create workspace')
      console.error('Workspace creation error:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Workspaces</h1>
          <p className="text-slate-400">Manage your workspaces and organizations</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Create Workspace
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-slate-400">Loading workspaces...</div>
      ) : workspaces.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
          <p className="text-slate-400 mb-4">No workspaces found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create your first workspace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-purple-500 transition-colors cursor-pointer"
            >
              <h3 className="text-xl font-bold text-white mb-2">{workspace.name}</h3>
              <p className="text-slate-400 text-sm mb-4">
                Created: {new Date(workspace.created_at).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition-colors">
                  Open
                </button>
                <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition-colors">
                  Settings
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Create Workspace</h2>
            <input
              type="text"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="Workspace name"
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:border-purple-500 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateWorkspace}
                disabled={!newWorkspaceName.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white py-2 rounded transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}