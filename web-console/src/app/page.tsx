'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MessageSquare, Heart, Sparkles, ChevronRight } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const recentConversations = [
    { id: 1, title: 'Planning my trip to Japan', preview: 'Let me help you plan an amazing trip...', time: '2 hours ago' },
    { id: 2, title: 'Learning Python programming', preview: 'I can guide you through the basics...', time: 'Yesterday' },
    { id: 3, title: 'Recipe ideas for dinner', preview: 'How about something simple and delicious...', time: '2 days ago' },
  ]

  const quickActions = [
    { icon: MessageSquare, label: 'Start a chat', color: 'from-purple-500 to-pink-500', route: '/app/chat' },
    { icon: Heart, label: 'My memories', color: 'from-pink-500 to-rose-500', route: '/app/memory' },
    { icon: Sparkles, label: 'Personalize', color: 'from-blue-500 to-cyan-500', route: '/app/settings' },
  ]

  const handleNavigate = (route: string) => {
    console.log('Navigating to:', route)
    router.push(route)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Greeting Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            {greeting}, I'm SIGIL
          </h1>
          <p className="text-xl text-purple-200">
            Your AI companion who remembers and helps you
          </p>
        </motion.div>

        {/* Main Chat Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
            <textarea
              placeholder="What would you like to talk about today?"
              className="w-full bg-transparent text-white text-lg placeholder-purple-300 resize-none focus:outline-none min-h-[120px]"
              rows={4}
            />
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors">
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => handleNavigate('/app/chat')}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
              >
                Start Chat
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                onClick={() => handleNavigate(action.route)}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-medium">{action.label}</p>
              </button>
            )
          })}
        </motion.div>

        {/* Recent Conversations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Recent Conversations</h2>
          <div className="space-y-3">
            {recentConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleNavigate('/app/chat')}
                className="w-full bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all text-left group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-medium text-lg">{conv.title}</h3>
                  <span className="text-purple-300 text-sm">{conv.time}</span>
                </div>
                <p className="text-purple-200 text-sm">{conv.preview}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/20 border border-green-500/30">
            <Heart className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">
              Your conversations are private and secure
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
