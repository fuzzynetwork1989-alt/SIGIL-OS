'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Brain, Heart, Target, Save, RotateCcw, Check, Loader2, Upload, Camera, X, Plus, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function ProfileBuilderPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState({
    // Basic Info
    displayName: 'SIGIL User',
    bio: 'AI enthusiast exploring the future of cognitive computing',
    avatar: null as string | null,

    // Personality Traits
    traits: {
      creativity: 75,
      empathy: 80,
      curiosity: 90,
      humor: 60,
      assertiveness: 50,
      adaptability: 85,
    },

    // AI Personality
    aiPersonality: {
      friendliness: 80,
      formality: 30,
      enthusiasm: 70,
      humor: 50,
      intellect: 85,
    },

    // Custom Instructions
    instructions: [
      {
        id: '1',
        title: 'Communication Style',
        content: 'Be friendly and approachable. Use conversational language. Show empathy and understanding.',
        category: 'behavior',
        enabled: true,
      },
      {
        id: '2',
        title: 'Response Length',
        content: 'Keep responses concise but informative. Focus on being helpful rather than verbose.',
        category: 'response',
        enabled: true,
      },
    ],

    // Interests
    interests: [
      'Artificial Intelligence',
      'Machine Learning',
      'Technology',
      'Gaming',
    ],

    // Goals
    goals: [
      'Learn advanced AI concepts',
      'Build innovative applications',
      'Connect with like-minded people',
    ],
  })

  const traitLabels = {
    creativity: 'Creativity',
    empathy: 'Empathy',
    curiosity: 'Curiosity',
    humor: 'Humor',
    assertiveness: 'Assertiveness',
    adaptability: 'Adaptability',
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addInterest = () => {
    const interest = prompt('Add an interest:')
    if (interest && !profile.interests.includes(interest)) {
      setProfile({ ...profile, interests: [...profile.interests, interest] })
    }
  }

  const removeInterest = (interest: string) => {
    setProfile({ ...profile, interests: profile.interests.filter(i => i !== interest) })
  }

  const addGoal = () => {
    const goal = prompt('Add a goal:')
    if (goal && !profile.goals.includes(goal)) {
      setProfile({ ...profile, goals: [...profile.goals, goal] })
    }
  }

  const removeGoal = (goal: string) => {
    setProfile({ ...profile, goals: profile.goals.filter(g => g !== goal) })
  }

  const addInstruction = () => {
    const newInstruction = {
      id: Date.now().toString(),
      title: 'New Instruction',
      content: 'Describe what you want SIGIL to do...',
      category: 'behavior',
      enabled: true,
    }
    setProfile({ ...profile, instructions: [...profile.instructions, newInstruction] })
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
            <h1 className="text-3xl font-bold text-white mb-2">Profile Builder</h1>
            <p className="text-gray-400">Customize your SIGIL experience</p>
          </div>
        </div>

        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <User className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Avatar</h3>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-purple-500">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Display Name</label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer relative z-20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none cursor-pointer relative z-20"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personality Traits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Personality Traits</h3>
          </div>

          <div className="space-y-6">
            {Object.entries(profile.traits).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-gray-300">{traitLabels[key as keyof typeof traitLabels]}</label>
                  <span className="text-sm text-purple-400 font-mono">{value}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={value}
                  onChange={(e) => setProfile({
                    ...profile,
                    traits: { ...profile.traits, [key]: parseInt(e.target.value) }
                  })}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Personality */}
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
            <h3 className="text-lg font-semibold text-white">AI Personality</h3>
          </div>

          <div className="space-y-6">
            {Object.entries(profile.aiPersonality).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-gray-300 capitalize">{key}</label>
                  <span className="text-sm text-purple-400 font-mono">{value}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={value}
                  onChange={(e) => setProfile({
                    ...profile,
                    aiPersonality: { ...profile.aiPersonality, [key]: parseInt(e.target.value) }
                  })}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Custom Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white-20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Custom Instructions</h3>
            </div>
            <button
              onClick={addInstruction}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all cursor-pointer relative z-20"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {profile.instructions.map((instruction) => (
              <div
                key={instruction.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex justify-between items-start mb-2">
                  <input
                    type="text"
                    value={instruction.title}
                    onChange={(e) => {
                      const updated = profile.instructions.map(i =>
                        i.id === instruction.id ? { ...i, title: e.target.value } : i
                      )
                      setProfile({ ...profile, instructions: updated })
                    }}
                    className="flex-1 bg-transparent text-white font-medium focus:outline-none cursor-pointer relative z-20"
                  />
                  <button
                    onClick={() => {
                      const updated = profile.instructions.filter(i => i.id !== instruction.id)
                      setProfile({ ...profile, instructions: updated })
                    }}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors cursor-pointer relative z-30"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={instruction.content}
                  onChange={(e) => {
                    const updated = profile.instructions.map(i =>
                      i.id === instruction.id ? { ...i, content: e.target.value } : i
                    )
                    setProfile({ ...profile, instructions: updated })
                  }}
                  rows={2}
                  className="w-full bg-transparent text-gray-300 text-sm focus:outline-none resize-none cursor-pointer relative z-20"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white-20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20">
                <Heart className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Interests</h3>
            </div>
            <button
              onClick={addInterest}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all cursor-pointer relative z-20"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <div
                key={interest}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-300"
              >
                <span className="text-sm">{interest}</span>
                <button
                  onClick={() => removeInterest(interest)}
                  className="hover:text-red-400 transition-colors cursor-pointer relative z-30"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white-20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Goals</h3>
            </div>
            <button
              onClick={addGoal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all cursor-pointer relative z-20"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="space-y-2">
            {profile.goals.map((goal) => (
              <div
                key={goal}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5"
              >
                <span className="text-gray-300">{goal}</span>
                <button
                  onClick={() => removeGoal(goal)}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors cursor-pointer relative z-30"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
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
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}
