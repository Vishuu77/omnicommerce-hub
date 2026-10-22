import React from 'react';
import {
  X,
  ExternalLink,
  Store,
  Boxes,
  Cpu,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Code2,
  Server,
  Database
} from 'lucide-react';
import { soundFX } from './SoundFX';

export interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  gradient: string;
  metrics: { label: string; value: string; desc: string }[];
  description: string;
  architectureHighlights: string[];
  keyChallenges: { challenge: string; solution: string }[];
  techStack: string[];
  githubUrl?: string;
  liveActions?: {
    customerPortal?: boolean;
    crmPortal?: boolean;
    sandboxLink?: string;
  };
}

interface ProjectDetailModalProps {
  project: ProjectData | null;
  onClose: () => void;
  onSwitchPortal: (portal: 'customer' | 'crm') => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onSwitchPortal
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
        onClick={() => {
          soundFX.playClick();
          onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#0c101a] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/50 overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {project.category}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              // ARCHITECTURAL CASE STUDY
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFX.playClick()}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold transition-all"
                title="View repository on GitHub"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>GitHub Repo ↗</span>
              </a>
            )}
            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          {/* Title & Tagline */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              {project.title}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {project.subtitle}
            </p>
          </div>

          {/* Live Action Buttons (if applicable) */}
          {(project.liveActions || project.githubUrl) && (
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mr-2">
                Actions &amp; Code:
              </span>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFX.playClick()}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 font-bold text-xs shadow-md transition-all"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>View GitHub Repository ↗</span>
                </a>
              )}
              {project.liveActions?.customerPortal && (
                <a
                  href="/customer-portal.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFX.playSuccess()}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Launch Customer Portal ↗</span>
                </a>
              )}
              {project.liveActions?.crmPortal && (
                <a
                  href="/employee-crm.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFX.playSuccess()}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Boxes className="w-3.5 h-3.5" />
                  <span>Launch Back-Office CRM ↗</span>
                </a>
              )}
              {project.liveActions?.sandboxLink && (
                <a
                  href={project.liveActions.sandboxLink}
                  onClick={() => {
                    soundFX.playClick();
                    onClose();
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-all"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Test in Live AI Sandbox</span>
                </a>
              )}
            </div>
          )}

          {/* Key Metrics Grid */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">
              // PRODUCTION PERFORMANCE BENCHMARKS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {project.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between"
                >
                  <div className="text-xl font-black text-cyan-400 font-mono mb-1">
                    {m.value}
                  </div>
                  <div className="text-xs font-bold text-white mb-0.5">{m.label}</div>
                  <div className="text-[11px] text-slate-400 leading-snug">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Architectural Overview */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">
              // SYSTEM ARCHITECTURE & DESIGN HIGHLIGHTS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.architectureHighlights.map((arch, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{arch}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Engineering Challenges & Solutions */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">
              // COMPLEX CHALLENGES & TECHNICAL SOLUTIONS
            </h3>
            <div className="space-y-3">
              {project.keyChallenges.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center space-x-2 text-amber-400 font-bold">
                    <span className="font-mono text-[10px] uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Challenge {idx + 1}
                    </span>
                    <span>{item.challenge}</span>
                  </div>
                  <p className="text-slate-300 pl-4 border-l-2 border-cyan-500/40 leading-relaxed">
                    <strong className="text-cyan-300">Solution: </strong>
                    {item.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">
              // TECHNOLOGIES & PROTOCOLS UTILIZED
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Designed &amp; Architected by Vish
          </span>
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Close Case Study
          </button>
        </div>
      </div>
    </div>
  );
};
