/**
 * Unified Collapsible Bottom Control Dock for Outpost Pioneer with multi-language support.
 * Conforms to Three.js design discipline: zero viewport occlusion, solid/rgba styling,
 * collapsible zen mode drawer, and consolidated tabs for Building, Colonists, Upgrades & Intel.
 */

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Hammer,
  Users,
  Cpu,
  Compass,
  Shield,
  Pickaxe,
  Fence,
  TriangleAlert,
  Lamp,
  Swords,
  Wheat,
  Sliders,
  Check,
  Wind,
  Flame,
  HeartPulse,
  Target,
} from 'lucide-react';
import { GameEngine } from '../game/engine';
import { BuildingType, BUILDING_BLUEPRINTS, VillagerRole } from '../game/state';
import { sound } from '../game/audio';
import { Language, TRANSLATIONS, Translations } from '../game/i18n';

interface BottomDockProps {
  engine: GameEngine | null;
  language: Language;
  onOpenSettings: () => void;
  onStateUpdate: () => void;
}

type DockTab = 'build' | 'villagers' | 'upgrades' | 'intel';

export const BottomDock: React.FC<BottomDockProps> = ({
  engine,
  language,
  onOpenSettings,
  onStateUpdate,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<DockTab>('build');

  if (!engine) return null;

  const t = TRANSLATIONS[language];
  const res = engine.resources;

  // Handle building ghost select
  const handleSelectBuilding = (type: BuildingType) => {
    if (engine.activeGhostType === type) {
      engine.setBuildingGhost(null);
    } else {
      engine.setBuildingGhost(type);
    }
    onStateUpdate();
  };

  // Handle tech purchase
  const handleResearchTech = (
    techKey: keyof typeof engine.upgrades,
    cost: { gold: number; iron: number }
  ) => {
    if (engine.upgrades[techKey]) return;
    if (res.gold >= cost.gold && res.iron >= cost.iron) {
      res.gold -= cost.gold;
      res.iron -= cost.iron;
      engine.upgrades[techKey] = true;
      sound.playLevelUp();
      engine.addFloatingText(`${t.researched}!`, '#00f5d4', engine.playerPos.x, 3, engine.playerPos.z);
      onStateUpdate();
    } else {
      sound.playHit();
      engine.addFloatingText(t.notEnoughRes, '#ef233c', engine.playerPos.x, 2, engine.playerPos.z);
    }
  };

  const getBuildingName = (type: BuildingType, tr: Translations) => {
    switch (type) {
      case 'farm':
        return tr.bpFarmName;
      case 'quarry':
        return tr.bpQuarryName;
      case 'watchtower':
        return tr.bpWatchtowerName;
      case 'palisade':
        return tr.bpPalisadeName;
      case 'spiketrap':
        return tr.bpSpiketrapName;
      case 'lantern':
        return tr.bpLanternName;
      case 'barracks':
        return tr.bpBarracksName;
      case 'windmill':
        return tr.bpWindmillName;
      case 'blacksmith':
        return tr.bpBlacksmithName;
      case 'clinic':
        return tr.bpClinicName;
      case 'stone_wall':
        return tr.bpStoneWallName;
      case 'ballista':
        return tr.bpBallistaName;
      default:
        return tr.bpTownHallName;
    }
  };

  const getBuildingIcon = (type: BuildingType) => {
    switch (type) {
      case 'farm':
        return <Wheat className="w-5 h-5 text-yellow-400" />;
      case 'quarry':
        return <Pickaxe className="w-5 h-5 text-stone-300" />;
      case 'watchtower':
        return <Shield className="w-5 h-5 text-amber-400" />;
      case 'palisade':
        return <Fence className="w-5 h-5 text-amber-600" />;
      case 'spiketrap':
        return <TriangleAlert className="w-5 h-5 text-red-400" />;
      case 'lantern':
        return <Lamp className="w-5 h-5 text-amber-300" />;
      case 'barracks':
        return <Swords className="w-5 h-5 text-rose-400" />;
      case 'windmill':
        return <Wind className="w-5 h-5 text-cyan-400" />;
      case 'blacksmith':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'clinic':
        return <HeartPulse className="w-5 h-5 text-emerald-400" />;
      case 'stone_wall':
        return <Shield className="w-5 h-5 text-stone-200" />;
      case 'ballista':
        return <Target className="w-5 h-5 text-red-400" />;
      default:
        return <Hammer className="w-5 h-5 text-amber-400" />;
    }
  };

  const getRoleLabel = (role: VillagerRole, tr: Translations) => {
    switch (role) {
      case 'farmer':
        return tr.roleFarmer;
      case 'miner':
        return tr.roleMiner;
      case 'guard':
        return tr.roleGuard;
      case 'builder':
        return tr.roleBuilder;
      default:
        return tr.roleIdle;
    }
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[94vw] max-w-4xl transition-all duration-300 pointer-events-auto select-none ${
        isCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
      }`}
    >
      {/* Collapse / Expand Tab */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-t-xl bg-stone-900 border-t border-x border-stone-700 text-stone-300 hover:text-amber-400 text-xs font-mono font-semibold transition-colors shadow-md cursor-pointer"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.showControls}</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              <span>{t.hideControls}</span>
            </>
          )}
        </button>
      </div>

      {/* Main Unified Solid Panel */}
      <div className="bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl p-3 md:p-4 text-stone-200">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('build')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'build'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300'
              }`}
            >
              <Hammer className="w-3.5 h-3.5" />
              <span>{t.tabBlueprints}</span>
            </button>

            <button
              onClick={() => setActiveTab('villagers')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'villagers'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t.tabColonists} ({engine.villagers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('upgrades')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'upgrades'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{t.tabUpgrades}</span>
            </button>

            <button
              onClick={() => setActiveTab('intel')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'intel'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t.tabIntel}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
              title={t.settings}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.settings}</span>
            </button>
          </div>
        </div>

        {/* TAB 1: BLUEPRINTS & FORTIFICATIONS */}
        {activeTab === 'build' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 max-h-56 overflow-y-auto pr-1">
            {(
              [
                'farm',
                'quarry',
                'watchtower',
                'palisade',
                'spiketrap',
                'lantern',
                'barracks',
                'windmill',
                'blacksmith',
                'clinic',
                'stone_wall',
                'ballista',
              ] as BuildingType[]
            ).map((type) => {
              const bp = BUILDING_BLUEPRINTS[type];
              const isSelected = engine.activeGhostType === type;
              const canAfford =
                res.wood >= bp.cost.wood &&
                res.stone >= bp.cost.stone &&
                res.iron >= bp.cost.iron &&
                res.gold >= bp.cost.gold;

              return (
                <button
                  key={type}
                  onClick={() => handleSelectBuilding(type)}
                  className={`flex flex-col items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/50'
                      : canAfford
                      ? 'bg-stone-800/90 hover:bg-stone-800 border-stone-700 text-stone-200'
                      : 'bg-stone-900/60 border-stone-800 text-stone-500 opacity-60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center mb-1.5">
                    {getBuildingIcon(type)}
                  </div>

                  <span className="text-[11px] font-bold text-center leading-tight mb-1">
                    {getBuildingName(type, t)}
                  </span>

                  {/* Cost Pill */}
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-400">
                    {bp.cost.wood > 0 && <span>🪵 {bp.cost.wood}</span>}
                    {bp.cost.stone > 0 && <span>🪨 {bp.cost.stone}</span>}
                    {bp.cost.iron > 0 && <span>⚙️ {bp.cost.iron}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* TAB 2: COLONISTS & ASSIGNMENTS */}
        {activeTab === 'villagers' && (
          <div className="max-h-52 overflow-y-auto pr-1 flex flex-col gap-2">
            {engine.villagers.map((vil) => (
              <div
                key={vil.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800/90 border border-stone-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center font-bold text-amber-400 text-xs">
                    {vil.role === 'farmer' && '🌾'}
                    {vil.role === 'miner' && '⛏️'}
                    {vil.role === 'guard' && '🛡️'}
                    {vil.role === 'builder' && '🔨'}
                    {vil.role === 'idle' && '💤'}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{vil.name}</span>
                      <span className="text-[10px] font-mono text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 uppercase">
                        {getRoleLabel(vil.role, t)}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono flex items-center gap-3 mt-0.5">
                      <span>{t.hp}: {vil.health}/{vil.maxHealth}</span>
                      <span>·</span>
                      <span>{t.kills}: {vil.kills}</span>
                    </div>
                  </div>
                </div>

                {/* 1-Click Role Reassignment Buttons */}
                <div className="flex items-center gap-1">
                  {(['farmer', 'miner', 'guard', 'builder', 'idle'] as VillagerRole[]).map(
                    (role) => (
                      <button
                        key={role}
                        onClick={() => {
                          engine.assignVillagerRole(vil.id, role);
                          onStateUpdate();
                        }}
                        className={`px-2 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                          vil.role === role
                            ? 'bg-amber-500 text-stone-950 font-bold'
                            : 'bg-stone-900 hover:bg-stone-700 text-stone-300'
                        }`}
                      >
                        {getRoleLabel(role, t)}
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SETTLEMENT TECH UPGRADES */}
        {activeTab === 'upgrades' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {/* Tech 1: Steel Weapons */}
            <div
              className={`p-3 rounded-xl border flex flex-col justify-between ${
                engine.upgrades.steelWeapons
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-stone-800/90 border-stone-700 text-stone-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{t.techSteelName}</span>
                  {engine.upgrades.steelWeapons && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  {t.techSteelDesc}
                </p>
              </div>

              {!engine.upgrades.steelWeapons ? (
                <button
                  onClick={() => handleResearchTech('steelWeapons', { gold: 15, iron: 20 })}
                  className="mt-3 w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase cursor-pointer"
                >
                  {t.research} (15 🪙, 20 ⚙️)
                </button>
              ) : (
                <span className="mt-3 text-[11px] font-mono text-emerald-400">{t.researched}</span>
              )}
            </div>

            {/* Tech 2: Crop Irrigation */}
            <div
              className={`p-3 rounded-xl border flex flex-col justify-between ${
                engine.upgrades.cropIrrigation
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-stone-800/90 border-stone-700 text-stone-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{t.techIrrigationName}</span>
                  {engine.upgrades.cropIrrigation && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  {t.techIrrigationDesc}
                </p>
              </div>

              {!engine.upgrades.cropIrrigation ? (
                <button
                  onClick={() => handleResearchTech('cropIrrigation', { gold: 10, iron: 15 })}
                  className="mt-3 w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase cursor-pointer"
                >
                  {t.research} (10 🪙, 15 ⚙️)
                </button>
              ) : (
                <span className="mt-3 text-[11px] font-mono text-emerald-400">{t.researched}</span>
              )}
            </div>

            {/* Tech 3: Reinforced Walls */}
            <div
              className={`p-3 rounded-xl border flex flex-col justify-between ${
                engine.upgrades.reinforcedWalls
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-stone-800/90 border-stone-700 text-stone-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{t.techWallsName}</span>
                  {engine.upgrades.reinforcedWalls && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  {t.techWallsDesc}
                </p>
              </div>

              {!engine.upgrades.reinforcedWalls ? (
                <button
                  onClick={() => handleResearchTech('reinforcedWalls', { gold: 20, iron: 25 })}
                  className="mt-3 w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase cursor-pointer"
                >
                  {t.research} (20 🪙, 25 ⚙️)
                </button>
              ) : (
                <span className="mt-3 text-[11px] font-mono text-emerald-400">{t.researched}</span>
              )}
            </div>

            {/* Tech 4: Composite Bows */}
            <div
              className={`p-3 rounded-xl border flex flex-col justify-between ${
                engine.upgrades.archeryRange
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-stone-800/90 border-stone-700 text-stone-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{t.techArcheryName}</span>
                  {engine.upgrades.archeryRange && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  {t.techArcheryDesc}
                </p>
              </div>

              {!engine.upgrades.archeryRange ? (
                <button
                  onClick={() => handleResearchTech('archeryRange', { gold: 25, iron: 20 })}
                  className="mt-3 w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase cursor-pointer"
                >
                  {t.research} (25 🪙, 20 ⚙️)
                </button>
              ) : (
                <span className="mt-3 text-[11px] font-mono text-emerald-400">{t.researched}</span>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: FRONTIER INTEL & EXPLORATION */}
        {activeTab === 'intel' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
              <div className="font-bold text-amber-400 mb-1">{t.intelMissionTitle}</div>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                {t.intelMissionDesc}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
              <div className="font-bold text-amber-400 mb-1">{t.intelRolesTitle}</div>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                {t.intelRolesDesc}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
              <div className="font-bold text-amber-400 mb-1">{t.intelControlsTitle}</div>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                {t.intelControlsDesc}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
