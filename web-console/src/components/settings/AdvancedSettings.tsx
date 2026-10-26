import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sliders,
  Zap,
  Cpu,
  Layers,
  Eye,
  Volume2,
  Mic,
  Clock,
  Wifi,
  Lock,
  Shield,
  Globe,
  Cloud,
  Database,
  Save,
  RotateCcw,
  Check,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const AdvancedSettings: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    // Model Settings
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    frequencyPenalty: 0.5,
    presencePenalty: 0.5,

    // Performance
    maxConcurrency: 3,
    cacheEnabled: true,
    streamingEnabled: true,
    batchSize: 32,

    // Voice
    voiceEnabled: true,
    voiceLanguage: 'en-US',
    voiceSpeed: 1.0,
    voicePitch: 1.0,

    // Audio
    audioEnabled: true,
    volume: 0.8,
    audioQuality: 'high',

    // Privacy
    dataRetention: '30days',
    localProcessing: true,
    encryptionEnabled: true,
    anonymousMode: false,

    // Network
    offlineMode: false,
    syncFrequency: 'hourly',
    bandwidthLimit: 'unlimited',

    // Advanced
    debugMode: false,
    experimentalFeatures: false,
    betaFeatures: true,
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings({
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
      frequencyPenalty: 0.5,
      presencePenalty: 0.5,
      maxConcurrency: 3,
      cacheEnabled: true,
      streamingEnabled: true,
      batchSize: 32,
      voiceEnabled: true,
      voiceLanguage: 'en-US',
      voiceSpeed: 1.0,
      voicePitch: 1.0,
      audioEnabled: true,
      volume: 0.8,
      audioQuality: 'high',
      dataRetention: '30days',
      localProcessing: true,
      encryptionEnabled: true,
      anonymousMode: false,
      offlineMode: false,
      syncFrequency: 'hourly',
      bandwidthLimit: 'unlimited',
      debugMode: false,
      experimentalFeatures: false,
      betaFeatures: true,
    });
  };

  const SettingSection = ({ icon: Icon, title, children }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-purple-500/20">
          <Icon className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );

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
  );

  const ToggleSetting = ({ label, checked, onChange }: any) => (
    <div className="flex items-center justify-between">
      <label className="text-sm text-gray-300">{label}</label>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'w-12 h-6 rounded-full transition-all relative',
          checked ? 'bg-purple-500' : 'bg-white/10'
        )}
      >
        <motion.div
          layout
          className={cn(
            'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all',
            checked ? 'left-6.5' : 'left-0.5'
          )}
        />
      </button>
    </div>
  );

  const SelectSetting = ({ label, value, onChange, options }: any) => (
    <div className="space-y-2">
      <label className="text-sm text-gray-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Advanced Settings</h1>
          <p className="text-gray-400">Customize every aspect of your SIGIL experience</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
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
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Model Settings */}
      <SettingSection icon={Cpu} title="Model Configuration">
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
      </SettingSection>

      {/* Performance */}
      <SettingSection icon={Zap} title="Performance">
        <div className="space-y-6">
          <SliderSetting
            label="Max Concurrency"
            value={settings.maxConcurrency}
            onChange={(v) => setSettings({ ...settings, maxConcurrency: v })}
            min={1}
            max={10}
            step={1}
          />
          <SliderSetting
            label="Batch Size"
            value={settings.batchSize}
            onChange={(v) => setSettings({ ...settings, batchSize: v })}
            min={1}
            max={128}
            step={1}
          />
          <ToggleSetting
            label="Enable Caching"
            checked={settings.cacheEnabled}
            onChange={(v) => setSettings({ ...settings, cacheEnabled: v })}
          />
          <ToggleSetting
            label="Enable Streaming"
            checked={settings.streamingEnabled}
            onChange={(v) => setSettings({ ...settings, streamingEnabled: v })}
          />
        </div>
      </SettingSection>

      {/* Voice & Audio */}
      <SettingSection icon={Mic} title="Voice & Audio">
        <div className="space-y-6">
          <ToggleSetting
            label="Enable Voice"
            checked={settings.voiceEnabled}
            onChange={(v) => setSettings({ ...settings, voiceEnabled: v })}
          />
          <SelectSetting
            label="Voice Language"
            value={settings.voiceLanguage}
            onChange={(v) => setSettings({ ...settings, voiceLanguage: v })}
            options={[
              { value: 'en-US', label: 'English (US)' },
              { value: 'en-GB', label: 'English (UK)' },
              { value: 'es-ES', label: 'Spanish' },
              { value: 'fr-FR', label: 'French' },
              { value: 'de-DE', label: 'German' },
              { value: 'ja-JP', label: 'Japanese' },
              { value: 'zh-CN', label: 'Chinese (Simplified)' },
            ]}
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
          <SliderSetting
            label="Volume"
            value={settings.volume}
            onChange={(v) => setSettings({ ...settings, volume: v })}
          />
          <SelectSetting
            label="Audio Quality"
            value={settings.audioQuality}
            onChange={(v) => setSettings({ ...settings, audioQuality: v })}
            options={[
              { value: 'low', label: 'Low (Faster)' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High (Best)' },
            ]}
          />
        </div>
      </SettingSection>

      {/* Privacy & Security */}
      <SettingSection icon={Shield} title="Privacy & Security">
        <div className="space-y-6">
          <SelectSetting
            label="Data Retention"
            value={settings.dataRetention}
            onChange={(v) => setSettings({ ...settings, dataRetention: v })}
            options={[
              { value: '7days', label: '7 Days' },
              { value: '30days', label: '30 Days' },
              { value: '90days', label: '90 Days' },
              { value: 'forever', label: 'Forever' },
            ]}
          />
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
          <ToggleSetting
            label="Anonymous Mode"
            checked={settings.anonymousMode}
            onChange={(v) => setSettings({ ...settings, anonymousMode: v })}
          />
        </div>
      </SettingSection>

      {/* Network */}
      <SettingSection icon={Wifi} title="Network & Sync">
        <div className="space-y-6">
          <ToggleSetting
            label="Offline Mode"
            checked={settings.offlineMode}
            onChange={(v) => setSettings({ ...settings, offlineMode: v })}
          />
          <SelectSetting
            label="Sync Frequency"
            value={settings.syncFrequency}
            onChange={(v) => setSettings({ ...settings, syncFrequency: v })}
            options={[
              { value: 'realtime', label: 'Real-time' },
              { value: 'hourly', label: 'Hourly' },
              { value: 'daily', label: 'Daily' },
              { value: 'manual', label: 'Manual' },
            ]}
          />
          <SelectSetting
            label="Bandwidth Limit"
            value={settings.bandwidthLimit}
            onChange={(v) => setSettings({ ...settings, bandwidthLimit: v })}
            options={[
              { value: 'unlimited', label: 'Unlimited' },
              { value: '100mb', label: '100 MB/day' },
              { value: '500mb', label: '500 MB/day' },
              { value: '1gb', label: '1 GB/day' },
            ]}
          />
        </div>
      </SettingSection>

      {/* Experimental */}
      <SettingSection icon={Zap} title="Experimental Features">
        <div className="space-y-6">
          <ToggleSetting
            label="Debug Mode"
            checked={settings.debugMode}
            onChange={(v) => setSettings({ ...settings, debugMode: v })}
          />
          <ToggleSetting
            label="Experimental Features"
            checked={settings.experimentalFeatures}
            onChange={(v) => setSettings({ ...settings, experimentalFeatures: v })}
          />
          <ToggleSetting
            label="Beta Features"
            checked={settings.betaFeatures}
            onChange={(v) => setSettings({ ...settings, betaFeatures: v })}
          />
        </div>
      </SettingSection>
    </div>
  );
};
