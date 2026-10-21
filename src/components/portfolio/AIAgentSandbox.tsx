import React, { useState } from 'react';
import {
  Cpu,
  Terminal,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Activity,
  ShieldCheck,
  Zap,
  MessageSquare,
  Radio,
  Clock,
  Bot,
  Cog,
  Wrench,
  Award
} from 'lucide-react';
import { soundFX } from './SoundFX';

export const AIAgentSandbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'twin' | 'agentic-os' | 'agribot-telemetry'>('twin');

  // Digital Twin state
  const [twinQuery, setTwinQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: "Hello! I am Er. Vishnu Ramachandra's interactive Digital Twin. Ask me about my Agentic-First execution philosophy, the grant-funded 6-DOF AgriBot robot, MCP server engineering, or my 10th VTU rank.",
      time: 'Just now'
    }
  ]);

  // Agentic OS Simulation State
  const [osTask, setOsTask] = useState<'firmware' | 'procurement'>('firmware');
  const [osStep, setOsStep] = useState<number>(0);
  const [isExecutingOS, setIsExecutingOS] = useState<boolean>(false);

  // Quick prompt presets for Digital Twin
  const presets = [
    'What is your Agentic-First Execution philosophy?',
    'Tell me about the grant-funded 6-DOF AgriBot robot.',
    'How do you connect MCP servers & Obsidian Second Brain?',
    'Tell me about your B2B manufacturing & CAD work at Venttup.'
  ];

  const answerPreset = (query: string) => {
    soundFX.playClick();
    setTwinQuery(query);
    handleSendTwin(query);
  };

  const handleSendTwin = (customText?: string) => {
    const textToSend = customText || twinQuery;
    if (!textToSend.trim() || isTyping) return;

    soundFX.playClick();
    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setTwinQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = textToSend.toLowerCase();

      if (lower.includes('philosophy') || lower.includes('agentic-first') || lower.includes('syntax')) {
        reply = "My 'Agentic-First Execution' paradigm shifts engineering away from manual, repetitive boilerplate syntax. Instead, I operate as a system architect and orchestrator: leveraging multi-agent crews (Claude, Hermes Agent, OpenClaw, DeepSeek Harness), low-code pipelines (n8n), and standardized .md skill definitions to take raw business or technical intent straight to validated, deployed execution.";
      } else if (lower.includes('agribot') || lower.includes('robot') || lower.includes('grant')) {
        reply = "AgriBot is my flagship 6-DOF agricultural mobile robot, selected for the Student Research Project Programme 2025–26 seed grant and honored at the 59th Engineers' Day by The Institution of Engineers (India) - Karnataka State Centre. It automates sapling plantation and vertical soil drilling using a 4-DC drivetrain, a high-torque Johnson motor drill, Raspberry Pi Pico, and ESP32-CAM, guided by ultrasonic depth profiling and agentic firmware.";
      } else if (lower.includes('mcp') || lower.includes('obsidian') || lower.includes('brain') || lower.includes('context')) {
        reply = "Model Context Protocol (MCP) servers are how I connect isolated reasoning models directly to local filesystems, databases, and APIs. To prevent context drift across multi-day initiatives, I couple MCP with an Obsidian Second Brain knowledge vault and reusable .md skill files. This ensures agents produce deterministic, reproducible outputs without hallucinating or losing project memory.";
      } else if (lower.includes('venttup') || lower.includes('cad') || lower.includes('manufacturing') || lower.includes('b2b')) {
        reply = "At Venttup Ventures Private Limited in Bengaluru, I served as Graduate Engineering Trainee in B2B Manufacturing. I designed 3D parametric mechanical models in Autodesk Fusion 360, performed Design for Manufacturability (DFM) analyses for sheet metal and CNC machining, conducted supplier shop-floor audits, and collaborated with Localization and Procurement teams on hardware indigenization.";
      } else if (lower.includes('vtu') || lower.includes('cgpa') || lower.includes('rank') || lower.includes('education')) {
        reply = "I graduated with a Bachelor of Engineering (B.E.) with Honours in Robotics and Artificial Intelligence from Bangalore Technological Institute (VTU). I achieved an overall 9.11 CGPA and secured the 10th University Rank across the entire Visvesvaraya Technological University (VTU) network.";
      } else {
        reply = `Thanks for asking! I am Er. Vishnu Ramachandra (ವಿಷ್ಣು ರಾಮಚಂದ್ರ), an AI Engineer specializing in Agentic AI, MCP, Robotics, and B2B Manufacturing. Currently AI Engineer at Learner's Byte (Hyderabad). Whether you need autonomous multi-agent systems, unattended cron automations, or 3D parametric hardware design, I deliver production-ready architectures with immediate availability.`;
      }

      soundFX.playSuccess();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  const runOsSimulation = (task: 'firmware' | 'procurement') => {
    soundFX.playClick();
    setOsTask(task);
    setIsExecutingOS(true);
    setOsStep(1);

    setTimeout(() => {
      soundFX.playClick();
      setOsStep(2);
    }, 900);

    setTimeout(() => {
      soundFX.playClick();
      setOsStep(3);
    }, 1800);

    setTimeout(() => {
      soundFX.playSuccess();
      setOsStep(4);
      setIsExecutingOS(false);
    }, 2800);
  };

  return (
    <section id="ai-sandbox" className="py-24 border-b border-black/10 bg-[#f4f4f4] relative overflow-hidden">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-16 pb-6 border-b border-black/10">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              // 04 &mdash; Interactive Sandbox
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-black tracking-tighter">
              AI Agent Console.
            </h2>
          </div>

          {/* Tab Selector */}
          <div className="mt-4 md:mt-0 flex p-1 rounded-full bg-white border border-black/10 shadow-sm">
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('twin');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'twin'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Ask Vishnu's Digital Twin
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('agentic-os');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'agentic-os'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              One-Man Agentic OS Harness
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('agribot-telemetry');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'agribot-telemetry'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              AgriBot Telemetry Stream
            </button>
          </div>
        </div>

        {/* Tab 1: Digital Twin Chat */}
        {activeTab === 'twin' && (
          <div className="bg-white rounded-3xl border border-black/10 overflow-hidden shadow-sm flex flex-col h-[580px]">
            {/* Terminal Top Bar */}
            <div className="px-6 py-4 bg-neutral-100 border-b border-black/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-neutral-300 inline-block" />
                <span className="ml-2 text-xs font-mono font-bold text-black">
                  vishnu_digital_twin@agentic-core
                </span>
                <span className="text-[10px] font-mono text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded">
                  9.11 CGPA • 10th VTU Rank
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>ONLINE // READY</span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-4 font-sans text-sm bg-white">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xl rounded-2xl p-4 ${
                      m.sender === 'user'
                        ? 'bg-black text-white rounded-br-none shadow-sm'
                        : 'bg-[#f4f4f4] text-black border border-black/5 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] opacity-70 mb-1.5 font-mono">
                      <span>{m.sender === 'user' ? 'You' : 'Er. Vishnu Ramachandra (Digital Twin)'}</span>
                      <span>{m.time}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-neutral-100 border border-black/10 rounded-2xl rounded-bl-none p-3.5 flex items-center space-x-2 text-black text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                    <span>Querying Obsidian Second Brain &amp; Agentic Knowledge Vault...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Preset Buttons */}
            <div className="px-6 py-3 bg-neutral-50 border-t border-black/10 flex flex-wrap gap-2">
              <span className="text-[11px] font-mono text-neutral-500 py-1">Try Prompt:</span>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => answerPreset(p)}
                  className="text-xs px-3 py-1 rounded-full bg-white hover:bg-neutral-200 border border-black/10 text-black transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-black/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendTwin();
                }}
                className="flex items-center space-x-3"
              >
                <input
                  type="text"
                  value={twinQuery}
                  onChange={(e) => setTwinQuery(e.target.value)}
                  placeholder="Ask Vishnu about Agentic AI, 6-DOF AgriBot, MCP, CAD modeling, or career..."
                  className="flex-1 bg-neutral-50 border border-black/15 rounded-full px-5 py-3 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!twinQuery.trim() || isTyping}
                  className="p-3 rounded-full bg-black hover:bg-neutral-800 text-white transition-colors disabled:opacity-30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: One-Man Agentic OS Simulator */}
        {activeTab === 'agentic-os' && (
          <div className="bg-white rounded-3xl border border-black/10 p-8 sm:p-10 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/10 gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-black">
                  One-Man Agentic OS &mdash; Autonomous Delegation Harness
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                  Demonstrating hierarchical goal decomposition across specialized sub-agents with shared Obsidian memory.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => runOsSimulation('firmware')}
                  disabled={isExecutingOS}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    osTask === 'firmware'
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 border border-black/10 text-neutral-800 hover:text-black'
                  }`}
                >
                  Run: AgriBot Firmware Generator
                </button>
                <button
                  onClick={() => runOsSimulation('procurement')}
                  disabled={isExecutingOS}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    osTask === 'procurement'
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 border border-black/10 text-neutral-800 hover:text-black'
                  }`}
                >
                  Run: B2B Sourcing Agent
                </button>
              </div>
            </div>

            {/* Stepper Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  step: 1,
                  title: '1. Master Goal Ingestion',
                  desc: 'Claude decomposes intent into discrete sub-agent tasks using master prompt rules.'
                },
                {
                  step: 2,
                  title: '2. Skill (.md) & Memory Query',
                  desc: 'Retrieves standardized execution protocols from Obsidian Second Brain vault.'
                },
                {
                  step: 3,
                  title: '3. Tool Execution via MCP',
                  desc: 'Connects to Pico compiler / Fusion 360 BOM extractor via Model Context Protocol.'
                },
                {
                  step: 4,
                  title: '4. Verified Deployment',
                  desc: 'AST code validation / tolerance check completed. Artifact committed to repository.'
                }
              ].map((s) => (
                <div
                  key={s.step}
                  className={`p-5 rounded-2xl border transition-all ${
                    osStep >= s.step
                      ? 'bg-black text-white border-black'
                      : 'bg-neutral-50 text-neutral-600 border-black/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase">
                      PHASE 0{s.step}
                    </span>
                    {osStep >= s.step && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <h4 className="text-sm font-black mb-1">{s.title}</h4>
                  <p className="text-xs opacity-80 leading-relaxed font-normal">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-neutral-100 font-mono text-xs text-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-neutral-500">Active Runtime: </span>
                <span className="font-bold">Hermes Agent + Claude Code + Local MCP Server</span>
              </div>
              <div className="text-emerald-700 font-bold">
                {isExecutingOS ? '● Orchestrating Crew...' : '✓ Simulation Idle'}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AgriBot Mechatronic Telemetry Stream */}
        {activeTab === 'agribot-telemetry' && (
          <div className="bg-white rounded-3xl border border-black/10 p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/10 gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-black">
                  AgriBot 6-DOF &mdash; Live Hardware Telemetry Stream
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                  Real-time sub-10ms motor, sensor, and microcontroller bus diagnostics.
                </p>
              </div>

              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>PICO + ESP32 LINKED</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-neutral-50 border border-black/10">
                <div className="text-xs font-mono text-neutral-500">Johnson Drill Motor</div>
                <div className="text-2xl font-black text-black mt-1">320 RPM</div>
                <div className="text-[10px] font-mono text-emerald-600 mt-0.5">Torque: 42 kg-cm • Normal</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-black/10">
                <div className="text-xs font-mono text-neutral-500">Drill Depth Profile</div>
                <div className="text-2xl font-black text-black mt-1">145 mm</div>
                <div className="text-[10px] font-mono text-neutral-600 mt-0.5">Target: 150 mm (Vertical)</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-black/10">
                <div className="text-xs font-mono text-neutral-500">4WD Mobile Drivetrain</div>
                <div className="text-2xl font-black text-black mt-1">1.2 m/s</div>
                <div className="text-[10px] font-mono text-neutral-600 mt-0.5">DC Motor PWM: 85% Sync</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-black/10">
                <div className="text-xs font-mono text-neutral-500">ESP32-CAM Feed</div>
                <div className="text-2xl font-black text-black mt-1">30 FPS</div>
                <div className="text-[10px] font-mono text-emerald-600 mt-0.5">Vision Ground Alignment OK</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
