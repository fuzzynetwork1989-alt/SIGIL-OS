import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Sparkles,
  Brain,
  Heart,
  Target,
  Zap,
  Palette,
  Eye,
  Save,
  Upload,
  Camera,
  X,
  Check,
  Loader2,
  Star,
  Trophy,
  Flame,
  Gem
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const ProfileBuilder: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

    // Interests
    interests: [
      'Artificial Intelligence',
      'Machine Learning',
      'Neuroscience',
      'Philosophy',
      'Technology',
    ],

    // Goals
    goals: [
      'Learn advanced AI concepts',
      'Build innovative applications',
      'Connect with like-minded people',
    ],

    // Communication Style
    communicationStyle: 'friendly',
    preferredTone: 'casual',
    humorLevel: 'moderate',

    // AI Relationship
    aiName: 'SIGIL',
    aiRelationship: 'companion',
    interactionFrequency: 'daily',

    // Privacy
    profileVisibility: 'public',
    shareStats: true,
    showAchievements: true,
  });

  const traitLabels = {
    creativity: 'Creativity',
    empathy: 'Empathy',
    curiosity: 'Curiosity',
    humor: 'Humor',
    assertiveness: 'Assertiveness',
    adaptability: 'Adaptability',
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addInterest = () => {
    const interest = prompt('Add an interest:');
    if (interest && !profile.interests.includes(interest)) {
      setProfile({ ...profile, interests: [...profile.interests, interest] });
    }
  };

  const removeInterest = (interest: string) => {
    setProfile({ ...profile, interests: profile.interests.filter(i => i !== interest) });
  };

  const addGoal = () => {
    const goal = prompt('Add a goal:');
    if (goal && !profile.goals.includes(goal)) {
      setProfile({ ...profile, goals: [...profile.goals, goal] });
    }
  };

  const removeGoal = (goal: string) => {
    setProfile({ ...profile, goals: profile.goals.filter(g => g !== goal) });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile Builder</h1>
          <p className="text-gray-400">Customize your digital identity and AI relationship</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-purple-500/20">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Avatar</h3>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-purple-500">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="space-y-3 w-full">
                <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
                  <Upload className="w-4 h-4" />
                  Upload Image
                </button>
                <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white transition-all">
                  <Sparkles className="w-4 h-4" />
                  Generate AI Avatar
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-gray-300">Display Name</label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm text-gray-300">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Personality Traits */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
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
          </div>

          {/* Interests */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20">
                  <Heart className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Interests</h3>
              </div>
              <button
                onClick={addInterest}
                className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
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
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Goals</h3>
              </div>
              <button
                onClick={addGoal}
                className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {profile.goals.map((goal) => (
                <div
                  key={goal}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-gray-300"
                >
                  <span className="text-sm">{goal}</span>
                  <button
                    onClick={() => removeGoal(goal)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Communication Style */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-purple-500/20">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Communication Style</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Style</label>
                <select
                  value={profile.communicationStyle}
                  onChange={(e) => setProfile({ ...profile, communicationStyle: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="humorous">Humorous</option>
                  <option value="intellectual">Intellectual</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Tone</label>
                <select
                  value={profile.preferredTone}
                  onChange={(e) => setProfile({ ...profile, preferredTone: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="calm">Calm</option>
                  <option value="energetic">Energetic</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Humor Level</label>
                <select
                  value={profile.humorLevel}
                  onChange={(e) => setProfile({ ...profile, humorLevel: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="none">None</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Relationship */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-purple-500/20">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Relationship</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">AI Name</label>
                <input
                  type="text"
                  value={profile.aiName}
                  onChange={(e) => setProfile({ ...profile, aiName: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Relationship Type</label>
                <select
                  value={profile.aiRelationship}
                  onChange={(e) => setProfile({ ...profile, aiRelationship: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="companion">Companion</option>
                  <option value="assistant">Assistant</option>
                  <option value="mentor">Mentor</option>
                  <option value="friend">Friend</option>
                  <option value="collaborator">Collaborator</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Interaction Frequency</label>
                <select
                  value={profile.interactionFrequency}
                  onChange={(e) => setProfile({ ...profile, interactionFrequency: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="continuous">Continuous</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="as-needed">As Needed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-purple-500/20">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Privacy Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-white">Profile Visibility</label>
                  <p className="text-xs text-gray-400">Control who can see your profile</p>
                </div>
                <select
                  value={profile.profileVisibility}
                  onChange={(e) => setProfile({ ...profile, profileVisibility: e.target.value })}
                  className="p-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-white">Share Statistics</label>
                  <p className="text-xs text-gray-400">Allow others to see your usage stats</p>
                </div>
                <button
                  onClick={() => setProfile({ ...profile, shareStats: !profile.shareStats })}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    profile.shareStats ? 'bg-purple-500' : 'bg-white/10'
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                      profile.shareStats ? 'left-6.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-white">Show Achievements</label>
                  <p className="text-xs text-gray-400">Display your badges and trophies</p>
                </div>
                <button
                  onClick={() => setProfile({ ...profile, showAchievements: !profile.showAchievements })}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    profile.showAchievements ? 'bg-purple-500' : 'bg-white/10'
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                      profile.showAchievements ? 'left-6.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
