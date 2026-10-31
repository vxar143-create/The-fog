/**
 * Atmospheric Title Screen for Outpost Pioneer.
 * Features bespoke SVG title lockup, expedition start CTA, language quick-toggle,
 * settings modal launcher, and localized control hints.
 */

import React from 'react';
import { Shield, Sparkles, Volume2, VolumeX, Sliders, Languages } from 'lucide-react';
import { Language, TRANSLATIONS } from '../game/i18n';

interface TitleScreenProps {
  onStartGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenSettings: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  isMuted,
  onToggleMute,
  language,
  onLanguageChange,
  onOpenSettings,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-between p-6 md:p-12 pointer-events-auto bg-gradient-to-b from-stone-950/75 via-stone-900/40 to-stone-950/90 text-stone-100 select-none">
      {/* Top Bar with Audio & Settings */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-amber-400 font-semibold tracking-wider text-xs uppercase px-3 py-1.5 rounded-xl bg-stone-900/90 border border-amber-500/30 shadow-md">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>{t.subtitle}</span>
        </div>

        {/* Quick Language Switcher & Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Language Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-stone-900/90 border border-stone-700/80 shadow-md">
            {[
              { code: 'en' as Language, label: 'EN' },
              { code: 'uk' as Language, label: 'УКР' },
              { code: 'pl' as Language, label: 'PL' },
            ].map((item) => (
              <button
                key={item.code}
                onClick={() => onLanguageChange(item.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  language === item.code
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-700/80 hover:border-amber-400 text-stone-300 hover:text-amber-300 transition-colors cursor-pointer shadow-md flex items-center gap-1.5 text-xs font-mono"
            title={t.settings}
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">{t.settings}</span>
          </button>

          {/* Audio Mute Button */}
          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-700/80 hover:border-amber-400 text-stone-300 hover:text-amber-300 transition-colors cursor-pointer shadow-md"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Hero Centerpiece: Bespoke Title Lockup */}
      <div className="max-w-2xl my-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-12 bg-amber-500" />
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">
            {t.subtitle}
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white uppercase drop-shadow-md font-serif">
          Outpost <span className="text-amber-400">Pioneer</span>
        </h1>

        <p className="mt-4 text-base md:text-lg text-stone-300 leading-relaxed max-w-xl font-sans">
          {t.tagline}
        </p>

        {/* Start Expedition CTA & Settings */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onStartGame}
            className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-lg tracking-wide uppercase shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] flex items-center gap-3 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>{t.startExpedition}</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="px-6 py-4 rounded-xl bg-stone-800/90 hover:bg-stone-700 active:bg-stone-800 text-stone-200 font-bold text-base tracking-wide uppercase border border-stone-600 transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>{t.settings}</span>
          </button>
        </div>
      </div>

      {/* Flat Control Hints Line */}
      <div className="pt-6 border-t border-stone-800/80 flex flex-wrap items-center justify-between text-xs text-stone-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-stone-300 font-bold">WASD</span>
          <span>{t.move}</span>
          <span className="text-stone-600 mx-1">·</span>
          <span className="text-stone-300 font-bold">Shift</span>
          <span>{t.sprint}</span>
          <span className="text-stone-600 mx-1">·</span>
          <span className="text-stone-300 font-bold">Left Click / F</span>
          <span>{t.action}</span>
          <span className="text-stone-600 mx-1">·</span>
          <span className="text-stone-300 font-bold">B</span>
          <span>{t.buildMode}</span>
          <span className="text-stone-600 mx-1">·</span>
          <span className="text-stone-300 font-bold">Esc</span>
          <span>{t.pause}</span>
        </div>
        <div className="mt-2 md:mt-0 text-stone-500">
          WebGL PBR · English / Українська / Polski
        </div>
      </div>
    </div>
  );
};
