'use client'

import { useState } from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('home')

  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'workspaces', label: 'Workspaces', icon: '📁' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'cognitive-processes', label: 'Cognitive Processes', icon: '🧠' },
    { id: 'world-state', label: 'World State', icon: '🌍' },
    { id: 'memory', label: 'Memory', icon: '💾' },
    { id: 'artifacts', label: 'Artifacts', icon: '📦' },
    { id: 'automations', label: 'Automations', icon: '⚡' },
    { id: 'skills', label: 'Skills', icon: '🛠️' },
    { id: 'models', label: 'Models', icon: '🤖' },
    { id: 'tools', label: 'Tools', icon: '🔧' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    { id: 'evaluations', label: 'Evaluations', icon: '📊' },
    { id: 'observability', label: 'Observability', icon: '📈' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'approvals', label: 'Approvals', icon: '✅' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'billing', label: 'Billing', icon: '💳' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'admin', label: 'Admin', icon: '👑' },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-700 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-0
        `}
      >
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">NEXORA Omega</h2>
          <p className="text-sm text-slate-400">Cognitive OS</p>
        </div>

        {/* Workspace Switcher */}
        <div className="p-4 border-b border-slate-700">
          <button className="w-full text-left text-white hover:bg-slate-800 p-2 rounded">
            <span className="text-sm">Workspace: Main</span>
            <span className="text-xs text-slate-400 ml-2">▼</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-700">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-800 text-white placeholder-slate-400 px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`
                    w-full text-left p-2 rounded flex items-center gap-3 transition-colors
                    ${activeItem === item.id
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm">
              U
            </div>
            <div className="flex-1">
              <p className="text-sm text-white">User</p>
              <p className="text-xs text-slate-400">user@nexora.omega</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}