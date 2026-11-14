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
  Loader2,
  BookOpen,
  Package,
  Ghost,
  Fingerprint,
  Atom,
  Cube,
  VrHeadset,
  Glasses,
  Cpu as Chip,
  Network,
  RefreshCw,
  Code,
  Puzzle,
  Globe2,
  Scroll,
  Key,
  Flame,
  Infinity,
  Dna,
  Box,
  LayoutGrid,
  Hexagon,
  Zap as Lightning,
  Radio,
  Command,
  Terminal,
  Layers3,
  Smile,
  Hand,
  ShoppingBag,
  Upload,
  GitBranch,
  Compass,
  Users,
  CheckSquare,
  ListTodo,
  Target,
  Rocket,
  Wand2,
  BrainCircuit,
  Waves,
  Radar,
  Scan,
  Aim,
  Energy,
  Neural,
  Processor,
  Fire,
  Lightbulb,
  TrendingUp,
  PieChart,
  Activity,
  Signal,
  Satellite,
  World,
  Map,
  Navigation,
  Direction,
  Power,
  ShieldCheck,
  Secure,
  Access,
  Inspect,
  FileSearch,
  Filter,
  Sort,
  Workflow,
  GitMerge,
  GitFork,
  GitPullRequest,
  GitCommit,
  Branch,
  TreeDeciduous,
  Mesh,
  Poly,
  Square,
  Circle,
  Triangle,
  Pentagon,
  MoreHorizontal,
  MoreVertical,
  Grip,
  Layout,
  LayoutTemplate,
  Columns,
  Rows,
  SquareStack,
  Stack,
  Fold,
  Unfold,
  Expand,
  Shrink,
  Maximize,
  Minimize,
  Move,
  MoveHorizontal,
  MoveVertical,
  MoveDiagonal,
  Move3D,
  Rotate3D,
  Scale,
  FlipHorizontal,
  FlipVertical,
  MousePointer,
  Pointer,
  View,
  Blind,
  Vision,
  Focus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Fullscreen,
  Sound,
  Mute,
  Voice,
  Silent,
  Transmit,
  Receive,
  Antenna,
  Wireless,
  Ethernet,
  Cable,
  Plug,
  PlugZap,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Toggle,
  PowerOff,
  Refresh,
  Sync,
  Download,
  UploadCloud,
  DownloadCloud,
  CloudUpload,
  CloudDownload,
  Share,
  Distribute,
  Send,
  SendHorizontal,
  Paperclip,
  Link,
  Link2,
  Unlink,
  ExternalLink,
  Copy,
  Clipboard,
  ClipboardCopy,
  ClipboardCheck,
  Paste,
  Cut,
  Edit,
  Edit2,
  Edit3,
  Pencil,
  Pen,
  Highlighter,
  Eraser,
  Type,
  Text,
  TextCursor,
  TextCursorInput,
  Input,
  Textarea,
  FormInput,
  Find,
  Filter2,
  Sort2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight2,
  ArrowUpRight,
  ArrowUpLeft,
  ArrowDownRight,
  ArrowDownLeft,
  ChevronsUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronsLeftRight,
  ArrowBigUp,
  ArrowBigDown,
  ArrowBigLeft,
  ArrowBigRight,
  CircleArrowUp,
  CircleArrowDown,
  CircleArrowLeft,
  CircleArrowRight,
  CircleChevronUp,
  CircleChevronDown,
  CircleChevronLeft,
  CircleChevronRight,
  Diamond,
  Gem,
  Crown,
  Medal,
  Award,
  Ribbon,
  Cup,
  Hot,
  Snowflake,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Sunny,
  Night,
  Sunrise,
  Sunset,
  Mountain,
  MountainSnow,
  TreePine,
  Leaf,
  Flower,
  Flower2,
  Shine,
  Twinkle,
  Glow,
  Ray,
  Idea,
  Think,
  Compute,
  Silicon,
  CircuitBoard,
  HardDrive,
  MemoryStick,
  Storage2,
  Server,
  ServerCog,
  ServerCrash,
  Monitor,
  MonitorSpeaker,
  MonitorPlay,
  Smartphone,
  Tablet,
  Laptop,
  Tv,
  Tv2,
  Stream,
  Headphones,
  HeadphonesIcon,
  Ear,
  EarOff,
  Microphone,
  Mic2,
  NoMic,
  Audio,
  NoAudio,
  LowAudio,
  HighAudio,
  Ring,
  NoRing,
  Ding,
  AlarmClock,
  AlarmClockCheck,
  Time,
  Clock3,
  Clock4,
  Timer,
  TimerReset,
  Stopwatch,
  Hourglass,
  HourglassEmpty,
  Date,
  CalendarCheck,
  CalendarX,
  CalendarDays,
  CalendarClock,
  CalendarRange,
  CalendarHeart,
  CalendarSearch,
  Plan,
  CalendarPlus,
  CalendarMinus,
  Schedule,
  Inbox,
  Folder
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SectionItem {
  id: string;
  icon: any;
  label: string;
}

interface Section {
  id: string;
  icon: any;
  label: string;
  badge?: string;
  items: SectionItem[];
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
      id: 'tasks',
      icon: ListTodo,
      label: 'Tasks',
      badge: 'NEW',
      items: [
        { id: 'task-inbox', icon: Inbox, label: 'Inbox' },
        { id: 'task-today', icon: Calendar, label: 'Today' },
        { id: 'task-upcoming', icon: CalendarDays, label: 'Upcoming' },
        { id: 'task-projects', icon: Folder, label: 'Projects' },
        { id: 'task-reminders', icon: Bell, label: 'Reminders' },
        { id: 'task-recurring', icon: RefreshCw, label: 'Recurring' },
        { id: 'task-deadlines', icon: Clock, label: 'Deadlines' },
        { id: 'task-ai-assist', icon: BrainCircuit, label: 'AI Task Assistant' },
      ],
    },
    {
      id: 'library',
      icon: BookOpen,
      label: 'Library',
      items: [
        { id: 'prompts', icon: Scroll, label: 'Prompt Library' },
        { id: 'templates', icon: LayoutGrid, label: 'Template Gallery' },
        { id: 'extensions', icon: Puzzle, label: 'Extensions' },
        { id: 'plugins', icon: Hexagon, label: 'Plugins' },
        { id: 'assets', icon: Box, label: 'Asset Library' },
      ],
    },
    {
      id: 'customize',
      icon: Palette,
      label: 'Customize',
      items: [
        { id: 'appearance', icon: Palette, label: 'Appearance' },
        { id: 'theme', icon: Sparkles, label: 'Theme Engine' },
        { id: 'layout', icon: LayoutGrid, label: 'Layout Config' },
        { id: 'animations', icon: Zap, label: 'Animations' },
        { id: 'widgets', icon: Layers3, label: 'Widgets' },
      ],
    },
    {
      id: 'quest3',
      icon: VrHeadset,
      label: 'Quest 3 Studio',
      badge: 'NEW',
      items: [
        { id: 'quest-avatar', icon: Ghost, label: 'Avatar Studio' },
        { id: 'quest-clothing', icon: Package, label: 'Clothing & Wearables' },
        { id: 'quest-accessories', icon: Glasses, label: 'Accessories' },
        { id: 'quest-environments', icon: Globe2, label: 'Environments' },
        { id: 'quest-animations', icon: RefreshCw, label: 'Motion Capture' },
        { id: 'quest-facial', icon: Smile, label: 'Facial Expressions' },
        { id: 'quest-voice', icon: Mic, label: 'Voice Profiles' },
        { id: 'quest-haptics', icon: Radio, label: 'Haptic Feedback' },
        { id: 'quest-hand-tracking', icon: Hand, label: 'Hand Tracking' },
        { id: 'quest-eye-tracking', icon: Eye, label: 'Eye Tracking' },
        { id: 'quest-store', icon: ShoppingBag, label: 'Asset Store' },
        { id: 'quest-publisher', icon: Upload, label: 'Publish to Quest' },
      ],
    },
    {
      id: 'sigil-models',
      icon: BrainCircuit,
      label: 'SIGIL Model Family',
      badge: 'PREMIUM',
      items: [
        { id: 'sigil-instructions', icon: Scroll, label: 'Custom Instructions' },
        { id: 'sigil-persona', icon: User, label: 'Persona Settings' },
        { id: 'sigil-voice', icon: Mic, label: 'Voice & Tone' },
        { id: 'sigil-knowledge', icon: BookOpen, label: 'Knowledge Base' },
        { id: 'sigil-memory', icon: Database, label: 'Memory Configuration' },
        { id: 'sigil-reasoning', icon: Brain, label: 'Reasoning Engine' },
        { id: 'sigil-creativity', icon: Sparkles, label: 'Creativity Mode' },
        { id: 'sigil-safety', icon: Shield, label: 'Safety Protocols' },
        { id: 'sigil-fine-tune', icon: Sliders, label: 'Fine-Tuning' },
        { id: 'sigil-model-switch', icon: RefreshCw, label: 'Model Switcher' },
      ],
    },
    {
      id: 'intelligence',
      icon: Sparkles,
      label: 'Intelligence Engine',
      badge: 'ULTRA',
      items: [
        { id: 'neural-core', icon: BrainCircuit, label: 'Neural Core' },
        { id: 'cognitive-stack', icon: Layers, label: 'Cognitive Stack' },
        { id: 'reasoning-deep', icon: Brain, label: 'Deep Reasoning' },
        { id: 'context-aware', icon: Target, label: 'Context Awareness' },
        { id: 'multi-modal', icon: Layers3, label: 'Multi-Modal Processing' },
        { id: 'attention-mechanism', icon: Eye, label: 'Attention Mechanism' },
        { id: 'memory-system', icon: Database, label: 'Memory System' },
        { id: 'learning-engine', icon: TrendingUp, label: 'Learning Engine' },
        { id: 'adaptation', icon: RefreshCw, label: 'Adaptive Learning' },
        { id: 'neural-bridge', icon: Network, label: 'Neural Bridge' },
        { id: 'quantum-ready', icon: Atom, label: 'Quantum Ready' },
        { id: 'parallel-process', icon: Cpu, label: 'Parallel Processing' },
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
        { id: 'signatures', icon: Fingerprint, label: 'Digital Signatures' },
      ],
    },
    {
      id: 'cognitive',
      icon: Brain,
      label: 'Cognitive',
      items: [
        { id: 'noetic-core', icon: Atom, label: 'Noetic Core' },
        { id: 'delta-state', icon: Layers, label: 'Delta State' },
        { id: 'half-life', icon: Clock, label: 'Half-Life' },
        { id: 'pressure', icon: BarChart3, label: 'Pressure System' },
        { id: 'quarantine', icon: Shield, label: 'Quarantine' },
        { id: 'immune', icon: Flame, label: 'Immune System' },
      ],
    },
    {
      id: 'governance',
      icon: Shield,
      label: 'Governance',
      items: [
        { id: 'warrants', icon: Key, label: 'Cryptographic Warrants' },
        { id: 'consensus', icon: Network, label: 'Consensus' },
        { id: 'derivation', icon: GitBranch, label: 'Derivation DAG' },
        { id: 'alignment', icon: Compass, label: 'Alignment Oracle' },
        { id: 'audit', icon: FileText, label: 'Audit Log' },
      ],
    },
    {
      id: 'inference',
      icon: Chip,
      label: 'Inference',
      items: [
        { id: 'model-config', icon: Cpu, label: 'Model Configuration' },
        { id: 'grammar', icon: Code, label: 'Grammar Constraints' },
        { id: 'speculative', icon: Lightning, label: 'Speculative Decoding' },
        { id: 'camel-ipc', icon: Terminal, label: 'CAMEL IPC' },
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
        { id: 'collaboration', icon: Users, label: 'Collaboration' },
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
        { id: 'health', icon: Heart, label: 'System Health' },
      ],
    },
  ];

  const quickActions = [
    { icon: Plus, label: 'New Chat', action: 'new-chat' },
    { icon: Search, label: 'Search', action: 'search' },
    { icon: Bookmark, label: 'Saved', action: 'saved' },
    { icon: Heart, label: 'Favorites', action: 'favorites' },
  ];

  const questQuickActions = [
    { icon: VrHeadset, label: 'VR Studio', action: 'quest-studio' },
    { icon: Ghost, label: 'Avatar', action: 'quest-avatar' },
    { icon: Package, label: 'Assets', action: 'quest-assets' },
    { icon: Upload, label: 'Publish', action: 'quest-publish' },
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

              {/* Quest 3 Quick Actions - Special Feature */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <VrHeadset className="w-5 h-5 text-pink-400" />
                  <span className="text-sm font-semibold text-white">Quest 3 Studio</span>
                  <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">NEW</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {questQuickActions.map((action) => (
                    <button
                      key={action.action}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all hover:scale-105 group"
                    >
                      <action.icon className="w-4 h-4 text-pink-300 group-hover:text-pink-200 transition-colors" />
                      <span className="text-xs text-gray-300 group-hover:text-white">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {sections.map((section) => (
                <div key={section.id} className="space-y-1">
                  <button
                    onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-xl transition-all group',
                      section.id === 'quest3'
                        ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/40 hover:to-pink-600/40 border border-purple-500/30'
                        : 'bg-white/5 hover:bg-white/10'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <section.icon className={cn(
                        'w-5 h-5 transition-colors',
                        section.id === 'quest3' ? 'text-pink-400 group-hover:text-pink-300' : 'text-purple-300 group-hover:text-white'
                      )} />
                      <span className={cn(
                        'font-medium',
                        section.id === 'quest3' ? 'text-white' : 'text-white'
                      )}>{section.label}</span>
                      {section.badge && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                          {section.badge}
                        </span>
                      )}
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
