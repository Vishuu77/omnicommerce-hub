import React from 'react';
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Zap,
  Terminal,
  Code2,
  CheckCircle2,
  Award,
  Bot,
  Cog,
  Database
} from 'lucide-react';
import { soundFX } from './SoundFX';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 border-b border-black/10 bg-[#f4f4f4] relative overflow-hidden">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-16 pb-6 border-b border-black/10">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              // 01 &mdash; About &amp; Engineering Philosophy
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-black tracking-tighter">
              Philosophy &amp; Rank
            </h2>
          </div>
          <div className="text-sm font-mono text-neutral-600 max-w-md mt-4 md:mt-0 flex items-center space-x-2">
            <Award className="w-4 h-4 text-black shrink-0" />
            <span>9.11 CGPA &bull; 10th University Rank across VTU</span>
          </div>
        </div>

        {/* Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Big Editorial Quote (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            <blockquote className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-black leading-[1.15] tracking-tight">
              &ldquo;Shift away from writing repetitive syntax boilerplate. Act as a system architect and orchestrator—bridging LLM reasoning with real-world execution, robotics, and industrial manufacturing.&rdquo;
            </blockquote>

            <div className="space-y-4 text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
              <p>
                I am <strong className="text-black">Er. Vishnu Ramachandra (ವಿಷ್ಣು ರಾಮಚಂದ್ರ / Vishnu R)</strong>, an AI Engineer specializing in Agentic AI &amp; Low-Code/No-Code Automation, Model Context Protocol (MCP), Robotics, and B2B Manufacturing. Currently based in Chintamani, Karnataka, and actively working across Bengaluru and Hyderabad (open to relocation globally).
              </p>
              <p>
                As an AI Engineer &amp; Assistant Operations Automation Engineer at <strong className="text-black">Learner's Byte (Hyderabad)</strong>, I engineer low-code/no-code autonomous agent crews using Claude, Hermes Agent, OpenClaw, and DeepSeek Harness—wiring models directly into business tools and databases via custom MCP servers and unattended cron automations. Previously at <strong className="text-black">Venttup Ventures (Bengaluru)</strong>, I delivered 3D CAD parametric models in Autodesk Fusion 360 for heavy engineering, supplier localization, and shop-floor manufacturing.
              </p>
              <p>
                I hold a <strong className="text-black">Bachelor of Engineering (B.E.) with Honours in Robotics and Artificial Intelligence</strong> from Bangalore Technological Institute (VTU), achieving a <strong className="text-black">9.11 CGPA</strong> and securing the prestigious <strong className="text-black">10th University Rank across all of VTU</strong>.
              </p>
            </div>

            {/* Core 4 Principles Grid */}
            <div className="pt-8 border-t border-black/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-black/10 shadow-sm">
                <div className="text-xs font-mono font-bold text-neutral-400 mb-1">01 / PARADIGM</div>
                <h4 className="text-base font-bold text-black mb-1">Agentic-First Execution</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Zero-manual-syntax paradigm: leveraging multi-agent crews and low-code harnesses to turn raw intent into deployed production workflows.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-black/10 shadow-sm">
                <div className="text-xs font-mono font-bold text-neutral-400 mb-1">02 / CONTEXT</div>
                <h4 className="text-base font-bold text-black mb-1">Modular Context &amp; Skills</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Standardized reusable .md skill files and master prompt architectures paired with an Obsidian Second Brain for deterministic consistency.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-black/10 shadow-sm">
                <div className="text-xs font-mono font-bold text-neutral-400 mb-1">03 / CONNECTIVITY</div>
                <h4 className="text-base font-bold text-black mb-1">End-to-End MCP Loops</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Model Context Protocol (MCP) servers, n8n automations, custom connectors, and unattended cron loops that execute without supervision.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-black/10 shadow-sm">
                <div className="text-xs font-mono font-bold text-neutral-400 mb-1">04 / GROUNDING</div>
                <h4 className="text-base font-bold text-black mb-1">Cyber-Physical Grounding</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Translating AI intelligence into physical hardware: Autodesk Fusion 360 3D CAD modeling, mechatronics, 6-DOF AgriBot, and B2B manufacturing.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Fact Sheet & Academic Distinction (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-black/10 space-y-5 shadow-sm">
              <h3 className="text-lg font-black text-black uppercase tracking-tight pb-3 border-b border-black/10 flex items-center justify-between">
                <span>Credentials Fact Sheet</span>
                <span className="text-xs font-mono text-neutral-500 font-normal">Immediate</span>
              </h3>

              <div className="space-y-3.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-neutral-500">Full Name:</span>
                  <span className="font-bold text-black text-right">Er. Vishnu Ramachandra (Vishnu R)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-neutral-500">Kannada Script:</span>
                  <span className="font-bold text-black font-sans">ವಿಷ್ಣು ರಾಮಚಂದ್ರ</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-neutral-500">Academic Merit:</span>
                  <span className="font-bold text-black">9.11 CGPA | 10th VTU Rank</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-neutral-500">Degree:</span>
                  <span className="font-bold text-black text-right">B.E. (Honours) Robotics &amp; AI</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-neutral-500">Current Role:</span>
                  <span className="font-bold text-black text-right">AI Engineer @ Learner's Byte</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-neutral-500">Ex-Experience:</span>
                  <span className="font-bold text-black text-right">Venttup Ventures (B2B Mfg)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-neutral-500">Domain Focus:</span>
                  <span className="font-bold text-black text-right">Agentic AI &amp; Industrial Robotics</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-neutral-500">Location Base:</span>
                  <span className="font-bold text-black text-right">Chintamani / Bengaluru / Hyderabad</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-neutral-500">Availability:</span>
                  <span className="font-bold text-emerald-600 font-sans">Immediate / Open to Relocation</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Email:</span>
                  <span className="font-bold text-black">nothingsvishnu@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Grant & Flagship Highlight Card */}
            <div className="p-6 rounded-3xl bg-black text-white space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                <span>// GRANT-FUNDED RECOGNITION</span>
                <span className="text-amber-400">Awarded</span>
              </div>
              <h4 className="text-base font-bold text-white">
                AgriBot 6-DOF Mobile Robotics
              </h4>
              <p className="text-xs leading-relaxed text-neutral-300">
                Selected for the Student Research Project Programme 2025–26 seed grant and honored at the 59th Engineers' Day by The Institution of Engineers (India) – Karnataka State Centre.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
