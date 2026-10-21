import React, { useState } from 'react';
import {
  ChevronUp,
  CheckCircle2,
  Info
} from 'lucide-react';
import { MondragonHeader } from './MondragonHeader';
import { MondragonHero } from './MondragonHero';
import { MondragonMarquee } from './MondragonMarquee';
import { AboutSection } from './AboutSection';
import { FeaturedProjects } from './FeaturedProjects';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { AIAgentSandbox } from './AIAgentSandbox';
import { SkillsBento } from './SkillsBento';
import { ExperienceTimeline } from './ExperienceTimeline';
import { ContactSection } from './ContactSection';
import { CommandPalette } from './CommandPalette';
import { ResumeModal } from './ResumeModal';
import { VoiceGreetingBar } from './VoiceGreetingBar';
import { soundFX } from './SoundFX';

interface PortfolioViewProps {
  onSwitchPortal: (portal: 'customer' | 'crm') => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ onSwitchPortal }) => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleToggleSound = () => {
    const nextState = soundFX.toggleSound();
    setSoundEnabled(nextState);
    showToast(nextState ? 'Futuristic sound effects enabled' : 'Sound effects muted', 'info');
  };

  const scrollToTop = () => {
    soundFX.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f7f5fa] text-black selection:bg-purple-900 selection:text-white font-sans">
      {/* Mondragon Top Editorial Header */}
      <MondragonHeader
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenCommand={() => setIsCommandPaletteOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Sections */}
      <main>
        {/* Asymmetrical Mondragon Hero */}
        <MondragonHero onOpenResume={() => setIsResumeOpen(true)} />

        {/* Running Marquee Ticker */}
        <MondragonMarquee />

        {/* Editorial About Section */}
        <AboutSection />

        {/* Selected Cases & Projects (Featuring OmniCommerce Hub as Case 01) */}
        <FeaturedProjects onSwitchPortal={onSwitchPortal} />

        {/* Live Interactive Architecture Visualizer */}
        <ArchitectureDiagram />

        {/* AI Agent Console & Digital Twin Sandbox */}
        <AIAgentSandbox />

        {/* Disciplines & Capabilities */}
        <SkillsBento />

        {/* Career Timeline */}
        <ExperienceTimeline />

        {/* Giant Typography Contact Section */}
        <ContactSection onShowToast={showToast} />
      </main>

      {/* Mondragon 4 Swiss Minimalist Footer */}
      <footer className="py-12 border-t border-purple-900/10 bg-[#f7f5fa] text-neutral-600 text-xs">
        <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <span className="font-black text-black tracking-tight text-base font-sans">
              VISHNU
            </span>
            <span className="text-neutral-400">&bull;</span>
            <span>
              &copy; {new Date().getFullYear()} Er. Vishnu Ramachandra &bull; AI Engineer, Agentic Automation &amp; Robotics.
            </span>
          </div>

          <div className="flex items-center space-x-5 font-semibold text-black">
            <button
              onClick={() => {
                soundFX.playClick();
                setIsResumeOpen(true);
              }}
              className="hover:underline underline-offset-4"
            >
              Resume (CV)
            </button>
            <span className="text-neutral-300">&bull;</span>
            <a
              href="#contact"
              onClick={() => soundFX.playClick()}
              className="hover:underline underline-offset-4"
            >
              Direct Inquiries
            </a>
            <span className="text-neutral-300">&bull;</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center space-x-1 hover:underline underline-offset-4"
            >
              <span>Back to Top</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSwitchPortal={onSwitchPortal}
        onOpenResume={() => setIsResumeOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onShowToast={showToast}
      />

      {/* ATS-Optimized Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        onShowToast={showToast}
      />

      {/* Visitor Voice Greeting Bar (Kannada & English with 360 Audio) */}
      <VoiceGreetingBar />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-full bg-black text-white text-xs font-semibold shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-neutral-300 shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
};
