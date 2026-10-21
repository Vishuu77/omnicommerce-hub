import React, { useState, useRef, useEffect } from 'react';
import { Award, ShieldCheck, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { PORTFOLIO_IMAGES } from '../../config/portfolioImages';
import { soundFX } from './SoundFX';

export const HeroGlobe3D: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glintPos, setGlintPos] = useState({ x: 50, y: 30 });
  const [isSigned, setIsSigned] = useState(false);

  // Trigger smooth signature write-in effect on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSigned(true);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Smooth mouse tilt parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      x: -ny * 10,
      y: nx * 12
    });

    setGlintPos({
      x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
      y: Math.round(((e.clientY - rect.top) / rect.height) * 100)
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlintPos({ x: 50, y: 30 });
  };

  const handleCardClick = () => {
    soundFX.playClick();
    // Replay signature flourish
    setIsSigned(false);
    setTimeout(() => setIsSigned(true), 100);
  };

  return (
    <div className="relative w-full max-w-[390px] lg:max-w-[410px] select-none flex flex-col items-center">
      {/* Ambient Lavender & Rose Glow Behind Plaque */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-purple-400/25 via-rose-300/20 to-indigo-300/20 blur-2xl rounded-3xl pointer-events-none -z-10" />

      {/* Main Signed Executive Monograph Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        style={{
          perspective: '1200px',
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.45s ease-out'
        }}
        className="w-full rounded-3xl overflow-hidden border border-purple-200/90 shadow-2xl shadow-purple-950/20 bg-gradient-to-b from-white via-[#faf6fe] to-[#f2e9fa] relative flex flex-col group cursor-pointer"
        title="Er. Vishnu Ramachandra — Executive Signed Monograph (Click to re-sign)"
      >
        {/* Dynamic Specular Glass Sheen (follows cursor) */}
        <div
          style={{
            background: `radial-gradient(circle 320px at ${glintPos.x}% ${glintPos.y}%, rgba(255,255,255,0.7), transparent 75%)`
          }}
          className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300 opacity-60 group-hover:opacity-100"
        />

        {/* Top Archival Header Bar */}
        <div className="relative z-30 pt-4 px-5 pb-2 flex items-center justify-between border-b border-purple-900/10">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-purple-950">
              Executive Monograph
            </span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-100/80 border border-purple-200/90 text-[10px] font-mono font-semibold text-purple-950">
            <Award className="w-3 h-3 text-purple-700" />
            <span>VTU 10th Rank</span>
          </div>
        </div>

        {/* Portrait Studio Frame with Ambient Light */}
        <div className="relative w-full h-[340px] sm:h-[370px] overflow-hidden flex items-end justify-center bg-gradient-to-b from-[#f7effe] via-[#ede0f9] to-[#dfcefa]">
          {/* Studio Radial Backdrop Halo */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.95),rgba(192,132,252,0.3)_65%)] pointer-events-none" />

          {/* High-Definition Developer Portrait */}
          <img
            src={PORTFOLIO_IMAGES.heroPortrait}
            alt="Er. Vishnu Ramachandra"
            className="w-full h-full object-contain object-bottom pt-4 drop-shadow-2xl transition-transform duration-700 group-hover:scale-105 relative z-10"
            loading="eager"
          />

          {/* Subtle bottom shadow vignette to blend portrait into signature overlay */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f2e9fa] via-[#f2e9fa]/70 to-transparent z-15 pointer-events-none" />

          {/* Authentic Handwritten Red Ink Signature (Signed gracefully across lower third) */}
          <div className="absolute inset-x-3 bottom-1 z-25 flex flex-col items-center pointer-events-none">
            <div className="relative w-full max-w-[320px] h-28 flex items-center justify-center">
              <img
                src={PORTFOLIO_IMAGES.signatureTransparent}
                alt="Signature of Er. Vishnu Ramachandra"
                style={{
                  clipPath: isSigned ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                  transition: 'clip-path 1.4s cubic-bezier(0.25, 1, 0.5, 1)',
                  filter: 'drop-shadow(0 4px 10px rgba(185, 28, 28, 0.45)) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.15))'
                }}
                className="w-full h-full object-contain transform -rotate-2 select-none"
              />

              {/* Shimmer sweep glint across signature */}
              <div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{
                  clipPath: isSigned ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                  transition: 'clip-path 1.4s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
              >
                <div className="w-16 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] animate-[shimmer_4.5s_infinite]" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Archival Metadata & Verification Strip */}
        <div className="relative z-30 py-3.5 px-5 bg-white/95 border-t border-purple-900/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-xs font-black tracking-tight text-black font-sans flex items-center gap-1.5">
              <span>Er. Vishnu Ramachandra</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </div>
            <div className="text-[10px] font-mono text-neutral-500">
              Autonomous Systems &bull; B.E. Robotics &amp; AI
            </div>
          </div>

          {/* Archival Red Seal Stamp */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            <span className="text-[9px] font-mono font-bold tracking-wider">
              SIGNED &bull; 2026
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Caption Under Plaque */}
      <div className="mt-3 text-center">
        <span className="text-[11px] font-mono text-neutral-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-purple-600" />
          <span>Interactive signed monograph &bull; Click to re-sign</span>
        </span>
      </div>
    </div>
  );
};

export const RevolvingSign3D = HeroGlobe3D;
export const SignedPortraitBadge = HeroGlobe3D;
