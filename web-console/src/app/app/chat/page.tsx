'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, userMessage])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const response = await api.generateText({
        prompt: input,
        model: 'Qwen/Qwen3-30B-A3B-Instruct-2507',
        max_tokens: 1000,
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.choices[0].text,
        timestamp: new Date().toISOString(),
      }

      setMessages([...messages, userMessage, assistantMessage])
    } catch (err) {
      setError('Failed to generate response')
      console.error('Chat error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <p className="text-lg mb-2">Start a conversation</p>
            <p className="text-sm">Ask NEXORA Omega anything about your workspace</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-2 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          disabled={loading}
          className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:border-purple-500 disabled:opacity-50"
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}