import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  Loader2,
  Save,
  Wand2,
  Brain,
  Lightbulb,
  Target,
  Shield,
  Heart,
  Zap,
  ChevronDown,
  ChevronUp,
  Edit,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Instruction {
  id: string;
  title: string;
  content: string;
  category: 'behavior' | 'response' | 'knowledge' | 'creativity' | 'safety';
  enabled: boolean;
  priority: number;
}

export const CustomInstructions: React.FC = () => {
  const [instructions, setInstructions] = useState<Instruction[]>([
    {
      id: '1',
      title: 'Be Helpful and Friendly',
      content: 'Always respond in a helpful, friendly manner. Show empathy and understanding. Use a warm, conversational tone.',
      category: 'behavior',
      enabled: true,
      priority: 1,
    },
    {
      id: '2',
      title: 'Be Concise',
      content: 'Keep responses concise and to the point. Avoid unnecessary fluff. Provide clear, actionable information.',
      category: 'response',
      enabled: true,
      priority: 2,
    },
    {
      id: '3',
      title: 'Be Creative',
      content: 'When appropriate, think outside the box. Offer creative solutions and novel perspectives.',
      category: 'creativity',
      enabled: true,
      priority: 3,
    },
  ]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const categoryIcons = {
    behavior: Brain,
    response: Target,
    knowledge: Lightbulb,
    creativity: Sparkles,
    safety: Shield,
  };

  const categoryColors = {
    behavior: 'bg-blue-500/20 text-blue-400',
    response: 'bg-green-500/20 text-green-400',
    knowledge: 'bg-yellow-500/20 text-yellow-400',
    creativity: 'bg-purple-500/20 text-purple-400',
    safety: 'bg-red-500/20 text-red-400',
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addInstruction = () => {
    const newInstruction: Instruction = {
      id: Date.now().toString(),
      title: 'New Instruction',
      content: 'Describe what you want the AI to do...',
      category: 'behavior',
      enabled: true,
      priority: instructions.length + 1,
    };
    setInstructions([...instructions, newInstruction]);
    setExpandedId(newInstruction.id);
    setEditingId(newInstruction.id);
  };

  const deleteInstruction = (id: string) => {
    setInstructions(instructions.filter(i => i.id !== id));
  };

  const toggleEnabled = (id: string) => {
    setInstructions(instructions.map(i =>
      i.id === id ? { ...i, enabled: !i.enabled } : i
    ));
  };

  const updateInstruction = (id: string, updates: Partial<Instruction>) => {
    setInstructions(instructions.map(i =>
      i.id === id ? { ...i, ...updates } : i
    ));
  };

  const categoryPresets = {
    behavior: [
      { title: 'Be Professional', content: 'Maintain a professional tone in all responses.' },
      { title: 'Be Casual', content: 'Use casual, conversational language.' },
      { title: 'Be Enthusiastic', content: 'Show enthusiasm and energy in responses.' },
    ],
    response: [
      { title: 'Be Detailed', content: 'Provide comprehensive, detailed explanations.' },
      { title: 'Be Brief', content: 'Keep responses short and to the point.' },
      { title: 'Be Educational', content: 'Explain concepts clearly for learning.' },
    ],
    knowledge: [
      { title: 'Be Factual', content: 'Always provide accurate, factual information.' },
      { title: 'Be Opinionated', content: 'Share your perspective and opinions.' },
      { title: 'Be Sourced', content: 'Cite sources when providing information.' },
    ],
    creativity: [
      { title: 'Be Innovative', content: 'Think creatively and offer novel solutions.' },
      { title: 'Be Artistic', content: 'Use artistic language and metaphors.' },
      { title: 'Be Humorous', content: 'Include humor and wit in responses.' },
    ],
    safety: [
      { title: 'Be Safe', content: 'Avoid harmful or dangerous content.' },
      { title: 'Be Ethical', content: 'Follow ethical guidelines in all responses.' },
      { title: 'Be Respectful', content: 'Maintain respectful communication.' },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Custom Instructions</h1>
          <p className="text-gray-400">Shape how SIGIL thinks and responds to you</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={addInstruction}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Instruction
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

      {/* Presets */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <Wand2 className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Quick Presets</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {Object.entries(categoryPresets).map(([category, presets]) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons];
            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400 capitalize">{category}</span>
                </div>
                {presets.map((preset) => (
                  <button
                    key={preset.title}
                    onClick={() => {
                      const newInstruction: Instruction = {
                        id: Date.now().toString(),
                        title: preset.title,
                        content: preset.content,
                        category: category as any,
                        enabled: true,
                        priority: instructions.length + 1,
                      };
                      setInstructions([...instructions, newInstruction]);
                      setExpandedId(newInstruction.id);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white transition-all"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions List */}
      <div className="space-y-3">
        <AnimatePresence>
          {instructions.map((instruction) => {
            const Icon = categoryIcons[instruction.category];
            const isExpanded = expandedId === instruction.id;
            const isEditing = editingId === instruction.id;

            return (
              <motion.div
                key={instruction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  'bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden',
                  !instruction.enabled && 'opacity-50'
                )}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Category Icon */}
                    <div className={cn('p-2 rounded-xl', categoryColors[instruction.category])}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={instruction.title}
                            onChange={(e) => updateInstruction(instruction.id, { title: e.target.value })}
                            className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500"
                          />
                          <textarea
                            value={instruction.content}
                            onChange={(e) => updateInstruction(instruction.id, { content: e.target.value })}
                            rows={3}
                            className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 resize-none"
                          />
                          <select
                            value={instruction.category}
                            onChange={(e) => updateInstruction(instruction.id, { category: e.target.value as any })}
                            className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500"
                          >
                            {Object.keys(categoryIcons).map((cat) => (
                              <option key={cat} value={cat} className="bg-slate-900 capitalize">
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-medium">{instruction.title}</h4>
                            {!instruction.enabled && (
                              <span className="px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 text-xs">
                                Disabled
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm line-clamp-2">{instruction.content}</p>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleEnabled(instruction.id)}
                        className={cn(
                          'p-2 rounded-lg transition-all',
                          instruction.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        )}
                      >
                        {instruction.enabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setEditingId(isEditing ? null : instruction.id)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : instruction.id)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteInstruction(instruction.id)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && !isEditing && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-white/10"
                      >
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{instruction.content}</p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                          <span className="capitalize">{instruction.category}</span>
                          <span>Priority: {instruction.priority}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-xl bg-purple-500/30">
            <Lightbulb className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Tips for Better Instructions</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Be specific and clear about what you want</li>
              <li>• Use positive language (what to do, not what not to do)</li>
              <li>• Keep instructions focused on a single behavior</li>
              <li>• Order instructions by priority (higher priority = executed first)</li>
              <li>• Test and iterate based on actual responses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
