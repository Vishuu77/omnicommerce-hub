import React, { useState, useEffect } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Mail,
  Award,
  Cpu,
  Bot,
  Cog
} from 'lucide-react';
import { soundFX } from './SoundFX';
import { HeroGlobe3D } from './HeroGlobe3D';
import { PORTFOLIO_IMAGES } from '../../config/portfolioImages';

interface MondragonHeroProps {
  onOpenResume: () => void;
}

export const MondragonHero: React.FC<MondragonHeroProps> = ({ onOpenResume }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) + ' GMT+5:30'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 border-b border-purple-900/10 overflow-hidden bg-gradient-to-b from-[#f7f5fa] via-[#f3eefa] to-[#eee8f7]">
      {/* Ambient Lavender Presentation Aura */}
      <div className="absolute top-0 right-1/4 w-[650px] h-[550px] bg-purple-300/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-[450px] h-[400px] bg-indigo-200/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Academic & Industry Distinctions (2 Cols) */}
          <div className="lg:col-span-2 space-y-6 text-xs font-mono text-neutral-800">
            <div>
              <div className="text-purple-900/60 mb-1">Academic Distinction</div>
              <div className="text-base font-bold text-black font-sans flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-700 shrink-0" />
                <span>10th VTU Rank</span>
              </div>
              <div className="text-xs text-neutral-600 font-mono mt-0.5">9.11 CGPA • Honours</div>
            </div>

            <div>
              <div className="text-purple-900/60 mb-1">Degree &amp; Major</div>
              <div className="text-sm font-bold text-black font-sans leading-snug">
                B.E. Robotics &amp; Artificial Intelligence
              </div>
              <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                Bangalore Tech Institute (2026)
              </div>
            </div>

            <div>
              <div className="text-purple-900/60 mb-1">Current Role</div>
              <div className="text-sm font-bold text-black font-sans">
                AI Engineer
              </div>
              <div className="text-[11px] text-neutral-600 font-mono mt-0.5">
                Learner's Byte (Hyderabad)
              </div>
            </div>

            <div className="pt-4 border-t border-purple-900/10">
              <button
                onClick={() => {
                  soundFX.playClick();
                  onOpenResume();
                }}
                className="group flex items-center space-x-1.5 text-purple-950 font-bold text-xs underline underline-offset-4 hover:opacity-75"
              >
                <span>Download CV (ATS)</span>
                <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform text-purple-700" />
              </button>
            </div>
          </div>

          {/* Middle Column: Massive Typography, Portrait & Philosophy (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="inline-flex items-center space-x-2 text-purple-900/70 font-mono text-xs uppercase tracking-wider">
                  <span>[ ER. VISHNU RAMACHANDRA / ವಿಷ್ಣು ರಾಮಚಂದ್ರ ]</span>
                </div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-100/90 border border-purple-300 text-purple-950 text-[10px] font-mono font-semibold shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                  <span>Voice Greeting Active (ಕನ್ನಡ / EN)</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-black leading-tight mb-2">
                AI Engineer &bull; Agentic AI &amp; Automation <br className="hidden sm:block" />
                <span className="text-neutral-600 font-normal text-xl sm:text-2xl md:text-3xl">
                  Robotics &bull; B2B Manufacturing
                </span>
              </h2>

              <div className="pt-2">
                {/* Massive Display Monogram / Name */}
                <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-black leading-none uppercase">
                  Vishnu
                </h1>
                <div className="flex items-center space-x-2 text-purple-900/70 font-mono text-xs sm:text-sm tracking-widest uppercase mt-3">
                  <span>RAMACHANDRA</span>
                  <span>&bull;</span>
                  <span>AUTONOMOUS SYSTEMS ARCHITECT</span>
                </div>
              </div>
            </div>

            <p className="text-base sm:text-lg text-neutral-700 max-w-xl leading-relaxed pt-2 font-normal">
              <strong>Agentic-First Execution:</strong> I eliminate repetitive syntax boilerplate by orchestrating autonomous multi-agent crews, low-code/no-code pipelines, and MCP servers. Bridging digital LLM reasoning with physical hardware, 3D parametric CAD modeling, and industrial manufacturing.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#projects"
                onClick={() => soundFX.playClick()}
                className="px-5 py-2.5 rounded-full bg-purple-950 hover:bg-black text-white font-bold text-xs transition-colors inline-flex items-center space-x-1.5 shadow-md shadow-purple-950/15"
              >
                <span>Explore Works &amp; AgriBot</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>

              <a
                href="#contact"
                onClick={() => soundFX.playClick()}
                className="px-5 py-2.5 rounded-full border border-purple-900/30 hover:border-purple-950 text-purple-950 font-bold text-xs transition-colors bg-white/50 backdrop-blur-xs"
              >
                <span>Direct Contact</span>
              </a>

              <a
                href="https://github.com/Vishuu77"
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFX.playClick()}
                className="px-4 py-2.5 rounded-full border border-purple-900/20 hover:border-purple-950 text-purple-950 font-bold text-xs transition-colors bg-white/40 inline-flex items-center space-x-1"
                title="View Vishnu's GitHub Repositories"
              >
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <span className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-purple-100/70 border border-purple-200/80 text-purple-950 text-xs font-mono font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Immediate Joining</span>
              </span>
            </div>
          </div>

          {/* Right Column: Haute-Couture Calligraphy Signature Emblem (4 Cols) */}
          <div className="lg:col-span-4 relative flex justify-center lg:justify-end">
            <HeroGlobe3D />
          </div>
        </div>

        {/* Bottom Metadata Info Strip */}
        <div className="pt-8 border-t border-purple-900/10 grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-neutral-800">
          {/* Location & Time */}
          <div className="md:col-span-4 space-y-1">
            <div className="font-bold text-black flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-500" />
              <span>Chintamani, Karnataka 563125</span>
            </div>
            <div className="text-neutral-600">
              Active in Bengaluru &amp; Hyderabad &bull; Open to Relocation
            </div>
            <div className="font-mono text-neutral-500 flex items-center gap-1.5 pt-0.5">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>{timeStr || '10:00 PM GMT+5:30'}</span>
            </div>
          </div>

          {/* Core Focus Narrative */}
          <div className="md:col-span-4 space-y-1">
            <div className="font-bold text-black">Cyber-Physical AI Engineering</div>
            <p className="text-neutral-600 leading-snug">
              Designing Claude/Hermes multi-agent workflows, unattended cron automations, Autodesk Fusion 360 parametric assemblies, and grant-funded robotics.
            </p>
          </div>

          {/* Contact Direct Line */}
          <div className="md:col-span-4 flex flex-col md:items-end space-y-1">
            <a
              href="mailto:nothingsvishnu@gmail.com"
              className="font-mono font-bold text-black hover:underline"
            >
              nothingsvishnu@gmail.com
            </a>
            <span className="font-mono text-neutral-600">
              +91 6361222162
            </span>
            <div className="flex items-center gap-3 pt-0.5">
              <a
                href="https://github.com/Vishuu77"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-purple-950 font-bold hover:underline flex items-center gap-1"
              >
                <span>github.com/Vishuu77</span>
                <ArrowUpRight className="w-3 h-3 text-purple-700" />
              </a>
              <span className="text-neutral-300">&bull;</span>
              <a
                href="https://linkedin.com/in/vishnu-r-63095b282"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-neutral-600 hover:text-black flex items-center gap-1"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-500" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
