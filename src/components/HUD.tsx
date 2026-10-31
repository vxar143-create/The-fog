/**
 * Low-Occlusion In-Game HUD for Outpost Pioneer with multi-language support.
 * Renders perimeter status clusters (resources, day/night clock, wave radar, health)
 * with pointer-events: none so 85%+ of playfield is completely unobstructed.
 */

import React from 'react';
import {
  Shield,
  Heart,
  Zap,
  Sun,
  Moon,
  TreePine,
  Layers,
  Sparkles,
  Wheat,
  Coins,
  Skull,
  Swords,
  Sliders,
  Sparkle,
} from 'lucide-react';
import { GameEngine } from '../game/engine';
import { Language, TRANSLATIONS } from '../game/i18n';
import { Minimap } from './Minimap';

interface HUDProps {
  engine: GameEngine | null;
  language: Language;
  onOpenSettings: () => void;
}

export const HUD: React.FC<HUDProps> = ({ engine, language, onOpenSettings }) => {
  if (!engine) return null;

  const t = TRANSLATIONS[language];
  const res = engine.resources;
  const pStats = engine.playerStats;
  const wave = engine.waveInfo;
  const dayTime = engine.dayTime;

  // Check if player is near an unlooted exploration structure
  const nearbyLootStruct = engine.terrain.explorationStructures?.find(
    (s) => !s.looted && Math.hypot(s.x - engine.playerPos.x, s.z - engine.playerPos.z) < 4.2
  );

  // Day Phase Calculation
  const isNight = dayTime < 0.2 || dayTime > 0.8;
  const isDusk = dayTime >= 0.7 && dayTime <= 0.8;
  const isDawn = dayTime >= 0.2 && dayTime <= 0.3;

  let phaseLabel = t.daylight;
  if (isNight) phaseLabel = t.nightfall;
  else if (isDusk) phaseLabel = t.dusk;
  else if (isDawn) phaseLabel = t.dawn;

  const waveCountdownMin = Math.floor(Math.max(0, wave.timeUntilNextWave) / 60);
  const waveCountdownSec = Math.floor(Math.max(0, wave.timeUntilNextWave) % 60);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-4 md:p-6 select-none font-sans">
      {/* TOP ROW: Settlement Status & Resource Stockpiles */}
      <div className="flex items-start justify-between gap-4">
        {/* Top-Left: Settlement Crest, Day/Night Clock & Real-time Minimap */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1.5 pointer-events-auto bg-stone-900/90 border border-stone-700/80 rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white tracking-wide uppercase">
                  {t.settlementName}
                </div>
                <div className="text-[11px] text-stone-400 font-mono flex items-center gap-1.5">
                  <span>{t.colonists}: {engine.villagers.length}</span>
                  <span>·</span>
                  <span>{t.structures}: {engine.buildings.length}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1.5 border-t border-stone-800 text-xs font-mono">
              {isNight ? (
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span
                className={
                  isNight
                    ? 'text-indigo-400 font-semibold'
                    : isDusk
                    ? 'text-orange-400 font-semibold'
                    : 'text-stone-300'
                }
              >
                {phaseLabel}
              </span>
            </div>
          </div>

          {/* Real-time Navigation Minimap Radar */}
          <Minimap engine={engine} language={language} />
        </div>

        {/* Top-Center: Wave Defense Radar / Countdown Banner */}
        <div className="flex flex-col items-center">
          {wave.active ? (
            <div className="pointer-events-auto bg-red-950/90 border border-red-600/80 rounded-xl px-5 py-2.5 shadow-xl flex flex-col items-center animate-pulse">
              <div className="flex items-center gap-2 text-red-300 font-black tracking-widest text-xs uppercase">
                <Skull className="w-4 h-4 text-red-500" />
                <span>{t.waveInvasion} {wave.waveNumber}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm font-mono text-white">
                <span>{t.creaturesRemaining}</span>
                <span className="font-bold text-red-400 tabular-nums text-base">
                  {wave.enemiesRemaining} / {wave.totalEnemiesInWave}
                </span>
              </div>
            </div>
          ) : (
            <div className="pointer-events-auto bg-stone-900/90 border border-stone-700/80 rounded-xl px-4 py-2 shadow-lg flex items-center gap-3">
              <Swords className="w-4 h-4 text-amber-400" />
              <div className="text-xs font-mono">
                <span className="text-stone-400">{t.waveInbound} </span>
                <span className="text-amber-400 font-bold tabular-nums">
                  {waveCountdownMin}:{waveCountdownSec < 10 ? `0${waveCountdownSec}` : waveCountdownSec}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Top-Right: Resource Stockpiles Cluster & Settings Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 pointer-events-auto bg-stone-900/90 border border-stone-700/80 rounded-xl p-2.5 shadow-lg">
            {/* Wood */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800/80 border border-stone-700 text-xs font-mono"
              title={t.wood}
            >
              <TreePine className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-stone-200 font-bold tabular-nums">{Math.floor(res.wood)}</span>
            </div>

            {/* Stone */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800/80 border border-stone-700 text-xs font-mono"
              title={t.stone}
            >
              <Layers className="w-3.5 h-3.5 text-stone-300" />
              <span className="text-stone-200 font-bold tabular-nums">{Math.floor(res.stone)}</span>
            </div>

            {/* Iron */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800/80 border border-stone-700 text-xs font-mono"
              title={t.iron}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-stone-200 font-bold tabular-nums">{Math.floor(res.iron)}</span>
            </div>

            {/* Gold */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800/80 border border-stone-700 text-xs font-mono"
              title={t.gold}
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-bold tabular-nums">{Math.floor(res.gold)}</span>
            </div>

            {/* Food */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800/80 border border-stone-700 text-xs font-mono"
              title={t.food}
            >
              <Wheat className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-yellow-200 font-bold tabular-nums">{Math.floor(res.food)}</span>
            </div>
          </div>

          {/* Quick Settings Icon */}
          <button
            onClick={onOpenSettings}
            className="p-3 pointer-events-auto rounded-xl bg-stone-900/90 border border-stone-700/80 hover:border-amber-400 text-stone-300 hover:text-amber-300 transition-colors cursor-pointer shadow-lg"
            title={t.settings}
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BOTTOM-LEFT: Commander Health & Stamina Bars */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2 pointer-events-auto bg-stone-900/90 border border-stone-700/80 rounded-xl p-3 shadow-lg w-56">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            {t.commander}
          </div>

          {/* Health Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-stone-300 font-mono mb-1">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {t.health}
              </span>
              <span className="tabular-nums">
                {Math.max(0, Math.ceil(pStats.health))} / {pStats.maxHealth}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-150"
                style={{ width: `${Math.max(0, (pStats.health / pStats.maxHealth) * 100)}%` }}
              />
            </div>
          </div>

          {/* Stamina Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-stone-300 font-mono mb-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> {t.stamina}
              </span>
              <span className="tabular-nums">
                {Math.max(0, Math.ceil(pStats.stamina))} / {pStats.maxStamina}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-150"
                style={{ width: `${Math.max(0, (pStats.stamina / pStats.maxStamina) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Interactive Loot Ruin Prompt */}
        {nearbyLootStruct && !engine.activeGhostType && (
          <button
            onClick={() => engine.performPlayerAction()}
            className="pointer-events-auto bg-gradient-to-r from-amber-600/90 to-yellow-600/90 border border-amber-300 text-stone-950 font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce hover:scale-105 transition-all cursor-pointer"
          >
            <Sparkle className="w-5 h-5 fill-stone-950" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-950">
                [E / Left Click to Search]
              </span>
              <span className="text-sm font-black">
                {nearbyLootStruct.name}
              </span>
            </div>
          </button>
        )}

        {/* Quick Placement Action Hint */}
        {engine.activeGhostType && (
          <div className="pointer-events-auto bg-amber-950/90 border border-amber-500/80 rounded-xl px-4 py-2.5 text-xs text-amber-200 font-mono shadow-xl flex items-center gap-3">
            <span>{t.placing}: <strong className="text-white uppercase">{engine.activeGhostType}</strong></span>
            <span className="text-stone-400">·</span>
            <span><strong>Left Click:</strong> {t.confirm}</span>
            <span className="text-stone-400">·</span>
            <span><strong>R:</strong> {t.rotate}</span>
            <span className="text-stone-400">·</span>
            <span><strong>Esc:</strong> {t.cancel}</span>
          </div>
        )}
      </div>
    </div>
  );
};
