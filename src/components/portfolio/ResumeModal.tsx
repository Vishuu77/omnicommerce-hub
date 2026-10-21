import React from 'react';
import {
  X,
  Printer,
  Copy,
  Download,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Award,
  Bot,
  Cog
} from 'lucide-react';
import { soundFX } from './SoundFX';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    soundFX.playSuccess();
    window.print();
  };

  const handleCopyText = () => {
    soundFX.playClick();
    const resumeText = `
ER. VISHNU RAMACHANDRA (ವಿಷ್ಣು ರಾಮಚಂದ್ರ / VISHNU R)
AI Engineer | Agentic AI & Automation (No-Code / Low-Code) | Robotics & B2B Manufacturing
Email: nothingsvishnu@gmail.com | Phone: +91 6361222162
Location: Chintamani, Karnataka 563125 (Active in Bengaluru & Hyderabad | Open to Relocation)
LinkedIn: https://linkedin.com/in/vishnu-r-63095b282
Availability: Immediate

================================================================================
ACADEMIC DISTINCTION & EDUCATION
================================================================================
Bachelor of Engineering (B.E.) with Honours in Robotics and Artificial Intelligence
Bangalore Technological Institute (Affiliated with Visvesvaraya Technological University – VTU)
Graduation: June / September 2026
Academic Standing: 9.11 CGPA | 10th University Rank across VTU

================================================================================
CORE PHILOSOPHY & PRINCIPLES
================================================================================
* Agentic-First Execution (Zero-Manual-Syntax Paradigm): Shift away from writing repetitive boilerplate syntax by acting as a system architect and orchestrator. Leverage LLM harnesses, multi-agent crews, and low-code/no-code pipelines.
* Modular Context & Skill Standardization: Structured .md skill files, master prompt architectures, and Obsidian Second Brain for deterministic consistency.
* End-to-End Tool & Loop Engineering: Model Context Protocol (MCP) servers, custom connectors, and unattended cron job automations.
* Cyber-Physical & Industrial Grounding: Bridge digital AI orchestration with physical hardware: 3D parametric CAD (Autodesk Fusion 360), mechatronics, and B2B manufacturing.

================================================================================
TECHNICAL STACK & DOMAINS
================================================================================
* Agentic AI & Orchestration: Multi-Agent Workflows, Task Planning & Delegation, Prompt Engineering, Context Engineering, Loop Engineering, Master Prompt Structures, Reusable Skill (.md) Files, RAG, Vector Databases.
* Platforms & Harnesses: Claude (Claude Code, Claude Cowork), Hermes Agent, OpenClaw, DeepSeek Harness, Ollama, OpenCode, Codex, GitHub Copilot, Perplexity, Streamlit.
* Integration & Automation: Model Context Protocol (MCP) Servers, n8n, Plugins & Connectors, Unattended Cron Jobs, Obsidian (Knowledge Base / Second Brain).
* Programming & Frameworks: Python, LangChain, LangGraph, Machine Learning, Statistics, NLP.
* Hardware, CAD & Infrastructure: Autodesk Fusion 360 (2D Drafting, 3D Parametric Modeling, Mechanical Assemblies), Raspberry Pi Pico, ESP32-CAM, BLDC/DC Motor Controllers, Docker, Kubernetes, Terraform.
* Manufacturing & Supply Chain: B2B Manufacturing, Procurement, Supplier Sourcing, Hardware Localization & Indigenization, NPD, R&D, Tender/Bid Process, Machining, Sheet Metal & Fabrication.

================================================================================
PROFESSIONAL EXPERIENCE
================================================================================
Learner's Byte (Hyderabad)
AI Engineer & Assistant Operations Automation Engineer | May 2026 – Present
- Agentic Workflow Design: Build low-code/no-code autonomous AI agents and operations automations using Claude, Hermes Agent, OpenClaw, and DeepSeek Harness.
- MCP & Tool Connectivity: Wire agents directly into business tools and data pipelines via MCP servers, plugins, and connectors for multi-step, end-to-end execution.
- Context & Skill Architecture: Author reusable .md skill files and master prompt structures to standardize agent behavior; maintain an Obsidian Second Brain for persistent context.
- Autonomous Scheduling: Configure unattended cron jobs to execute recurring operational automations reliably.
- Technical Enablement: Organized and facilitated technical upskilling workshops on Claude, Salesforce Admin workflows, and AI automation tools.

Learner's Byte (Hyderabad)
Intern – Generative AI & Agentic AI | Jan 2026 – May 2026
- Built multi-step AI workflow automations and agent pipelines using n8n.
- Benchmarked and evaluated generative AI models and toolsets to map optimal architectures to business use cases.
- Completed the Codexpert track, analyzing cross-language paradigms and structural differences.

Venttup Ventures Private Limited (Bengaluru)
Graduate Engineering Trainee – B2B Manufacturing | Feb 2026 – Apr 2026
- 3D CAD & Hardware Design: Designed hardware systems and 3D engineering models in Autodesk Fusion 360 for industrial manufacturing projects.
- Cross-Functional Operations: Collaborated across Localization, Procurement, Heavy Engineering, NPD, and R&D teams on supplier sourcing, hardware indigenization, and tender/bid execution.
- Shop-Floor & Client Execution: Conducted on-site supplier shop-floor assessments (machining, fabrication, sheet metal) and participated in high-profile B2B client requirement consultations.

================================================================================
FEATURED PROJECTS
================================================================================
1. AgriBot — 6-DOF Agricultural Mobile Robot (Grant-Funded Flagship Project)
   Selected for Student Research Project Programme 2025–26 grant (seed funding) and recognized at the 59th Engineers' Day by The Institution of Engineers (India) - Karnataka State Centre. 4-DC mobile drivetrain with high-torque Johnson vertical drill, Raspberry Pi Pico, and ESP32-CAM.
2. One-Man Agentic OS (Multi-Agent System)
   Personal autonomous operating system powered by a crew of specialized AI agents (Hermes, OpenClaw, Claude) governed by .md skill definitions, Obsidian context vaults, and automated cron triggers.
3. OmniCommerce Hub & AI Harness (Dual Customer & CRM Platform)
   Production-ready dual-interface e-commerce platform synchronized in real-time with an enterprise employee fulfillment CRM via WebSockets (<50ms) and Google Sheets database engine.
4. No-Code Data Science Engineer Agent
   Autonomous agent executing end-to-end data science workflows (ingestion, statistical profiling, insights) without manual code authoring.
5. B2B Engineering 3D Designs & Localization Suite (Venttup Ventures)
   Production-ready 2D drafts, 3D parametric models, and mechanical assemblies built in Autodesk Fusion 360 for heavy engineering and indigenization.
    `.trim();

    navigator.clipboard.writeText(resumeText);
    onShowToast('Full ATS Resume copied to clipboard!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => {
          soundFX.playClick();
          onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white text-black rounded-3xl shadow-2xl border border-black/20 flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 bg-neutral-100 border-b border-black/10">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-neutral-600">
            <span className="px-2 py-0.5 rounded bg-black text-white text-[10px]">
              ATS-OPTIMIZED RESUME
            </span>
            <span>// ER. VISHNU RAMACHANDRA</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleCopyText}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-neutral-200 border border-black/15 text-black text-xs font-bold transition-all"
              title="Copy plain text for job applications"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Text</span>
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 font-sans text-xs sm:text-sm">
          {/* Header Identity */}
          <div className="border-b border-black/10 pb-6 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
                Er. Vishnu Ramachandra (ವಿಷ್ಣು ರಾಮಚಂದ್ರ)
              </h1>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>Available for Immediate Joining</span>
              </div>
            </div>

            <div className="text-sm font-bold text-neutral-700">
              AI Engineer &bull; Agentic AI &amp; Automation (No-Code / Low-Code) &bull; Robotics &amp; B2B Manufacturing
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-neutral-600 pt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-neutral-400" />
                <span>nothingsvishnu@gmail.com</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-neutral-400" />
                <span>+91 6361222162</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-400" />
                <span>Chintamani / Bengaluru / Hyderabad</span>
              </span>
              <span>&bull;</span>
              <a
                href="https://linkedin.com/in/vishnu-r-63095b282"
                target="_blank"
                rel="noreferrer"
                className="text-black font-bold underline"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Academic Distinction */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-black" />
              <span>ACADEMIC DISTINCTION &amp; EDUCATION</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="font-bold text-black text-sm sm:text-base">
                  Bachelor of Engineering (B.E.) with Honours in Robotics and Artificial Intelligence
                </div>
                <div className="text-xs text-neutral-600 font-semibold mt-0.5">
                  Bangalore Technological Institute &bull; Affiliated with Visvesvaraya Technological University (VTU)
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-black font-mono">
                  9.11 CGPA &bull; 10th VTU Rank
                </div>
                <div className="text-xs text-neutral-500 font-mono">
                  Class of 2026
                </div>
              </div>
            </div>
          </div>

          {/* Core Philosophy */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest">
              CORE ENGINEERING PHILOSOPHY
            </div>
            <p className="text-neutral-700 leading-relaxed font-normal">
              <strong>Agentic-First Execution (Zero-Manual-Syntax Paradigm):</strong> Shifting away from repetitive boilerplate syntax by operating as a system architect and orchestrator. Leveraging LLM harnesses, multi-agent crews, and low-code/no-code pipelines (Claude, Hermes Agent, n8n, MCP) to take software, firmware, and data tasks from raw intent to deployed execution.
            </p>
          </div>

          {/* Technical Matrix */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest">
              TECHNICAL COMPETENCIES MATRIX
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-black/10">
                <span className="font-bold text-black block mb-1">Agentic AI &amp; Orchestration:</span>
                <span className="text-neutral-600">Multi-Agent Workflows, Task Planning &amp; Delegation, Prompt &amp; Context Engineering, Reusable Skill (.md) Files, RAG, Vector DBs</span>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-black/10">
                <span className="font-bold text-black block mb-1">Platforms &amp; Harnesses:</span>
                <span className="text-neutral-600">Claude (Claude Code, Cowork), Hermes Agent, OpenClaw, DeepSeek Harness, Ollama, OpenCode, Codex, Streamlit</span>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-black/10">
                <span className="font-bold text-black block mb-1">Integration &amp; Automation:</span>
                <span className="text-neutral-600">Model Context Protocol (MCP) Servers, n8n, Plugins, Unattended Cron Jobs, Obsidian Second Brain</span>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-black/10">
                <span className="font-bold text-black block mb-1">Hardware, CAD &amp; Manufacturing:</span>
                <span className="text-neutral-600">Autodesk Fusion 360 (2D/3D Parametric CAD), Raspberry Pi Pico, ESP32-CAM, Johnson Motors, DFM Sheet Metal, Machining</span>
              </div>
            </div>
          </div>

          {/* Professional Experience */}
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest">
              PROFESSIONAL EXPERIENCE
            </div>

            {/* Learner's Byte AI Engineer */}
            <div className="space-y-2 border-l-2 border-black pl-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="font-bold text-black text-sm">
                  AI Engineer &amp; Assistant Operations Automation Engineer
                </div>
                <div className="text-xs font-mono text-neutral-500">
                  May 2026 &mdash; Present &bull; Hyderabad
                </div>
              </div>
              <div className="text-xs font-semibold text-neutral-700">Learner's Byte</div>
              <ul className="list-disc list-inside space-y-1 text-xs text-neutral-600 leading-relaxed">
                <li>Built low-code/no-code autonomous AI agents using Claude, Hermes Agent, OpenClaw, and DeepSeek Harness.</li>
                <li>Wired agents directly into business tools and data pipelines via custom MCP servers and connectors.</li>
                <li>Authored reusable .md skill files and master prompt structures; maintained Obsidian Second Brain context vault.</li>
                <li>Configured unattended cron jobs to execute recurring operational automations reliably.</li>
                <li>Facilitated technical upskilling workshops on Claude and AI automation tools.</li>
              </ul>
            </div>

            {/* Learner's Byte Intern */}
            <div className="space-y-2 border-l-2 border-neutral-300 pl-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="font-bold text-black text-sm">
                  Intern &mdash; Generative AI &amp; Agentic AI
                </div>
                <div className="text-xs font-mono text-neutral-500">
                  Jan 2026 &mdash; May 2026 &bull; Hyderabad
                </div>
              </div>
              <div className="text-xs font-semibold text-neutral-700">Learner's Byte</div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Engineered multi-step AI workflow automations using n8n; benchmarked generative AI models for enterprise use cases; completed the Codexpert programming paradigm track.
              </p>
            </div>

            {/* Venttup Ventures */}
            <div className="space-y-2 border-l-2 border-neutral-300 pl-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="font-bold text-black text-sm">
                  Graduate Engineering Trainee &mdash; B2B Manufacturing
                </div>
                <div className="text-xs font-mono text-neutral-500">
                  Feb 2026 &mdash; Apr 2026 &bull; Bengaluru
                </div>
              </div>
              <div className="text-xs font-semibold text-neutral-700">Venttup Ventures Private Limited</div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Authored production-ready 3D parametric CAD models in Autodesk Fusion 360; conducted on-site supplier shop-floor audits (sheet metal, fabrication, machining); collaborated across Localization, Procurement, and NPD teams on hardware indigenization and tender/bid execution.
              </p>
            </div>
          </div>

          {/* Flagship Projects */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest">
              FLAGSHIP ENGINEERING PROJECTS
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 border border-black/10">
                <div className="font-bold text-black">
                  AgriBot &mdash; 6-DOF Agricultural Mobile Robot (Grant-Funded Flagship Project)
                </div>
                <p className="text-neutral-600 mt-0.5">
                  Awarded Student Research Project Programme 2025–26 seed grant; recognized at 59th Engineers' Day by IEI Karnataka. 4-DC drivetrain, high-torque Johnson motor vertical soil drill, Raspberry Pi Pico, and ESP32-CAM.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-black/10">
                <div className="font-bold text-black">
                  One-Man Agentic OS &mdash; Autonomous Multi-Agent System
                </div>
                <p className="text-neutral-600 mt-0.5">
                  Personal operating system powered by specialized AI agent crews (Hermes, Claude, OpenClaw) governed by .md skill files, Obsidian context vaults, and automated cron triggers.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-black/10">
                <div className="font-bold text-black">
                  OmniCommerce Hub &mdash; Dual Customer &amp; Employee CRM Prototype
                </div>
                <p className="text-neutral-600 mt-0.5">
                  Production-ready dual-interface shopping platform synchronized in real-time with an enterprise employee fulfillment CRM via WebSockets (&lt;50ms) and Google Sheets database engine.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-100 border-t border-black/10 flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-500">Contact: nothingsvishnu@gmail.com</span>
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            Close Resume
          </button>
        </div>
      </div>
    </div>
  );
};
