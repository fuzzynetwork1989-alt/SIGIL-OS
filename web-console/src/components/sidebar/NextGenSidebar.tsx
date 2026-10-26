import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Settings,
  User,
  Brain,
  Palette,
  Sparkles,
  Trophy,
  Share2,
  Zap,
  Sliders,
  MessageSquare,
  Layers,
  Database,
  Shield,
  Globe,
  Cloud,
  Cpu,
  Eye,
  Mic,
  Volume2,
  Wifi,
  Lock,
  Bell,
  Clock,
  Calendar,
  BarChart3,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronDown,
  Star,
  Heart,
  Bookmark,
  History,
  Search,
  Plus,
  X,
  Check,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NextGenSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string>('home');

  const sections = [
    {
      id: 'main',
      icon: Home,
      label: 'Main',
      items: [
        { id: 'home', icon: Home, label: 'Dashboard' },
        { id: 'chat', icon: MessageSquare, label: 'Chat' },
        { id: 'memory', icon: Database, label: 'Memory' },
        { id: 'missions', icon: Layers, label: 'Missions' },
      ],
    },
    {
      id: 'profile',
      icon: User,
      label: 'Profile',
      items: [
        { id: 'my-profile', icon: User, label: 'My Profile' },
        { id: 'avatar', icon: Eye, label: 'Avatar Builder' },
        { id: 'personality', icon: Brain, label: 'AI Personality' },
        { id: 'instructions', icon: Sparkles, label: 'Custom Instructions' },
      ],
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
      items: [
        { id: 'appearance', icon: Palette, label: 'Appearance' },
        { id: 'advanced', icon: Sliders, label: 'Advanced' },
        { id: 'privacy', icon: Shield, label: 'Privacy & Security' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
      ],
    },
    {
      id: 'model',
      icon: Cpu,
      label: 'Model',
      items: [
        { id: 'model-config', icon: Cpu, label: 'Model Configuration' },
        { id: 'inference', icon: Zap, label: 'Inference Settings' },
        { id: 'temperature', icon: BarChart3, label: 'Temperature Control' },
        { id: 'context', icon: Layers, label: 'Context Window' },
      ],
    },
    {
      id: 'social',
      icon: Share2,
      label: 'Social',
      items: [
        { id: 'achievements', icon: Trophy, label: 'Achievements' },
        { id: 'share', icon: Share2, label: 'Share & Export' },
        { id: 'community', icon: Globe, label: 'Community' },
        { id: 'leaderboard', icon: Star, label: 'Leaderboard' },
      ],
    },
    {
      id: 'system',
      icon: Database,
      label: 'System',
      items: [
        { id: 'history', icon: History, label: 'Activity History' },
        { id: 'storage', icon: Database, label: 'Storage' },
        { id: 'cloud', icon: Cloud, label: 'Cloud Sync' },
        { id: 'logs', icon: FileText, label: 'System Logs' },
      ],
    },
  ];

  const quickActions = [
    { icon: Plus, label: 'New Chat', action: 'new-chat' },
    { icon: Search, label: 'Search', action: 'search' },
    { icon: Bookmark, label: 'Saved', action: 'saved' },
    { icon: Heart, label: 'Favorites', action: 'favorites' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-96 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">SIGIL OS</h2>
                    <p className="text-xs text-purple-300">Next-Gen AI Companion</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-4 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.action}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:scale-105 group"
                  >
                    <action.icon className="w-5 h-5 text-purple-300 group-hover:text-white transition-colors" />
                    <span className="text-xs text-gray-300 group-hover:text-white">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {sections.map((section) => (
                <div key={section.id} className="space-y-1">
                  <button
                    onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <section.icon className="w-5 h-5 text-purple-300 group-hover:text-white transition-colors" />
                      <span className="text-white font-medium">{section.label}</span>
                    </div>
                    {expandedSection === section.id ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedSection === section.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-4 space-y-1 overflow-hidden"
                      >
                        {section.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveItem(item.id);
                              onClose();
                            }}
                            className={cn(
                              'w-full flex items-center gap-3 p-3 rounded-lg transition-all',
                              activeItem === item.id
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'hover:bg-white/5 text-gray-300 hover:text-white'
                            )}
                          >
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm">{item.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">Help & Support</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-all">
                <LogOut className="w-5 h-5 text-red-400" />
                <span className="text-red-400">Sign Out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
