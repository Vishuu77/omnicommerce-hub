import React, { useState } from 'react';
import {
  Code2,
  Cpu,
  Server,
  Database,
  Terminal,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Bot,
  Cog,
  Wrench,
  Workflow
} from 'lucide-react';
import { soundFX } from './SoundFX';

interface SkillItem {
  number: string;
  name: string;
  category: 'ai' | 'automation' | 'hardware' | 'manufacturing';
  level: number; // 0-100
  experience: string;
  tag: string;
  highlight: string;
  metrics: string;
}

export const SkillsBento: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'ai' | 'automation' | 'hardware' | 'manufacturing'>('all');

  const skills: SkillItem[] = [
    {
      number: '01',
      name: 'Agentic AI & Multi-Agent Orchestration',
      category: 'ai',
      level: 98,
      experience: 'Core Focus',
      tag: 'Hierarchical Crews',
      highlight: 'Decomposes complex engineering workflows into specialized sub-agents with master prompt architectures and zero-manual-syntax execution.',
      metrics: 'Claude • Hermes Agent • OpenClaw • DeepSeek Harness'
    },
    {
      number: '02',
      name: 'Model Context Protocol (MCP) & Tool Loops',
      category: 'automation',
      level: 96,
      experience: 'Production Lead',
      tag: 'End-to-End Tools',
      highlight: 'Designs MCP servers, custom connectors, and API hooks that wire LLMs directly to local databases, code compilers, and SaaS backends.',
      metrics: 'Custom MCP Servers • Connectors • Plugins'
    },
    {
      number: '03',
      name: 'Autodesk Fusion 360 & 3D Parametric CAD',
      category: 'manufacturing',
      level: 95,
      experience: 'Venttup Trained',
      tag: 'Industrial DFM',
      highlight: 'Builds production-ready 2D drafts, 3D parametric models, and mechanical assemblies optimized for sheet metal, fabrication, and machining.',
      metrics: 'Parametric CAD • DFM Sheet Metal • Tolerance Stack-Up'
    },
    {
      number: '04',
      name: 'Robotics & Embedded Mechatronics',
      category: 'hardware',
      level: 94,
      experience: 'Grant Winner',
      tag: 'Grant-Funded 6-DOF',
      highlight: 'Engineered AgriBot: 4WD mobile drivetrain, high-torque Johnson motor drill, Raspberry Pi Pico, and ESP32-CAM with agentic firmware routines.',
      metrics: 'Pico • ESP32-CAM • Johnson Motors • Ultrasonic Sensors'
    },
    {
      number: '05',
      name: 'Unattended Cron Automations & n8n',
      category: 'automation',
      level: 95,
      experience: 'Learner\'s Byte',
      tag: 'Zero-Touch Ops',
      highlight: 'Configures self-running background cron jobs, n8n multi-step webhooks, and automated operational pipelines eliminating manual bottlenecks.',
      metrics: 'Unattended Crons • n8n Pipelines • Scheduled Loops'
    },
    {
      number: '06',
      name: 'B2B Manufacturing & Hardware Localization',
      category: 'manufacturing',
      level: 92,
      experience: 'Venttup Ventures',
      tag: 'Supply Chain & Sourcing',
      highlight: 'Conducted on-site supplier shop-floor audits (machining, fabrication), hardware indigenization, and tender/bid documentation.',
      metrics: 'Supplier Sourcing • Shop-Floor Audits • NPD & R&D'
    },
    {
      number: '07',
      name: 'Modular Skills (.md) & Obsidian Second Brain',
      category: 'ai',
      level: 97,
      experience: 'Standardized',
      tag: 'Knowledge Vault',
      highlight: 'Authors standardized .md skill definitions and maintains an Obsidian Second Brain for deterministic, persistent context across agent sessions.',
      metrics: 'Reusable .md Skills • Obsidian Context Vaults'
    },
    {
      number: '08',
      name: 'Python, LangChain & LangGraph Systems',
      category: 'ai',
      level: 93,
      experience: 'B.E. Honours',
      tag: 'Agent State Machines',
      highlight: 'Develops intent-driven state graphs, automated exploratory data science agents, and vector database embeddings for RAG retrieval.',
      metrics: 'LangGraph • RAG • Vector DBs • Streamlit'
    }
  ];

  const filteredSkills =
    activeCategory === 'all'
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="py-24 sm:py-32 relative overflow-hidden bg-[#f4f4f4] border-b border-black/10">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-black/10 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-neutral-500 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
              <span>[ 05 / TECHNICAL MATRIX &amp; DOMAINS ]</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-black tracking-tight">
              Engineering Disciplines.
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base mt-2 max-w-xl font-normal">
              Agentic AI orchestration, Model Context Protocol (MCP), Autodesk Fusion 360, robotics, and B2B industrial manufacturing.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Disciplines' },
              { id: 'ai', label: 'Agentic AI & LLMs' },
              { id: 'automation', label: 'MCP & Automations' },
              { id: 'manufacturing', label: 'B2B Mfg & CAD' },
              { id: 'hardware', label: 'Robotics & Hardware' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  soundFX.playClick();
                  setActiveCategory(cat.id as any);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white border border-black/15 text-neutral-700 hover:text-black hover:border-black'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className="bg-white rounded-2xl border border-black/10 p-6 sm:p-7 flex flex-col justify-between group hover:border-black/40 hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Number & Category Pill */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-mono font-bold text-neutral-400 group-hover:text-black transition-colors">
                    [{skill.number}]
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border border-black/10 bg-neutral-100 text-neutral-700 font-semibold">
                    {skill.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-black mb-2 tracking-tight">
                  {skill.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-neutral-600 leading-relaxed mb-6 font-normal">
                  {skill.highlight}
                </p>
              </div>

              {/* Bottom Metrics & Tech Badges */}
              <div className="pt-4 border-t border-black/5">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-2">
                  <span>{skill.experience}</span>
                  <span className="font-bold text-black">{skill.level}% Proficiency</span>
                </div>

                <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>

                <div className="text-[10px] font-mono text-neutral-700 font-medium truncate">
                  ⚡ {skill.metrics}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
