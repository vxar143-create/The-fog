/**
 * Core 3D Game Engine for Outpost Pioneer.
 * Handles Three.js rendering, day-night cycle, player controls, villager AI,
 * wave generation & combat, building placement, and WebGL lifecycle.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { TerrainManager } from './terrain';
import { sound } from './audio';
import {
  BuildingType,
  BUILDING_BLUEPRINTS,
  ColonyUpgrades,
  EnemyData,
  GameResources,
  PlacedBuilding,
  PlayerStats,
  VillagerData,
  VillagerRole,
  WaveInfo,
} from './state';
import {
  createBuildingMesh,
  createEnemyMesh,
  createPlayerMesh,
  createVillagerMesh,
} from './models';
import { Language, TRANSLATIONS } from './i18n';

export interface FloatingText {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  z: number;
  vy: number;
  life: number;
  maxLife: number;
}

export interface Projectile {
  mesh: THREE.Mesh;
  startPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  targetEnemyId: string;
  progress: number;
  damage: number;
}

export class GameEngine {
  public container: HTMLDivElement;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public terrain: TerrainManager;

  // Day-Night & Lighting
  public sunLight: THREE.DirectionalLight;
  public hemiLight: THREE.HemisphereLight;
  public dayTime = 0.25; // 0 = midnight, 0.25 = sunrise/morning, 0.5 = noon, 0.75 = dusk, 1 = midnight
  public dayCycleDuration = 180; // 3 minutes full day-night cycle
  public dayCount = 1;

  // Entities & Meshes
  public playerMesh: THREE.Group;
  public playerPos = new THREE.Vector3(0, 0, 0);
  public playerVelocity = new THREE.Vector3(0, 0, 0);
  public playerRotation = 0;
  public isPlayerAttacking = false;
  public attackAnimTimer = 0;

  public villagers: VillagerData[] = [];
  public villagerMeshes: Map<string, THREE.Group> = new Map();

  public buildings: PlacedBuilding[] = [];
  public buildingMeshes: Map<string, THREE.Group> = new Map();

  public enemies: EnemyData[] = [];
  public enemyMeshes: Map<string, THREE.Group> = new Map();

  public projectiles: Projectile[] = [];
  public floatingTexts: FloatingText[] = [];

  // Building Placement Ghost
  public activeGhostType: BuildingType | null = null;
  public ghostMesh: THREE.Group | null = null;
  public ghostValid = false;

  // State & Resources
  public resources: GameResources = {
    wood: 120,
    stone: 80,
    iron: 30,
    gold: 15,
    food: 50,
  };

  public playerStats: PlayerStats = {
    health: 100,
    maxHealth: 100,
    stamina: 100,
    maxStamina: 100,
    tool: 'sword',
    speed: 7.5,
    attackPower: 25,
  };

  public upgrades: ColonyUpgrades = {
    reinforcedWalls: false,
    cropIrrigation: false,
    steelWeapons: false,
    archeryRange: false,
    beaconAura: false,
  };

  public waveInfo: WaveInfo = {
    waveNumber: 1,
    active: false,
    enemiesRemaining: 0,
    totalEnemiesInWave: 0,
    timeUntilNextWave: 90,
    waveWarningActive: false,
  };

  public isPaused = false;
  public isGameOver = false;

  // Settings & Customization
  public language: Language = 'en';
  public cameraDistanceSetting: 'close' | 'medium' | 'far' = 'medium';
  public screenShakeEnabled: boolean = true;
  public difficulty: 'peaceful' | 'normal' | 'brutal' = 'normal';
  public shadowsEnabled: boolean = true;

  // Camera Shake & Hitstop
  private cameraShake = 0;
  private hitstopTimer = 0;

  public setLanguage(lang: Language) {
    this.language = lang;
  }

  public setCameraDistance(dist: 'close' | 'medium' | 'far') {
    this.cameraDistanceSetting = dist;
  }

  public setScreenShakeEnabled(enabled: boolean) {
    this.screenShakeEnabled = enabled;
  }

  public setShadowsEnabled(enabled: boolean) {
    this.shadowsEnabled = enabled;
    if (this.sunLight) this.sunLight.castShadow = enabled;
    if (this.renderer) this.renderer.shadowMap.enabled = enabled;
  }

  public setDifficulty(diff: 'peaceful' | 'normal' | 'brutal') {
    this.difficulty = diff;
  }

  // Inputs
  private keys: Record<string, boolean> = {};
  private mouseRaycaster = new THREE.Raycaster();
  private mouseCoords = new THREE.Vector2(0, 0);
  private groundIntersection = new THREE.Vector3();

  // Animation Loop IDs
  private animFrameId = 0;
  private lastTime = performance.now();
  private onStateUpdateCb?: () => void;

  constructor(container: HTMLDivElement, onStateUpdate?: () => void) {
    this.container = container;
    this.onStateUpdateCb = onStateUpdate;

    // Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.012);

    this.camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      400
    );
    this.camera.position.set(0, 16, 22);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.shadowMap.enabled = !isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 3. Studio Environment Reflections (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig
    this.hemiLight = new THREE.HemisphereLight(0xbadbf7, 0x3d4128, 0.85);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfff3db, 1.8);
    this.sunLight.castShadow = !isSoftwareGl;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 120;
    const shadowD = 35;
    this.sunLight.shadow.camera.left = -shadowD;
    this.sunLight.shadow.camera.right = shadowD;
    this.sunLight.shadow.camera.top = shadowD;
    this.sunLight.shadow.camera.bottom = -shadowD;
    this.sunLight.shadow.bias = -0.0005;
    this.sunLight.shadow.normalBias = 0.02;
    this.scene.add(this.sunLight);

    // 5. Terrain Manager
    this.terrain = new TerrainManager();
    this.terrain.buildTerrain(this.scene);

    // 6. Player
    this.playerMesh = createPlayerMesh();
    this.playerPos.set(0, this.terrain.getHeight(0, 0), 0);
    this.playerMesh.position.copy(this.playerPos);
    this.scene.add(this.playerMesh);

    // 7. Initial Colony Setup (Town Hall & 3 Starting Settlers)
    this.initColony();

    // 8. Event Listeners
    this.bindEvents();

    // Precompile shaders
    if (!isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    // Start 60fps Loop
    this.startLoop();
  }

  private initColony() {
    // Spawn Town Hall in central meadow
    this.placeBuildingDirectly('town_hall', 0, -4);

    // Spawn 1 Farm & 1 Watchtower to jumpstart the colony
    this.placeBuildingDirectly('farm', -8, -6);
    this.placeBuildingDirectly('watchtower', 8, 4);

    // Spawn 3 starting villagers with distinct roles
    this.spawnVillager('Elric the Farmer', 'farmer', -8, -5);
    this.spawnVillager('Bram the Miner', 'miner', -3, 2);
    this.spawnVillager('Alys the Scout', 'guard', 8, 3);
  }

  public spawnVillager(name: string, role: VillagerRole, x: number, z: number): VillagerData {
    const id = `vil_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const y = this.terrain.getHeight(x, z);
    const data: VillagerData = {
      id,
      name,
      role,
      health: 100,
      maxHealth: 100,
      level: 1,
      x,
      z,
      actionState: 'idle',
      workTimer: 0,
      kills: 0,
    };

    this.villagers.push(data);

    const mesh = createVillagerMesh(role);
    mesh.position.set(x, y, z);
    this.scene.add(mesh);
    this.villagerMeshes.set(id, mesh);

    return data;
  }

  public placeBuildingDirectly(type: BuildingType, x: number, z: number, rotation = 0): PlacedBuilding {
    const bp = BUILDING_BLUEPRINTS[type];
    const id = `bld_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const y = this.terrain.getHeight(x, z);

    const bld: PlacedBuilding = {
      id,
      type,
      x,
      z,
      rotation,
      health: bp.maxHealth,
      maxHealth: bp.maxHealth,
      assignedVillagerIds: [],
      cooldownTimer: 0,
    };

    this.buildings.push(bld);

    const mesh = createBuildingMesh(type);
    mesh.position.set(x, y, z);
    mesh.rotation.y = rotation;
    this.scene.add(mesh);
    this.buildingMeshes.set(id, mesh);

    return bld;
  }

  // Set ghost building for placement preview
  public setBuildingGhost(type: BuildingType | null) {
    if (this.ghostMesh) {
      this.scene.remove(this.ghostMesh);
      this.ghostMesh = null;
    }
    this.activeGhostType = type;
    if (type) {
      this.ghostMesh = createBuildingMesh(type);
      // Make semi-transparent holographic
      this.ghostMesh.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const m = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (m) {
            const cloneMat = m.clone();
            cloneMat.transparent = true;
            cloneMat.opacity = 0.6;
            (child as THREE.Mesh).material = cloneMat;
          }
        }
      });
      this.scene.add(this.ghostMesh);
    }
  }

  public confirmBuildingPlacement(): boolean {
    if (!this.activeGhostType || !this.ghostMesh) return false;
    const bp = BUILDING_BLUEPRINTS[this.activeGhostType];

    // Check resources
    if (
      this.resources.wood < bp.cost.wood ||
      this.resources.stone < bp.cost.stone ||
      this.resources.iron < bp.cost.iron ||
      this.resources.gold < bp.cost.gold
    ) {
      this.addFloatingText('Not enough resources!', '#ef233c', this.playerPos.x, this.playerPos.y + 2, this.playerPos.z);
      sound.playHit();
      return false;
    }

    // Deduct
    this.resources.wood -= bp.cost.wood;
    this.resources.stone -= bp.cost.stone;
    this.resources.iron -= bp.cost.iron;
    this.resources.gold -= bp.cost.gold;

    const gx = this.ghostMesh.position.x;
    const gz = this.ghostMesh.position.z;
    const rot = this.ghostMesh.rotation.y;

    this.placeBuildingDirectly(this.activeGhostType, gx, gz, rot);
    sound.playBuild();
    this.addFloatingText(`Built ${bp.name}!`, '#4ade80', gx, this.terrain.getHeight(gx, gz) + 2.5, gz);

    // Keep ghost active for rapid palisade / lantern placing or cancel
    if (this.activeGhostType !== 'palisade') {
      this.setBuildingGhost(null);
    }
    return true;
  }

  // Villager Role Assignment
  public assignVillagerRole(villagerId: string, newRole: VillagerRole) {
    const vil = this.villagers.find((v) => v.id === villagerId);
    if (!vil) return;

    vil.role = newRole;
    vil.actionState = 'idle';

    // Replace 3D mesh with role-specific accessories
    const oldMesh = this.villagerMeshes.get(villagerId);
    if (oldMesh) {
      this.scene.remove(oldMesh);
    }
    const newMesh = createVillagerMesh(newRole);
    newMesh.position.set(vil.x, this.terrain.getHeight(vil.x, vil.z), vil.z);
    this.scene.add(newMesh);
    this.villagerMeshes.set(villagerId, newMesh);

    sound.playHarvest();
    this.addFloatingText(`${vil.name} -> ${newRole.toUpperCase()}`, '#ffd166', vil.x, this.terrain.getHeight(vil.x, vil.z) + 2.2, vil.z);
  }

  // Floating Damage / Notification Numbers
  public addFloatingText(text: string, color: string, x: number, y: number, z: number) {
    this.floatingTexts.push({
      id: Math.random().toString(),
      text,
      color,
      x,
      y,
      z,
      vy: 1.2,
      life: 0,
      maxLife: 1.6,
    });
  }

  // Player Attack / Gather
  public performPlayerAction() {
    if (this.isPlayerAttacking) return;
    this.isPlayerAttacking = true;
    this.attackAnimTimer = 0.28;
    sound.playSwing();

    // Forward attack cone
    const fwd = new THREE.Vector3(Math.sin(this.playerRotation), 0, Math.cos(this.playerRotation)).normalize();
    const actionRange = 3.2;

    // 1. Check for Enemies in front
    let hitEnemy = false;
    for (const enemy of this.enemies) {
      const ex = enemy.x - this.playerPos.x;
      const ez = enemy.z - this.playerPos.z;
      const dist = Math.hypot(ex, ez);
      if (dist < actionRange) {
        const dot = (ex * fwd.x + ez * fwd.z) / dist;
        if (dot > 0.4) {
          // Hit enemy!
          const dmg = this.playerStats.attackPower + (this.upgrades.steelWeapons ? 12 : 0);
          enemy.health -= dmg;
          hitEnemy = true;
          this.cameraShake = 0.35;
          this.hitstopTimer = 0.04;
          sound.playHit();
          this.addFloatingText(`-${dmg}`, '#ff3333', enemy.x, this.terrain.getHeight(enemy.x, enemy.z) + 1.5, enemy.z);

          // Knockback
          enemy.x += fwd.x * 0.8;
          enemy.z += fwd.z * 0.8;
          break;
        }
      }
    }

    if (hitEnemy) return;

    // 2. Check for Resource Nodes (Trees, Rocks, Ores, Berries)
    for (const node of this.terrain.resourceNodes) {
      const dx = node.x - this.playerPos.x;
      const dz = node.z - this.playerPos.z;
      const dist = Math.hypot(dx, dz);
      if (dist < actionRange + 0.5) {
        if (node.type === 'tree') {
          sound.playWoodChop();
          const amt = 10;
          this.resources.wood += amt;
          node.resourceRemaining -= amt;
          this.addFloatingText(`+${amt} Wood`, '#a7c957', node.x, this.terrain.getHeight(node.x, node.z) + 2.5, node.z);
        } else if (node.type === 'rock') {
          sound.playMineRock();
          const amt = 12;
          this.resources.stone += amt;
          node.resourceRemaining -= amt;
          this.addFloatingText(`+${amt} Stone`, '#ced4da', node.x, this.terrain.getHeight(node.x, node.z) + 1.8, node.z);
        } else if (node.type === 'iron_vein') {
          sound.playMineRock();
          const amt = 8;
          this.resources.iron += amt;
          node.resourceRemaining -= amt;
          this.addFloatingText(`+${amt} Iron`, '#90e0ef', node.x, this.terrain.getHeight(node.x, node.z) + 1.8, node.z);
        } else if (node.type === 'gold_vein') {
          sound.playMineRock();
          const amt = 5;
          this.resources.gold += amt;
          node.resourceRemaining -= amt;
          this.addFloatingText(`+${amt} Gold`, '#ffd166', node.x, this.terrain.getHeight(node.x, node.z) + 1.8, node.z);
        } else if (node.type === 'berry_bush') {
          sound.playHarvest();
          const amt = 15;
          this.resources.food += amt;
          node.resourceRemaining -= amt;
          this.addFloatingText(`+${amt} Berries`, '#ff70a6', node.x, this.terrain.getHeight(node.x, node.z) + 1.5, node.z);
        }

        // Check depletion
        if (node.resourceRemaining <= 0) {
          this.terrain.removeResourceNode(this.scene, node.id);
        }
        return;
      }
    }

    // 3. Check for 30 Exploration Structures with Loot
    if (this.terrain.explorationStructures) {
      for (const struct of this.terrain.explorationStructures) {
        const dist = Math.hypot(struct.x - this.playerPos.x, struct.z - this.playerPos.z);
        if (dist < 4.2 && !struct.looted) {
          this.terrain.markStructureLooted(this.scene, struct.id);
          sound.playVictory();

          const lootSummary: string[] = [];
          if (struct.loot.gold) {
            this.resources.gold += struct.loot.gold;
            lootSummary.push(`+${struct.loot.gold} Gold`);
          }
          if (struct.loot.iron) {
            this.resources.iron += struct.loot.iron;
            lootSummary.push(`+${struct.loot.iron} Iron`);
          }
          if (struct.loot.food) {
            this.resources.food += struct.loot.food;
            lootSummary.push(`+${struct.loot.food} Food`);
          }
          if (struct.loot.wood) {
            this.resources.wood += struct.loot.wood;
            lootSummary.push(`+${struct.loot.wood} Wood`);
          }
          if (struct.loot.stone) {
            this.resources.stone += struct.loot.stone;
            lootSummary.push(`+${struct.loot.stone} Stone`);
          }

          if (struct.loot.survivorName) {
            const role = Math.random() > 0.5 ? 'guard' : 'farmer';
            this.spawnVillager(struct.loot.survivorName, role, struct.x, struct.z);
            lootSummary.push(`Rescued ${struct.loot.survivorName}!`);
          }
          if (struct.loot.relicName) {
            lootSummary.push(`Found ${struct.loot.relicName}!`);
          }

          this.addFloatingText(
            `LOOTED ${struct.name.toUpperCase()}! (${lootSummary.join(', ')})`,
            '#00f5d4',
            struct.x,
            this.terrain.getHeight(struct.x, struct.z) + 3.5,
            struct.z
          );
          return;
        }
      }
    }
  }

  // Wave Spawning & Progression
  public triggerNextWave() {
    if (this.difficulty === 'peaceful') {
      this.waveInfo.active = false;
      this.waveInfo.waveNumber++;
      this.waveInfo.timeUntilNextWave = 150;
      return;
    }

    this.waveInfo.active = true;
    this.waveInfo.waveWarningActive = true;
    sound.playWaveWarning();

    const waveNum = this.waveInfo.waveNumber;
    const diffMult = this.difficulty === 'brutal' ? 1.6 : 1.0;
    const enemyCount = Math.floor((5 + waveNum * 3) * diffMult);
    this.waveInfo.totalEnemiesInWave = enemyCount;
    this.waveInfo.enemiesRemaining = enemyCount;

    // Spawn enemies from perimeter ring
    for (let i = 0; i < enemyCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 65 + Math.random() * 20;
      const ex = Math.cos(angle) * dist;
      const ez = Math.sin(angle) * dist;

      // Select enemy tier
      let type: 'stalker' | 'brute' | 'golem' = 'stalker';
      if (waveNum >= 2 && Math.random() > 0.65) type = 'brute';
      if (waveNum >= 3 && i === 0) type = 'golem'; // 1 boss golem

      let hp = 45;
      let spd = 3.6;
      let dmg = 8;
      if (type === 'brute') {
        hp = 110;
        spd = 2.4;
        dmg = 18;
      } else if (type === 'golem') {
        hp = 280;
        spd = 1.6;
        dmg = 35;
      }

      const id = `en_${Date.now()}_${i}`;
      const enemy: EnemyData = {
        id,
        type,
        health: hp,
        maxHealth: hp,
        speed: spd,
        damage: dmg,
        attackRange: type === 'golem' ? 2.5 : 1.8,
        attackCooldown: 1.5,
        lastAttackTime: 0,
        x: ex,
        z: ez,
        vx: 0,
        vz: 0,
        rotation: 0,
        targetType: 'building',
      };

      this.enemies.push(enemy);

      const mesh = createEnemyMesh(type);
      mesh.position.set(ex, this.terrain.getHeight(ex, ez), ez);
      this.scene.add(mesh);
      this.enemyMeshes.set(id, mesh);
    }
  }

  // Update Game Physics & Simulation (Clamped dt)
  private update(dt: number) {
    if (this.isPaused || this.isGameOver) return;

    // Hitstop freeze
    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= dt;
      return;
    }

    // 1. Day-Night Cycle
    this.dayTime = (this.dayTime + dt / this.dayCycleDuration) % 1.0;
    this.updateDayNightLighting();

    // Check wave countdown
    if (!this.waveInfo.active) {
      this.waveInfo.timeUntilNextWave -= dt;
      if (this.waveInfo.timeUntilNextWave <= 0) {
        this.triggerNextWave();
      }
    }

    // 2. Player Movement
    this.updatePlayerMovement(dt);

    // 3. Villagers AI
    this.updateVillagers(dt);

    // 4. Enemies AI & Wave Defense
    this.updateEnemies(dt);

    // 5. Watchtower Archery Defense
    this.updateWatchtowers(dt);

    // 6. Projectiles
    this.updateProjectiles(dt);

    // 7. Floating Texts
    this.updateFloatingTexts(dt);

    // 8. Ghost Building Placement Update
    this.updateGhostPlacement();

    // 9. Camera Follow & Shake
    this.updateCamera(dt);
  }

  private updateDayNightLighting() {
    // Sun angle around the world
    const sunAngle = this.dayTime * Math.PI * 2 - Math.PI / 2;
    const sunDist = 70;
    const sunX = Math.cos(sunAngle) * sunDist + this.playerPos.x;
    const sunY = Math.sin(sunAngle) * sunDist;
    const sunZ = Math.sin(sunAngle * 0.4) * 20 + this.playerPos.z;

    this.sunLight.position.set(sunX, Math.max(sunY, 15), sunZ);
    this.sunLight.target.position.copy(this.playerPos);
    this.sunLight.target.updateMatrixWorld();

    // Sky colors: Dawn/Dusk vs High Noon vs Deep Night
    const isDay = sunY > 0;
    const t = Math.max(0, Math.min(1, (sunY + 10) / 40));

    const daySky = new THREE.Color(0x87ceeb);
    const sunsetSky = new THREE.Color(0xe76f51);
    const nightSky = new THREE.Color(0x0b132b);

    const currentSky = new THREE.Color();
    if (sunY > 15) {
      currentSky.copy(daySky);
      this.sunLight.intensity = 1.8;
      this.hemiLight.intensity = 0.85;
    } else if (sunY > -5) {
      currentSky.lerpColors(sunsetSky, daySky, t);
      this.sunLight.intensity = 1.0;
      this.hemiLight.intensity = 0.5;
    } else {
      currentSky.copy(nightSky);
      this.sunLight.intensity = 0.25; // Moon glow
      this.hemiLight.intensity = 0.3;
    }

    this.scene.background = currentSky;
    if (this.scene.fog) {
      (this.scene.fog as THREE.FogExp2).color.copy(currentSky);
    }
  }

  private updatePlayerMovement(dt: number) {
    let moveX = 0;
    let moveZ = 0;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveZ -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveZ += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;

    const isMoving = moveX !== 0 || moveZ !== 0;
    const isSprinting = this.keys['ShiftLeft'] || this.keys['ShiftRight'];

    if (isMoving) {
      const len = Math.hypot(moveX, moveZ);
      moveX /= len;
      moveZ /= len;

      let speed = this.playerStats.speed;
      if (isSprinting && this.playerStats.stamina > 5) {
        speed *= 1.45;
        this.playerStats.stamina = Math.max(0, this.playerStats.stamina - dt * 18);
      } else {
        this.playerStats.stamina = Math.min(this.playerStats.maxStamina, this.playerStats.stamina + dt * 12);
      }

      this.playerPos.x += moveX * speed * dt;
      this.playerPos.z += moveZ * speed * dt;

      // Rotate player smoothly toward movement vector
      const targetRot = Math.atan2(moveX, moveZ);
      this.playerRotation = THREE.MathUtils.damp(this.playerRotation, targetRot, 14, dt);

      // Footstep sound
      if (Math.random() < 0.08) sound.playFootstep();

      // Leg swing animation
      const walkCycle = performance.now() * 0.012;
      const leftLeg = this.playerMesh.getObjectByName('leftLeg');
      const rightLeg = this.playerMesh.getObjectByName('rightLeg');
      if (leftLeg && rightLeg) {
        leftLeg.rotation.x = Math.sin(walkCycle) * 0.6;
        rightLeg.rotation.x = -Math.sin(walkCycle) * 0.6;
      }
    } else {
      this.playerStats.stamina = Math.min(this.playerStats.maxStamina, this.playerStats.stamina + dt * 18);
    }

    // Ground clamp
    const groundY = this.terrain.getHeight(this.playerPos.x, this.playerPos.z);
    this.playerPos.y = THREE.MathUtils.damp(this.playerPos.y, groundY, 15, dt);

    this.playerMesh.position.copy(this.playerPos);
    this.playerMesh.rotation.y = this.playerRotation;

    // Attack swing arm animation
    const rightArm = this.playerMesh.getObjectByName('rightArm');
    if (rightArm) {
      if (this.isPlayerAttacking) {
        this.attackAnimTimer -= dt;
        rightArm.rotation.x = -Math.PI / 2 + Math.sin(this.attackAnimTimer * 15) * 1.2;
        if (this.attackAnimTimer <= 0) {
          this.isPlayerAttacking = false;
          rightArm.rotation.x = 0;
        }
      } else {
        rightArm.rotation.x = 0;
      }
    }
  }

  private updateVillagers(dt: number) {
    for (const vil of this.villagers) {
      vil.workTimer += dt;
      const mesh = this.villagerMeshes.get(vil.id);
      if (!mesh) continue;

      // Behavior per role
      if (vil.role === 'farmer') {
        // Find nearest farm building
        const farm = this.buildings.find((b) => b.type === 'farm');
        if (farm) {
          const dist = Math.hypot(farm.x - vil.x, farm.z - vil.z);
          if (dist > 2.5) {
            // Walk toward farm
            const dx = (farm.x - vil.x) / dist;
            const dz = (farm.z - vil.z) / dist;
            vil.x += dx * 2.2 * dt;
            vil.z += dz * 2.2 * dt;
            mesh.rotation.y = Math.atan2(dx, dz);
          } else {
            // Working on farm: hoeing animation & food production
            if (vil.workTimer > 8) {
              vil.workTimer = 0;
              const yieldFood = this.upgrades.cropIrrigation ? 8 : 5;
              this.resources.food += yieldFood;
              sound.playHarvest();
              this.addFloatingText(`+${yieldFood} Food`, '#52b788', farm.x, this.terrain.getHeight(farm.x, farm.z) + 1.8, farm.z);
            }
          }
        }
      } else if (vil.role === 'miner') {
        // Find nearest quarry or rock
        const quarry = this.buildings.find((b) => b.type === 'quarry');
        const targetX = quarry ? quarry.x : 10;
        const targetZ = quarry ? quarry.z : 10;
        const dist = Math.hypot(targetX - vil.x, targetZ - vil.z);
        if (dist > 2.5) {
          const dx = (targetX - vil.x) / dist;
          const dz = (targetZ - vil.z) / dist;
          vil.x += dx * 2.2 * dt;
          vil.z += dz * 2.2 * dt;
          mesh.rotation.y = Math.atan2(dx, dz);
        } else {
          if (vil.workTimer > 10) {
            vil.workTimer = 0;
            const yieldStone = 6;
            const yieldIron = 2;
            this.resources.stone += yieldStone;
            this.resources.iron += yieldIron;
            sound.playMineRock();
            this.addFloatingText(`+${yieldStone} Stone, +${yieldIron} Iron`, '#b0c4de', targetX, this.terrain.getHeight(targetX, targetZ) + 1.8, targetZ);
          }
        }
      } else if (vil.role === 'guard') {
        // Patrol perimeter or engage nearby monsters!
        let targetEnemy: EnemyData | null = null;
        let closestDist = 20;

        for (const en of this.enemies) {
          const d = Math.hypot(en.x - vil.x, en.z - vil.z);
          if (d < closestDist) {
            closestDist = d;
            targetEnemy = en;
          }
        }

        if (targetEnemy) {
          // Move to attack or shoot
          const dx = targetEnemy.x - vil.x;
          const dz = targetEnemy.z - vil.z;
          const dist = Math.hypot(dx, dz);
          mesh.rotation.y = Math.atan2(dx, dz);

          if (dist > 3.0) {
            vil.x += (dx / dist) * 3.4 * dt;
            vil.z += (dz / dist) * 3.4 * dt;
          }

          if (vil.workTimer > 1.4 && dist < 4.0) {
            vil.workTimer = 0;
            const guardDmg = this.upgrades.steelWeapons ? 24 : 16;
            targetEnemy.health -= guardDmg;
            sound.playHit();
            this.addFloatingText(`-${guardDmg}`, '#ff9f1c', targetEnemy.x, this.terrain.getHeight(targetEnemy.x, targetEnemy.z) + 1.5, targetEnemy.z);
          }
        } else {
          // Idle patrol near Town Hall / Watchtower
          const patrolAngle = (performance.now() * 0.0004 + parseInt(vil.id.slice(-3) || '1')) % (Math.PI * 2);
          const patrolX = Math.cos(patrolAngle) * 14;
          const patrolZ = Math.sin(patrolAngle) * 14;
          const d = Math.hypot(patrolX - vil.x, patrolZ - vil.z);
          if (d > 1.0) {
            vil.x += ((patrolX - vil.x) / d) * 1.8 * dt;
            vil.z += ((patrolZ - vil.z) / d) * 1.8 * dt;
            mesh.rotation.y = Math.atan2(patrolX - vil.x, patrolZ - vil.z);
          }
        }
      }

      // Update mesh coordinates
      const y = this.terrain.getHeight(vil.x, vil.z);
      mesh.position.set(vil.x, y, vil.z);
    }
  }

  private updateEnemies(dt: number) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const en = this.enemies[i];
      const mesh = this.enemyMeshes.get(en.id);

      // Check death
      if (en.health <= 0) {
        sound.playDefeat();
        this.addFloatingText('SLAIN (+Gold)', '#ffd166', en.x, this.terrain.getHeight(en.x, en.z) + 1.5, en.z);
        this.resources.gold += 4;
        if (mesh) this.scene.remove(mesh);
        this.enemyMeshes.delete(en.id);
        this.enemies.splice(i, 1);
        this.waveInfo.enemiesRemaining--;

        // Check wave complete
        if (this.enemies.length === 0 && this.waveInfo.active) {
          this.onWaveVictory();
        }
        continue;
      }

      if (!mesh) continue;

      // Select Target: Priority: 1. Player (if close), 2. Palisade/Buildings in path, 3. Town Hall
      let targetX = 0;
      let targetZ = -4; // Town Hall position

      const pDist = Math.hypot(this.playerPos.x - en.x, this.playerPos.z - en.z);
      if (pDist < 12) {
        targetX = this.playerPos.x;
        targetZ = this.playerPos.z;
      } else {
        // Check if any palisade wall or building is blocking path
        for (const bld of this.buildings) {
          const bd = Math.hypot(bld.x - en.x, bld.z - en.z);
          if (bd < 4.0) {
            targetX = bld.x;
            targetZ = bld.z;
            break;
          }
        }
      }

      const dx = targetX - en.x;
      const dz = targetZ - en.z;
      const dist = Math.hypot(dx, dz);

      en.rotation = Math.atan2(dx, dz);
      mesh.rotation.y = en.rotation;

      if (dist > en.attackRange) {
        en.x += (dx / dist) * en.speed * dt;
        en.z += (dz / dist) * en.speed * dt;
      } else {
        // Attack target!
        const now = performance.now() * 0.001;
        if (now - en.lastAttackTime > en.attackCooldown) {
          en.lastAttackTime = now;

          // If targeting player
          if (targetX === this.playerPos.x && targetZ === this.playerPos.z) {
            this.playerStats.health -= en.damage;
            this.cameraShake = 0.5;
            sound.playHit();
            this.addFloatingText(`-${en.damage}`, '#ff0054', this.playerPos.x, this.playerPos.y + 1.8, this.playerPos.z);

            if (this.playerStats.health <= 0) {
              this.triggerGameOver('The Commander has fallen in battle.');
            }
          } else {
            // Damage building
            const targetBld = this.buildings.find((b) => Math.hypot(b.x - targetX, b.z - targetZ) < 3.0);
            if (targetBld) {
              targetBld.health -= en.damage;
              sound.playHit();
              this.addFloatingText(`-${en.damage}`, '#ff5400', targetBld.x, this.terrain.getHeight(targetBld.x, targetBld.z) + 2.0, targetBld.z);

              if (targetBld.health <= 0) {
                if (targetBld.type === 'town_hall') {
                  this.triggerGameOver('The Colony Center has been destroyed by the horde!');
                } else {
                  // Destroy building
                  const bMesh = this.buildingMeshes.get(targetBld.id);
                  if (bMesh) this.scene.remove(bMesh);
                  this.buildingMeshes.delete(targetBld.id);
                  this.buildings = this.buildings.filter((b) => b.id !== targetBld.id);
                  this.addFloatingText(`${BUILDING_BLUEPRINTS[targetBld.type].name} Destroyed!`, '#ef233c', targetBld.x, 3, targetBld.z);
                }
              }
            }
          }
        }
      }

      // Check spike trap collisions
      for (const bld of this.buildings) {
        if (bld.type === 'spiketrap') {
          const trapDist = Math.hypot(bld.x - en.x, bld.z - en.z);
          if (trapDist < 1.4) {
            en.health -= 35 * dt; // Rapid impale damage
            bld.health -= 15 * dt;
          }
        }
      }

      mesh.position.set(en.x, this.terrain.getHeight(en.x, en.z), en.z);
    }
  }

  private updateWatchtowers(dt: number) {
    for (const bld of this.buildings) {
      if (bld.type === 'watchtower') {
        bld.cooldownTimer = (bld.cooldownTimer || 0) + dt;
        if (bld.cooldownTimer >= 1.6) {
          let target: EnemyData | null = null;
          let minD = 22; // Range

          for (const en of this.enemies) {
            const d = Math.hypot(en.x - bld.x, en.z - bld.z);
            if (d < minD) {
              minD = d;
              target = en;
            }
          }

          if (target) {
            bld.cooldownTimer = 0;
            this.fireTowerArrow(bld, target, 28);
          }
        }
      } else if (bld.type === 'ballista') {
        bld.cooldownTimer = (bld.cooldownTimer || 0) + dt;
        if (bld.cooldownTimer >= 2.4) {
          // Prefers larger enemies (golems or brutes) or nearest
          let target: EnemyData | null = null;
          let minD = 30;

          for (const en of this.enemies) {
            const d = Math.hypot(en.x - bld.x, en.z - bld.z);
            if (d < minD) {
              if (en.type === 'golem' || en.type === 'brute' || !target) {
                minD = d;
                target = en;
              }
            }
          }

          if (target) {
            bld.cooldownTimer = 0;
            this.fireTowerArrow(bld, target, 65); // Heavy siege bolt
          }
        }
      } else if (bld.type === 'windmill') {
        // Rotate Windmill Sails smoothly in the wind
        const mesh = this.buildingMeshes.get(bld.id);
        if (mesh) {
          const sails = mesh.getObjectByName('windmillSails');
          if (sails) {
            sails.rotation.z += dt * 1.6;
          }
        }

        bld.cooldownTimer = (bld.cooldownTimer || 0) + dt;
        if (bld.cooldownTimer >= 7.0) {
          bld.cooldownTimer = 0;
          this.resources.food += 6;
          this.addFloatingText('+6 Flour (Food)', '#eab308', bld.x, this.terrain.getHeight(bld.x, bld.z) + 3.5, bld.z);
        }
      } else if (bld.type === 'clinic') {
        bld.cooldownTimer = (bld.cooldownTimer || 0) + dt;
        if (bld.cooldownTimer >= 2.5) {
          bld.cooldownTimer = 0;
          // Heal player if within 9m
          const pDist = Math.hypot(this.playerPos.x - bld.x, this.playerPos.z - bld.z);
          if (pDist < 9 && this.playerStats.health < this.playerStats.maxHealth) {
            this.playerStats.health = Math.min(this.playerStats.maxHealth, this.playerStats.health + 8);
            this.addFloatingText('+8 HP', '#4ade80', this.playerPos.x, this.playerPos.y + 1.8, this.playerPos.z);
          }

          // Heal nearby colonists
          for (const vil of this.villagers) {
            const vDist = Math.hypot(vil.x - bld.x, vil.z - bld.z);
            if (vDist < 9 && vil.health < vil.maxHealth) {
              vil.health = Math.min(vil.maxHealth, vil.health + 10);
            }
          }
        }
      } else if (bld.type === 'blacksmith') {
        bld.cooldownTimer = (bld.cooldownTimer || 0) + dt;
        if (bld.cooldownTimer >= 4.0) {
          bld.cooldownTimer = 0;
          // Repair damaged nearby building
          for (const targetBld of this.buildings) {
            const bDist = Math.hypot(targetBld.x - bld.x, targetBld.z - bld.z);
            if (bDist < 12 && targetBld.health < targetBld.maxHealth) {
              targetBld.health = Math.min(targetBld.maxHealth, targetBld.health + 25);
              this.addFloatingText('+25 Repaired', '#38bdf8', targetBld.x, this.terrain.getHeight(targetBld.x, targetBld.z) + 2.0, targetBld.z);
              break;
            }
          }
        }
      }
    }
  }

  private fireTowerArrow(tower: PlacedBuilding, enemy: EnemyData, damage = 28) {
    sound.playArrowFire();

    const towerY = this.terrain.getHeight(tower.x, tower.z) + 5.2; // Crow's nest height
    const enemyY = this.terrain.getHeight(enemy.x, enemy.z) + 0.8;

    const arrowGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.7, 4);
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffe066 });
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    arrow.position.set(tower.x, towerY, tower.z);
    arrow.lookAt(enemy.x, enemyY, enemy.z);
    arrow.rotateX(Math.PI / 2);
    this.scene.add(arrow);

    this.projectiles.push({
      mesh: arrow,
      startPos: new THREE.Vector3(tower.x, towerY, tower.z),
      targetPos: new THREE.Vector3(enemy.x, enemyY, enemy.z),
      targetEnemyId: enemy.id,
      progress: 0,
      damage,
    });
  }

  private updateProjectiles(dt: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.progress += dt * 3.5; // Fast arrow speed

      if (p.progress >= 1.0) {
        // Arrow arrived!
        const en = this.enemies.find((e) => e.id === p.targetEnemyId);
        if (en) {
          en.health -= p.damage;
          sound.playHit();
          this.addFloatingText(`-${p.damage}`, '#ffe600', en.x, this.terrain.getHeight(en.x, en.z) + 1.8, en.z);
        }
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      } else {
        p.mesh.position.lerpVectors(p.startPos, p.targetPos, p.progress);
      }
    }
  }

  private updateFloatingTexts(dt: number) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life += dt;
      ft.y += ft.vy * dt;
      if (ft.life >= ft.maxLife) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  private updateGhostPlacement() {
    if (!this.ghostMesh || !this.activeGhostType) return;

    // Raycast ground intersection
    this.mouseRaycaster.setFromCamera(this.mouseCoords, this.camera);
    if (this.terrain.terrainMesh) {
      const intersects = this.mouseRaycaster.intersectObject(this.terrain.terrainMesh);
      if (intersects.length > 0) {
        const pt = intersects[0].point;
        // Snap to gentle 1m grid
        const snapX = Math.round(pt.x);
        const snapZ = Math.round(pt.z);
        const y = this.terrain.getHeight(snapX, snapZ);

        this.ghostMesh.position.set(snapX, y, snapZ);
        this.ghostMesh.visible = true;
      }
    }
  }

  private updateCamera(dt: number) {
    // Third-person smoothed follow camera based on distance setting
    const camOffset =
      this.cameraDistanceSetting === 'close'
        ? new THREE.Vector3(0, 10, 13)
        : this.cameraDistanceSetting === 'far'
        ? new THREE.Vector3(0, 20, 26)
        : new THREE.Vector3(0, 14, 18);

    const targetCamPos = this.playerPos.clone().add(camOffset);

    // Apply camera shake if present and enabled
    if (this.cameraShake > 0 && this.screenShakeEnabled) {
      targetCamPos.x += (Math.random() - 0.5) * this.cameraShake * 1.5;
      targetCamPos.y += (Math.random() - 0.5) * this.cameraShake * 1.5;
      this.cameraShake = Math.max(0, this.cameraShake - dt * 2.0);
    }

    // Exponential smoothing
    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, targetCamPos.x, 8, dt);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, targetCamPos.y, 8, dt);
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, targetCamPos.z, 8, dt);

    const lookTarget = this.playerPos.clone().add(new THREE.Vector3(0, 1.5, 0));
    this.camera.lookAt(lookTarget);
  }

  private onWaveVictory() {
    this.waveInfo.active = false;
    sound.playVictory();

    // Reward: +35 Gold, +50 Food, and a new Villager settler joins!
    this.resources.gold += 35;
    this.resources.food += 50;

    const villagerNames = ['Torin', 'Kaelen', 'Mira', 'Rowan', 'Garrick', 'Vera', 'Orson', 'Lyra', 'Darek'];
    const newName = villagerNames[this.villagers.length % villagerNames.length] + ' the Settler';
    const newVil = this.spawnVillager(newName, 'idle', 0, -2);

    this.addFloatingText(`WAVE ${this.waveInfo.waveNumber} SURVIVED!`, '#00f5d4', this.playerPos.x, 6, this.playerPos.z);
    this.addFloatingText(`${newVil.name} joined the colony!`, '#ffd166', 0, 3, -2);

    this.waveInfo.waveNumber++;
    this.waveInfo.timeUntilNextWave = 120; // 2 minutes peace until next wave
  }

  private triggerGameOver(reason: string) {
    this.isGameOver = true;
    sound.playDefeat();
    this.addFloatingText(`GAME OVER: ${reason}`, '#ef233c', this.playerPos.x, 4, this.playerPos.z);
  }

  // Event Listeners
  private bindEvents() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('blur', this.onWindowBlur);
    this.container.addEventListener('mousemove', this.onMouseMove);
    this.container.addEventListener('mousedown', this.onMouseDown);
    this.container.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;

    // Action Key (Space / E / F)
    if (e.code === 'KeyF' || e.code === 'KeyE') {
      this.performPlayerAction();
    }

    // Toggle Build Ghost Cancel (Escape)
    if (e.code === 'Escape') {
      if (this.activeGhostType) {
        this.setBuildingGhost(null);
      } else {
        this.isPaused = !this.isPaused;
      }
    }

    // Rotate Ghost Building (R key)
    if (e.code === 'KeyR' && this.ghostMesh) {
      this.ghostMesh.rotation.y += Math.PI / 4;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  private onWindowBlur = () => {
    this.keys = {};
  };

  private onMouseMove = (e: MouseEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.mouseCoords.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseCoords.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  private onMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      // Left Click
      if (this.activeGhostType) {
        this.confirmBuildingPlacement();
      } else {
        this.performPlayerAction();
      }
    } else if (e.button === 2) {
      // Right Click cancels building
      if (this.activeGhostType) {
        this.setBuildingGhost(null);
      }
    }
  };

  private onWindowResize = () => {
    if (!this.container) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  };

  // Main 60fps Loop
  private startLoop() {
    let lastUiDispatch = 0;

    const tick = () => {
      const now = performance.now();
      const rawDt = (now - this.lastTime) / 1000;
      this.lastTime = now;
      const dt = Math.min(rawDt, 0.05); // Clamped dt to prevent physics tunneling

      this.update(dt);
      this.renderer.render(this.scene, this.camera);

      // Periodic React HUD synchronization (~15 times/sec)
      if (now - lastUiDispatch > 65) {
        lastUiDispatch = now;
        this.onStateUpdateCb?.();
      }

      this.animFrameId = requestAnimationFrame(tick);
    };

    this.animFrameId = requestAnimationFrame(tick);
  }

  // Cleanup
  public destroy() {
    cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('blur', this.onWindowBlur);
    this.container.removeEventListener('mousemove', this.onMouseMove);
    this.container.removeEventListener('mousedown', this.onMouseDown);

    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
