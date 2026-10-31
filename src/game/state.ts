/**
 * Game state types, resource models, building recipes, and tech tree definitions.
 */

export type VillagerRole = 'farmer' | 'miner' | 'guard' | 'builder' | 'idle';

export interface VillagerData {
  id: string;
  name: string;
  role: VillagerRole;
  health: number;
  maxHealth: number;
  level: number;
  x: number;
  z: number;
  targetX?: number;
  targetZ?: number;
  actionState: 'idle' | 'walking' | 'working' | 'defending' | 'fleeing';
  workTimer: number;
  assignedBuildingId?: string;
  kills: number;
}

export type BuildingType =
  | 'town_hall'
  | 'farm'
  | 'quarry'
  | 'watchtower'
  | 'palisade'
  | 'spiketrap'
  | 'lantern'
  | 'barracks'
  | 'windmill'
  | 'blacksmith'
  | 'clinic'
  | 'stone_wall'
  | 'ballista';

export interface BuildingBlueprint {
  type: BuildingType;
  name: string;
  description: string;
  icon: string;
  cost: {
    wood: number;
    stone: number;
    iron: number;
    gold: number;
  };
  maxHealth: number;
  size: { width: number; depth: number };
  maxWorkers: number;
  allowedRole?: VillagerRole;
}

export const BUILDING_BLUEPRINTS: Record<BuildingType, BuildingBlueprint> = {
  town_hall: {
    type: 'town_hall',
    name: 'Colony Center',
    description: 'The heart of your settlement. Attracts settlers and coordinates defenses.',
    icon: 'Crown',
    cost: { wood: 100, stone: 80, iron: 25, gold: 10 },
    maxHealth: 1500,
    size: { width: 5, depth: 5 },
    maxWorkers: 0,
  },
  farm: {
    type: 'farm',
    name: 'Cultivated Farm',
    description: 'Produces fresh wheat and vegetables when worked by farmers to feed the colony.',
    icon: 'Wheat',
    cost: { wood: 35, stone: 10, iron: 0, gold: 0 },
    maxHealth: 300,
    size: { width: 4, depth: 4 },
    maxWorkers: 2,
    allowedRole: 'farmer',
  },
  quarry: {
    type: 'quarry',
    name: 'Mining Quarry',
    description: 'Extracts stone and raw iron ore from the bedrock when worked by miners.',
    icon: 'Pickaxe',
    cost: { wood: 45, stone: 30, iron: 5, gold: 0 },
    maxHealth: 450,
    size: { width: 4, depth: 4 },
    maxWorkers: 2,
    allowedRole: 'miner',
  },
  watchtower: {
    type: 'watchtower',
    name: 'Archer Watchtower',
    description: 'Automated ballista & vantage point. Guards garrisoned here shoot approaching monsters.',
    icon: 'ShieldAlert',
    cost: { wood: 50, stone: 25, iron: 10, gold: 0 },
    maxHealth: 600,
    size: { width: 2.5, depth: 2.5 },
    maxWorkers: 1,
    allowedRole: 'guard',
  },
  palisade: {
    type: 'palisade',
    name: 'Timber Palisade',
    description: 'Sturdy sharpened wooden fortification that blocks hostile creature paths.',
    icon: 'Fence',
    cost: { wood: 20, stone: 5, iron: 0, gold: 0 },
    maxHealth: 500,
    size: { width: 2.5, depth: 1 },
    maxWorkers: 0,
  },
  spiketrap: {
    type: 'spiketrap',
    name: 'Iron Spike Trap',
    description: 'Hidden spring spikes that impale and bleed invading monsters.',
    icon: 'TriangleAlert',
    cost: { wood: 15, stone: 0, iron: 15, gold: 0 },
    maxHealth: 200,
    size: { width: 2, depth: 2 },
    maxWorkers: 0,
  },
  lantern: {
    type: 'lantern',
    name: 'Ward Lantern Post',
    description: 'Illuminates the perimeter, deters night prowlers, and enhances guard sight.',
    icon: 'Lamp',
    cost: { wood: 15, stone: 10, iron: 5, gold: 0 },
    maxHealth: 250,
    size: { width: 1.2, depth: 1.2 },
    maxWorkers: 0,
  },
  barracks: {
    type: 'barracks',
    name: 'Guards Barracks',
    description: 'Trains militia with shields and spears. Improves guard combat stats by +50%.',
    icon: 'Swords',
    cost: { wood: 80, stone: 60, iron: 30, gold: 15 },
    maxHealth: 800,
    size: { width: 4.5, depth: 4.5 },
    maxWorkers: 3,
    allowedRole: 'guard',
  },
  windmill: {
    type: 'windmill',
    name: 'Windmill & Granary',
    description: 'Milling sails grind grain into surplus flour, boosting all food production by +75%.',
    icon: 'Wind',
    cost: { wood: 70, stone: 40, iron: 15, gold: 5 },
    maxHealth: 650,
    size: { width: 4, depth: 4 },
    maxWorkers: 2,
    allowedRole: 'farmer',
  },
  blacksmith: {
    type: 'blacksmith',
    name: 'Armory Forge',
    description: 'Smelts ore and produces armor. Periodically repairs damaged colony structures.',
    icon: 'Anvil',
    cost: { wood: 60, stone: 85, iron: 35, gold: 10 },
    maxHealth: 900,
    size: { width: 4.5, depth: 4.5 },
    maxWorkers: 1,
    allowedRole: 'miner',
  },
  clinic: {
    type: 'clinic',
    name: 'Herbalist Clinic',
    description: 'Apothecary brewing restorative salves that heal nearby wounded colonists and player.',
    icon: 'Cross',
    cost: { wood: 50, stone: 35, iron: 10, gold: 15 },
    maxHealth: 550,
    size: { width: 3.5, depth: 3.5 },
    maxWorkers: 1,
    allowedRole: 'builder',
  },
  stone_wall: {
    type: 'stone_wall',
    name: 'Stone Bastion Wall',
    description: 'Heavy ashlar masonry wall with battlements. Enormous resistance against monsters.',
    icon: 'Shield',
    cost: { wood: 10, stone: 45, iron: 10, gold: 0 },
    maxHealth: 1400,
    size: { width: 3, depth: 1.2 },
    maxWorkers: 0,
  },
  ballista: {
    type: 'ballista',
    name: 'Siege Ballista Turret',
    description: 'Heavy automated siege bolt-thrower that impales and pierces giant brutes and golems.',
    icon: 'Target',
    cost: { wood: 90, stone: 50, iron: 40, gold: 20 },
    maxHealth: 750,
    size: { width: 3, depth: 3 },
    maxWorkers: 1,
    allowedRole: 'guard',
  },
};

export type ExplorationStructureType =
  | 'ruined_temple'
  | 'abandoned_outpost'
  | 'lumber_camp'
  | 'smelter_ruin'
  | 'sunken_cache'
  | 'stone_henge'
  | 'alchemist_den'
  | 'ancient_crypt'
  | 'hermit_shack'
  | 'treasure_vault';

export interface ExplorationStructure {
  id: string;
  name: string;
  type: ExplorationStructureType;
  x: number;
  z: number;
  looted: boolean;
  loot: {
    wood?: number;
    stone?: number;
    iron?: number;
    gold?: number;
    food?: number;
    survivorName?: string;
    relicName?: string;
  };
}

export interface PlacedBuilding {
  id: string;
  type: BuildingType;
  x: number;
  z: number;
  rotation: number;
  health: number;
  maxHealth: number;
  assignedVillagerIds: string[];
  cooldownTimer: number;
}

export type EnemyType = 'stalker' | 'brute' | 'golem';

export interface EnemyData {
  id: string;
  type: EnemyType;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  attackRange: number;
  attackCooldown: number;
  lastAttackTime: number;
  x: number;
  z: number;
  vx: number;
  vz: number;
  rotation: number;
  targetType: 'player' | 'villager' | 'building';
  targetId?: string;
}

export interface ResourceNode {
  id: string;
  type: 'tree' | 'rock' | 'iron_vein' | 'gold_vein' | 'berry_bush';
  x: number;
  z: number;
  scale: number;
  resourceRemaining: number;
  maxResource: number;
}

export interface GameResources {
  wood: number;
  stone: number;
  iron: number;
  gold: number;
  food: number;
}

export interface ColonyUpgrades {
  reinforcedWalls: boolean;
  cropIrrigation: boolean;
  steelWeapons: boolean;
  archeryRange: boolean;
  beaconAura: boolean;
}

export interface PlayerStats {
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  tool: 'sword' | 'pickaxe' | 'axe' | 'bow';
  speed: number;
  attackPower: number;
}

export type GamePhase = 'title' | 'playing' | 'paused' | 'gameover' | 'victory';

export interface WaveInfo {
  waveNumber: number;
  active: boolean;
  enemiesRemaining: number;
  totalEnemiesInWave: number;
  timeUntilNextWave: number; // in seconds
  waveWarningActive: boolean;
}
