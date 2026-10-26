import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Copy,
  Check,
  Download,
  Mail,
  MessageCircle,
  Heart,
  Bookmark,
  Globe,
  Lock,
  QrCode,
  Image as ImageIcon,
  FileText,
  Sparkles,
  Users,
  TrendingUp,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const SocialSharing: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('markdown');
  const [privacy, setPrivacy] = useState('public');

  const shareFormats = [
    { id: 'markdown', label: 'Markdown', icon: FileText },
    { id: 'json', label: 'JSON', icon: FileText },
    { id: 'image', label: 'Image', icon: ImageIcon },
    { id: 'link', label: 'Link', icon: Link2 },
  ];

  const socialPlatforms = [
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'bg-blue-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
    { id: 'email', name: 'Email', icon: Mail, color: 'bg-gray-600' },
  ];

  const shareableContent = [
    {
      id: 'avatar',
      title: 'My Avatar',
      description: 'Share your custom SIGIL avatar',
      icon: Sparkles,
    },
    {
      id: 'profile',
      title: 'My Profile',
      description: 'Share your profile settings',
      icon: Users,
    },
    {
      id: 'achievements',
      title: 'Achievements',
      description: 'Show off your badges and XP',
      icon: TrendingUp,
    },
    {
      id: 'conversation',
      title: 'Conversation',
      description: 'Share an interesting conversation',
      icon: MessageCircle,
    },
  ];

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    // Simulate share
    console.log(`Sharing to ${platform}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Share & Export</h1>
        <p className="text-gray-400">Share your SIGIL experience with the world</p>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <Lock className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Privacy Settings</h3>
        </div>

        <div className="flex gap-4">
          {['public', 'friends', 'private'].map((level) => (
            <button
              key={level}
              onClick={() => setPrivacy(level)}
              className={cn(
                'flex-1 p-4 rounded-xl border-2 transition-all',
                privacy === level
                  ? 'bg-purple-500/20 border-purple-500'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              )}
            >
              <div className="flex flex-col items-center gap-2">
                {level === 'public' && <Globe className="w-6 h-6 text-purple-400" />}
                {level === 'friends' && <Users className="w-6 h-6 text-purple-400" />}
                {level === 'private' && <Lock className="w-6 h-6 text-purple-400" />}
                <span className="text-white font-medium capitalize">{level}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* What to Share */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <Share2 className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">What to Share</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {shareableContent.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500 transition-all group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-all">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Format */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <FileText className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Export Format</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shareFormats.map((format) => {
            const Icon = format.icon;
            return (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all',
                  selectedFormat === format.id
                    ? 'bg-purple-500/20 border-purple-500'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className={cn(
                    'w-6 h-6',
                    selectedFormat === format.id ? 'text-purple-400' : 'text-gray-400'
                  )} />
                  <span className="text-white font-medium">{format.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Share Link */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <Link2 className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Share Link</h3>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value="https://sigil-os.app/share/abc123"
            readOnly
            className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 text-gray-300 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Social Platforms */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <Share2 className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Share to Social</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <button
                key={platform.id}
                onClick={() => handleShare(platform.id)}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500 transition-all group"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={cn(
                    'p-3 rounded-xl',
                    platform.color
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white font-medium">{platform.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* QR Code */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <QrCode className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">QR Code</h3>
        </div>

        <div className="flex items-center gap-6">
          <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center">
            <QrCode className="w-24 h-24 text-black" />
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-gray-300">Scan this QR code to view your SIGIL profile on mobile devices.</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all">
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Advanced Options</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="text-white font-medium">Include Statistics</p>
              <p className="text-xs text-gray-400">Add your usage stats to the share</p>
            </div>
            <button className="w-12 h-6 rounded-full bg-purple-500 relative">
              <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-6.5" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="text-white font-medium">Watermark</p>
              <p className="text-xs text-gray-400">Add SIGIL branding to exports</p>
            </div>
            <button className="w-12 h-6 rounded-full bg-white/10 relative">
              <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-0.5" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="text-white font-medium">Custom Message</p>
              <p className="text-xs text-gray-400">Add a personal message to your share</p>
            </div>
            <button className="w-12 h-6 rounded-full bg-purple-500 relative">
              <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-6.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all">
          <Share2 className="w-5 h-5" />
          Share Now
        </button>
        <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all">
          <Download className="w-5 h-5" />
          Download
        </button>
        <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all">
          <Bookmark className="w-5 h-5" />
          Save Draft
        </button>
      </div>
    </div>
  );
};
