import React, { useState, useEffect } from 'react';
import {
  Search,
  Command,
  ExternalLink,
  Store,
  Boxes,
  Cpu,
  FileText,
  Mail,
  Volume2,
  VolumeX,
  Layers,
  Sparkles,
  ArrowRight,
  Terminal,
  User,
  X
} from 'lucide-react';
import { soundFX } from './SoundFX';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchPortal: (portal: 'customer' | 'crm') => void;
  onOpenResume: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSwitchPortal,
  onOpenResume,
  soundEnabled,
  onToggleSound,
  onShowToast
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = [
    {
      id: 'about',
      title: 'About Er. Vishnu Ramachandra (Philosophy & 10th VTU Rank)',
      category: 'About Me',
      icon: User,
      badge: '9.11 CGPA',
      perform: () => {
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'proj-agribot',
      title: 'AgriBot — 6-DOF Agricultural Mobile Robot (Grant-Funded)',
      category: 'Flagship Project',
      icon: Cpu,
      badge: 'Seed Grant Awarded',
      perform: () => {
        const el = document.getElementById('projects');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'proj-agentic-os',
      title: 'One-Man Agentic OS — Multi-Agent System',
      category: 'Featured Project',
      icon: Sparkles,
      badge: 'Hermes & Claude',
      perform: () => {
        const el = document.getElementById('projects');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'proj-omni',
      title: 'Launch OmniCommerce (Customer Portal ↗)',
      category: 'Project Demo',
      icon: Store,
      badge: 'Live Platform',
      perform: () => window.open('/customer-portal.html', '_blank')
    },
    {
      id: 'proj-crm',
      title: 'Launch OmniCommerce (Employee CRM ↗)',
      category: 'Project Demo',
      icon: Boxes,
      badge: 'Back-Office Engine',
      perform: () => window.open('/employee-crm.html', '_blank')
    },
    {
      id: 'proj-cad',
      title: 'B2B Engineering 3D Designs & Localization (Venttup)',
      category: 'Manufacturing',
      icon: Layers,
      badge: 'Fusion 360',
      perform: () => {
        const el = document.getElementById('projects');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'ai-sandbox',
      title: 'Jump to AI Agent Console & Digital Twin',
      category: 'Interactive',
      icon: Terminal,
      badge: 'Digital Twin',
      perform: () => {
        const el = document.getElementById('ai-sandbox');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'architecture',
      title: 'View Cyber-Physical System Blueprint',
      category: 'Architecture',
      icon: Layers,
      badge: '4 Layers',
      perform: () => {
        const el = document.getElementById('architecture');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'skills',
      title: 'Explore Technical Matrix & Capabilities Bento',
      category: 'Portfolio',
      icon: Terminal,
      badge: 'Skills',
      perform: () => {
        const el = document.getElementById('skills');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'resume',
      title: 'Open Comprehensive Resume (Print / PDF)',
      category: 'Credentials',
      icon: FileText,
      badge: 'ATS-Ready',
      perform: () => onOpenResume()
    },
    {
      id: 'email',
      title: "Copy Vishnu's Direct Email (nothingsvishnu@gmail.com)",
      category: 'Contact',
      icon: Mail,
      badge: 'nothingsvishnu@gmail.com',
      perform: () => {
        navigator.clipboard.writeText('nothingsvishnu@gmail.com');
        onShowToast('Copied nothingsvishnu@gmail.com to clipboard!', 'success');
      }
    },
    {
      id: 'sound',
      title: soundEnabled ? 'Mute Sound Effects' : 'Enable Futuristic Audio SFX',
      category: 'Preferences',
      icon: soundEnabled ? VolumeX : Volume2,
      badge: soundEnabled ? 'Active' : 'Muted',
      perform: () => onToggleSound()
    }
  ];

  const filteredActions = actions.filter((act) =>
    act.title.toLowerCase().includes(query.toLowerCase()) ||
    act.category.toLowerCase().includes(query.toLowerCase()) ||
    (act.badge && act.badge.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
          soundFX.playClick();
          // parent controls open
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      } else if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % (filteredActions.length || 1));
          soundFX.playClick();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % (filteredActions.length || 1));
          soundFX.playClick();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredActions[selectedIndex]) {
            soundFX.playSuccess();
            filteredActions[selectedIndex].perform();
            onClose();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={() => {
          soundFX.playClick();
          onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-[#0c101a] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/50 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/60">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, projects, architecture, contact... (↑↓ to select)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none font-sans"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Action Results */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredActions.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No matching actions found for "{query}".
            </div>
          ) : (
            filteredActions.map((action, idx) => {
              const Icon = action.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={action.id}
                  onClick={() => {
                    soundFX.playSuccess();
                    action.perform();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/60 to-indigo-950/40 border border-cyan-500/30 text-white'
                      : 'text-slate-300 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium flex items-center gap-2">
                        <span>{action.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{action.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {action.badge && (
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-cyan-300">
                        {action.badge}
                      </span>
                    )}
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'} transition-transform`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span>Navigation: <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-300">↑</kbd> <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-300">↓</kbd></span>
            <span>Execute: <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-300">↵ Enter</kbd></span>
          </div>
          <span className="text-cyan-400 font-mono">Vish Systems Engine</span>
        </div>
      </div>
    </div>
  );
};
