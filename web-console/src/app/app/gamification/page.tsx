'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trophy, Star, Flame, Target, Award, TrendingUp, Medal, Zap, Crown, Gem } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function GamificationPage() {
  const router = useRouter()

  const [stats, setStats] = useState({
    level: 12,
    xp: 3450,
    xpToNext: 5000,
    streak: 7,
    totalXp: 15000,
    rank: 'Silver',
  })

  const [dailyChallenges, setDailyChallenges] = useState([
    { id: 1, title: 'Have 5 conversations', progress: 3, goal: 5, xp: 100, completed: false },
    { id: 2, title: 'Use 3 different models', progress: 2, goal: 3, xp: 150, completed: false },
    { id: 3, title: 'Try custom instructions', progress: 0, goal: 1, xp: 200, completed: false },
  ])

  const [achievements, setAchievements] = useState([
    { id: 1, title: 'First Chat', description: 'Had your first conversation', icon: '💬', rarity: 'common', unlocked: true },
    { id: 2, title: 'Memory Master', description: 'Created 10 memories', icon: '🧠', rarity: 'rare', unlocked: true },
    { id: 3, title: 'Style Icon', description: 'Customized your avatar', icon: '🎨', rarity: 'common', unlocked: true },
    { id: 4, title: 'Streak Champion', description: '7-day streak', icon: '🔥', rarity: 'epic', unlocked: true },
    { id: 5, title: 'Model Explorer', description: 'Tried all SIGIL models', icon: '🤖', rarity: 'rare', unlocked: false },
    { id: 6, title: 'Legend', description: 'Reached level 50', icon: '👑', rarity: 'legendary', unlocked: false },
  ])

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'SIGIL Master', xp: 25000, avatar: '🎯' },
    { rank: 2, name: 'TechWizard', xp: 22000, avatar: '🧙' },
    { rank: 3, name: 'AI Enthusiast', xp: 18000, avatar: '🚀' },
    { rank: 4, name: 'You', xp: 15000, avatar: '😊', isUser: true },
    { rank: 5, name: 'Creative Mind', xp: 12000, avatar: '💡' },
  ])

  const [rewards, setRewards] = useState([
    { id: 1, name: 'Custom Theme', cost: 500, icon: '🎨', owned: false },
    { id: 2, name: 'Special Avatar', cost: 1000, icon: '🦄', owned: false },
    { id: 3, name: 'Badge Pack', cost: 2000, icon: '🏅', owned: true },
    { id: 4, name: 'Premium Effects', cost: 3000, icon: '✨', owned: false },
  ])

  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    rare: 'from-blue-500 to-cyan-500',
    epic: 'from-purple-500 to-pink-500',
    legendary: 'from-yellow-500 to-orange-500',
  }

  const rarityBorders = {
    common: 'border-gray-500',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-yellow-500',
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
            <h1 className="text-3xl font-bold text-white mb-2">Gamification</h1>
            <p className="text-gray-400">Level up your SIGIL experience</p>
          </div>
        </div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-purple-500">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Level {stats.level}</h2>
                <p className="text-purple-300">{stats.rank} Rank</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-xl">{stats.xp} / {stats.xpToNext} XP</p>
              <p className="text-purple-300 text-sm">{stats.totalXp} Total XP</p>
            </div>
          </div>
          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stats.xp / stats.xpToNext) * 100}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-orange-500/20">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Daily Streak</h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-orange-400">{stats.streak}</div>
            <div>
              <p className="text-white font-medium">Day Streak</p>
              <p className="text-gray-400 text-sm">Keep chatting to maintain your streak!</p>
            </div>
          </div>
        </motion.div>

        {/* Daily Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Daily Challenges</h3>
          </div>

          <div className="space-y-3">
            {dailyChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{challenge.title}</h4>
                    <p className="text-purple-300 text-sm">+{challenge.xp} XP</p>
                  </div>
                  {challenge.completed && (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${(challenge.progress / challenge.goal) * 100}%` }}
                  />
                </div>
                <p className="text-gray-400 text-xs mt-1">{challenge.progress} / {challenge.goal}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Achievements</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={cn(
                  'p-4 rounded-xl border-2 text-center transition-all cursor-pointer relative z-20',
                  achievement.unlocked
                    ? `bg-gradient-to-br ${rarityColors[achievement.rarity as keyof typeof rarityColors]} border-transparent`
                    : 'bg-white/5 border-white/10 opacity-50'
                )}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h4 className="text-white font-medium text-sm">{achievement.title}</h4>
                <p className="text-gray-300 text-xs mt-1">{achievement.description}</p>
                <span className="inline-block mt-2 px-2 py-1 rounded-full bg-black/20 text-xs capitalize text-white">
                  {achievement.rarity}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
          </div>

          <div className="space-y-2">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-xl cursor-pointer relative z-20',
                  user.isUser ? 'bg-purple-500/20 border-2 border-purple-500' : 'bg-white/5 hover:bg-white/10'
                )}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-bold">
                  {user.rank}
                </div>
                <div className="text-2xl">{user.avatar}</div>
                <div className="flex-1">
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-purple-300 text-sm">{user.xp.toLocaleString()} XP</p>
                </div>
                {user.rank <= 3 && (
                  <Medal className="w-5 h-5 text-yellow-400" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rewards Store */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Gem className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Rewards Store</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={cn(
                  'p-4 rounded-xl border-2 text-center cursor-pointer relative z-20',
                  reward.owned
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                )}
              >
                <div className="text-4xl mb-2">{reward.icon}</div>
                <h4 className="text-white font-medium">{reward.name}</h4>
                <p className="text-purple-300 text-sm mt-1">{reward.cost} XP</p>
                {reward.owned ? (
                  <button className="mt-2 px-4 py-1 rounded-lg bg-green-500 text-white text-sm cursor-pointer relative z-30">
                    Owned
                  </button>
                ) : (
                  <button className="mt-2 px-4 py-1 rounded-lg bg-purple-500 text-white text-sm cursor-pointer relative z-30">
                    Buy
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
