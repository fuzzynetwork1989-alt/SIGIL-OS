'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Copy, Download, Link2, Twitter, Facebook, Linkedin, QrCode, Lock, Globe, Image, FileText, Check, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function SocialSharingPage() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)

  const [privacy, setPrivacy] = useState('friends')

  const [exportFormat, setExportFormat] = useState('markdown')

  const [conversation, setConversation] = useState({
    title: 'Planning my Japan trip',
    messages: 15,
    date: '2024-03-15',
    preview: 'Let me help you plan an amazing trip to Japan...',
  })

  const socialPlatforms = [
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
  ]

  const exportFormats = [
    { id: 'markdown', name: 'Markdown', icon: FileText },
    { id: 'json', name: 'JSON', icon: FileText },
    { id: 'image', name: 'Image', icon: Image },
    { id: 'link', name: 'Share Link', icon: Link2 },
  ]

  const privacyOptions = [
    { id: 'private', name: 'Private', description: 'Only you can see', icon: Lock },
    { id: 'friends', name: 'Friends', description: 'Share with friends', icon: Share2 },
    { id: 'public', name: 'Public', description: 'Anyone can see', icon: Globe },
  ]

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://sigil.os/share/abc123')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async (platform: string) => {
    setSharing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSharing(false)
  }

  const handleExport = async () => {
    setSharing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSharing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/app/settings')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Social Sharing</h1>
            <p className="text-gray-400">Share your SIGIL experience</p>
          </div>
        </div>

        {/* Conversation Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Share2 className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Conversation to Share</h3>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h4 className="text-white font-medium mb-2">{conversation.title}</h4>
            <p className="text-gray-300 text-sm mb-3">{conversation.preview}</p>
            <div className="flex gap-4 text-xs text-purple-300">
              <span>{conversation.messages} messages</span>
              <span>{conversation.date}</span>
            </div>
          </div>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Lock className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Privacy Settings</h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {privacyOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => setPrivacy(option.id)}
                  className={cn(
                    'p-4 rounded-xl border-2 text-center transition-all cursor-pointer relative z-20',
                    privacy === option.id
                      ? 'bg-purple-500/20 border-purple-500'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  )}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                  <p className="text-white font-medium">{option.name}</p>
                  <p className="text-gray-400 text-xs mt-1">{option.description}</p>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Export Format */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Download className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Export Format</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exportFormats.map((format) => {
              const Icon = format.icon
              return (
                <button
                  key={format.id}
                  onClick={() => setExportFormat(format.id)}
                  className={cn(
                    'p-4 rounded-xl border-2 text-center transition-all cursor-pointer relative z-20',
                    exportFormat === format.id
                      ? 'bg-purple-500/20 border-purple-500'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  )}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                  <p className="text-white font-medium text-sm">{format.name}</p>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Share Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Link2 className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Share Link</h3>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value="https://sigil.os/share/abc123"
              readOnly
              className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 text-gray-300 focus:outline-none cursor-pointer relative z-20"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all cursor-pointer relative z-20"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </motion.div>

        {/* Social Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Share2 className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Share to Social</h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon
              return (
                <button
                  key={platform.id}
                  onClick={() => handleShare(platform.id)}
                  disabled={sharing}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer relative z-20 disabled:opacity-50"
                >
                  <Icon className="w-8 h-8 text-white" />
                  <span className="text-white font-medium">{platform.name}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <QrCode className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">QR Code</h3>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center">
              <QrCode className="w-24 h-24 text-slate-900" />
            </div>
            <div className="flex-1 space-y-3">
              <button
                onClick={handleExport}
                disabled={sharing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all cursor-pointer relative z-20 disabled:opacity-50"
              >
                {sharing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {sharing ? 'Generating...' : 'Download QR Code'}
              </button>
              <p className="text-gray-400 text-sm">
                Scan this QR code to view the shared conversation
              </p>
            </div>
          </div>
        </motion.div>

        {/* Export Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={handleExport}
            disabled={sharing}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer relative z-20"
          >
            {sharing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {sharing ? 'Exporting...' : `Export as ${exportFormat}`}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
