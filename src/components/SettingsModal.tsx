/**
 * Comprehensive Settings Modal for Outpost Pioneer.
 * Supports:
 * - Language switcher: English, Ukrainian (Українська), Polish (Polski)
 * - Audio: Mute & Volume slider
 * - Visual: Dynamic Shadows & Screen Shake
 * - Camera: Distance presets (Close, Normal, Wide)
 * - Difficulty: Explorer, Survivor, Nightmare
 * - Controls reference table
 */

import React from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Languages,
  Eye,
  Sliders,
  ShieldAlert,
  Keyboard,
  Check,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../game/i18n';
import { sound } from '../game/audio';
import { GameEngine } from '../game/engine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  engine: GameEngine | null;
  onStateUpdate: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  engine,
  onStateUpdate,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language];
  const isMuted = sound.getMuted();
  const volume = Math.round(sound.getVolume() * 100);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) / 100;
    sound.setVolume(val);
    if (sound.getMuted()) sound.setMuted(false);
    onStateUpdate();
  };

  const handleToggleMute = () => {
    sound.toggleMute();
    onStateUpdate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 pointer-events-auto select-none font-sans">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-stone-900 border border-stone-700 rounded-2xl p-5 md:p-6 shadow-2xl text-stone-100 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold uppercase tracking-wide text-white font-serif">
              {t.settingsTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. LANGUAGE SELECTOR */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Languages className="w-4 h-4" />
            <span>{t.languageLabel}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
              { code: 'uk' as Language, label: 'Українська', flag: '🇺🇦' },
              { code: 'pl' as Language, label: 'Polski', flag: '🇵🇱' },
            ].map((item) => (
              <button
                key={item.code}
                onClick={() => {
                  onLanguageChange(item.code);
                  if (engine) engine.setLanguage(item.code);
                }}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  language === item.code
                    ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-stone-800/80 hover:bg-stone-800 border-stone-700 text-stone-300'
                }`}
              >
                <span>{item.flag}</span>
                <span>{item.label}</span>
                {language === item.code && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>

        {/* 2. AUDIO & SOUND */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-stone-800">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Volume2 className="w-4 h-4" />
            <span>{t.audioSettings}</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-300">{t.muteAudio}</span>
              <button
                onClick={handleToggleMute}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isMuted
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isMuted ? 'Muted' : 'Active'}</span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-stone-400 font-mono">
                <span>{t.soundVolume}</span>
                <span>{isMuted ? '0%' : `${volume}%`}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full accent-amber-500 h-1.5 bg-stone-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3. VISUALS & CAMERA */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-stone-800">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Eye className="w-4 h-4" />
            <span>{t.graphicsSettings}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Screen Shake */}
            <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 flex items-center justify-between">
              <span className="text-xs text-stone-300">{t.screenShake}</span>
              <button
                onClick={() => {
                  if (engine) {
                    engine.setScreenShakeEnabled(!engine.screenShakeEnabled);
                    onStateUpdate();
                  }
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                  engine?.screenShakeEnabled
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-700 text-stone-400'
                }`}
              >
                {engine?.screenShakeEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Dynamic Shadows */}
            <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 flex items-center justify-between">
              <span className="text-xs text-stone-300">{t.shadows}</span>
              <button
                onClick={() => {
                  if (engine) {
                    engine.setShadowsEnabled(!engine.shadowsEnabled);
                    onStateUpdate();
                  }
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                  engine?.shadowsEnabled
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-700 text-stone-400'
                }`}
              >
                {engine?.shadowsEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Camera Distance */}
          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 flex flex-col gap-2">
            <span className="text-xs text-stone-300 font-mono">{t.cameraDistance}</span>
            <div className="grid grid-cols-3 gap-2">
              {(['close', 'medium', 'far'] as const).map((dist) => (
                <button
                  key={dist}
                  onClick={() => {
                    if (engine) {
                      engine.setCameraDistance(dist);
                      onStateUpdate();
                    }
                  }}
                  className={`py-1.5 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                    engine?.cameraDistanceSetting === dist
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-900 hover:bg-stone-700 text-stone-300'
                  }`}
                >
                  {dist === 'close' ? t.camClose : dist === 'medium' ? t.camMedium : t.camFar}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. EXPEDITION DIFFICULTY */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-stone-800">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>{t.gameplaySettings}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(
              [
                { id: 'peaceful' as const, label: t.diffPeaceful, color: 'text-emerald-400' },
                { id: 'normal' as const, label: t.diffNormal, color: 'text-amber-400' },
                { id: 'brutal' as const, label: t.diffBrutal, color: 'text-red-400' },
              ]
            ).map((diff) => (
              <button
                key={diff.id}
                onClick={() => {
                  if (engine) {
                    engine.setDifficulty(diff.id);
                    onStateUpdate();
                  }
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  engine?.difficulty === diff.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/50'
                    : 'bg-stone-800/80 hover:bg-stone-800 border-stone-700 text-stone-400'
                }`}
              >
                <span className={diff.color}>{diff.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. CONTROLS GUIDE TABLE */}
        <div className="flex flex-col gap-2 pt-2 border-t border-stone-800">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-wider">
            <Keyboard className="w-4 h-4" />
            <span>{t.controls}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 rounded-lg bg-stone-800/60 border border-stone-700/60">
              <span className="text-amber-400 font-bold">WASD / Arrows</span>
              <div className="text-[11px] text-stone-400">{t.move}</div>
            </div>
            <div className="p-2 rounded-lg bg-stone-800/60 border border-stone-700/60">
              <span className="text-amber-400 font-bold">Shift</span>
              <div className="text-[11px] text-stone-400">{t.sprint}</div>
            </div>
            <div className="p-2 rounded-lg bg-stone-800/60 border border-stone-700/60">
              <span className="text-amber-400 font-bold">Left Click / F</span>
              <div className="text-[11px] text-stone-400">{t.action}</div>
            </div>
            <div className="p-2 rounded-lg bg-stone-800/60 border border-stone-700/60">
              <span className="text-amber-400 font-bold">R</span>
              <div className="text-[11px] text-stone-400">{t.rotate}</div>
            </div>
            <div className="p-2 rounded-lg bg-stone-800/60 border border-stone-700/60">
              <span className="text-amber-400 font-bold">H</span>
              <div className="text-[11px] text-stone-400">{t.hideControls}</div>
            </div>
            <div className="p-2 rounded-lg bg-stone-800/60 border border-stone-700/60">
              <span className="text-amber-400 font-bold">Esc</span>
              <div className="text-[11px] text-stone-400">{t.pause}</div>
            </div>
          </div>
        </div>

        {/* Footer Apply Button */}
        <div className="pt-3 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-lg"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
