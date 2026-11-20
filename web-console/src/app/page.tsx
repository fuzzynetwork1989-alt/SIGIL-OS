'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/api'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(isAuthenticated() ? '/app/home' : '/auth/login')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <p className="text-purple-200">Loading SIGIL OS…</p>
    </div>
  )
}
