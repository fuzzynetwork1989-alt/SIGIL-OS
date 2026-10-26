import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Moon,
  Sun,
  Sparkles,
  Sliders,
  Save,
  RotateCcw,
  Check,
  Loader2,
  Layers,
  Droplets,
  Zap,
  Globe,
  Eye,
  Contrast,
  Wallpaper,
  MagicWand
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const ThemeEngine: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [theme, setTheme] = useState({
    // Base Theme
    mode: 'dark',
    preset: 'neon-purple',

    // Colors
    primary: '#8B5CF6',
    secondary: '#EC4899',
    accent: '#F59E0B',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',

    // Effects
    glassmorphism: true,
    neonGlow: true,
    particleEffects: true,
    gradients: true,
    animations: true,

    // UI Style
    borderRadius: 'rounded-xl',
    shadows: 'medium',
    spacing: 'comfortable',
    typography: 'modern',

    // Special Effects
    customCursor: false,
    soundEffects: false,
    hapticFeedback: false,
  });

  const themePresets = [
    {
      id: 'neon-purple',
      name: 'Neon Purple',
      colors: { primary: '#8B5CF6', secondary: '#EC4899', accent: '#F59E0B' },
      preview: 'bg-gradient-to-br from-purple-500 to-pink-500',
    },
    {
      id: 'cyber-blue',
      name: 'Cyber Blue',
      colors: { primary: '#3B82F6', secondary: '#06B6D4', accent: '#10B981' },
      preview: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    },
    {
      id: 'emerald-green',
      name: 'Emerald Green',
      colors: { primary: '#10B981', secondary: '#06B6D4', accent: '#F59E0B' },
      preview: 'bg-gradient-to-br from-green-500 to-teal-500',
    },
    {
      id: 'sunset-orange',
      name: 'Sunset Orange',
      colors: { primary: '#F97316', secondary: '#EC4899', accent: '#F59E0B' },
      preview: 'bg-gradient-to-br from-orange-500 to-pink-500',
    },
    {
      id: 'midnight-dark',
      name: 'Midnight Dark',
      colors: { primary: '#6366F1', secondary: '#8B5CF6', accent: '#EC4899' },
      preview: 'bg-gradient-to-br from-indigo-500 to-purple-500',
    },
    {
      id: 'rose-pink',
      name: 'Rose Pink',
      colors: { primary: '#EC4899', secondary: '#F43F5E', accent: '#F59E0B' },
      preview: 'bg-gradient-to-br from-pink-500 to-rose-500',
    },
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const applyPreset = (preset: typeof themePresets[0]) => {
    setTheme({
      ...theme,
      primary: preset.colors.primary,
      secondary: preset.colors.secondary,
      accent: preset.colors.accent,
      preset: preset.id,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Theme Engine</h1>
          <p className="text-gray-400">Customize the look and feel of SIGIL OS</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme({ ...theme, mode: theme.mode === 'dark' ? 'light' : 'dark' })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            {theme.mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme.mode === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button
            onClick={() => setTheme({
              mode: 'dark',
              preset: 'neon-purple',
              primary: '#8B5CF6',
              secondary: '#EC4899',
              accent: '#F59E0B',
              background: '#0F172A',
              surface: '#1E293B',
              text: '#F8FAFC',
              textSecondary: '#94A3B8',
              glassmorphism: true,
              neonGlow: true,
              particleEffects: true,
              gradients: true,
              animations: true,
              borderRadius: 'rounded-xl',
              shadows: 'medium',
              spacing: 'comfortable',
              typography: 'modern',
              customCursor: false,
              soundEffects: false,
              hapticFeedback: false,
            })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
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
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Theme'}
          </button>
        </div>
      </div>

      {/* Theme Presets */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <Palette className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Theme Presets</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {themePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={cn(
                'p-4 rounded-xl transition-all group',
                theme.preset === preset.id
                  ? 'ring-2 ring-purple-500 bg-purple-500/20'
                  : 'bg-white/5 hover:bg-white/10'
              )}
            >
              <div className={cn('w-full h-16 rounded-lg mb-3', preset.preview)} />
              <p className="text-sm text-white font-medium">{preset.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color Customization */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <Droplets className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Color Palette</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { key: 'primary', label: 'Primary' },
            { key: 'secondary', label: 'Secondary' },
            { key: 'accent', label: 'Accent' },
            { key: 'background', label: 'Background' },
            { key: 'surface', label: 'Surface' },
            { key: 'text', label: 'Text' },
          ].map((color) => (
            <div key={color.key} className="space-y-2">
              <label className="text-sm text-gray-300">{color.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme[color.key as keyof typeof theme] as string}
                  onChange={(e) => setTheme({ ...theme, [color.key]: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={theme[color.key as keyof typeof theme] as string}
                  onChange={(e) => setTheme({ ...theme, [color.key]: e.target.value })}
                  className="flex-1 p-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Effects */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Visual Effects</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: 'glassmorphism', label: 'Glassmorphism', icon: Layers },
            { key: 'neonGlow', label: 'Neon Glow', icon: Zap },
            { key: 'particleEffects', label: 'Particle Effects', icon: MagicWand },
            { key: 'gradients', label: 'Gradients', icon: Globe },
            { key: 'animations', label: 'Animations', icon: Sliders },
          ].map((effect) => {
            const Icon = effect.icon;
            return (
              <div key={effect.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-purple-400" />
                  <span className="text-white">{effect.label}</span>
                </div>
                <button
                  onClick={() => setTheme({ ...theme, [effect.key]: !theme[effect.key as keyof typeof theme] })}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    theme[effect.key as keyof typeof theme] ? 'bg-purple-500' : 'bg-white/10'
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                      theme[effect.key as keyof typeof theme] ? 'left-6.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* UI Style */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <Sliders className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">UI Style</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Border Radius</label>
            <select
              value={theme.borderRadius}
              onChange={(e) => setTheme({ ...theme, borderRadius: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="rounded-none">None</option>
              <option value="rounded-sm">Small</option>
              <option value="rounded-md">Medium</option>
              <option value="rounded-lg">Large</option>
              <option value="rounded-xl">Extra Large</option>
              <option value="rounded-full">Full</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Shadows</label>
            <select
              value={theme.shadows}
              onChange={(e) => setTheme({ ...theme, shadows: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="none">None</option>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="heavy">Heavy</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Spacing</label>
            <select
              value={theme.spacing}
              onChange={(e) => setTheme({ ...theme, spacing: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="tight">Tight</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Typography</label>
            <select
              value={theme.typography}
              onChange={(e) => setTheme({ ...theme, typography: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="minimal">Minimal</option>
              <option value="playful">Playful</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <Eye className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Accessibility</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <Contrast className="w-5 h-5 text-purple-400" />
              <span className="text-white">High Contrast</span>
            </div>
            <button
              onClick={() => setTheme({ ...theme, text: '#FFFFFF', textSecondary: '#E2E8F0' })}
              className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all"
            >
              <MagicWand className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <Wallpaper className="w-5 h-5 text-purple-400" />
              <span className="text-white">Reduce Motion</span>
            </div>
            <button
              onClick={() => setTheme({ ...theme, animations: false })}
              className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all"
            >
              <MagicWand className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
