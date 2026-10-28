'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, Palette, Sparkles, Save, RotateCcw, Check, Loader2, Crown, Wand2, Download, Upload } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function AvatarBuilderPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [avatar, setAvatar] = useState({
    style: 'realistic',
    bodyType: 'average',
    skinTone: 'medium',
    eyeColor: 'blue',
    eyeShape: 'round',
    hairStyle: 'modern',
    hairColor: 'brown',
    hairLength: 'medium',
    accessories: 'none',
    expression: 'friendly',
    effects: {
      glow: false,
      particles: false,
      animation: 'none',
    },
  })

  const skinTones = ['pale', 'light', 'medium', 'olive', 'tan', 'dark', 'deep']
  const eyeColors = ['blue', 'green', 'brown', 'hazel', 'gray', 'amber', 'purple']
  const hairColors = ['black', 'brown', 'blonde', 'red', 'gray', 'white', 'pink', 'blue', 'purple', 'green']
  const expressions = ['friendly', 'serious', 'happy', 'thoughtful', 'excited', 'calm', 'mysterious', 'playful']
  const accessories = ['none', 'crown', 'halo', 'wings', 'glasses']

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleRandomize = () => {
    setAvatar({
      ...avatar,
      skinTone: skinTones[Math.floor(Math.random() * skinTones.length)],
      eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      expression: expressions[Math.floor(Math.random() * expressions.length)],
    })
  }

  const getSkinToneColor = (tone: string) => {
    const colors: Record<string, string> = {
      pale: '#FDEBD0',
      light: '#F5D0C5',
      medium: '#E0AC69',
      olive: '#C68642',
      tan: '#D2B48C',
      dark: '#8D5524',
      deep: '#5C3317',
    }
    return colors[tone] || colors.medium
  }

  const getEyeColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: '#3B82F6',
      green: '#10B981',
      brown: '#92400E',
      hazel: '#A98467',
      gray: '#6B7280',
      amber: '#F59E0B',
      purple: '#8B5CF6',
    }
    return colors[color] || colors.blue
  }

  const getHairColor = (color: string) => {
    const colors: Record<string, string> = {
      black: '#1F2937',
      brown: '#92400E',
      blonde: '#FCD34D',
      red: '#DC2626',
      gray: '#6B7280',
      white: '#F9FAFB',
      pink: '#EC4899',
      blue: '#3B82F6',
      purple: '#8B5CF6',
      green: '#10B981',
    }
    return colors[color] || colors.brown
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/app/profile')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 transition-colors cursor-pointer relative z-20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Avatar Builder</h1>
            <p className="text-gray-400">Create your unique digital identity</p>
          </div>
        </div>

        {/* Avatar Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-purple-500 relative z-10">
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: getSkinToneColor(avatar.skinTone) }}
              >
                {/* Eyes */}
                <div className="absolute top-12 left-8 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getEyeColor(avatar.eyeColor) }}
                  />
                </div>
                <div className="absolute top-12 right-8 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getEyeColor(avatar.eyeColor) }}
                  />
                </div>

                {/* Mouth */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  {avatar.expression === 'happy' && (
                    <div className="w-12 h-6 border-b-4 border-purple-400 rounded-b-full" />
                  )}
                  {avatar.expression === 'friendly' && (
                    <div className="w-8 h-4 border-b-4 border-purple-400 rounded-b-full" />
                  )}
                  {avatar.expression === 'serious' && (
                    <div className="w-10 h-1 bg-purple-400 rounded" />
                  )}
                </div>

                {/* Hair */}
                <div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-12 rounded-t-full"
                  style={{ backgroundColor: getHairColor(avatar.hairColor) }}
                />
              </div>

              {/* Accessory */}
              {avatar.accessories === 'crown' && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <Crown className="w-10 h-10 text-yellow-400" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <button
                onClick={handleRandomize}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer relative z-20"
              >
                <Wand2 className="w-4 h-4" />
                Randomize
              </button>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer relative z-20">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer relative z-20">
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Face Customization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Palette className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Face</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Skin Tone</label>
              <div className="flex gap-2 flex-wrap">
                {skinTones.map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setAvatar({ ...avatar, skinTone: tone })}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all cursor-pointer relative z-20',
                      avatar.skinTone === tone ? 'border-purple-500 scale-110' : 'border-transparent'
                    )}
                    style={{ backgroundColor: getSkinToneColor(tone) }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Eye Color</label>
              <div className="flex gap-2 flex-wrap">
                {eyeColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAvatar({ ...avatar, eyeColor: color })}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all cursor-pointer relative z-20',
                      avatar.eyeColor === color ? 'border-purple-500 scale-110' : 'border-transparent'
                    )}
                    style={{ backgroundColor: getEyeColor(color) }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Expression</label>
              <div className="grid grid-cols-4 gap-2">
                {expressions.map((expr) => (
                  <button
                    key={expr}
                    onClick={() => setAvatar({ ...avatar, expression: expr })}
                    className={cn(
                      'p-2 rounded-lg text-xs capitalize transition-all cursor-pointer relative z-20',
                      avatar.expression === expr
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    )}
                  >
                    {expr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hair */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Hair</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Hair Color</label>
              <div className="flex gap-2 flex-wrap">
                {hairColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAvatar({ ...avatar, hairColor: color })}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all cursor-pointer relative z-20',
                      avatar.hairColor === color ? 'border-purple-500 scale-110' : 'border-transparent'
                    )}
                    style={{ backgroundColor: getHairColor(color) }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Effects</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-white">Glow Effect</label>
                <p className="text-xs text-gray-400">Add a glowing aura</p>
              </div>
              <button
                onClick={() => setAvatar({ ...avatar, effects: { ...avatar.effects, glow: !avatar.effects.glow } })}
                className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${
                  avatar.effects.glow ? 'bg-purple-500' : 'bg-white/10'
                }`}
              >
                <motion.div
                  layout
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                    avatar.effects.glow ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-white">Particle Effects</label>
                <p className="text-xs text-gray-400">Floating particles</p>
              </div>
              <button
                onClick={() => setAvatar({ ...avatar, effects: { ...avatar.effects, particles: !avatar.effects.particles } })}
                className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${
                  avatar.effects.particles ? 'bg-purple-500' : 'bg-white/10'
                }`}
              >
                <motion.div
                  layout
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                    avatar.effects.particles ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Animation</label>
              <select
                value={avatar.effects.animation}
                onChange={(e) => setAvatar({ ...avatar, effects: { ...avatar.effects, animation: e.target.value } })}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer relative z-20"
              >
                <option value="none">None</option>
                <option value="float">Float</option>
                <option value="pulse">Pulse</option>
                <option value="bounce">Bounce</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Accessories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Crown className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Special Accessories</h3>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {accessories.map((acc) => (
              <button
                key={acc}
                onClick={() => setAvatar({ ...avatar, accessories: acc })}
                className={cn(
                  'p-3 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer relative z-20',
                  avatar.accessories === acc
                    ? 'bg-purple-500/20 border-2 border-purple-500'
                    : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                )}
              >
                <span className="text-2xl">{acc === 'none' ? '🚫' : acc === 'crown' ? '👑' : acc === 'halo' ? '😇' : acc === 'wings' ? '🦋' : acc === 'glasses' ? '👓' : '✨'}</span>
                <span className="text-xs text-gray-300 capitalize">{acc}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Save Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleRandomize}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer relative z-20"
          >
            <Wand2 className="w-4 h-4" />
            Randomize
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
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Avatar'}
          </button>
        </div>
      </div>
    </div>
  )
}
