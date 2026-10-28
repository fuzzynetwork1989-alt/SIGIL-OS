'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sliders,
  Zap,
  Cpu,
  Save,
  RotateCcw,
  Check,
  Loader2,
  Sparkles,
  Volume2,
  Shield,
  Globe,
  Play,
  Pause,
  Trash2,
  Download,
  Upload,
  Palette,
  Bell,
  User,
  ArrowRight,
  LogOut,
} from 'lucide-react'
import { cn } from '../../lib/utils'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [settings, setSettings] = useState({
    // Model Settings
    selectedModel: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    frequencyPenalty: 0.5,
    presencePenalty: 0.5,

    // Voice
    voiceEnabled: true,
    voiceSpeed: 1.0,
    voicePitch: 1.0,

    // OWO Vest
    owoVestEnabled: false,
    owoVestIntensity: 50,
    owoVestPatterns: {
      notification: true,
      aiResponse: true,
      achievement: true,
      heartbeat: true,
    },

    // Privacy
    dataRetention: '30days',
    localProcessing: true,
    encryptionEnabled: true,

    // Chat
    streamingEnabled: true,
    showTimestamps: true,
    autoSaveChats: true,
  })

  const models = [
    { id: 'sigil-companion', name: 'SIGIL Companion', description: 'Your personal AI companion' },
    { id: 'sigil-mission', name: 'SIGIL Mission', description: 'Goal-oriented task execution' },
    { id: 'sigil-world', name: 'SIGIL World', description: 'World knowledge and context' },
    { id: 'sigil-spatial', name: 'SIGIL Spatial', description: 'Spatial reasoning and 3D understanding' },
    { id: 'sigil-presence', name: 'SIGIL Presence', description: 'Awareness and attention management' },
    { id: 'sigil-research', name: 'SIGIL Research', description: 'Deep research and analysis' },
    { id: 'sigil-reasoner', name: 'SIGIL Reasoner', description: 'Logical reasoning and inference' },
  ]

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    setSettings({
      selectedModel: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
      frequencyPenalty: 0.5,
      presencePenalty: 0.5,
      voiceEnabled: true,
      voiceSpeed: 1.0,
      voicePitch: 1.0,
      owoVestEnabled: false,
      owoVestIntensity: 50,
      owoVestPatterns: {
        notification: true,
        aiResponse: true,
        achievement: true,
        heartbeat: true,
      },
      dataRetention: '30days',
      localProcessing: true,
      encryptionEnabled: true,
      streamingEnabled: true,
      showTimestamps: true,
      autoSaveChats: true,
    })
  }

  const SliderSetting = ({ label, value, onChange, min = 0, max = 1, step = 0.1 }: any) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm text-gray-300">{label}</label>
        <span className="text-sm text-purple-400 font-mono">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
    </div>
  )

  const ToggleSetting = ({ label, checked, onChange }: any) => (
    <div className="flex items-center justify-between">
      <label className="text-sm text-gray-300">{label}</label>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${
          checked ? 'bg-purple-500' : 'bg-white/10'
        }`}
      >
        <motion.div
          layout
          className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
            checked ? 'left-6.5' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Customize your SIGIL experience</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer relative z-20"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer relative z-20"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Model Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Cpu className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Model Selection</h3>
          </div>

          <div className="space-y-3">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => setSettings({ ...settings, selectedModel: model.id })}
                className={cn(
                  'w-full p-4 rounded-xl border-2 transition-all text-left cursor-pointer relative z-20',
                  settings.selectedModel === model.id
                    ? 'bg-purple-500/20 border-purple-500'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                )}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-medium">{model.name}</h4>
                    <p className="text-sm text-gray-400">{model.description}</p>
                  </div>
                  {settings.selectedModel === model.id && (
                    <Check className="w-5 h-5 text-purple-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Model Parameters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Sliders className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Model Parameters</h3>
          </div>

          <div className="space-y-6">
            <SliderSetting
              label="Temperature"
              value={settings.temperature}
              onChange={(v) => setSettings({ ...settings, temperature: v })}
            />
            <SliderSetting
              label="Max Tokens"
              value={settings.maxTokens}
              onChange={(v) => setSettings({ ...settings, maxTokens: v })}
              min={256}
              max={4096}
              step={256}
            />
            <SliderSetting
              label="Top P"
              value={settings.topP}
              onChange={(v) => setSettings({ ...settings, topP: v })}
            />
            <SliderSetting
              label="Frequency Penalty"
              value={settings.frequencyPenalty}
              onChange={(v) => setSettings({ ...settings, frequencyPenalty: v })}
            />
            <SliderSetting
              label="Presence Penalty"
              value={settings.presencePenalty}
              onChange={(v) => setSettings({ ...settings, presencePenalty: v })}
            />
          </div>
        </motion.div>

        {/* Voice Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Volume2 className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Voice Settings</h3>
          </div>

          <div className="space-y-6">
            <ToggleSetting
              label="Enable Voice"
              checked={settings.voiceEnabled}
              onChange={(v) => setSettings({ ...settings, voiceEnabled: v })}
            />
            <SliderSetting
              label="Voice Speed"
              value={settings.voiceSpeed}
              onChange={(v) => setSettings({ ...settings, voiceSpeed: v })}
              min={0.5}
              max={2.0}
              step={0.1}
            />
            <SliderSetting
              label="Voice Pitch"
              value={settings.voicePitch}
              onChange={(v) => setSettings({ ...settings, voicePitch: v })}
              min={0.5}
              max={2.0}
              step={0.1}
            />
          </div>
        </motion.div>

        {/* OWO Vest Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">OWO Vest Haptics</h3>
          </div>

          <div className="space-y-6">
            <ToggleSetting
              label="Enable OWO Vest"
              checked={settings.owoVestEnabled}
              onChange={(v) => setSettings({ ...settings, owoVestEnabled: v })}
            />
            <SliderSetting
              label="Haptic Intensity"
              value={settings.owoVestIntensity}
              onChange={(v) => setSettings({ ...settings, owoVestIntensity: v })}
              min={0}
              max={100}
              step={5}
            />
            <div className="space-y-3">
              <label className="text-sm text-gray-300">Haptic Patterns</label>
              <ToggleSetting
                label="AI Response"
                checked={settings.owoVestPatterns.aiResponse}
                onChange={(v) => setSettings({
                  ...settings,
                  owoVestPatterns: { ...settings.owoVestPatterns, aiResponse: v }
                })}
              />
              <ToggleSetting
                label="Heartbeat"
                checked={settings.owoVestPatterns.heartbeat}
                onChange={(v) => setSettings({
                  ...settings,
                  owoVestPatterns: { ...settings.owoVestPatterns, heartbeat: v }
                })}
              />
              <ToggleSetting
                label="Achievements"
                checked={settings.owoVestPatterns.achievement}
                onChange={(v) => setSettings({
                  ...settings,
                  owoVestPatterns: { ...settings.owoVestPatterns, achievement: v }
                })}
              />
            </div>
          </div>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Privacy & Security</h3>
          </div>

          <div className="space-y-6">
            <ToggleSetting
              label="Local Processing Only"
              checked={settings.localProcessing}
              onChange={(v) => setSettings({ ...settings, localProcessing: v })}
            />
            <ToggleSetting
              label="Enable Encryption"
              checked={settings.encryptionEnabled}
              onChange={(v) => setSettings({ ...settings, encryptionEnabled: v })}
            />
          </div>
        </motion.div>

        {/* Chat Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Chat Settings</h3>
          </div>

          <div className="space-y-6">
            <ToggleSetting
              label="Streaming Responses"
              checked={settings.streamingEnabled}
              onChange={(v) => setSettings({ ...settings, streamingEnabled: v })}
            />
            <ToggleSetting
              label="Show Timestamps"
              checked={settings.showTimestamps}
              onChange={(v) => setSettings({ ...settings, showTimestamps: v })}
            />
            <ToggleSetting
              label="Auto-Save Chats"
              checked={settings.autoSaveChats}
              onChange={(v) => setSettings({ ...settings, autoSaveChats: v })}
            />
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Globe className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Data Management</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer relative z-20">
              <Download className="w-5 h-5 text-purple-400" />
              <span>Export Chats</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer relative z-20">
              <Upload className="w-5 h-5 text-purple-400" />
              <span>Import Chats</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white transition-all cursor-pointer relative z-20">
              <Trash2 className="w-5 h-5 text-red-400" />
              <span>Clear All Data</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer relative z-20">
              <Play className="w-5 h-5 text-purple-400" />
              <span>Sync Now</span>
            </button>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer relative z-20">
              <span>Profile Builder</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer relative z-20">
              <span>Avatar Builder</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer relative z-20">
              <span>Theme Engine</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer relative z-20">
              <span>Gamification</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer relative z-20">
              <span>Social Sharing</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer relative z-20">
              <span>API Keys</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer relative z-20">
              <span>Usage Statistics</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer relative z-20">
              <span>Help Center</span>
            </button>
          </div>
        </motion.div>

        {/* Advanced Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Sliders className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Advanced Settings</h3>
          </div>

          <div className="space-y-4">
            <ToggleSetting
              label="Enable Debug Mode"
              checked={false}
              onChange={(v) => {}}
            />
            <ToggleSetting
              label="Enable Experimental Features"
              checked={false}
              onChange={(v) => {}}
            />
            <ToggleSetting
              label="Enable Beta Features"
              checked={true}
              onChange={(v) => {}}
            />
            <ToggleSetting
              label="Verbose Logging"
              checked={false}
              onChange={(v) => {}}
            />
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Palette className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Appearance</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Theme</label>
              <select
                value="dark"
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer relative z-20"
              >
                <option value="dark">Dark (Default)</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <ToggleSetting
              label="Glassmorphism Effects"
              checked={true}
              onChange={(v) => {}}
            />
            <ToggleSetting
              label="Particles Animation"
              checked={true}
              onChange={(v) => {}}
            />
            <ToggleSetting
              label="Smooth Transitions"
              checked={true}
              onChange={(v) => {}}
            />
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Bell className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>

          <div className="space-y-4">
            <ToggleSetting
              label="Desktop Notifications"
              checked={true}
              onChange={(v) => {}}
            />
            <ToggleSetting
              label="Sound Effects"
              checked={true}
              onChange={(v) => {}}
            />
            <ToggleSetting
              label="Haptic Feedback"
              checked={true}
              onChange={(v) => {}}
            />
            <ToggleSetting
              label="Achievement Alerts"
              checked={true}
              onChange={(v) => {}}
            />
          </div>
        </motion.div>

        {/* Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <User className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Account</h3>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer relative z-20">
              <span>Edit Profile</span>
              <ArrowRight className="w-4 h-4 text-purple-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer relative z-20">
              <span>Change Password</span>
              <ArrowRight className="w-4 h-4 text-purple-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white transition-all cursor-pointer relative z-20">
              <span>Sign Out</span>
              <LogOut className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
