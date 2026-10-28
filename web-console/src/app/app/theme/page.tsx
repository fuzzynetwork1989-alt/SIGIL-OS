'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Palette, Sun, Moon, Save, RotateCcw, Check, Loader2, Sparkles, Droplet, Zap } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function ThemeEnginePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [theme, setTheme] = useState({
    preset: 'neon-purple',
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    backgroundColor: '#0F172A',
    textColor: '#FFFFFF',
    accentColor: '#3B82F6',
    glassEffect: true,
    particles: true,
    animations: true,
    borderRoundedness: 16,
    shadowIntensity: 50,
    glowEffect: true,
  })

  const presets = [
    { id: 'neon-purple', name: 'Neon Purple', primary: '#8B5CF6', secondary: '#EC4899', bg: '#0F172A' },
    { id: 'cyber-blue', name: 'Cyber Blue', primary: '#3B82F6', secondary: '#06B6D4', bg: '#0C1929' },
    { id: 'emerald-green', name: 'Emerald Green', primary: '#10B981', secondary: '#34D399', bg: '#064E3B' },
    { id: 'rose-red', name: 'Rose Red', primary: '#EF4444', secondary: '#F43F5E', bg: '#1F1517' },
    { id: 'amber-gold', name: 'Amber Gold', primary: '#F59E0B', secondary: '#FBBF24', bg: '#1C1917' },
    { id: 'slate-dark', name: 'Slate Dark', primary: '#64748B', secondary: '#94A3B8', bg: '#0F172A' },
  ]

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const applyPreset = (preset: typeof presets[0]) => {
    setTheme({
      ...theme,
      preset: preset.id,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      backgroundColor: preset.bg,
    })
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
            <h1 className="text-3xl font-bold text-white mb-2">Theme Engine</h1>
            <p className="text-gray-400">Customize your SIGIL experience</p>
          </div>
        </div>

        {/* Theme Presets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Palette className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Theme Presets</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all cursor-pointer relative z-20',
                  theme.preset === preset.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                )}
              >
                <div
                  className="w-full h-16 rounded-lg mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                  }}
                />
                <p className="text-white font-medium">{preset.name}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Color Customization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Droplet className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Color Palette</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Primary Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-12 h-12 rounded-lg cursor-pointer relative z-20"
                />
                <input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 cursor-pointer relative z-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Secondary Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="w-12 h-12 rounded-lg cursor-pointer relative z-20"
                />
                <input
                  type="text"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 cursor-pointer relative z-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Background Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                  className="w-12 h-12 rounded-lg cursor-pointer relative z-20"
                />
                <input
                  type="text"
                  value={theme.backgroundColor}
                  onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                  className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 cursor-pointer relative z-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Accent Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                  className="w-12 h-12 rounded-lg cursor-pointer relative z-20"
                />
                <input
                  type="text"
                  value={theme.accentColor}
                  onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                  className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 cursor-pointer relative z-20"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Visual Effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Visual Effects</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-white">Glassmorphism</label>
                <p className="text-xs text-gray-400">Blur and transparency effects</p>
              </div>
              <button
                onClick={() => setTheme({ ...theme, glassEffect: !theme.glassEffect })}
                className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${
                  theme.glassEffect ? 'bg-purple-500' : 'bg-white/10'
                }`}
              >
                <motion.div
                  layout
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                    theme.glassEffect ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-white">Particle Effects</label>
                <p className="text-xs text-gray-400">Floating animated particles</p>
              </div>
              <button
                onClick={() => setTheme({ ...theme, particles: !theme.particles })}
                className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${
                  theme.particles ? 'bg-purple-500' : 'bg-white/10'
                }`}
              >
                <motion.div
                  layout
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                    theme.particles ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-white">Animations</label>
                <p className="text-xs text-gray-400">Smooth transitions and animations</p>
              </div>
              <button
                onClick={() => setTheme({ ...theme, animations: !theme.animations })}
                className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${
                  theme.animations ? 'bg-purple-500' : 'bg-white/10'
                }`}
              >
                <motion.div
                  layout
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                    theme.animations ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-white">Glow Effect</label>
                <p className="text-xs text-gray-400">Neon glow on interactive elements</p>
              </div>
              <button
                onClick={() => setTheme({ ...theme, glowEffect: !theme.glowEffect })}
                className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${
                  theme.glowEffect ? 'bg-purple-500' : 'bg-white/10'
                }`}
              >
                <motion.div
                  layout
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                    theme.glowEffect ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* UI Styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">UI Styling</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-300">Border Roundedness</label>
                <span className="text-sm text-purple-400 font-mono">{theme.borderRoundedness}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={32}
                value={theme.borderRoundedness}
                onChange={(e) => setTheme({ ...theme, borderRoundedness: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-300">Shadow Intensity</label>
                <span className="text-sm text-purple-400 font-mono">{theme.shadowIntensity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={theme.shadowIntensity}
                onChange={(e) => setTheme({ ...theme, shadowIntensity: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Theme Mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Moon className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Theme Mode</h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-500/20 border-2 border-purple-500 cursor-pointer relative z-20">
              <Moon className="w-6 h-6 text-purple-400" />
              <span className="text-white text-sm">Dark</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border-2 border-white/10 hover:border-white/20 cursor-pointer relative z-20">
              <Sun className="w-6 h-6 text-gray-400" />
              <span className="text-gray-300 text-sm">Light</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border-2 border-white/10 hover:border-white/20 cursor-pointer relative z-20">
              <div className="flex gap-1">
                <Moon className="w-4 h-4 text-gray-400" />
                <Sun className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-gray-300 text-sm">Auto</span>
            </button>
          </div>
        </motion.div>

        {/* Save Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {}}
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
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Theme'}
          </button>
        </div>
      </div>
    </div>
  )
}
