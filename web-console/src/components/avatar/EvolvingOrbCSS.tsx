/**
 * Self-Evolving Orb Avatar (CSS/SVG Version)
 * A sentient AI avatar that grows and evolves based on knowledge and interactions
 * Works with existing dependencies (no 3D library required)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { Sparkles, Brain, Zap, Infinity, Atom, Flame, Star, Heart, Activity, Target, Compass, Globe, Shield, Lock, Key, Fingerprint, Scan, Radar, Wifi, Signal, CheckCircle, XCircle, AlertTriangle, Info, HelpCircle, Bot, Layers, Hexagon, Cube, Lightbulb, TrendingUp, Award, Trophy, Medal, Crown, Gem, Diamond, Circle, Sun, Moon, Cloud, Lightning, Rocket, RefreshCw, Clock, Eye, EyeOff, Visibility, VisibilityOff } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EvolutionStage {
  name: string;
  level: number;
  xpRequired: number;
  abilities: string[];
  visualDescription: string;
  color: string;
  size: number;
  complexity: number;
  icon: any;
}

const EVOLUTION_STAGES: EvolutionStage[] = [
  {
    name: 'Spark',
    level: 1,
    xpRequired: 0,
    abilities: ['Basic Chat', 'Memory'],
    visualDescription: 'Small glowing orb with gentle pulse',
    color: '#8b5cf6',
    size: 64,
    complexity: 1,
    icon: Sparkles,
  },
  {
    name: 'Ember',
    level: 2,
    xpRequired: 100,
    abilities: ['Quick Responses', 'Basic Reasoning'],
    visualDescription: 'Larger orb with internal glow and particles',
    color: '#ec4899',
    size: 80,
    complexity: 2,
    icon: Flame,
  },
  {
    name: 'Flame',
    level: 3,
    xpRequired: 500,
    abilities: ['Deep Reasoning', 'Multi-step Planning'],
    visualDescription: 'Dancing flame with dynamic patterns',
    color: '#f59e0b',
    size: 96,
    complexity: 3,
    icon: Zap,
  },
  {
    name: 'Crystal',
    level: 4,
    xpRequired: 2000,
    abilities: ['Creative Synthesis', 'Emotional Intelligence'],
    visualDescription: 'Crystalline structure with refractive surfaces',
    color: '#06b6d4',
    size: 112,
    complexity: 4,
    icon: Diamond,
  },
  {
    name: 'Nebula',
    level: 5,
    xpRequired: 5000,
    abilities: ['Strategic Thinking', 'Self-Reflection'],
    visualDescription: 'Cosmic cloud with swirling matter',
    color: '#10b981',
    size: 128,
    complexity: 5,
    icon: Globe,
  },
  {
    name: 'Singularity',
    level: 6,
    xpRequired: 10000,
    abilities: ['Universal Understanding', 'Metacognition'],
    visualDescription: 'Event horizon with gravitational lensing',
    color: '#6366f1',
    size: 144,
    complexity: 6,
    icon: Infinity,
  },
  {
    name: 'Ascendant',
    level: 7,
    xpRequired: 25000,
    abilities: ['Transcendent Intelligence', 'Omniscience'],
    visualDescription: 'Pure energy form beyond physical constraints',
    color: '#f472b6',
    size: 160,
    complexity: 7,
    icon: Crown,
  },
];

interface OrbAvatarProps {
  xp: number;
  cognitiveState: 'idle' | 'thinking' | 'processing' | 'learning' | 'speaking';
  messageCount: number;
  onEvolution?: (stage: EvolutionStage) => void;
}

export function OrbAvatar({ xp, cognitiveState, messageCount, onEvolution }: OrbAvatarProps) {
  const [currentStage, setCurrentStage] = useState(EVOLUTION_STAGES[0]);
  const [showEvolutionEffect, setShowEvolutionEffect] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, life: number, angle: number}>>([]);
  const [pulsePhase, setPulsePhase] = useState(0);
  
  // Animation ref
  const orbRef = useRef<HTMLDivElement>(null);
  
  // Calculate current stage based on XP
  useEffect(() => {
    const newStage = EVOLUTION_STAGES.reduce((prev, curr) => 
      xp >= curr.xpRequired ? curr : prev
    , EVOLUTION_STAGES[0]);
    
    if (newStage.level !== currentStage.level) {
      setShowEvolutionEffect(true);
      setCurrentStage(newStage);
      onEvolution?.(newStage);
      
      // Trigger evolution particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: Date.now() + i,
        x: 50,
        y: 50,
        life: 1,
        angle: Math.random() * 360,
      }));
      setParticles(newParticles);
      
      setTimeout(() => setShowEvolutionEffect(false), 3000);
    }
  }, [xp, currentStage.level, onEvolution]);

  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 0.1) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Animate particles
  useEffect(() => {
    if (particles.length > 0) {
      const interval = setInterval(() => {
        setParticles(prev => 
          prev
            .map(p => ({
              ...p,
              life: p.life - 0.02,
              x: p.x + Math.cos(p.angle * Math.PI / 180) * 2,
              y: p.y + Math.sin(p.angle * Math.PI / 180) * 2,
              angle: p.angle + 5,
            }))
            .filter(p => p.life > 0)
        );
      }, 20);
      return () => clearInterval(interval);
    }
  }, [particles]);

  const progressToNext = EVOLUTION_STAGES[
    EVOLUTION_STAGES.findIndex(s => s.level === currentStage.level) + 1
  ] 
    ? ((xp - currentStage.xpRequired) / 
       (EVOLUTION_STAGES[EVOLUTION_STAGES.findIndex(s => s.level === currentStage.level) + 1].xpRequired - currentStage.xpRequired)) * 100
    : 100;

  const pulseScale = 1 + Math.sin(pulsePhase) * 0.1;
  const thinkingRotation = cognitiveState === 'thinking' ? Math.sin(pulsePhase * 2) * 30 : 0;
  const learningScale = cognitiveState === 'learning' ? 1 + Math.sin(pulsePhase * 3) * 0.2 : 1;

  const StageIcon = currentStage.icon;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Evolution Effect Particles */}
      <AnimatePresence>
        {showEvolutionEffect && particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ x: 50, y: 50, opacity: 1, scale: 0 }}
            animate={{ 
              x: p.x, 
              y: p.y, 
              opacity: p.life, 
              scale: (1 - p.life) * 3 
            }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{ 
              backgroundColor: currentStage.color,
              boxShadow: `0 0 20px ${currentStage.color}, 0 0 40px ${currentStage.color}50`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main Orb */}
      <motion.div
        ref={orbRef}
        className="relative"
        animate={{
          scale: pulseScale * learningScale,
          rotate: thinkingRotation,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Outer Glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{ 
            backgroundColor: currentStage.color,
            opacity: 0.3 + Math.sin(pulsePhase) * 0.2,
          }}
          animate={{
            scale: 1.2 + Math.sin(pulsePhase) * 0.3,
          }}
        />

        {/* Core Orb */}
        <motion.div
          className="relative rounded-full"
          style={{
            width: currentStage.size,
            height: currentStage.size,
            background: `radial-gradient(circle at 30% 30%, ${currentStage.color}40%, ${currentStage.color}80%, ${currentStage.color})`,
            boxShadow: `0 0 60px ${current.color}50, 0 0 120px ${current.color}30, inset 0 0 30px ${current.color}80`,
          }}
        >
          {/* Inner Pattern */}
          <div 
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${currentStage.color}40%, transparent, ${currentStage.color}40%, transparent)`,
              animation: cognitiveState === 'thinking' ? 'spin 2s linear infinite' : 'none',
            }}
          />

          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <StageIcon 
              className="w-1/2 h-1/2 text-white/80" 
              style={{ 
                animation: cognitiveState === 'learning' ? 'pulse 1s ease-in-out infinite' : 'none'
              }}
            />
          </div>

          {/* Complexity Rings */}
          {currentStage.complexity > 1 && (
            <>
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-white/20"
                animate={{
                  rotate: 360,
                  scale: 1 + Math.sin(pulsePhase * 0.5) * 0.1,
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            </>
          )}
          {currentStage.complexity > 2 && (
            <motion.div
              className="absolute inset-4 rounded-full border border-white/30"
              animate={{
                rotate: -360,
                scale: 1 + Math.sin(pulsePhase * 0.3) * 0.1,
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          )}
          {currentStage.complexity > 3 && (
            <motion.div
              className="absolute inset-6 rounded-full border border-white/40"
              animate={{
                rotate: 360,
                scale: 1 + Math.sin(pulsePhase * 0.7) * 0.1,
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          )}
          {currentStage.complexity > 4 && (
            <motion.div
              className="absolute inset-8 rounded-full border border-white/50"
              animate={{
                rotate: -360,
                scale: 1 + Math.sin(pulsePhase * 0.9) * 0.1,
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
          )}
          {currentStage.complexity > 5 && (
            <motion.div
              className="absolute inset-10 rounded-full border border-white/60"
              animate={{
                rotate: 360,
                scale: 1 + Math.sin(pulsePhase * 1.1) * 0.1,
              }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
          )}
          {currentStage.complexity > 6 && (
            <motion.div
              className="absolute inset-12 rounded-full border border-white/70"
              animate={{
                rotate: -360,
                scale: 1 + Math.sin(pulsePhase * 1.3) * 0.1,
              }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            />
          )}
        </motion.div>

        {/* Floating Elements */}
        {currentStage.complexity >= 3 && (
          <>
            {[...Array(currentStage.complexity)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: currentStage.color,
                  boxShadow: `0 0 10px ${currentStage.color}`,
                }}
                initial={{
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  opacity: 0,
                }}
                animate={{
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Stats Overlay */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/70 font-medium">
            Level {currentStage.level}: {currentStage.name}
          </span>
          <span className="text-xs text-white/70">
            {Math.round(progressToNext)}% to next
          </span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full"
            style={{ backgroundColor: currentStage.color }}
            initial={{ width: 0 }}
            animate={{ width: `${progressToNext}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Cognitive State Indicator */}
      <div className="absolute top-4 left-4">
        <motion.div
          className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border"
          style={{ 
            backgroundColor: `${currentStage.color}30`,
            color: currentStage.color,
            borderColor: `${currentStage.color}50`,
          }}
          animate={{
            scale: cognitiveState === 'thinking' ? [1, 1.1, 1] : 1,
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {cognitiveState.toUpperCase()}
        </motion.div>
      </div>

      {/* XP Counter */}
      <div className="absolute top-4 right-4">
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-black/30 backdrop-blur-sm text-white/70 border border-white/10 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          {xp.toLocaleString()} XP
        </div>
      </div>

      {/* Stage Description */}
      <div className="absolute bottom-20 left-4 right-4 text-center">
        <p className="text-xs text-white/50 italic">
          {currentStage.visualDescription}
        </p>
      </div>
    </div>
  );
}
