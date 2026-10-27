'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Heart, Clock, MoreVertical, Smile, Paperclip, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const aiResponses = [
  "That's a great question! Let me think about that for a moment. Based on what you've shared, I'd suggest focusing on the key points first.",
  "I understand what you're looking for. Here's my perspective on this - it's important to consider both the short-term and long-term implications.",
  "Interesting! I remember we talked about something similar before. Building on that, I think you might want to explore this approach.",
  "That's a thoughtful question. From my understanding, there are a few different ways to approach this. Let me share the most effective one.",
  "I'm here to help with that. Based on our previous conversations, I know you prefer practical solutions, so here's what I'd recommend.",
  "Great point! Let me break this down for you. First, we should consider the main factors, then look at the specific details.",
  "I appreciate you sharing that with me. This is something I can definitely help you work through. Let's start with the basics.",
  "That makes sense. Here's my take on it - focus on what matters most to you right now, and we can build from there.",
]

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm SIGIL, your AI companion. I remember our conversations and I'm here to help you with anything. What's on your mind today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response with varied responses
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
    const responseTime = 1000 + Math.random() * 2000

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, responseTime)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold">SIGIL</h1>
              <p className="text-purple-300 text-sm">Your AI companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors">
              <Clock className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 backdrop-blur-lg text-white border border-white/20'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-purple-200' : 'text-purple-300'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/10 backdrop-blur-lg border-t border-white/20 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 bg-white/10 rounded-2xl border border-white/20 focus-within:border-purple-500 transition-colors">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Type your message..."
                className="w-full bg-transparent text-white placeholder-purple-300 resize-none focus:outline-none p-4 min-h-[60px] max-h-[200px]"
                rows={1}
              />
            </div>
            <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-purple-300 text-xs mt-3">
            SIGIL remembers your conversations to provide better help
          </p>
        </div>
      </div>
    </div>
  )
}
