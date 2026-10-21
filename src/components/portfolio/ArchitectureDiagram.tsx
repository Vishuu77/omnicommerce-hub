import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  Server,
  Cpu,
  Database,
  Radio,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Bot,
  Cog,
  Wrench,
  Workflow
} from 'lucide-react';
import { soundFX } from './SoundFX';

interface TierNode {
  id: string;
  name: string;
  subtitle: string;
  tech: string[];
  latency: string;
  resilience: string;
  details: string;
}

export const ArchitectureDiagram: React.FC = () => {
  const [activeTier, setActiveTier] = useState<string>('tier-2');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);

  const tiers: TierNode[] = [
    {
      id: 'tier-1',
      name: 'Agentic Orchestration & Planning',
      subtitle: 'Hierarchical Task Decomposition & Master Prompts',
      tech: ['Claude Code', 'Hermes Agent', 'OpenClaw', 'DeepSeek Harness', 'Master Prompt Architecture'],
      latency: '< 1.2s intent decomposition',
      resilience: 'Goal decomposition into specialized sub-agents with strict output boundaries and self-healing retries',
      details: 'Acts as the master system orchestrator. Shifts from manual boilerplate writing to decomposing user intent across autonomous sub-agents with defined responsibility domains.'
    },
    {
      id: 'tier-2',
      name: 'Tooling & Model Context Protocol (MCP)',
      subtitle: 'Modular Context, Skill Standardization & Obsidian Brain',
      tech: ['MCP Servers', 'Custom Connectors', 'Reusable .md Skills', 'Obsidian Vault', 'n8n Automations'],
      latency: '< 45ms tool dispatch',
      resilience: 'Standardized skill schemas, persistent graph memory, deterministic parameter verification',
      details: 'Connects isolated LLMs to the physical world and local environments. Reusable .md skill files standardize behavior while Obsidian Second Brain provides persistent context across sessions.'
    },
    {
      id: 'tier-3',
      name: 'Autonomous Loops & Execution Engine',
      subtitle: 'Unattended Cron Automations & Real-Time Sync',
      tech: ['Unattended Cron Jobs', 'LangGraph Loops', 'Python Sandbox', 'WebSockets (<45ms)', 'Google Sheets Engine'],
      latency: '< 50ms WebSocket telemetry',
      resilience: 'Zero write collision file-locks, background heartbeat watchdog, sandboxed AST-validated execution',
      details: 'Executes automated data science pipelines, real-time e-commerce state sync (OmniCommerce Hub), and recurring operations cron jobs without human babysitting.'
    },
    {
      id: 'tier-4',
      name: 'Cyber-Physical Hardware & Manufacturing',
      subtitle: '3D Parametric CAD, 6-DOF AgriBot & B2B Localization',
      tech: ['Autodesk Fusion 360', 'Raspberry Pi Pico', 'ESP32-CAM', 'Johnson DC Motors', 'DFM Sheet Metal', 'Machining'],
      latency: 'Real-time motor loop (sub-10ms)',
      resilience: 'Ultrasonic depth profiling, vertical travel limits, reverse-engineered localized domestic components',
      details: 'Bridges digital code with the physical world. Translates specifications into 3D CAD mechanical assemblies, shop-floor manufacturing blueprints at Venttup, and grant-funded AgriBot mobile robotics.'
    }
  ];

  const currentTierData = tiers.find((t) => t.id === activeTier) || tiers[1];

  const handleSimulateTrace = () => {
    soundFX.playClick();
    setIsSimulating(true);
    setSimulationStep(1);
    setActiveTier('tier-1');

    const sequence = [
      { step: 1, tier: 'tier-1', delay: 700 },
      { step: 2, tier: 'tier-2', delay: 1500 },
      { step: 3, tier: 'tier-3', delay: 2300 },
      { step: 4, tier: 'tier-4', delay: 3100 }
    ];

    sequence.forEach((item) => {
      setTimeout(() => {
        setSimulationStep(item.step);
        setActiveTier(item.tier);
        soundFX.playClick();
        if (item.step === 4) {
          setTimeout(() => {
            soundFX.playSuccess();
            setIsSimulating(false);
          }, 800);
        }
      }, item.delay);
    });
  };

  return (
    <section id="architecture" className="py-24 sm:py-32 border-b border-black/10 bg-[#f4f4f4] relative">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-16 pb-6 border-b border-black/10">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              // 03 &mdash; Cyber-Physical Architecture Blueprint
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-black tracking-tighter">
              System Blueprint.
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={handleSimulateTrace}
              disabled={isSimulating}
              className="px-4 py-2 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all inline-flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Traced Step {simulationStep} / 4...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Simulate End-to-End Pipeline</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4-Tier Interactive Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tiers.map((tier, idx) => {
            const isCurrent = activeTier === tier.id;
            const isStepActive = isSimulating && simulationStep === idx + 1;

            return (
              <div
                key={tier.id}
                onClick={() => {
                  soundFX.playClick();
                  setActiveTier(tier.id);
                }}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isCurrent || isStepActive
                    ? 'bg-black text-white border-black shadow-xl -translate-y-1'
                    : 'bg-white text-black border-black/10 hover:border-black/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold tracking-wider opacity-60">
                      LAYER 0{idx + 1}
                    </span>
                    {(isCurrent || isStepActive) && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>

                  <h3 className="text-lg font-black tracking-tight mb-1">
                    {tier.name}
                  </h3>
                  <p className={`text-xs leading-relaxed line-clamp-2 ${isCurrent ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    {tier.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-current/10 flex items-center justify-between text-[11px] font-mono">
                  <span>Latency:</span>
                  <span className="font-bold">{tier.latency}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Tier Deep-Dive Card */}
        <div className="bg-white rounded-3xl border border-black/10 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-black/5 gap-4">
            <div>
              <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-1">
                Active Architectural Inspector
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                {currentTierData.name}
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                {currentTierData.subtitle}
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs font-mono">
              <div className="px-3 py-1 rounded-full bg-neutral-100 border border-black/10 text-black font-bold">
                ⚡ {currentTierData.latency}
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
            {currentTierData.details}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Tech Stack Matrix */}
            <div className="p-5 rounded-2xl bg-neutral-50 border border-black/10 space-y-3">
              <div className="text-xs font-mono font-bold text-neutral-500 uppercase">
                Technologies &amp; Frameworks
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentTierData.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-md bg-white border border-black/10 text-xs font-mono font-bold text-black shadow-2xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Resilience & Fault Tolerance */}
            <div className="p-5 rounded-2xl bg-neutral-50 border border-black/10 space-y-3">
              <div className="text-xs font-mono font-bold text-neutral-500 uppercase">
                Resilience &amp; Fail-Safe Policy
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed font-normal">
                {currentTierData.resilience}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
