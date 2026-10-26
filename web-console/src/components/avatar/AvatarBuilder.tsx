import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Palette,
  Sparkles,
  Save,
  RotateCcw,
  Wand2,
  Download,
  Share2,
  Layers,
  Sliders,
  Zap,
  Check,
  Loader2,
  Star,
  Heart,
  Crown,
  Flame,
  Gem,
  Award
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const AvatarBuilder: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [avatar, setAvatar] = useState({
    // Base
    style: 'realistic',
    bodyType: 'average',
    height: 170,

    // Face
    faceShape: 'oval',
    skinTone: 'medium',
    eyeColor: 'blue',
    eyeShape: 'round',
    eyeSize: 'medium',
    eyebrowStyle: 'natural',
    noseShape: 'average',
    lipShape: 'average',
    lipColor: 'natural',

    // Hair
    hairStyle: 'modern',
    hairColor: 'brown',
    hairLength: 'medium',
    facialHair: 'none',

    // Features
    glasses: 'none',
    accessories: 'none',
    jewelry: 'none',

    // Clothing
    outfitStyle: 'casual',
    outfitColor: 'blue',
    shoes: 'sneakers',

    // Expression
    expression: 'friendly',
    mood: 'happy',

    // Effects
    glow: false,
    particles: false,
    animation: 'none',

    // Background
    background: 'gradient',
    backgroundColor: 'purple',
  });

  const skinTones = ['pale', 'light', 'medium', 'olive', 'tan', 'dark', 'deep'];
  const eyeColors = ['blue', 'green', 'brown', 'hazel', 'gray', 'amber'];
  const hairColors = ['black', 'brown', 'blonde', 'red', 'gray', 'white', 'pink', 'blue', 'purple', 'green'];
  const expressions = ['friendly', 'serious', 'happy', 'thoughtful', 'excited', 'calm', 'mysterious', 'playful'];

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRandomize = () => {
    setAvatar({
      ...avatar,
      skinTone: skinTones[Math.floor(Math.random() * skinTones.length)],
      eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      expression: expressions[Math.floor(Math.random() * expressions.length)],
    });
  };

  const AvatarPreview = () => (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Background */}
      <div
        className={cn(
          'absolute inset-0 rounded-3xl overflow-hidden',
          avatar.background === 'gradient' && 'bg-gradient-to-br from-purple-500 to-pink-500',
          avatar.background === 'solid' && `bg-${avatar.backgroundColor}-500`,
          avatar.background === 'transparent' && 'bg-transparent'
        )}
      >
        {/* Effects */}
        {avatar.glow && (
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/50 to-transparent" />
        )}
        {avatar.particles && (
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}

        {/* Avatar Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative"
            animate={avatar.animation === 'float' ? { y: [0, -10, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div
              className={cn(
                'w-48 h-48 rounded-full border-4',
                avatar.background === 'gradient' ? 'border-white' : 'border-purple-500'
              )}
              style={{
                backgroundColor: getSkinToneColor(avatar.skinTone),
              }}
            >
              {/* Eyes */}
              <div className="absolute top-16 left-12 w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getEyeColor(avatar.eyeColor) }}
                />
              </div>
              <div className="absolute top-16 right-12 w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getEyeColor(avatar.eyeColor) }}
                />
              </div>

              {/* Mouth - based on expression */}
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                {avatar.expression === 'happy' && (
                  <div className="w-16 h-8 border-b-4 border-red-400 rounded-b-full" />
                )}
                {avatar.expression === 'serious' && (
                  <div className="w-16 h-1 bg-red-400 rounded" />
                )}
                {avatar.expression === 'friendly' && (
                  <div className="w-12 h-6 border-b-4 border-red-400 rounded-b-full" />
                )}
              </div>

              {/* Hair */}
              <div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-20 rounded-t-full"
                style={{ backgroundColor: getHairColor(avatar.hairColor) }}
              />
            </div>

            {/* Crown if special */}
            {avatar.accessories === 'crown' && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <Crown className="w-12 h-12 text-yellow-400" />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );

  const getSkinToneColor = (tone: string) => {
    const colors: Record<string, string> = {
      pale: '#FDEBD0',
      light: '#F5D0C5',
      medium: '#E0AC69',
      olive: '#C68642',
      tan: '#D2B48C',
      dark: '#8D5524',
      deep: '#5C3317',
    };
    return colors[tone] || colors.medium;
  };

  const getEyeColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: '#3B82F6',
      green: '#10B981',
      brown: '#92400E',
      hazel: '#A98467',
      gray: '#6B7280',
      amber: '#F59E0B',
    };
    return colors[color] || colors.blue;
  };

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
    };
    return colors[color] || colors.brown;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Avatar Builder</h1>
          <p className="text-gray-400">Create your unique digital identity</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRandomize}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            <Wand2 className="w-4 h-4" />
            Randomize
          </button>
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
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Avatar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-purple-500/20">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Preview</h3>
            </div>
            <AvatarPreview />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
              <Download className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-gray-300">Download</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
              <Share2 className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-gray-300">Share</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
              <Layers className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-gray-300">Variants</span>
            </button>
          </div>
        </motion.div>

        {/* Customization Options */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Face */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
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
                        'w-8 h-8 rounded-full border-2 transition-all',
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
                        'w-8 h-8 rounded-full border-2 transition-all',
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
                        'p-2 rounded-lg text-xs capitalize transition-all',
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
          </div>

          {/* Hair */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
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
                        'w-8 h-8 rounded-full border-2 transition-all',
                        avatar.hairColor === color ? 'border-purple-500 scale-110' : 'border-transparent'
                      )}
                      style={{ backgroundColor: getHairColor(color) }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Effects */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-purple-500/20">
                <Zap className="w-5 h-5 text-purple-400" />
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
                  onClick={() => setAvatar({ ...avatar, glow: !avatar.glow })}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    avatar.glow ? 'bg-purple-500' : 'bg-white/10'
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                      avatar.glow ? 'left-6.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-white">Particle Effects</label>
                  <p className="text-xs text-gray-400">Floating particles around avatar</p>
                </div>
                <button
                  onClick={() => setAvatar({ ...avatar, particles: !avatar.particles })}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    avatar.particles ? 'bg-purple-500' : 'bg-white/10'
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                      avatar.particles ? 'left-6.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Animation</label>
                <select
                  value={avatar.animation}
                  onChange={(e) => setAvatar({ ...avatar, animation: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="none">None</option>
                  <option value="float">Float</option>
                  <option value="pulse">Pulse</option>
                  <option value="bounce">Bounce</option>
                </select>
              </div>
            </div>
          </div>

          {/* Special Accessories */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-purple-500/20">
                <Crown className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Special Accessories</h3>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {['none', 'crown', 'halo', 'wings'].map((acc) => (
                <button
                  key={acc}
                  onClick={() => setAvatar({ ...avatar, accessories: acc })}
                  className={cn(
                    'p-3 rounded-xl flex flex-col items-center gap-1 transition-all',
                    avatar.accessories === acc
                      ? 'bg-purple-500/20 border-2 border-purple-500'
                      : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                  )}
                >
                  <span className="text-2xl capitalize">{acc === 'none' ? '🚫' : acc === 'crown' ? '👑' : acc === 'halo' ? '😇' : '🦋'}</span>
                  <span className="text-xs text-gray-300 capitalize">{acc}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
