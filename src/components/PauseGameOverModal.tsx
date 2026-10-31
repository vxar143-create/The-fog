/**
 * Pause & Game Over Modal for Outpost Pioneer with multi-language support.
 */

import React from 'react';
import { RefreshCw, Play, ShieldAlert, Award } from 'lucide-react';
import { GameEngine } from '../game/engine';
import { Language, TRANSLATIONS } from '../game/i18n';

interface ModalProps {
  engine: GameEngine | null;
  language: Language;
  onResume: () => void;
  onRestart: () => void;
}

export const PauseGameOverModal: React.FC<ModalProps> = ({
  engine,
  language,
  onResume,
  onRestart,
}) => {
  if (!engine) return null;
  if (!engine.isPaused && !engine.isGameOver) return null;

  const t = TRANSLATIONS[language];
  const isGameOver = engine.isGameOver;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 pointer-events-auto select-none font-sans">
      <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-2xl p-6 shadow-2xl text-stone-100 flex flex-col items-center text-center">
        {/* Status Icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
            isGameOver
              ? 'bg-red-500/20 border border-red-500/40 text-red-500'
              : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
          }`}
        >
          {isGameOver ? (
            <ShieldAlert className="w-8 h-8" />
          ) : (
            <Award className="w-8 h-8" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold uppercase tracking-wide">
          {isGameOver ? t.colonyOverrun : t.expeditionPaused}
        </h2>

        <p className="mt-2 text-sm text-stone-300 leading-relaxed">
          {isGameOver ? t.overrunDesc : t.pausedDesc}
        </p>

        {/* Stats Summary */}
        <div className="my-6 w-full grid grid-cols-2 gap-2 text-left text-xs font-mono">
          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
            <div className="text-stone-400">{t.wavesSurvived}</div>
            <div className="text-lg font-bold text-amber-400">
              {engine.waveInfo.waveNumber - 1}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
            <div className="text-stone-400">{t.colonistsThriving}</div>
            <div className="text-lg font-bold text-emerald-400">
              {engine.villagers.length}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
            <div className="text-stone-400">{t.structuresBuilt}</div>
            <div className="text-lg font-bold text-cyan-400">
              {engine.buildings.length}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
            <div className="text-stone-400">{t.goldAmassed}</div>
            <div className="text-lg font-bold text-yellow-400">
              {Math.floor(engine.resources.gold)}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {!isGameOver && (
            <button
              onClick={onResume}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              <span>{t.resumeExpedition}</span>
            </button>
          )}

          <button
            onClick={onRestart}
            className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-stone-600 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isGameOver ? t.restartColony : t.tryAgain}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
