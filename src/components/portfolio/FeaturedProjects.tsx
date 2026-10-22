import React, { useState } from 'react';
import {
  ExternalLink,
  Store,
  Boxes,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity,
  Code2,
  Terminal,
  Database,
  Award,
  Bot,
  Wrench,
  BarChart3
} from 'lucide-react';
import { ProjectData, ProjectDetailModal } from './ProjectDetailModal';
import { soundFX } from './SoundFX';
import { PORTFOLIO_IMAGES } from '../../config/portfolioImages';

interface FeaturedProjectsProps {
  onSwitchPortal?: (portal: 'customer' | 'crm') => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ onSwitchPortal }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const projects: (ProjectData & { image: string; number: string })[] = [
    {
      id: 'agribot-6dof',
      number: '01',
      image: PORTFOLIO_IMAGES.agribotShowcase,
      title: 'AgriBot — 6-DOF Agricultural Mobile Robot',
      subtitle: 'Grant-funded 6-Degree-of-Freedom agricultural mobile robot engineered for automated sapling plantation and high-precision vertical soil drilling.',
      category: 'Robotics & Embedded Hardware',
      badge: 'Grant-Funded Flagship (SRPP 2025–26)',
      gradient: 'from-emerald-500/10 to-transparent',
      metrics: [
        { label: 'Degrees of Freedom', value: '6-DOF', desc: 'Precision vertical articulation and mobile 4WD platform' },
        { label: 'Grant Status', value: 'Awarded', desc: 'Student Research Project Programme 2025–26 seed funding' },
        { label: 'Recognition', value: '59th Eng Day', desc: 'Honored by The Institution of Engineers (India) - Karnataka' }
      ],
      description: 'Engineered a specialized 6-Degree-of-Freedom mobile robotics platform designed to automate physical sapling plantation, depth-controlled soil drilling, and field navigation. Built with a 4-DC-motor mobile drivetrain and a high-torque Johnson motor driving a vertical drill mechanism.',
      architectureHighlights: [
        'Mechatronic Integration: Raspberry Pi Pico paired with ESP32-CAM for low-latency motor control and visual feed monitoring.',
        'Sensor-Driven Vertical Drill: Replaced complex IMU dependencies with ultrasonic depth profiling, vision cues, and vertical-travel limit sensors.',
        'Agentic Firmware Generation: Firmware routines generated and iteratively optimized through an LLM agentic architecture for deterministic motor sequencing.',
        'Rugged Field Drivetrain: Custom mechanical assemblies drafted in Autodesk Fusion 360 to withstand continuous outdoor agricultural shock.'
      ],
      keyChallenges: [
        {
          challenge: 'Achieving consistent vertical soil drilling torque without motor stall in varied soil densities.',
          solution: 'Implemented a high-torque Johnson motor with vertical lead-screw guide rails and closed-loop current sensing via Raspberry Pi Pico.'
        },
        {
          challenge: 'Eliminating costly IMU drift in open agricultural fields without satellite RTK corrections.',
          solution: 'Engineered a sensor array using ultrasonic ground profiling, visual alignment via ESP32-CAM, and vertical travel limit switches.'
        }
      ],
      techStack: ['Raspberry Pi Pico', 'ESP32-CAM', 'Autodesk Fusion 360', 'Johnson DC Motors', 'Ultrasonic Sensors', 'Embedded C/C++', 'Agentic Firmware'],
      githubUrl: 'https://github.com/Vishuu77/RAI-'
    },
    {
      id: 'one-man-agentic-os',
      number: '02',
      image: PORTFOLIO_IMAGES.agenticOsShowcase,
      title: 'One-Man Agentic OS — Multi-Agent System',
      subtitle: 'Personal autonomous operating system powered by specialized AI agent crews that collaborate to take complex software, firmware, and data tasks from intent to delivery.',
      category: 'Agentic AI & Orchestration',
      badge: 'Hierarchical Crew & Shared Memory',
      gradient: 'from-indigo-500/10 to-transparent',
      metrics: [
        { label: 'Execution Mode', value: 'Zero-Syntax', desc: 'Shift from manual boilerplate to system architect orchestration' },
        { label: 'Knowledge Base', value: 'Obsidian Vault', desc: 'Persistent Second Brain maintaining deterministic context' },
        { label: 'Automation', value: 'Unattended Crons', desc: 'Self-executing cron jobs for recurring background tasks' }
      ],
      description: 'A personal agentic operating system where goals are decomposed across specialized sub-agents orchestrated via low-code/no-code runtimes (Claude, Hermes Agent, OpenClaw, DeepSeek Harness). Governed by standardized .md skill definitions and an Obsidian Second Brain.',
      architectureHighlights: [
        'Hierarchical Task Delegation: Master planner orchestrates specialized sub-agents with strict handoff protocols and feedback loops.',
        'Modular Skill (.md) Architecture: Standardized operational instructions stored as modular markdown files for high-consistency agent behavior.',
        'Model Context Protocol (MCP) Integration: Connects isolated LLMs directly to local databases, file systems, and external APIs.',
        'Persistent Obsidian Context Vault: Dynamic memory graph allowing agents to recall project architecture and historical decisions across sessions.'
      ],
      keyChallenges: [
        {
          challenge: 'Preventing agent context drift and hallucination across multi-day, multi-step projects.',
          solution: 'Architected structured .md skill files and master prompt constraints with strict JSON validation gates before tool execution.'
        },
        {
          challenge: 'Orchestrating disparate AI models (Claude, Hermes, DeepSeek) under a unified control interface.',
          solution: 'Built a standardized MCP connector layer and unattended cron automation harness to dispatch tasks based on model reasoning strengths.'
        }
      ],
      techStack: ['Claude Code', 'Hermes Agent', 'OpenClaw', 'MCP Servers', 'Obsidian', 'LangGraph', 'Python', 'Unattended Crons'],
      githubUrl: 'https://github.com/Vishuu77/agentic-os'
    },
    {
      id: 'omnicommerce-hub',
      number: '03',
      image: PORTFOLIO_IMAGES.omnicommerceShowcase,
      title: 'OmniCommerce Hub & AI Operations Harness',
      subtitle: 'Production-ready dual-interface shopping platform replicating Amazon & Flipkart checkout synchronized in real-time with an enterprise employee fulfillment CRM.',
      category: 'Distributed Full-Stack & AI Prototype',
      badge: 'Live Interactive System',
      gradient: 'from-orange-500/10 to-transparent',
      metrics: [
        { label: 'Sync Latency', value: '< 50ms', desc: 'Real-time WebSocket event dispatch across customer and CRM actors' },
        { label: 'Data Durability', value: '100%', desc: 'Google Sheets CSV engine with transactional file-lock safety' },
        { label: 'Agent Routing', value: 'Automated', desc: 'Autonomous CRM dispute and returns resolution pipeline' }
      ],
      description: 'Engineered a dual-portal enterprise platform bridging consumer retail checkout with an operations back-office. Connects front-end operational interfaces directly to background LLM agents via MCP and webhook triggers to automate customer data handling, inventory adjustments, and returns.',
      architectureHighlights: [
        'Dual-Actor Event Synchronization: Live customer orders immediately trigger audio-visual dispatch alerts in the employee CRM portal.',
        'Google Sheets Distributed Engine: Custom CSV synchronization engine with in-memory transactional cache and atomic disk flushes.',
        'OTP Phone Authentication Guard: Session-based verification with built-in multi-persona demo profile selector.',
        'Autonomous Dispute Resolution: AI-driven returns adjudication assessing product compliance against financial policy thresholds.'
      ],
      keyChallenges: [
        {
          challenge: 'Preventing concurrent write race conditions on file-based persistence under multiple browser sessions.',
          solution: 'Implemented an atomic serialization lock queue and in-memory cache with debounced writes, ensuring zero corruptions.'
        },
        {
          challenge: 'Synchronizing customer checkout state with live warehouse CRM telemetry without page reloads.',
          solution: 'Built a bi-directional WebSocket broker multiplexing order updates, tracking milestones, and typing telemetry.'
        }
      ],
      techStack: ['React 19', 'TypeScript', 'Node.js', 'Express', 'WebSockets', 'Google Sheets DB', 'Streamlit', 'MCP Webhooks'],
      githubUrl: 'https://github.com/Vishuu77/omnicommerce-hub',
      liveActions: { customerPortal: true, crmPortal: true }
    },
    {
      id: 'nocode-datascience-agent',
      number: '04',
      image: PORTFOLIO_IMAGES.dataScienceAgentShowcase,
      title: 'No-Code Data Science Engineer Agent',
      subtitle: 'Autonomous AI agent capable of executing end-to-end data science workflows—from raw data ingestion and statistical distribution analysis to insight generation.',
      category: 'Data Science & Agentic Loops',
      badge: 'Intent-Driven Execution Loop',
      gradient: 'from-purple-500/10 to-transparent',
      metrics: [
        { label: 'Workflow Automation', value: '100%', desc: 'Ingestion, cleaning, statistical profiling, and automated visualization' },
        { label: 'Code Required', value: 'Zero', desc: 'Natural language problem definitions converted to validated analytics' },
        { label: 'Interface', value: 'Streamlit UI', desc: 'Interactive parameter controls, charting, and executive summary exports' }
      ],
      description: 'Abstracts away programming syntax barriers by pairing LLM reasoning loops with automated execution harnesses. Users provide raw datasets (CSV, JSON, SQL) and natural language questions; the agent autonomously writes, executes, validates, and charts rigorous statistical analyses.',
      architectureHighlights: [
        'Automated Exploratory Data Analysis (EDA): Computes correlations, detects outliers, and visualizes distributions autonomously.',
        'Self-Healing Code Execution: Sandboxed Python code generation with AST validation and automatic error retry loops.',
        'Multi-Format Visual Outputs: Exports interactive charts, tabular summaries, and natural-language executive briefs.',
        'Modular Analytics Tools: Connects to specialized statistical packages and vector memory via MCP tools.'
      ],
      keyChallenges: [
        {
          challenge: 'Ensuring generated data processing scripts execute without memory overflows on large datasets.',
          solution: 'Implemented chunked pandas/polars processing guards and sandboxed subprocess execution with resource quotas.'
        },
        {
          challenge: 'Translating open-ended exploratory queries into statistically valid hypothesis tests.',
          solution: 'Designed a structured multi-phase prompt architecture guiding the LLM from hypothesis formulation to test execution.'
        }
      ],
      techStack: ['Python', 'Streamlit', 'Pandas', 'LangGraph', 'Statistical Modeling', 'MCP Connectors', 'AST Validation'],
      githubUrl: 'https://github.com/Vishuu77/Machine-Learning-Data-Science-Projects-'
    },
    {
      id: 'b2b-cad-localization',
      number: '05',
      image: PORTFOLIO_IMAGES.cadShowcase,
      title: 'B2B Engineering 3D Designs & Localization Suite',
      subtitle: 'Production-ready 2D drafts, 3D parametric models, and mechanical assemblies built in Autodesk Fusion 360 for heavy engineering at Venttup Ventures.',
      category: '3D CAD & B2B Manufacturing',
      badge: 'Design for Manufacturability (DFM)',
      gradient: 'from-amber-500/10 to-transparent',
      metrics: [
        { label: 'Software', value: 'Fusion 360', desc: '2D drafting, 3D parametric modeling, and tolerance stack-ups' },
        { label: 'Scope', value: 'B2B Sourcing', desc: 'Supplier shop-floor assessments, machining, fabrication, sheet metal' },
        { label: 'Impact', value: 'Localization', desc: 'Hardware indigenization reducing import dependence and lead times' }
      ],
      description: 'Delivered at Venttup Ventures Private Limited (Bengaluru). Translates high-profile client industrial specifications into localized, shop-floor-ready designs optimized for domestic sheet-metal, fabrication, and machining supply chains. Cross-functional collaboration across Localization, Procurement, Heavy Engineering, NPD, and R&D.',
      architectureHighlights: [
        'Design for Manufacturability (DFM): Engineered parametric sheet-metal enclosures and precision CNC-machined components.',
        'Hardware Indigenization: Reverse-engineered and adapted foreign component specs to match domestic Indian manufacturing standards.',
        'Shop-Floor Validation: Conducted on-site supplier assessments verifying machining tolerances, welding quality, and finishing.',
        'Tender & Bid Documentation: Authored detailed bill of materials (BOM), tolerance sheets, and fabrication blueprints for tender submissions.'
      ],
      keyChallenges: [
        {
          challenge: 'Adapting imported hardware components to local Indian supplier tooling without sacrificing structural integrity.',
          solution: 'Re-engineered parametric geometry in Autodesk Fusion 360, selecting standardized domestic steel grades and sheet gauges.'
        },
        {
          challenge: 'Bridging engineering tolerance requirements with real-world supplier shop-floor capabilities.',
          solution: 'Conducted on-site supplier shop-floor audits and established pragmatic GD&T standards that eliminated manufacturing rejections.'
        }
      ],
      techStack: ['Autodesk Fusion 360', '3D Parametric CAD', 'DFM Analysis', 'Sheet Metal & Fabrication', 'CNC Machining', 'B2B Sourcing', 'Bill of Materials (BOM)'],
      githubUrl: 'https://github.com/Vishuu77/DESIGN-'
    }
  ];

  return (
    <section id="projects" className="py-24 sm:py-32 border-b border-black/10 bg-[#f4f4f4] relative">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-16 pb-6 border-b border-black/10">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              // 02 &mdash; Selected Works &amp; Flagship Cases
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-black tracking-tighter">
              Featured Cases.
            </h2>
          </div>
          <p className="text-sm font-mono text-neutral-600 max-w-md mt-4 md:mt-0">
            Selected engineering cases across Agentic AI, Grant-Funded Robotics, OmniCommerce, and B2B Manufacturing.
          </p>
        </div>

        {/* 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col justify-between bg-white rounded-3xl border border-black/10 overflow-hidden hover:border-black/40 hover:shadow-2xl transition-all duration-300"
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 border-b border-black/10">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Top Overlay Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-mono font-bold">
                      [{project.number}]
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-black border border-black/10 text-[10px] font-mono font-bold shadow-sm">
                      {project.badge}
                    </span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-8 sm:p-10 space-y-4">
                  <div className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest">
                    {project.category}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight group-hover:underline underline-offset-4">
                    {project.title}
                  </h3>

                  <p className="text-sm text-neutral-700 leading-relaxed font-normal">
                    {project.subtitle}
                  </p>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-3 gap-2 pt-4 pb-2 border-t border-b border-black/5">
                    {project.metrics.map((m, mIdx) => (
                      <div key={mIdx}>
                        <div className="text-xs font-mono text-neutral-500">{m.label}</div>
                        <div className="text-sm sm:text-base font-black text-black">{m.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-neutral-100 border border-black/10 text-neutral-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="p-8 sm:p-10 pt-0 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedProject(project);
                  }}
                  className="px-5 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors inline-flex items-center space-x-1.5"
                >
                  <span>Read Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Direct GitHub Source Code Repository Link */}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => soundFX.playClick()}
                    className="px-4 py-2.5 rounded-full border border-black/20 hover:border-black text-black text-xs font-bold transition-colors inline-flex items-center space-x-1"
                    title={`View ${project.title} source code on GitHub`}
                  >
                    <Code2 className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Source Code ↗</span>
                  </a>
                )}

                {/* For OmniCommerce Hub, render direct links to customer-portal and employee-crm */}
                {project.id === 'omnicommerce-hub' && (
                  <>
                    <a
                      href="/customer-portal.html"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => soundFX.playClick()}
                      className="px-4 py-2.5 rounded-full border border-black/20 hover:border-black text-black text-xs font-bold transition-colors inline-flex items-center space-x-1"
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Customer Portal ↗</span>
                    </a>

                    <a
                      href="/employee-crm.html"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => soundFX.playClick()}
                      className="px-4 py-2.5 rounded-full border border-black/20 hover:border-black text-black text-xs font-bold transition-colors inline-flex items-center space-x-1"
                    >
                      <Boxes className="w-3.5 h-3.5" />
                      <span>Employee CRM ↗</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSwitchPortal={onSwitchPortal || (() => {})}
      />
    </section>
  );
};
