import React from 'react';
import {
  Calendar,
  CheckCircle2,
  MapPin,
  Briefcase,
  ArrowUpRight,
  Award
} from 'lucide-react';
import { soundFX } from './SoundFX';

interface ExperienceItem {
  number: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  achievements: string[];
  technologies: string[];
}

export const ExperienceTimeline: React.FC = () => {
  const experiences: ExperienceItem[] = [
    {
      number: '01',
      role: 'AI Engineer & Assistant Operations Automation Engineer',
      company: 'Learner\'s Byte',
      period: 'May 2026 — Present',
      location: 'Hyderabad, India',
      type: 'Full-Time Engineering',
      achievements: [
        'Agentic Workflow Design: Build low-code/no-code autonomous AI agents and operations automations using Claude, Hermes Agent, OpenClaw, and DeepSeek Harness, turning manual operational bottlenecks into self-running workflows.',
        'MCP & Tool Connectivity: Wire agents directly into business tools, databases, and pipelines via Model Context Protocol (MCP) servers, plugins, and custom connectors for multi-step execution.',
        'Context & Skill Architecture: Author reusable .md skill files and master prompt structures to standardize agent behavior; maintain an Obsidian Second Brain for persistent context.',
        'Autonomous Scheduling: Configure unattended cron jobs to execute recurring background operational automations reliably.',
        'Technical Enablement: Organized and facilitated technical upskilling workshops on Claude, Salesforce Admin workflows, and AI automation tools.'
      ],
      technologies: ['Claude Code', 'Hermes Agent', 'OpenClaw', 'DeepSeek Harness', 'MCP Servers', 'Obsidian', 'Unattended Crons', 'n8n']
    },
    {
      number: '02',
      role: 'Intern — Generative AI & Agentic AI',
      company: 'Learner\'s Byte',
      period: 'Jan 2026 — May 2026',
      location: 'Hyderabad, India',
      type: 'Internship',
      achievements: [
        'Built multi-step AI workflow automations and autonomous agent pipelines using n8n.',
        'Benchmarked and evaluated generative AI models and toolsets to map optimal architectures to business use cases.',
        'Completed the Codexpert track, analyzing cross-language paradigms and structural code patterns.'
      ],
      technologies: ['n8n', 'Generative AI', 'Agent Pipelines', 'Model Benchmarking', 'Codexpert']
    },
    {
      number: '03',
      role: 'Graduate Engineering Trainee — B2B Manufacturing',
      company: 'Venttup Ventures Private Limited',
      period: 'Feb 2026 — Apr 2026',
      location: 'Bengaluru, India',
      type: 'Graduate Trainee (1 Mo Intern + 2 Mo Trainee)',
      achievements: [
        '3D CAD & Hardware Design: Designed hardware systems and 3D engineering models in Autodesk Fusion 360 for industrial manufacturing projects.',
        'Cross-Functional Operations: Collaborated across Localization, Procurement, Heavy Engineering, NPD, and R&D teams on supplier sourcing, hardware indigenization, and tender/bid execution.',
        'Shop-Floor & Client Execution: Conducted on-site supplier shop-floor assessments (machining, fabrication, sheet metal) and participated in high-profile B2B client requirement consultations.'
      ],
      technologies: ['Autodesk Fusion 360', '3D Parametric CAD', 'DFM Analysis', 'Sheet Metal & Fabrication', 'Machining', 'Hardware Indigenization', 'B2B Sourcing']
    }
  ];

  return (
    <section id="experience" className="py-24 sm:py-32 relative overflow-hidden bg-[#f4f4f4] border-b border-black/10">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-black/10 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-neutral-500 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
              <span>[ 06 / CAREER RECORD &amp; IMPACT ]</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-black tracking-tight">
              Track Record &amp; Leadership.
            </h2>
          </div>
          <p className="text-neutral-600 text-sm sm:text-base max-w-md font-normal">
            Proven engineering experience across Agentic AI Operations at Learner's Byte and B2B Industrial Manufacturing at Venttup Ventures.
          </p>
        </div>

        {/* Experience List Cards */}
        <div className="space-y-8">
          {experiences.map((exp) => (
            <div
              key={exp.number}
              className="bg-white rounded-2xl border border-black/10 p-8 sm:p-10 hover:border-black/40 hover:shadow-xl transition-all duration-300"
            >
              {/* Card Header Row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-black/5 gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-1.5">
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      [{exp.number}]
                    </span>
                    <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full border border-black/10 bg-neutral-100 text-neutral-700 font-semibold">
                      {exp.type}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                    {exp.role}
                  </h3>
                  <div className="text-sm font-semibold text-neutral-700 mt-1">
                    {exp.company}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-black/10 text-xs font-mono font-bold text-black">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{exp.period}</span>
                  </div>
                  <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-black/10 text-xs font-mono text-neutral-600">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              {/* Achievements Checklist */}
              <div className="py-6 space-y-3.5">
                {exp.achievements.map((ach, achIdx) => (
                  <div key={achIdx} className="flex items-start space-x-3.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2" />
                    <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
                      {ach}
                    </p>
                  </div>
                ))}
              </div>

              {/* Technology Tags */}
              <div className="pt-6 border-t border-black/5 flex flex-wrap gap-2">
                {exp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-3 py-1 rounded-md bg-neutral-100 text-neutral-800 border border-black/10 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
