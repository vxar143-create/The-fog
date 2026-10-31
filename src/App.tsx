/**
 * Outpost Pioneer - Main React Application Container
 * Full-bleed 3D viewport with isolated WebGL canvas mount ref, low-occlusion HUD,
 * collapsible bottom dock, settings modal, and multi-language support (English, Ukrainian, Polish).
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/engine';
import { TitleScreen } from './components/TitleScreen';
import { HUD } from './components/HUD';
import { BottomDock } from './components/BottomDock';
import { PauseGameOverModal } from './components/PauseGameOverModal';
import { SettingsModal } from './components/SettingsModal';
import { sound } from './game/audio';
import { Language } from './game/i18n';

export default function App() {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gamePhase, setGamePhase] = useState<'title' | 'playing'>('title');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('outpost_pioneer_lang');
    if (saved === 'uk' || saved === 'pl' || saved === 'en') return saved;
    return 'en';
  });
  const [, setTick] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Force re-render for UI sync without touching canvas
  const handleEngineStateUpdate = useCallback(() => {
    setTick((prev) => prev + 1);
  }, []);

  // Initialize Three.js Engine once on mount
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const engine = new GameEngine(canvasContainerRef.current, handleEngineStateUpdate);
    engine.setLanguage(language);
    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [handleEngineStateUpdate]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('outpost_pioneer_lang', newLang);
    if (engineRef.current) {
      engineRef.current.setLanguage(newLang);
    }
    handleEngineStateUpdate();
  };

  const handleStartGame = () => {
    setGamePhase('playing');
    sound.playVictory();
  };

  const handleResume = () => {
    if (engineRef.current) {
      engineRef.current.isPaused = false;
      handleEngineStateUpdate();
    }
  };

  const handleRestart = () => {
    if (!canvasContainerRef.current) return;
    if (engineRef.current) {
      engineRef.current.destroy();
    }
    const engine = new GameEngine(canvasContainerRef.current, handleEngineStateUpdate);
    engine.setLanguage(language);
    engineRef.current = engine;
    setGamePhase('playing');
    handleEngineStateUpdate();
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    handleEngineStateUpdate();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-sans select-none">
      {/* Isolated 3D WebGL Canvas Container */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
      />

      {/* Title Screen Overlay */}
      {gamePhase === 'title' && (
        <TitleScreen
          onStartGame={handleStartGame}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          language={language}
          onLanguageChange={handleLanguageChange}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* In-Game Low-Occlusion HUD */}
      {gamePhase === 'playing' && (
        <>
          <HUD
            engine={engineRef.current}
            language={language}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
          <BottomDock
            engine={engineRef.current}
            language={language}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onStateUpdate={handleEngineStateUpdate}
          />
          <PauseGameOverModal
            engine={engineRef.current}
            language={language}
            onResume={handleResume}
            onRestart={handleRestart}
          />
        </>
      )}

      {/* Universal Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        onLanguageChange={handleLanguageChange}
        engine={engineRef.current}
        onStateUpdate={handleEngineStateUpdate}
      />
    </div>
  );
}
