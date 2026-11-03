'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Heart, Clock, MoreVertical, Smile, Paperclip, ArrowLeft, Trash2, Copy, Download, StopCircle, Eye, Mic, Video, Music, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { api } from '../../lib/api'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

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
  const [isStreaming, setIsStreaming] = useState(false)
  const [selectedModel, setSelectedModel] = useState('sigil-companion')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showVisionPanel, setShowVisionPanel] = useState(false)
  const [showVoicePanel, setShowVoicePanel] = useState(false)
  const [showVideoPanel, setShowVideoPanel] = useState(false)
  const [showMusicPanel, setShowMusicPanel] = useState(false)
  const [visionQuery, setVisionQuery] = useState('')
  const [visionImage, setVisionImage] = useState<File | null>(null)
  const [voiceText, setVoiceText] = useState('')
  const [videoPrompt, setVideoPrompt] = useState('')
  const [musicPrompt, setMusicPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const visionImageRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput('')
    setIsStreaming(true)
    setIsTyping(true)

    // Prepare conversation history
    const conversationHistory = messages.map(m => ({
      role: m.role,
      content: m.content,
    }))
    conversationHistory.push({ role: 'user', content: input })

    try {
      abortControllerRef.current = new AbortController()
      
      // Stream the response
      const stream = await api.streamChatCompletion({
        model: selectedModel,
        messages: conversationHistory,
        temperature: 0.7,
        maxTokens: 2048,
      })

      const reader = stream.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''
      const assistantMessageId = (Date.now() + 1).toString()

      // Add empty assistant message that will be updated
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content || ''
              
              if (content) {
                assistantContent += content
                setMessages(prev => prev.map(m => 
                  m.id === assistantMessageId 
                    ? { ...m, content: assistantContent }
                    : m
                ))
              }

              if (parsed.choices?.[0]?.finish_reason === 'stop') {
                setIsStreaming(false)
                setIsTyping(false)
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setIsStreaming(false)
      setIsTyping(false)
      
      // Add error message
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }])
    }
  }

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsStreaming(false)
      setIsTyping(false)
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('File selected:', file.name)
      // TODO: Implement actual file upload and analysis
      setInput(input + `\n[Attached: ${file.name}]`)
    }
  }

  const handleEmojiClick = (emoji: string) => {
    setInput(input + emoji)
    setShowEmojiPicker(false)
  }

  const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '✨', '🎉']
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter(m => m.id !== id))
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Hi! I'm SIGIL, your AI companion. I remember our conversations and I'm here to help you with anything. What's on your mind today?",
        timestamp: new Date(),
      },
    ])
  }

  const handleFavorite = () => {
    console.log('Favorite clicked')
    // TODO: Implement favorite functionality
  }

  const handleHistory = () => {
    console.log('History clicked')
    // TODO: Implement history functionality
  }

  const handleMore = () => {
    console.log('More options clicked')
    // TODO: Implement more options
  }

  // Multimodal handlers
  const handleVisionUpload = () => {
    visionImageRef.current?.click()
  }

  const handleVisionImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVisionImage(file)
    }
  }

  const handleVisionAnalyze = async () => {
    if (!visionImage || !visionQuery.trim()) return

    setIsGenerating(true)
    try {
      const formData = new FormData()
      formData.append('image', visionImage)
      formData.append('query', visionQuery)
      formData.append('model', 'sigil-vision')

      const response = await fetch('/api/vision/analyze', {
        method: 'POST',
        headers: {
          'X-HuggingFace-Key': JSON.parse(localStorage.getItem('sigil_api_keys') || '{}').huggingface || '',
        },
        body: formData,
      })

      const result = await response.json()
      setGenerationResult(result)
    } catch (error) {
      console.error('Vision analysis error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleVoiceSynthesize = async () => {
    if (!voiceText.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-HuggingFace-Key': JSON.parse(localStorage.getItem('sigil_api_keys') || '{}').huggingface || '',
        },
        body: JSON.stringify({
          text: voiceText,
          model: 'sigil-voice',
        }),
      })

      const result = await response.json()
      setGenerationResult(result)
    } catch (error) {
      console.error('Voice synthesis error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleVideoGenerate = async () => {
    if (!videoPrompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-HuggingFace-Key': JSON.parse(localStorage.getItem('sigil_api_keys') || '{}').huggingface || '',
        },
        body: JSON.stringify({
          prompt: videoPrompt,
          model: 'sigil-video',
        }),
      })

      const result = await response.json()
      setGenerationResult(result)
    } catch (error) {
      console.error('Video generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleMusicGenerate = async () => {
    if (!musicPrompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/music/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-HuggingFace-Key': JSON.parse(localStorage.getItem('sigil_api_keys') || '{}').huggingface || '',
        },
        body: JSON.stringify({
          prompt: musicPrompt,
          model: 'sigil-music',
        }),
      })

      const result = await response.json()
      setGenerationResult(result)
    } catch (error) {
      console.error('Music generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col relative">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 px-6 py-4 relative z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30"
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
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-purple-500 cursor-pointer relative z-20"
            >
              <option value="sigil-companion">SIGIL Companion</option>
              <option value="sigil-mission">SIGIL Mission</option>
              <option value="sigil-world">SIGIL World</option>
              <option value="sigil-spatial">SIGIL Spatial</option>
              <option value="sigil-presence">SIGIL Presence</option>
              <option value="sigil-research">SIGIL Research</option>
              <option value="sigil-reasoner">SIGIL Reasoner</option>
              <option value="sigil-vision">SIGIL Vision</option>
              <option value="sigil-voice">SIGIL Voice</option>
              <option value="sigil-video">SIGIL Video</option>
              <option value="sigil-music">SIGIL Music</option>
            </select>
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleFavorite}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30"
              title="Favorite"
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={handleHistory}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30"
              title="History"
            >
              <Clock className="w-5 h-5" />
            </button>
            <button
              onClick={handleMore}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30"
              title="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowVisionPanel(!showVisionPanel)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30"
              title="Vision analysis"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowVoicePanel(!showVoicePanel)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30"
              title="Voice synthesis"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowVideoPanel(!showVideoPanel)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30"
              title="Video generation"
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowMusicPanel(!showMusicPanel)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30"
              title="Music generation"
            >
              <Music className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Multimodal Panels */}
      {showVisionPanel && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4 bg-white/10 backdrop-blur-lg border-b border-white/20 relative z-20"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Vision Analysis
            </h3>
            <div className="flex gap-3">
              <button
                onClick={handleVisionUpload}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer relative z-30"
              >
                {visionImage ? visionImage.name : 'Select Image'}
              </button>
              <input
                type="text"
                value={visionQuery}
                onChange={(e) => setVisionQuery(e.target.value)}
                placeholder="What would you like to know about this image?"
                className="flex-1 bg-white/10 rounded-xl px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500 border border-white/20 cursor-pointer relative z-20"
              />
              <button
                onClick={handleVisionAnalyze}
                disabled={!visionImage || !visionQuery.trim() || isGenerating}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer relative z-20"
              >
                {isGenerating ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
            {generationResult?.success && generationResult.response && (
              <div className="mt-3 p-3 bg-white/10 rounded-xl text-white text-sm">
                {JSON.stringify(generationResult.response)}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {showVoicePanel && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4 bg-white/10 backdrop-blur-lg border-b border-white/20 relative z-20"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Voice Synthesis
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                placeholder="Enter text to synthesize..."
                className="flex-1 bg-white/10 rounded-xl px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500 border border-white/20 cursor-pointer relative z-20"
              />
              <button
                onClick={handleVoiceSynthesize}
                disabled={!voiceText.trim() || isGenerating}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer relative z-20"
              >
                {isGenerating ? 'Synthesizing...' : 'Synthesize'}
              </button>
            </div>
            {generationResult?.success && generationResult.audio && (
              <div className="mt-3">
                <audio controls src={generationResult.audio} className="w-full" />
              </div>
            )}
          </div>
        </motion.div>
      )}

      {showVideoPanel && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4 bg-white/10 backdrop-blur-lg border-b border-white/20 relative z-20"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Video className="w-5 h-5" />
              Video Generation
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                placeholder="Describe the video you want to generate..."
                className="flex-1 bg-white/10 rounded-xl px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500 border border-white/20 cursor-pointer relative z-20"
              />
              <button
                onClick={handleVideoGenerate}
                disabled={!videoPrompt.trim() || isGenerating}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer relative z-20"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
            {generationResult?.success && generationResult.jobId && (
              <div className="mt-3 p-3 bg-white/10 rounded-xl text-white text-sm">
                Job ID: {generationResult.jobId} - Status: {generationResult.status}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {showMusicPanel && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4 bg-white/10 backdrop-blur-lg border-b border-white/20 relative z-20"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Music className="w-5 h-5" />
              Music Generation
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={musicPrompt}
                onChange={(e) => setMusicPrompt(e.target.value)}
                placeholder="Describe the music you want to generate..."
                className="flex-1 bg-white/10 rounded-xl px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500 border border-white/20 cursor-pointer relative z-20"
              />
              <button
                onClick={handleMusicGenerate}
                disabled={!musicPrompt.trim() || isGenerating}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer relative z-20"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
            {generationResult?.success && generationResult.jobId && (
              <div className="mt-3 p-3 bg-white/10 rounded-xl text-white text-sm">
                Job ID: {generationResult.jobId} - Status: {generationResult.status}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-end gap-2">
                  {message.role === 'assistant' && (
                    <div className="flex gap-1 mb-2">
                      <button
                        onClick={() => handleCopyMessage(message.content)}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 text-purple-300 cursor-pointer relative z-30"
                        title="Copy"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 text-purple-300 cursor-pointer relative z-30"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl p-4 relative z-20 ${
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
      <div className="bg-white/10 backdrop-blur-lg border-t border-white/20 px-6 py-4 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={visionImageRef}
              type="file"
              onChange={handleVisionImageChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={handleFileUpload}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 bg-white/10 rounded-2xl border border-white/20 focus-within:border-purple-500 transition-colors relative z-20">
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
                className="w-full bg-transparent text-white placeholder-purple-300 resize-none focus:outline-none p-4 min-h-[60px] max-h-[200px] relative z-30"
                rows={1}
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-30"
                title="Add emoji"
              >
                <Smile className="w-5 h-5" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 p-3 bg-slate-800 rounded-xl border border-white/20 shadow-xl z-40">
                  <div className="grid grid-cols-5 gap-2">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-2xl hover:bg-white/10 rounded p-1 cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={isStreaming ? handleStopGeneration : handleSend}
              disabled={!input.trim() && !isStreaming}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer relative z-30"
            >
              {isStreaming ? <StopCircle className="w-5 h-5" /> : <Send className="w-5 h-5" />}
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
