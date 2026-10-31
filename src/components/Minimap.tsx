/**
 * Real-Time 3D World Minimap for Outpost Pioneer.
 * Renders high-performance top-down radar canvas displaying:
 * - Player position & facing direction chevron
 * - Colony center & perimeter defense ring
 * - Colony buildings & walls
 * - Colonists / Villagers (color-coded by role)
 * - Invading hostile creatures (pulsing red dots)
 * - 30 Exploration structures & loot caches (gold/cyan diamonds)
 * - Zoom controls (+ / -) and Expand / Compact mode toggle
 */

import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Compass, MapPin } from 'lucide-react';
import { GameEngine } from '../game/engine';
import { Language, TRANSLATIONS } from '../game/i18n';

interface MinimapProps {
  engine: GameEngine | null;
  language: Language;
}

export const Minimap: React.FC<MinimapProps> = ({ engine, language }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.2); // 0.8x to 2.2x

  const t = TRANSLATIONS[language];

  useEffect(() => {
    let animId = 0;

    const renderMinimap = () => {
      if (!canvasRef.current || !engine) {
        animId = requestAnimationFrame(renderMinimap);
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = canvas.width;
      const center = size / 2;
      const scale = (size / 220) * zoomLevel;

      ctx.clearRect(0, 0, size, size);

      // Radar Background & Grid
      ctx.fillStyle = '#111822';
      ctx.fillRect(0, 0, size, size);

      // Save context for player-centered transformation
      ctx.save();
      ctx.translate(center, center);

      const px = engine.playerPos.x;
      const pz = engine.playerPos.z;

      // 1. World Boundaries & Shading
      // Lake area (near 45, 45)
      const lakeScreenX = (45 - px) * scale;
      const lakeScreenZ = (45 - pz) * scale;
      ctx.beginPath();
      ctx.arc(lakeScreenX, lakeScreenZ, 30 * scale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(27, 73, 101, 0.45)';
      ctx.fill();

      // 2. Colony Defense Perimeter (Radius ~26m from origin 0, 0)
      const baseOriginX = (0 - px) * scale;
      const baseOriginZ = (0 - pz) * scale;

      ctx.beginPath();
      ctx.arc(baseOriginX, baseOriginZ, 26 * scale, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Colony Center Marker
      ctx.beginPath();
      ctx.arc(baseOriginX, baseOriginZ, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. Placed Colony Buildings
      for (const bld of engine.buildings) {
        const bx = (bld.x - px) * scale;
        const bz = (bld.z - pz) * scale;

        ctx.fillStyle =
          bld.type === 'watchtower'
            ? '#38bdf8'
            : bld.type === 'palisade' || bld.type === 'stone_wall'
            ? '#a16207'
            : bld.type === 'farm' || bld.type === 'windmill'
            ? '#eab308'
            : '#94a3b8';

        ctx.fillRect(bx - 3, bz - 3, 6, 6);
      }

      // 4. 30 Exploration Structures with Loot
      if (engine.terrain.explorationStructures) {
        for (const struct of engine.terrain.explorationStructures) {
          const sx = (struct.x - px) * scale;
          const sz = (struct.z - pz) * scale;

          ctx.save();
          ctx.translate(sx, sz);
          ctx.rotate(Math.PI / 4);

          if (!struct.looted) {
            // Unlooted Glowing Diamond
            ctx.fillStyle = '#00f5d4';
            ctx.fillRect(-3.5, -3.5, 7, 7);
            ctx.strokeStyle = '#ffd166';
            ctx.lineWidth = 1;
            ctx.strokeRect(-3.5, -3.5, 7, 7);
          } else {
            // Looted Dim Marker
            ctx.fillStyle = '#475569';
            ctx.fillRect(-2, -2, 4, 4);
          }
          ctx.restore();
        }
      }

      // 5. Villagers (Color-coded)
      for (const vil of engine.villagers) {
        const vx = (vil.x - px) * scale;
        const vz = (vil.z - pz) * scale;

        ctx.beginPath();
        ctx.arc(vx, vz, 3, 0, Math.PI * 2);
        ctx.fillStyle =
          vil.role === 'guard'
            ? '#60a5fa'
            : vil.role === 'farmer'
            ? '#4ade80'
            : vil.role === 'miner'
            ? '#cbd5e1'
            : '#facc15';
        ctx.fill();
      }

      // 6. Hostile Creatures (Pulsing Red)
      const pulse = (Math.sin(performance.now() * 0.008) + 1) * 0.5;
      for (const en of engine.enemies) {
        const ex = (en.x - px) * scale;
        const ez = (en.z - pz) * scale;

        ctx.beginPath();
        ctx.arc(ex, ez, 3.5 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ef233c';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();

      // 7. Player Indicator (Fixed at radar center, pointing in direction)
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(engine.playerRotation);

      // Directional arrow
      ctx.beginPath();
      ctx.moveTo(0, -7);
      ctx.lineTo(5, 6);
      ctx.lineTo(0, 3);
      ctx.lineTo(-5, 6);
      ctx.closePath();
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // 8. Compass Cardinal Points
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('N', center, 14);
      ctx.fillText('S', center, size - 4);
      ctx.fillText('W', 10, center + 4);
      ctx.fillText('E', size - 10, center + 4);

      animId = requestAnimationFrame(renderMinimap);
    };

    animId = requestAnimationFrame(renderMinimap);
    return () => cancelAnimationFrame(animId);
  }, [engine, zoomLevel]);

  if (!engine) return null;

  const currentX = Math.round(engine.playerPos.x);
  const currentZ = Math.round(engine.playerPos.z);
  const lootedCount = engine.terrain.explorationStructures?.filter((s) => s.looted).length || 0;
  const totalRuins = engine.terrain.explorationStructures?.length || 30;

  return (
    <div
      className={`pointer-events-auto flex flex-col bg-stone-900/95 border border-stone-700/90 rounded-2xl p-2 shadow-2xl backdrop-blur-none transition-all duration-300 ${
        isExpanded ? 'w-72' : 'w-48'
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-1.5 pb-1 text-[11px] font-mono text-stone-300 border-b border-stone-800">
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>RADAR</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Zoom In / Out */}
          <button
            onClick={() => setZoomLevel((z) => Math.min(2.4, z + 0.3))}
            className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.3))}
            className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>

          {/* Expand / Minimize */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Radar Canvas */}
      <div className="relative mt-1.5 rounded-xl overflow-hidden border border-stone-800 flex justify-center bg-stone-950">
        <canvas
          ref={canvasRef}
          width={isExpanded ? 270 : 176}
          height={isExpanded ? 270 : 176}
          className="rounded-xl block"
        />
      </div>

      {/* Footer Info: Coordinates & Loot Structures Found */}
      <div className="mt-1.5 px-1 flex items-center justify-between text-[10px] font-mono text-stone-400">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-cyan-400" />
          <span>X:{currentX} Z:{currentZ}</span>
        </div>
        <div className="text-amber-400 font-bold">
          Loot: {lootedCount}/{totalRuins}
        </div>
      </div>

      {/* Expanded Legend */}
      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-stone-800 grid grid-cols-2 gap-1 text-[10px] font-mono text-stone-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            <span>Commander</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>Colony Core</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 inline-block" />
            <span>Villagers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            <span>Enemies</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-teal-400 rotate-45 inline-block" />
            <span>Loot Ruin</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 border-t border-dashed border-amber-500 inline-block" />
            <span>Perimeter</span>
          </div>
        </div>
      )}
    </div>
  );
};
