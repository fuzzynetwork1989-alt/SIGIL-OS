import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Star,
  Flame,
  Gem,
  Award,
  Zap,
  Crown,
  Target,
  Calendar,
  TrendingUp,
  Medal,
  Lock,
  Unlock,
  Sparkles,
  Check,
  Gift,
  Heart,
  Share2,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Gamification: React.FC = () => {
  const [userStats, setUserStats] = useState({
    level: 15,
    xp: 7500,
    xpToNext: 10000,
    streak: 7,
    totalSessions: 142,
    totalMessages: 3456,
    achievementsUnlocked: 23,
    achievementsTotal: 50,
  });

  const [achievements] = useState([
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first conversation',
      icon: Star,
      unlocked: true,
      rarity: 'common',
      xp: 100,
    },
    {
      id: 2,
      title: 'Rising Star',
      description: 'Reach level 5',
      icon: Flame,
      unlocked: true,
      rarity: 'common',
      xp: 200,
    },
    {
      id: 3,
      title: 'Quick Learner',
      description: 'Complete 10 sessions in one day',
      icon: Zap,
      unlocked: true,
      rarity: 'rare',
      xp: 500,
    },
    {
      id: 4,
      title: 'Consistency King',
      description: 'Maintain a 7-day streak',
      icon: Crown,
      unlocked: true,
      rarity: 'epic',
      xp: 1000,
    },
    {
      id: 5,
      title: 'Mastermind',
      description: 'Solve 100 complex problems',
      icon: Target,
      unlocked: false,
      rarity: 'legendary',
      xp: 2000,
    },
    {
      id: 6,
      title: 'Gem Collector',
      description: 'Earn 10,000 XP',
      icon: Gem,
      unlocked: false,
      rarity: 'epic',
      xp: 1500,
    },
  ]);

  const [dailyChallenges] = useState([
    {
      id: 1,
      title: 'Daily Conversationalist',
      description: 'Have 5 meaningful conversations',
      progress: 3,
      total: 5,
      xp: 200,
      completed: false,
    },
    {
      id: 2,
      title: 'Knowledge Seeker',
      description: 'Ask 10 interesting questions',
      progress: 7,
      total: 10,
      xp: 150,
      completed: false,
    },
    {
      id: 3,
      title: 'Creative Mind',
      description: 'Use creative responses 5 times',
      progress: 5,
      total: 5,
      xp: 300,
      completed: true,
    },
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: 'Alex Chen', xp: 15600, level: 20, avatar: '🚀' },
    { rank: 2, name: 'Sarah Kim', xp: 14200, level: 18, avatar: '⭐' },
    { rank: 3, name: 'You', xp: 7500, level: 15, avatar: '🎯', isUser: true },
    { rank: 4, name: 'Mike Johnson', xp: 6800, level: 14, avatar: '💎' },
    { rank: 5, name: 'Emma Wilson', xp: 6200, level: 13, avatar: '🌟' },
  ]);

  const rarityColors = {
    common: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    rare: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    epic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    legendary: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  const xpProgress = (userStats.xp / userStats.xpToNext) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Achievements & Progress</h1>
        <p className="text-gray-400">Track your journey and unlock rewards</p>
      </div>

      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-xl bg-purple-500/30">
              <Trophy className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-3xl font-bold text-white">{userStats.level}</span>
          </div>
          <p className="text-gray-300 text-sm">Current Level</p>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{userStats.xp.toLocaleString()} XP</span>
              <span>{userStats.xpToNext.toLocaleString()} XP</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-xl bg-orange-500/30">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-3xl font-bold text-white">{userStats.streak}</span>
          </div>
          <p className="text-gray-300 text-sm">Day Streak</p>
          <p className="text-xs text-orange-400 mt-1">Keep it going!</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-xl bg-blue-500/30">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-3xl font-bold text-white">{userStats.totalSessions}</span>
          </div>
          <p className="text-gray-300 text-sm">Total Sessions</p>
          <p className="text-xs text-blue-400 mt-1">Great consistency!</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-xl bg-green-500/30">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-3xl font-bold text-white">{userStats.totalMessages.toLocaleString()}</span>
          </div>
          <p className="text-gray-300 text-sm">Messages Exchanged</p>
          <p className="text-xs text-green-400 mt-1">Growing fast!</p>
        </motion.div>
      </div>

      {/* Daily Challenges */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Daily Challenges</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Reset in 14:32:05</span>
          </div>
        </div>

        <div className="space-y-3">
          {dailyChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className={cn(
                'p-4 rounded-xl border transition-all',
                challenge.completed
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-white/5 border-white/10'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {challenge.completed ? (
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Target className="w-4 h-4 text-purple-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-white font-medium">{challenge.title}</h4>
                    <p className="text-sm text-gray-400">{challenge.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-purple-400 font-bold">+{challenge.xp} XP</div>
                </div>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                  className={cn(
                    'h-full transition-all',
                    challenge.completed ? 'bg-green-500' : 'bg-purple-500'
                  )}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{challenge.progress} / {challenge.total}</span>
                <span>{Math.round((challenge.progress / challenge.total) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Achievements</h3>
          </div>
          <div className="text-sm text-gray-400">
            {userStats.achievementsUnlocked} / {userStats.achievementsTotal} Unlocked
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={cn(
                  'p-4 rounded-xl border transition-all group',
                  achievement.unlocked
                    ? rarityColors[achievement.rarity]
                    : 'bg-white/5 border-white/10 opacity-50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'p-2 rounded-lg',
                    achievement.unlocked ? 'bg-white/20' : 'bg-gray-500/20'
                  )}>
                    {achievement.unlocked ? (
                      <Icon className="w-5 h-5 text-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{achievement.title}</h4>
                    <p className="text-xs text-gray-400 mb-2">{achievement.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full capitalize',
                        achievement.unlocked ? 'bg-white/20 text-white' : 'bg-gray-500/20 text-gray-400'
                      )}>
                        {achievement.rarity}
                      </span>
                      <span className="text-xs text-purple-400">+{achievement.xp} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Medal className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
          </div>
          <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-2">
          {leaderboard.map((user) => (
            <div
              key={user.rank}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl transition-all',
                user.isUser
                  ? 'bg-purple-500/20 border-2 border-purple-500'
                  : 'bg-white/5 hover:bg-white/10'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center font-bold',
                user.rank <= 3
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                  : 'bg-white/10 text-gray-400'
              )}>
                {user.rank}
              </div>
              <div className="text-2xl">{user.avatar}</div>
              <div className="flex-1">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-xs text-gray-400">Level {user.level}</p>
              </div>
              <div className="text-right">
                <p className="text-purple-400 font-bold">{user.xp.toLocaleString()} XP</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Store */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Gift className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Rewards Store</h3>
          </div>
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-purple-400" />
            <span className="text-white font-bold">{userStats.xp.toLocaleString()} XP</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Custom Avatar Theme', cost: 500, icon: Palette, unlocked: true },
            { name: 'Premium Badge', cost: 1000, icon: Star, unlocked: true },
            { name: 'Special Effects Pack', cost: 2000, icon: Sparkles, unlocked: false },
            { name: 'Exclusive Voice', cost: 3000, icon: Heart, unlocked: false },
          ].map((reward) => {
            const Icon = reward.icon;
            return (
              <div
                key={reward.name}
                className={cn(
                  'p-4 rounded-xl border transition-all group',
                  reward.unlocked
                    ? 'bg-white/5 border-white/10 cursor-pointer hover:border-purple-500'
                    : 'bg-white/5 border-white/10 opacity-50'
                )}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={cn(
                    'p-3 rounded-xl',
                    reward.unlocked ? 'bg-purple-500/20' : 'bg-gray-500/20'
                  )}>
                    <Icon className={cn(
                      'w-6 h-6',
                      reward.unlocked ? 'text-purple-400' : 'text-gray-400'
                    )} />
                  </div>
                  <div className="text-center">
                    <p className="text-white text-sm font-medium">{reward.name}</p>
                    <p className="text-xs text-purple-400">{reward.cost} XP</p>
                  </div>
                  {reward.unlocked ? (
                    <button className="w-full py-2 rounded-lg bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-all">
                      Claim
                    </button>
                  ) : (
                    <div className="w-full py-2 rounded-lg bg-gray-500/20 text-gray-400 text-sm font-medium">
                      Locked
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
