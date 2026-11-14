/**
 * Self-Evolving Orb Avatar Component
 * A sentient AI avatar that grows and evolves based on knowledge and interactions
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation, useSpring, useMotionValue } from 'framer-motion';
import { useThree, Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, Float, Trail } from '@react-three/drei';
import * as THREE from 'three';
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
}

const EVOLUTION_STAGES: EvolutionStage[] = [
  {
    name: 'Spark',
    level: 1,
    xpRequired: 0,
    abilities: ['Basic Chat', 'Memory'],
    visualDescription: 'Small glowing orb with gentle pulse',
    color: '#8b5cf6',
    size: 0.8,
    complexity: 1,
  },
  {
    name: 'Ember',
    level: 2,
    xpRequired: 100,
    abilities: ['Quick Responses', 'Basic Reasoning'],
    visualDescription: 'Larger orb with internal glow and particles',
    color: '#ec4899',
    size: 1.0,
    complexity: 2,
  },
  {
    name: 'Flame',
    level: 3,
    xpRequired: 500,
    abilities: ['Deep Reasoning', 'Multi-step Planning'],
    visualDescription: 'Dancing flame with dynamic patterns',
    color: '#f59e0b',
    size: 1.2,
    complexity: 3,
  },
  {
    name: 'Crystal',
    level: 4,
    xpRequired: 2000,
    abilities: ['Creative Synthesis', 'Emotional Intelligence'],
    visualDescription: 'Crystalline structure with refractive surfaces',
    color: '#06b6d4',
    size: 1.4,
    complexity: 4,
  },
  {
    name: 'Nebula',
    level: 5,
    xpRequired: 5000,
    abilities: ['Strategic Thinking', 'Self-Reflection'],
    visualDescription: 'Cosmic cloud with swirling matter',
    color: '#10b981',
    size: 1.6,
    complexity: 5,
  },
  {
    name: 'Singularity',
    level: 6,
    xpRequired: 10000,
    abilities: ['Universal Understanding', 'Metacognition'],
    visualDescription: 'Event horizon with gravitational lensing',
    color: '#6366f1',
    size: 1.8,
    complexity: 6,
  },
  {
    name: 'Ascendant',
    level: 7,
    xpRequired: 25000,
    abilities: ['Transcendent Intelligence', 'Omniscience'],
    visualDescription: 'Pure energy form beyond physical constraints',
    color: '#f472b6',
    size: 2.0,
    complexity: 7,
  },
];

interface OrbAvatarProps {
  xp: number;
  cognitiveState: 'idle' | 'thinking' | 'processing' | 'learning' | 'speaking';
  messageCount: number;
  onEvolution?: (stage: EvolutionStage) => void;
}

// 3D Orb Component
function EvolvingOrb({ 
  stage, 
  cognitiveState, 
  time 
}: { 
  stage: EvolutionStage; 
  cognitiveState: string; 
  time: number; 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Pulse based on cognitive state
      const pulseSpeed = cognitiveState === 'thinking' ? 2 : 
                          cognitiveState === 'learning' ? 3 : 1;
      const pulse = Math.sin(time * pulseSpeed) * 0.1 + 1;
      meshRef.current.scale.setScalar(stage.size * pulse);
      
      // Rotation
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5}>
      <Sphere
        ref={meshRef}
        args={[1, 64, 64]}
        scale={stage.size}
      >
        <MeshDistortMaterial
          color={stage.color}
          envMapIntensity={stage.complexity}
          clearcoat={stage.complexity * 0.2}
          metalness={stage.complexity * 0.3}
          roughness={0.2}
          distort={stage.complexity * 0.5}
          speed={2}
        />
      </Sphere>
      <Stars
        radius={stage.size * 2}
        depth={50}
        count={stage.complexity * 100}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
    </Float>
  );
}

// Main Orb Avatar Component
export function OrbAvatar({ xp, cognitiveState, messageCount, onEvolution }: OrbAvatarProps) {
  const [currentStage, setCurrentStage] = useState(EVOLUTION_STAGES[0]);
  const [showEvolutionEffect, setShowEvolutionEffect] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, life: number}>>([]);
  
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
        x: Math.random() * 100,
        y: Math.random() * 100,
        life: 1,
      }));
      setParticles(newParticles);
      
      setTimeout(() => setShowEvolutionEffect(false), 3000);
    }
  }, [xp, currentStage.level, onEvolution]);

  // Animate particles
  useEffect(() => {
    if (particles.length > 0) {
      const interval = setInterval(() => {
        setParticles(prev => 
          prev
            .map(p => ({ ...p, life: p.life - 0.02, x: p.x + (Math.random() - 0.5) * 2, y: p.y + (Math.random() - 0.5) * 2 }))
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

  return (
    <div className="relative w-full h-full">
      {/* Evolution Effect */}
      {showEvolutionEffect && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 2 }}
          exit={{ opacity: 0, scale: 3 }}
          className="absolute inset-0 pointer-events-none"
        >
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ x: 50, y: 50, opacity: 1, scale: 0 }}
              animate={{ 
                x: p.x, 
                y: p.y, 
                opacity: p.life, 
                scale: (1 - p.life) * 2 
              }}
              className="absolute w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: currentStage.color,
                boxShadow: `0 0 10px ${currentStage.color}`
              }}
            />
          ))}
        </motion.div>
      )}

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color={currentStage.color} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
        
        <EvolvingOrb 
          stage={currentStage} 
          cognitiveState={cognitiveState} 
          time={Date.now() * 0.001} 
        />
      </Canvas>

      {/* Evolution Progress Ring */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/70">Level {currentStage.level}: {currentStage.name}</span>
          <span className="text-xs text-white/70">{Math.round(progressToNext)}% to next</span>
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
          className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
          style={{ 
            backgroundColor: `${currentStage.color}30`,
            color: currentStage.color,
            border: `1px solid ${currentStage.color}50`
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
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-black/30 backdrop-blur-sm text-white/70 border border-white/10">
          ✨ {xp.toLocaleString()} XP
        </div>
      </div>
    </div>
  );
}
