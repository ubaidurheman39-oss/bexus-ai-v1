import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Sparkles, 
  Code2, 
  FileText, 
  Presentation, 
  Brain, 
  TrendingUp, 
  Check, 
  ArrowRight,
  Zap,
  Terminal,
  Bug,
  BookOpen
} from 'lucide-react';
import { sounds } from '../../services/soundEffects';

export interface PromptTemplate {
  id: string;
  category: 'coding' | 'writing' | 'slides' | 'business' | 'research';
  title: string;
  description: string;
  icon: any;
  prompt: string;
  tag: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  // Coding
  {
    id: 'code-refactor',
    category: 'coding',
    title: 'Code Refactor & Architecture',
    description: 'Clean up technical debt, improve readability, modularity, and TypeScript type safety.',
    icon: Code2,
    tag: 'Clean Code',
    prompt: 'Refactor this code to follow clean architecture principles, optimize performance, and ensure strict TypeScript type safety:\n\n```typescript\n// Paste your code here\n```'
  },
  {
    id: 'debug-error',
    category: 'coding',
    title: 'Diagnose & Fix Error',
    description: 'Pinpoint root causes from stack traces and generate verified bug-fixes.',
    icon: Bug,
    tag: 'Debugging',
    prompt: 'Analyze this error and codebase snippet. Diagnose why it fails and provide the exact, production-ready fix:\n\nError Message:\n'
  },
  {
    id: 'api-design',
    category: 'coding',
    title: 'REST / GraphQL API Schema',
    description: 'Design production backend endpoints, DTOs, and validation schemas.',
    icon: Terminal,
    tag: 'Backend',
    prompt: 'Design a scalable, secure RESTful API specification with TypeScript request/response interfaces and input validation schemas for: '
  },
  {
    id: 'unit-tests',
    category: 'coding',
    title: 'Write Unit & Integration Tests',
    description: 'Generate complete Vitest/Jest tests covering edge cases and mocks.',
    icon: Code2,
    tag: 'Testing',
    prompt: 'Write exhaustive unit tests with high test coverage using Vitest/React Testing Library, covering happy paths and edge cases for: '
  },

  // Writing
  {
    id: 'blog-post',
    category: 'writing',
    title: 'High-Impact SEO Blog Post',
    description: 'Engaging, narrative-driven article with catchy headlines, subheadings, and takeaways.',
    icon: FileText,
    tag: 'Content',
    prompt: 'Write an authoritative, highly engaging 1,200-word SEO blog post with captivating hooks, structured H2/H3 subheadings, data points, and actionable takeaways on: '
  },
  {
    id: 'executive-summary',
    category: 'writing',
    title: 'Executive Briefing & Memo',
    description: 'Crisp 1-page leadership summary with TL;DR, risks, and next steps.',
    icon: BookOpen,
    tag: 'Executive',
    prompt: 'Synthesize the following material into a concise Executive Briefing note for C-suite leadership with TL;DR, strategic business impact, key metrics, and recommended next steps:\n\n'
  },
  {
    id: 'viral-copy',
    category: 'writing',
    title: 'High-Converting Copywriting',
    description: 'Landing page value proposition, conversion hooks, and CTA frameworks.',
    icon: Sparkles,
    tag: 'Marketing',
    prompt: 'Craft high-converting landing page marketing copy (Headline, Sub-headline, 3 Value Props, Social Proof snippet, and primary CTA) for: '
  },

  // Slides
  {
    id: 'slide-outline',
    category: 'slides',
    title: 'Generate Keynote Slide Outline',
    description: 'Structured 7-slide presentation deck with titles, bullet points, and speaker notes.',
    icon: Presentation,
    tag: 'Keynote',
    prompt: 'Generate an interactive 7-slide executive keynote presentation outline with compelling slide titles, visual layout ideas, bullet points, and speaker notes for: '
  },
  {
    id: 'pitch-deck',
    category: 'slides',
    title: 'Investor Seed Pitch Deck',
    description: '10-slide VC presentation covering Problem, Solution, Moat, Traction, and Ask.',
    icon: TrendingUp,
    tag: 'Fundraising',
    prompt: 'Build a standard 10-slide Venture Capital investor pitch deck outline (Problem, Solution, Market Size TAM/SAM/SOM, Technology Moat, Traction, Business Model, Financial Forecast, and The Ask) for: '
  },

  // Business & Research
  {
    id: 'swot-analysis',
    category: 'business',
    title: 'SWOT & Strategic Positioning',
    description: 'Strengths, Weaknesses, Opportunities, and Threats breakdown with actionable matrix.',
    icon: Brain,
    tag: 'Strategy',
    prompt: 'Conduct a comprehensive SWOT analysis and competitive moat evaluation with actionable strategic priorities for: '
  },
  {
    id: 'system-arch',
    category: 'coding',
    title: 'Full-Stack System Architecture',
    description: 'Design resilient microservice or monolith architecture, caching, and data pipelines.',
    icon: Terminal,
    tag: 'Architecture',
    prompt: 'Design a resilient, high-throughput system architecture with database selection, caching strategy, auth flow, and API design for: '
  },
  {
    id: 'db-optimization',
    category: 'coding',
    title: 'Database Schema & Query Tuning',
    description: 'PostgreSQL/MySQL schema normalization, indexing strategy, and query performance.',
    icon: Code2,
    tag: 'Database',
    prompt: 'Design an optimized relational database schema with foreign keys, index strategies, and performant SQL queries for: '
  },
  {
    id: 'b2b-outreach',
    category: 'writing',
    title: 'Executive B2B Cold Outreach',
    description: 'High-converting personalized email sequences tailored for decision-makers.',
    icon: FileText,
    tag: 'Outreach',
    prompt: 'Write a compelling, concise 3-email B2B outreach sequence with irresistible hook, value proposition, social proof, and low-friction CTA for: '
  },
  {
    id: 'saas-metrics',
    category: 'business',
    title: 'SaaS Unit Economics & Projections',
    description: 'CAC, LTV, MRR/ARR churn model, and 3-year financial forecasts.',
    icon: TrendingUp,
    tag: 'Finance',
    prompt: 'Develop a financial model breakdown for a high-growth tech business including CAC/LTV benchmarks, gross margin assumptions, and revenue projections for: '
  },
  {
    id: 'deep-research-topic',
    category: 'research',
    title: 'Deep Multi-Source Research',
    description: 'Exhaustive technological and market investigation with verifiable telemetry.',
    icon: Zap,
    tag: 'Intelligence',
    prompt: 'Conduct an exhaustive deep research investigation on 2026 technological breakthroughs, market telemetry, and competitive benchmarking for: '
  }
];

interface PromptTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (prompt: string, immediateSend?: boolean) => void;
  isLightMode?: boolean;
}

export const PromptTemplatesModal: React.FC<PromptTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  isLightMode = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'coding', label: '💻 Coding & Tech' },
    { id: 'writing', label: '✍️ Writing & Content' },
    { id: 'slides', label: '📊 Slide Outlines' },
    { id: 'business', label: '📈 Business Strategy' },
    { id: 'research', label: '🔬 Research' }
  ];

  const filteredTemplates = PROMPT_TEMPLATES.filter(tpl => {
    const matchesCat = selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesSearch = 
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden border shadow-2xl transition-all ${
            isLightMode 
              ? 'bg-white border-slate-200 text-slate-800' 
              : 'bg-[#100e1b] border-purple-500/30 text-white'
          }`}
          style={{
            boxShadow: isLightMode 
              ? '0 25px 60px rgba(0,0,0,0.15)' 
              : '0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(168,85,247,0.15)'
          }}
        >
          {/* Header */}
          <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
            isLightMode ? 'border-slate-100 bg-slate-50/70' : 'border-white/[0.08] bg-white/[0.02]'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold">One-Click AI Prompt Templates</h3>
                <p className={`text-xs ${isLightMode ? 'text-slate-500' : 'text-neutral-400'}`}>
                  Pre-crafted, high-fidelity prompt templates. Click to use instantly without overthinking.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isLightMode ? 'hover:bg-slate-100 text-slate-400 hover:text-slate-700' : 'hover:bg-white/[0.06] text-neutral-400 hover:text-white'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Category Filter Pills */}
          <div className={`p-4 border-b space-y-3 ${isLightMode ? 'border-slate-100 bg-white' : 'border-white/[0.06] bg-[#0c0a15]'}`}>
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompt templates (e.g., refactor, blog post, pitch deck)..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none transition-all ${
                  isLightMode
                    ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-purple-500'
                    : 'bg-[#151324] border-white/10 text-white placeholder-neutral-500 focus:border-purple-500/50'
                }`}
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : isLightMode
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {filteredTemplates.length === 0 ? (
              <div className="py-12 text-center text-neutral-500">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No prompt templates match your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredTemplates.map(tpl => {
                  const Icon = tpl.icon;
                  return (
                    <div
                      key={tpl.id}
                      className={`group p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isLightMode
                          ? 'bg-slate-50 hover:bg-white border-slate-200 hover:border-purple-400 hover:shadow-lg'
                          : 'bg-[#141221] hover:bg-[#181529] border-white/[0.07] hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.12)]'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <h4 className="text-sm font-bold leading-tight">{tpl.title}</h4>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 font-semibold shrink-0">
                            {tpl.tag}
                          </span>
                        </div>
                        <p className={`text-xs mb-3 line-clamp-2 ${isLightMode ? 'text-slate-600' : 'text-neutral-400'}`}>
                          {tpl.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.06]">
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            navigator.clipboard.writeText(tpl.prompt);
                            setCopiedId(tpl.id);
                            setTimeout(() => setCopiedId(null), 1800);
                          }}
                          className={`text-xs font-medium px-2 py-1 rounded transition-colors cursor-pointer ${
                            copiedId === tpl.id 
                              ? 'text-emerald-400' 
                              : isLightMode ? 'text-slate-500 hover:text-slate-800' : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          {copiedId === tpl.id ? 'Copied ✓' : 'Copy'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            onSelectTemplate(tpl.prompt, false);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          <span>Use Template</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
