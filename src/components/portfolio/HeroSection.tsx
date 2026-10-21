import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Store,
  Boxes,
  Cpu,
  FileText,
  Mail,
  ShieldCheck,
  Zap,
  Terminal,
  Activity,
  ChevronDown
} from 'lucide-react';
import { soundFX } from './SoundFX';

interface HeroSectionProps {
  onSwitchPortal: (portal: 'customer' | 'crm') => void;
  onOpenResume: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSwitchPortal,
  onOpenResume,
  onShowToast
}) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background Ambient Mesh & Grids */}
      <div className="absolute inset-0 bg-radial-mesh pointer-events-none" />
      <div className="absolute inset-0 bg-tech-grid opacity-60 pointer-events-none" />

      {/* Floating Neon Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Availability Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-950/30">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-200 tracking-wide">
              Available for Senior / Staff Roles &amp; High-Impact Consulting
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-3">
            <span className="font-mono text-xs md:text-sm tracking-widest text-cyan-400 uppercase font-semibold">
              // Senior Full-Stack &amp; Generative AI Systems Architect
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Engineering Intelligent,{' '}
            <span className="text-gradient-cyan block sm:inline">
              High-Throughput Systems
            </span>{' '}
            That Scale.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Senior Full-Stack Engineer &amp; AI Systems Architect specializing in distributed backends, real-time event infrastructure, and multi-agent AI decision engines. Creator of <strong className="text-white">OmniCommerce Hub</strong>, <strong className="text-white">NeuroFlow</strong>, and resilient cloud platforms.
          </p>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
            <a
              href="#projects"
              onClick={() => soundFX.playClick()}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-cyan-950/50 hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Featured Projects</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>

            <a
              href="#about"
              onClick={() => soundFX.playClick()}
              className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-bold text-sm shadow-lg transition-all"
            >
              <span>About Vish</span>
            </a>

            <a
              href="#ai-sandbox"
              onClick={() => soundFX.playClick()}
              className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-400 font-semibold text-sm shadow-lg transition-all"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Try AI Digital Twin</span>
            </a>

            <button
              onClick={() => {
                soundFX.playClick();
                onOpenResume();
              }}
              className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 font-semibold text-sm transition-all"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>View Resume</span>
            </button>
          </div>

          {/* Core Tech Stack Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-16">
            {[
              'React 19 & Modern Vanilla CSS',
              'Node.js & Express',
              'TypeScript Strict',
              'Google Gemini 2.0 AI Agents',
              'WebSockets (<45ms)',
              'Distributed Google Sheets Sync',
              'Event-Driven Architecture',
              'Docker & Cloud Systems'
            ].map((tech) => (
              <span
                key={tech}
                className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 font-mono hover:border-cyan-500/30 hover:text-cyan-300 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Live Architectural Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="glass-card p-5 rounded-2xl border border-white/[0.08] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-colors" />
            <div className="flex items-center space-x-2 text-cyan-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">High Availability</span>
            </div>
            <div className="text-3xl font-black text-white font-mono mb-1">99.99%</div>
            <p className="text-xs text-slate-400 leading-snug">
              Resilient zero-loss failover architecture across all microservices
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/[0.08] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
            <div className="flex items-center space-x-2 text-indigo-400 mb-2">
              <Zap className="w-4 h-4" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Bi-Directional Latency</span>
            </div>
            <div className="text-3xl font-black text-white font-mono mb-1">&lt; 45ms</div>
            <p className="text-xs text-slate-400 leading-snug">
              Real-time WebSocket telemetry, customer chat &amp; order stream
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/[0.08] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors" />
            <div className="flex items-center space-x-2 text-purple-400 mb-2">
              <Cpu className="w-4 h-4" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Autonomous AI Loops</span>
            </div>
            <div className="text-3xl font-black text-white font-mono mb-1">15+</div>
            <p className="text-xs text-slate-400 leading-snug">
              Automated dispute resolutions, inventory balancing &amp; tool dispatch
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/[0.08] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <Activity className="w-4 h-4" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Persistent Sync</span>
            </div>
            <div className="text-3xl font-black text-white font-mono mb-1">100k+</div>
            <p className="text-xs text-slate-400 leading-snug">
              Operations synced with Google Sheets engine without data collisions
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 flex justify-center">
          <a
            href="#projects"
            onClick={() => soundFX.playClick()}
            className="flex flex-col items-center text-slate-500 hover:text-cyan-400 transition-colors text-xs font-mono"
          >
            <span>DISCOVER SYSTEMS</span>
            <ChevronDown className="w-4 h-4 animate-bounce mt-1" />
          </a>
        </div>
      </div>
    </section>
  );
};
