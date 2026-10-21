import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  X,
  Radio,
  Languages,
  Check
} from 'lucide-react';
import { soundFX } from './SoundFX';

export type GreetingLang = 'kn' | 'en' | 'bilingual';

interface GreetingInfo {
  lang: GreetingLang;
  label: string;
  nativeLabel: string;
  src: string;
  title: string;
  transliteration?: string;
}

const GREETINGS: Record<GreetingLang, GreetingInfo> = {
  kn: {
    lang: 'kn',
    label: 'Kannada',
    nativeLabel: 'ಕನ್ನಡ',
    src: '/audio/kannada_greeting.mp3',
    title: 'ವಿಷ್ಣು ರಾಮಚಂದ್ರ ಅವರಿಂದ ಇಂದಿನ ನಮಸ್ಕಾರಗಳು ನಿಮಗೆ',
    transliteration: 'Vishnu Ramachandra avarinda indina namaskaragalu nimage'
  },
  en: {
    lang: 'en',
    label: 'English',
    nativeLabel: 'English',
    src: '/audio/english_greeting.mp3',
    title: 'Hey Hi, Today\'s Greetings From Vishnu Ramachandra'
  },
  bilingual: {
    lang: 'bilingual',
    label: 'Both (KN + EN)',
    nativeLabel: 'ದ್ವಿಭಾಷೆ',
    src: '/audio/bilingual_kn_en.mp3',
    title: 'ವಿಷ್ಣು ರಾಮಚಂದ್ರ ಅವರಿಂದ ಇಂದಿನ ನಮಸ್ಕಾರಗಳು ನಿಮಗೆ • Hey Hi, Today\'s Greetings',
    transliteration: 'Bilingual Greeting (Kannada + English)'
  }
};

export const VoiceGreetingBar: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<GreetingLang>('kn');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and attempt auto-play on load
  useEffect(() => {
    const audio = new Audio(GREETINGS[currentLang].src);
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Web Speech synthesis fallback if MP3 fails to load on a specific device
    const playSynthesisFallback = () => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const text = currentLang === 'kn'
        ? 'ವಿಷ್ಣು ರಾಮಚಂದ್ರ ಅವರಿಂದ ಇಂದಿನ ನಮಸ್ಕಾರಗಳು ನಿಮಗೆ'
        : "Hey Hi, Today's Greetings From Vishnu Ramachandra";
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = currentLang === 'kn' ? 'kn-IN' : 'en-IN';
      utter.rate = 0.95;
      utter.onstart = () => setIsPlaying(true);
      utter.onend = () => {
        setIsPlaying(false);
        setProgress(0);
      };
      window.speechSynthesis.speak(utter);
    };

    audio.addEventListener('error', playSynthesisFallback);

    // Auto-play attempt
    const attemptPlay = async () => {
      try {
        await audio.play();
        setIsAutoplayBlocked(false);
        setIsPlaying(true);
      } catch (err) {
        // Modern browsers block autoplay without prior user interaction
        setIsAutoplayBlocked(true);

        // Listen for first interaction anywhere on page to trigger greeting automatically
        const unlockAudio = async () => {
          try {
            await audio.play();
            setIsAutoplayBlocked(false);
            setIsPlaying(true);
          } catch (e) {
            // User did not initiate audio gesture
          }
          window.removeEventListener('pointerdown', unlockAudio);
          window.removeEventListener('click', unlockAudio);
          window.removeEventListener('keydown', unlockAudio);
          window.removeEventListener('scroll', unlockAudio);
        };

        window.addEventListener('pointerdown', unlockAudio, { once: true });
        window.addEventListener('click', unlockAudio, { once: true });
        window.addEventListener('keydown', unlockAudio, { once: true });
        window.addEventListener('scroll', unlockAudio, { once: true });
      }
    };

    attemptPlay();

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', playSynthesisFallback);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // When user switches language
  const changeLanguage = (lang: GreetingLang) => {
    soundFX.playClick();
    setCurrentLang(lang);
    setProgress(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = GREETINGS[lang].src;
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsAutoplayBlocked(false);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  const togglePlay = () => {
    soundFX.playClick();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (progress >= 99) {
        audioRef.current.currentTime = 0;
      }
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsAutoplayBlocked(false);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  const replay = () => {
    soundFX.playClick();
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsAutoplayBlocked(false);
      })
      .catch(() => {});
  };

  const currentInfo = GREETINGS[currentLang];

  // If minimized, display a sleek compact floating button
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => {
            soundFX.playClick();
            setIsMinimized(false);
          }}
          className="group relative flex items-center space-x-2.5 px-3.5 py-2.5 rounded-full bg-purple-950 text-purple-100 text-xs font-mono shadow-2xl border border-purple-500/30 hover:scale-105 transition-all"
          title="Open Voice Greeting"
        >
          {isPlaying ? (
            <div className="flex items-center space-x-0.5 h-3">
              <span className="w-0.5 bg-purple-400 rounded-full animate-bounce" style={{ height: '100%', animationDuration: '0.6s' }} />
              <span className="w-0.5 bg-purple-400 rounded-full animate-bounce" style={{ height: '60%', animationDuration: '0.8s', animationDelay: '0.1s' }} />
              <span className="w-0.5 bg-purple-400 rounded-full animate-bounce" style={{ height: '80%', animationDuration: '0.5s', animationDelay: '0.2s' }} />
            </div>
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-purple-300 group-hover:scale-110 transition-transform" />
          )}
          <span className="font-bold text-[11px]">Vishnu Voice Greeting</span>
          <span className="text-[10px] text-purple-300 uppercase">[{currentLang}]</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-[92vw] sm:max-w-[360px] w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="relative rounded-2xl bg-[#faf8fd]/95 backdrop-blur-xl border border-purple-200/90 shadow-2xl shadow-purple-950/15 overflow-hidden p-3.5">
        {/* Playback progress bar at top edge */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-purple-100">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header Row: Title, Equalizer, Minimize */}
        <div className="flex items-center justify-between pb-2 border-b border-purple-100">
          <div className="flex items-center space-x-2">
            {/* Animated Audio Equalizer Bars */}
            <div className="flex items-center space-x-0.5 h-3.5 px-1 bg-purple-50 rounded border border-purple-200/60">
              <span
                className={`w-0.5 bg-purple-600 rounded-full transition-all ${
                  isPlaying ? 'animate-bounce' : 'h-1.5'
                }`}
                style={{ height: isPlaying ? '100%' : '30%', animationDuration: '0.5s' }}
              />
              <span
                className={`w-0.5 bg-purple-600 rounded-full transition-all ${
                  isPlaying ? 'animate-bounce' : 'h-2'
                }`}
                style={{ height: isPlaying ? '70%' : '40%', animationDuration: '0.7s', animationDelay: '0.1s' }}
              />
              <span
                className={`w-0.5 bg-purple-600 rounded-full transition-all ${
                  isPlaying ? 'animate-bounce' : 'h-1'
                }`}
                style={{ height: isPlaying ? '90%' : '20%', animationDuration: '0.4s', animationDelay: '0.2s' }}
              />
              <span
                className={`w-0.5 bg-purple-600 rounded-full transition-all ${
                  isPlaying ? 'animate-bounce' : 'h-2.5'
                }`}
                style={{ height: isPlaying ? '60%' : '50%', animationDuration: '0.6s', animationDelay: '0.15s' }}
              />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-900/60">
                PORTFOLIO VOICE GREETING
              </span>
              <span className="text-xs font-bold text-black font-sans leading-none">
                Er. Vishnu Ramachandra
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                soundFX.playClick();
                setIsMinimized(true);
              }}
              className="p-1 text-purple-400 hover:text-purple-950 hover:bg-purple-100/60 rounded-md transition-colors"
              title="Minimize greeting badge"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Spoken Text Transcript & Prompts */}
        <div className="py-2.5">
          {isAutoplayBlocked && !isPlaying ? (
            <div
              onClick={togglePlay}
              className="cursor-pointer p-2 rounded-lg bg-purple-50 border border-purple-200/90 hover:bg-purple-100/80 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-purple-600 animate-pulse shrink-0" />
                <span className="text-xs font-semibold text-purple-950">
                  Tap to hear Vishnu's Welcome Voice
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-purple-700 text-white rounded-full group-hover:scale-105 transition-transform">
                PLAY
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xs font-medium text-black leading-snug">
                "{currentInfo.title}"
              </p>
              {currentInfo.transliteration && (
                <p className="text-[11px] font-mono text-purple-900/60 italic">
                  [{currentInfo.transliteration}]
                </p>
              )}
            </div>
          )}
        </div>

        {/* Controls: Play/Pause, Replay, and Language Selectors */}
        <div className="flex items-center justify-between pt-2 border-t border-purple-100 text-xs">
          {/* Audio Transport Buttons */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={togglePlay}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-purple-950 hover:bg-black text-white font-mono font-bold text-[11px] transition-all shadow-sm"
              title={isPlaying ? 'Pause Greeting' : 'Play Greeting'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 fill-current text-purple-200" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current text-purple-200" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              onClick={replay}
              className="p-1.5 rounded-full border border-purple-200 hover:border-purple-950 text-purple-800 hover:text-black transition-colors"
              title="Replay Voice Greeting from start"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Language Selection Pills */}
          <div className="flex items-center space-x-1 bg-purple-100/60 p-0.5 rounded-full border border-purple-200">
            <button
              onClick={() => changeLanguage('kn')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                currentLang === 'kn'
                  ? 'bg-purple-950 text-white shadow-xs'
                  : 'text-purple-900/70 hover:text-purple-950'
              }`}
              title="Kannada: ವಿಷ್ಣು ರಾಮಚಂದ್ರ ಅವರಿಂದ ಇಂದಿನ ನಮಸ್ಕಾರಗಳು ನಿಮಗೆ"
            >
              ಕನ್ನಡ (KN)
            </button>

            <button
              onClick={() => changeLanguage('en')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                currentLang === 'en'
                  ? 'bg-purple-950 text-white shadow-xs'
                  : 'text-purple-900/70 hover:text-purple-950'
              }`}
              title="English: Hey Hi, Today's Greetings From Vishnu Ramachandra"
            >
              English (EN)
            </button>

            <button
              onClick={() => changeLanguage('bilingual')}
              className={`px-2 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                currentLang === 'bilingual'
                  ? 'bg-purple-950 text-white shadow-xs'
                  : 'text-purple-900/70 hover:text-purple-950'
              }`}
              title="Both Kannada & English Greetings"
            >
              Both
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
