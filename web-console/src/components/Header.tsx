'use client'

import { useState } from 'react'

interface HeaderProps {
  onMenuClick: () => void
  isSidebarOpen: boolean
}

export default function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="bg-slate-900 border-b border-slate-700 h-16 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-white hover:bg-slate-800 p-2 rounded"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Global command palette trigger */}
        <button className="text-white hover:bg-slate-800 p-2 rounded flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden sm:inline text-sm">Search</span>
          <kbd className="hidden sm:inline text-xs bg-slate-700 px-2 py-1 rounded">⌘K</kbd>
        </button>
      </div>

      {/* Center - Status indicators */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Model: Online</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Services: Healthy</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="text-white hover:bg-slate-800 p-2 rounded relative">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Approvals */}
        <button className="text-white hover:bg-slate-800 p-2 rounded relative">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>
        </button>

        {/* User menu */}
        <button className="flex items-center gap-2 text-white hover:bg-slate-800 p-2 rounded">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm">
            U
          </div>
          <span className="hidden sm:inline text-sm">User</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </header>
  )
}