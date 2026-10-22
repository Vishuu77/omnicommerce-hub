import React, { useState } from 'react';
import {
  Menu,
  X,
  ArrowUpRight,
  Command,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { soundFX } from './SoundFX';

interface MondragonHeaderProps {
  onOpenResume: () => void;
  onOpenCommand: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const MondragonHeader: React.FC<MondragonHeaderProps> = ({
  onOpenResume,
  onOpenCommand,
  soundEnabled,
  onToggleSound
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#f7f5fa]/95 backdrop-blur-md border-b border-purple-900/10 py-5 transition-all">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-6 items-start">
          {/* Column 1: Monogram / Brand (2 Cols) */}
          <div className="md:col-span-2 flex items-center justify-between">
            <a
              href="#"
              onClick={() => soundFX.playClick()}
              className="group flex flex-col"
            >
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-black group-hover:opacity-75 transition-opacity">
                VISHNU
              </span>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                Er. Vishnu R • AI Eng
              </span>
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-black hover:bg-black/5"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Column 2: Navigation Links (2 Cols) */}
          <div className="hidden md:flex flex-col space-y-1.5 md:col-span-2 text-xs font-semibold text-black">
            <a href="#" onClick={() => soundFX.playClick()} className="hover:underline underline-offset-4">
              Home
            </a>
            <a href="#about" onClick={() => soundFX.playClick()} className="hover:underline underline-offset-4">
              Philosophy &amp; Rank
            </a>
            <a href="#projects" onClick={() => soundFX.playClick()} className="hover:underline underline-offset-4">
              Selected Works &amp; Cases
            </a>
            <a href="#architecture" onClick={() => soundFX.playClick()} className="hover:underline underline-offset-4">
              Cyber-Physical Blueprint
            </a>
            <a href="#ai-sandbox" onClick={() => soundFX.playClick()} className="hover:underline underline-offset-4">
              Agent Harness Sandbox
            </a>
            <a href="#contact" onClick={() => soundFX.playClick()} className="hover:underline underline-offset-4">
              Direct Contact
            </a>
          </div>

          {/* Column 3: Socials & External (2 Cols) */}
          <div className="hidden md:flex flex-col space-y-1.5 md:col-span-2 text-xs font-semibold text-black">
            <a
              href="https://github.com/Vishuu77"
              target="_blank"
              rel="noreferrer"
              className="hover:underline underline-offset-4 flex items-center gap-1"
            >
              <span>GitHub (@Vishuu77)</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-500" />
            </a>
            <a
              href="https://linkedin.com/in/vishnu-r-63095b282"
              target="_blank"
              rel="noreferrer"
              className="hover:underline underline-offset-4 flex items-center gap-1"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-500" />
            </a>
            <a
              href="mailto:nothingsvishnu@gmail.com"
              className="hover:underline underline-offset-4 flex items-center gap-1"
            >
              <span>Email Direct</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-500" />
            </a>
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenResume();
              }}
              className="text-left hover:underline underline-offset-4 font-bold text-black flex items-center gap-1"
            >
              <span>Download CV ↓</span>
            </button>
            <a
              href="https://github.com/Vishuu77/Vishuu77.github.io"
              target="_blank"
              rel="noreferrer"
              className="hover:underline underline-offset-4 flex items-center gap-1 text-[11px] font-mono text-purple-900"
            >
              <span>Portfolio Source ↗</span>
            </a>
          </div>

          {/* Column 4: Disciplines & Services (3 Cols) */}
          <div className="hidden md:flex flex-col space-y-1 md:col-span-3 text-xs text-neutral-600 font-medium">
            <span>Agentic AI &amp; Multi-Agent Crews</span>
            <span>Low-Code / No-Code Automation (n8n)</span>
            <span>Model Context Protocol (MCP) Tools</span>
            <span>3D CAD &amp; B2B Manufacturing (Fusion 360)</span>
            <span>Robotics &amp; 6-DOF AgriBot Hardware</span>
          </div>

          {/* Column 5: Status Pill & Utility Actions (3 Cols) */}
          <div className="hidden md:flex flex-col items-end space-y-3 md:col-span-3">
            {/* Mondragon Availability Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black text-white text-[11px] font-semibold tracking-wide shadow-sm">
              <span>Available for Hire</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-neutral-400 font-normal">| Immediate</span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  soundFX.playClick();
                  onOpenCommand();
                }}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md border border-black/15 hover:border-black text-[11px] font-mono text-black transition-colors"
                title="Search Command Palette (Ctrl+K)"
              >
                <Command className="w-3 h-3 text-neutral-600" />
                <span>Search</span>
                <kbd className="text-[9px] bg-neutral-200 px-1 py-0.5 rounded text-neutral-700">⌘K</kbd>
              </button>

              <button
                onClick={onToggleSound}
                className="p-1.5 rounded-md border border-black/15 hover:border-black text-black transition-colors"
                title={soundEnabled ? 'Mute Audio SFX' : 'Enable Audio SFX'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-black/10 mt-4 space-y-3 text-sm font-semibold">
            <div className="flex flex-col space-y-2">
              <a href="#" onClick={() => setMobileMenuOpen(false)}>Home</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)}>Philosophy &amp; Rank</a>
              <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Selected Works &amp; Cases</a>
              <a href="#architecture" onClick={() => setMobileMenuOpen(false)}>Cyber-Physical Blueprint</a>
              <a href="#ai-sandbox" onClick={() => setMobileMenuOpen(false)}>Agent Harness Sandbox</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Direct Contact</a>
            </div>
            <div className="pt-2 border-t border-black/10 flex items-center justify-between">
              <button
                onClick={() => {
                  onOpenResume();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold underline"
              >
                Download CV ↓
              </button>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black text-white text-[10px] font-semibold">
                <span>Immediate Hire</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
