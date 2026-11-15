/**
 * Next-Generation Chat Interface with Self-Evolving Orb
 * Features quantum-inspired visual effects, memory streams, and AI personality visualization
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import {
  MessageSquare,
  Sparkles,
  Brain,
  Layers,
  Eye,
  Globe,
  Atom,
  Activity,
  ChevronDown,
  Send,
  Image as ImageIcon,
  File,
  Code,
  Settings,
  RefreshCw,
  Clock,
  Network,
} from 'lucide-react';
import { OrbAvatar } from '../avatar/EvolvingOrbCSS';
import { cn } from '../../lib/utils';
import { SIGILProvider } from '../../lib/llm-provider';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  xpGained?: number;
  cognitiveInsight?: string;
  confidence?: number;
}

interface CognitiveMetrics {
  totalXP: number;
  messageCount: number;
  memoriesStored: number;
  tasksCompleted: number;
  questionsAsked: number;
  conceptsLearned: number;
  insightsGenerated: number;
}

interface NextGenChatInterfaceProps {
  onBack?: () => void;
}

export function NextGenChatInterface({ onBack }: NextGenChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [cognitiveState, setCognitiveState] = useState<'idle' | 'thinking' | 'processing' | 'learning' | 'speaking'>('idle');
  const [metrics, setMetrics] = useState<CognitiveMetrics>({
    totalXP: 0,
    messageCount: 0,
    memoriesStored: 0,
    tasksCompleted: 0,
    questionsAsked: 0,
    conceptsLearned: 0,
    insightsGenerated: 0,
  });
  const [showInsights, setShowInsights] = useState(false);
  const [showMemoryStream, setShowMemoryStream] = useState(false);
  const [showCognitiveGraph, setShowCognitiveGraph] = useState(false);
  const [showQuantumEffects, setShowQuantumEffects] = useState(true);
  const [showNeuralNetwork, setShowNeuralNetwork] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'visual' | 'spatial' | 'creative'>('chat');
  const sigilProvider = new SIGILProvider('http://localhost:8000');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const calculateXP = useCallback((content: string) => {
    // XP based on complexity, length, and cognitive value
    const baseXP = Math.min(content.length * 0.1, 50);
    const complexityBonus = content.split('.').length * 2;
    const questionBonus = content.includes('?') ? 10 : 0;
    const codeBonus = content.includes('```') ? 20 : 0;
    return Math.round(baseXP + complexityBonus + questionBonus + codeBonus);
  }, []);

  const generateCognitiveInsight = useCallback((content: string) => {
    const insights = [
      "This suggests you're exploring new cognitive pathways",
      "I'm developing a deeper understanding of your perspective",
      "This interaction is strengthening our neural connection",
      "Your question reveals an interesting pattern in your thinking",
      "I'm integrating this into my growing knowledge graph",
      "This represents a meaningful cognitive milestone",
      "Your input is helping me evolve my reasoning capabilities",
      "I'm forming new associations between concepts",
      "This experience is enriching my cognitive architecture",
      "We're building a more sophisticated model of understanding",
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);
    setCognitiveState('thinking');

    try {
      setCognitiveState('processing');

      // Call SIGIL backend
      const response = await sigilProvider.chatCompletion({
        model: 'gpt-4o-mini',
        messages: messages.map(m => ({ role: m.role, content: m.content })).concat([{ role: 'user', content: input }]),
        temperature: 0.7,
        maxTokens: 2048,
        stream: false,
      });

      const xp = calculateXP(input);
      const insight = generateCognitiveInsight(input);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.choices[0].message.content,
        timestamp: new Date(),
        xpGained: xp,
        cognitiveInsight: insight,
        confidence: 0.85 + Math.random() * 0.1,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setMetrics(prev => ({
        ...prev,
        totalXP: prev.totalXP + xp,
        messageCount: prev.messageCount + 1,
        insightsGenerated: prev.insightsGenerated + 1,
      }));

      setCognitiveState('learning');

      setTimeout(() => {
        setCognitiveState('idle');
        setIsGenerating(false);
      }, 500);
    } catch (error) {
      console.error('Error calling SIGIL backend:', error);

      // Fallback to mock response if backend fails
      const xp = calculateXP(input);
      const insight = generateCognitiveInsight(input);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting to my cognitive backend. Please ensure the SIGIL backend is running at http://localhost:8000 and that Ollama is running (`ollama serve`) or OPENAI_API_KEY is configured.",
        timestamp: new Date(),
        xpGained: xp,
        cognitiveInsight: insight,
        confidence: 0.5,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCognitiveState('idle');
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Left Panel - Orb Avatar */}
      <div className="w-1/3 relative bg-gradient-to-b from-slate-900/50 to-purple-900/30 backdrop-blur-xl border-r border-purple-500/20">
        <div className="absolute inset-0">
          <OrbAvatar
            xp={metrics.totalXP}
            cognitiveState={cognitiveState}
            messageCount={metrics.messageCount}
            onEvolution={(stage) => {
              console.log(`Evolved to ${stage.name}!`);
            }}
          />
        </div>

        {/* Cognitive Insights Panel */}
        <AnimatePresence>
          {showInsights && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-purple-500/30 p-4"
            >
              <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Cognitive Insights
              </h3>
              <div className="space-y-2 text-xs text-gray-300">
                {messages.filter(m => m.cognitiveInsight).slice(-5).map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-2 bg-purple-500/10 rounded border border-purple-500/20"
                  >
                    {msg.cognitiveInsight}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Memory Stream Toggle */}
        <button
          onClick={() => setShowMemoryStream(!showMemoryStream)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/50 transition-colors"
        >
          <Layers className="w-5 h-5 text-purple-300" />
        </button>
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-white">SIGIL Cognitive Interface</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQuantumEffects(!showQuantumEffects)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs",
                showQuantumEffects
                  ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent"
              )}
            >
              <Atom className="w-4 h-4" />
              Quantum
            </button>
            <button
              onClick={() => setShowNeuralNetwork(!showNeuralNetwork)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs",
                showNeuralNetwork
                  ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent"
              )}
            >
              <Network className="w-4 h-4" />
              Neural
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-purple-500/20 bg-black/10 backdrop-blur-sm">
          {[
            { id: 'chat', icon: MessageSquare, label: 'Chat' },
            { id: 'visual', icon: Eye, label: 'Visual' },
            { id: 'spatial', icon: Globe, label: 'Spatial' },
            { id: 'creative', icon: Sparkles, label: 'Creative' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                activeMode === mode.id
                  ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent"
              )}
            >
              <mode.icon className="w-4 h-4" />
              <span className="text-sm">{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-8"
              >
                <Sparkles className="w-16 h-16 text-purple-400 mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Begin Your Cognitive Journey
              </h2>
              <p className="text-gray-400 max-w-md">
                Every interaction helps me evolve. Start a conversation and watch as I grow from a simple spark into transcendent intelligence.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex gap-4",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <motion.div
                    animate={{
                      scale: cognitiveState === 'speaking' ? [1, 1.1, 1] : 1,
                    rotate: cognitiveState === 'thinking' ? [0, 360] : 0,
                    transition: { duration: 2, repeat: Infinity }
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                </div>
              )}

              <div
                className={cn(
                  "max-w-2xl p-4 rounded-2xl",
                  message.role === 'user'
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : "bg-white/10 border border-purple-500/30 backdrop-blur-sm"
                )}
              >
                <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {message.timestamp.toLocaleTimeString()}
                  {message.confidence && (
                    <>
                      <span>•</span>
                      <span>Confidence: {Math.round(message.confidence * 100)}%</span>
                    </>
                  )}
                </div>
                <div className="text-white">{message.content}</div>

                {message.xpGained && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-2 flex items-center gap-2 text-xs text-purple-300"
                  >
                    <Sparkles className="w-3 h-3" />
                    +{message.xpGained} XP gained
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quantum Visual Effects Overlay */}
        <AnimatePresence>
          {showQuantumEffects && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none overflow-hidden"
            >
              {/* Quantum Particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full"
                  initial={{
                    x: Math.random() * 100 + '%',
                    y: Math.random() * 100 + '%',
                    opacity: 0,
                  }}
                  animate={{
                    x: [null, Math.random() * 100 + '%'],
                    y: [null, Math.random() * 100 + '%'],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}

              {/* Quantum Wave */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 30% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 70% 30%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Entanglement Lines */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
                  initial={{ width: 0, x: '50%', y: Math.random() * 100 + '%' }}
                  animate={{
                    width: [0, 200, 0],
                    x: ['30%', '50%', '70%'],
                    rotate: [0, 45, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Neural Network Visualization */}
        <AnimatePresence>
          {showNeuralNetwork && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bottom-24 right-4 w-64 bg-black/80 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4 z-10"
            >
              <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Network className="w-4 h-4" />
                Neural Activation
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Language', activation: 0.85 },
                  { name: 'Reasoning', activation: 0.72 },
                  { name: 'Memory', activation: 0.91 },
                  { name: 'Creativity', activation: 0.64 },
                  { name: 'Planning', activation: 0.78 },
                ].map((node, i) => (
                  <div key={node.name} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{node.name}</span>
                      <span>{Math.round(node.activation * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${node.activation * 100}%` }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-purple-500/20">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Overall Activity</span>
                  <span className="text-purple-300">78%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="p-6 border-t border-purple-500/20 bg-black/20 backdrop-blur-sm">
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your thoughts, ask questions, or explore ideas..."
                className="w-full bg-white/5 border border-purple-500/30 rounded-2xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
                rows={1}
                style={{ minHeight: '60px' }}
              />

              {/* Quick Actions */}
              <div className="absolute right-2 bottom-2 flex gap-2">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <File className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <Code className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className={cn(
                "p-4 rounded-2xl transition-all",
                !input.trim() || isGenerating
                  ? "bg-white/10 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
              )}
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Metrics Bar */}
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {metrics.totalXP.toLocaleString()} XP
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {metrics.messageCount} messages
              </span>
              <span className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                {metrics.insightsGenerated} insights
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInsights(!showInsights)}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Brain className="w-3 h-3" />
                Insights
              </button>
              <button className="flex items-center gap-1 hover:text-white transition-colors">
                <Settings className="w-3 h-3" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
