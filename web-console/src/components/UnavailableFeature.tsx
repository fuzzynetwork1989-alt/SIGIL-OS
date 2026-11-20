'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Construction } from 'lucide-react'

export default function UnavailableFeature({
  title,
  backTo = '/app/home',
}: {
  title: string
  backTo?: string
}) {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push(backTo)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/20 text-center">
          <Construction className="w-12 h-12 text-purple-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          <p className="text-purple-200">
            This feature is not available in the current build — the backend
            service it depends on has not been implemented yet. Nothing here is
            simulated.
          </p>
        </div>
      </div>
    </div>
  )
}
