/**
 * Procedural Terrain Generation, Height Query, and Natural World Boundaries.
 * Generates continuous terrain with vertex colors (meadow, stone crag, mountain, sand),
 * water body with specular reflection, 30 exploration structures with loot, and natural resources.
 */

import * as THREE from 'three';
import { SimplexNoise } from './noise';
import { ExplorationStructure, ExplorationStructureType, ResourceNode } from './state';
import { createExplorationStructureMesh, createResourceMesh } from './models';

export const WORLD_SIZE = 260;
export const HALF_WORLD = WORLD_SIZE / 2;

export class TerrainManager {
  public noise: SimplexNoise;
  public terrainMesh: THREE.Mesh | null = null;
  public waterMesh: THREE.Mesh | null = null;
  public resourceNodes: ResourceNode[] = [];
  public resourceMeshes: Map<string, THREE.Group> = new Map();
  public explorationStructures: ExplorationStructure[] = [];
  public explorationMeshes: Map<string, THREE.Group> = new Map();
  public shrines: { id: string; x: number; z: number; discovered: boolean; mesh: THREE.Group }[] = [];

  constructor(seed = 4242) {
    this.noise = new SimplexNoise(seed);
  }

  // Exact continuous mathematical heightmap function
  public getHeight(x: number, z: number): number {
    const dist = Math.hypot(x, z);

    // Natural mountain barrier bounding the world edges
    let baseElevation = 0;
    if (dist > 90) {
      baseElevation = Math.pow((dist - 90) / 28, 2.3) * 14;
    }

    // Gentle central bowl for colony building (radius < 25)
    const broad = this.noise.fbm2D(x * 0.012, z * 0.012, 4, 0.5, 2.0) * 9.0;
    const detail = this.noise.noise2D(x * 0.045, z * 0.045) * 1.8;
    const micro = this.noise.noise2D(x * 0.12, z * 0.12) * 0.4;

    // Lake depression in eastern sector
    const lakeDist = Math.hypot(x - 45, z - 45);
    let lakeDepression = 0;
    if (lakeDist < 35) {
      lakeDepression = (1 - lakeDist / 35) * 4.5;
    }

    const centerFactor = Math.min(1.0, Math.max(0.12, (dist - 12) / 38));

    return (broad + detail + micro) * centerFactor + baseElevation - lakeDepression;
  }

  // Surface normal computation via finite differences
  public getNormal(x: number, z: number): THREE.Vector3 {
    const eps = 0.5;
    const hL = this.getHeight(x - eps, z);
    const hR = this.getHeight(x + eps, z);
    const hD = this.getHeight(x, z - eps);
    const hU = this.getHeight(x, z + eps);

    const normal = new THREE.Vector3(hL - hR, 2 * eps, hD - hU).normalize();
    return normal;
  }

  // Builds the procedural terrain geometry with rich biome vertex colors
  public buildTerrain(scene: THREE.Scene): void {
    const resolution = 160; // 160x160 high detail grid
    const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, resolution, resolution);
    geometry.rotateX(-Math.PI / 2);

    const posAttr = geometry.attributes.position;
    const colors: number[] = [];

    const deepGrass = new THREE.Color(0x285933);
    const lushGrass = new THREE.Color(0x3e7747);
    const brightMeadow = new THREE.Color(0x4f8f58);
    const sandShore = new THREE.Color(0xd4c28f);
    const wetSand = new THREE.Color(0xb5a072);
    const rockCrag = new THREE.Color(0x60656b);
    const darkStone = new THREE.Color(0x45484c);
    const snowCap = new THREE.Color(0xf2f4f7);

    const vertex = new THREE.Vector3();
    for (let i = 0; i < posAttr.count; i++) {
      vertex.fromBufferAttribute(posAttr, i);
      const y = this.getHeight(vertex.x, vertex.z);
      posAttr.setY(i, y);

      const norm = this.getNormal(vertex.x, vertex.z);
      const slope = 1 - norm.y; // 0 = flat, 1 = cliff

      const col = new THREE.Color();

      if (y < 0.2) {
        col.copy(wetSand);
      } else if (y < 0.9) {
        col.copy(sandShore).lerp(lushGrass, (y - 0.2) / 0.7);
      } else if (slope > 0.42 || y > 15) {
        col.copy(rockCrag).lerp(darkStone, Math.min(1, slope * 1.5));
        if (y > 17) {
          col.lerp(snowCap, Math.min(1, (y - 17) / 5));
        }
      } else {
        const n = this.noise.noise2D(vertex.x * 0.08, vertex.z * 0.08);
        if (n > 0.2) {
          col.copy(brightMeadow);
        } else if (n < -0.2) {
          col.copy(deepGrass);
        } else {
          col.copy(lushGrass);
        }
      }

      colors.push(col.r, col.g, col.b);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const terrainMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.88,
      metalness: 0.06,
      flatShading: true,
    });

    this.terrainMesh = new THREE.Mesh(geometry, terrainMaterial);
    this.terrainMesh.receiveShadow = true;
    this.terrainMesh.name = 'TerrainMesh';
    scene.add(this.terrainMesh);

    // Enhanced Water Basin with high-specular reflective surface
    const waterGeo = new THREE.PlaneGeometry(80, 80, 32, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x1b4965,
      roughness: 0.08,
      metalness: 0.85,
      transparent: true,
      opacity: 0.82,
    });
    this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
    this.waterMesh.rotation.x = -Math.PI / 2;
    this.waterMesh.position.set(45, 0.1, 45);
    this.waterMesh.receiveShadow = true;
    scene.add(this.waterMesh);

    // Populate natural resource nodes & 30 exploration structures
    this.populateResources(scene);
    this.populate30ExplorationStructures(scene);
    this.populateWildflowers(scene);
  }

  // Populate wildflowers / flora tufts to bring the landscape alive
  private populateWildflowers(scene: THREE.Scene): void {
    const flowerColors = [0xffd166, 0xef476f, 0x06d6a0, 0x118ab2, 0xff9f1c];
    const flowerGeo = new THREE.ConeGeometry(0.12, 0.35, 4);

    for (let i = 0; i < 180; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 6 + Math.random() * 80;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const y = this.getHeight(x, z);

      if (y > 0.8 && y < 12) {
        const col = flowerColors[i % flowerColors.length];
        const mat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.5 });
        const flower = new THREE.Mesh(flowerGeo, mat);
        flower.position.set(x, y + 0.15, z);
        flower.rotation.y = Math.random() * Math.PI;
        flower.scale.setScalar(0.8 + Math.random() * 0.4);
        scene.add(flower);
      }
    }
  }

  // Generates 30 distinct exploration structures with rich interactive loot
  private populate30ExplorationStructures(scene: THREE.Scene): void {
    const definitions: {
      type: ExplorationStructureType;
      name: string;
      x: number;
      z: number;
      loot: ExplorationStructure['loot'];
    }[] = [
      { type: 'ruined_temple', name: 'Sunken Temple of Valen', x: -35, z: 40, loot: { gold: 45, relicName: 'Sunken Relic' } },
      { type: 'abandoned_outpost', name: 'Ranger Watchtower', x: -55, z: 25, loot: { wood: 50, iron: 25, survivorName: 'Rowan the Scout' } },
      { type: 'stone_henge', name: 'Whispering Megaliths', x: -45, z: -50, loot: { gold: 35, food: 40 } },
      { type: 'smelter_ruin', name: 'Old Smelter Barrow', x: -60, z: -25, loot: { iron: 45, stone: 40 } },
      { type: 'lumber_camp', name: 'Forgotten Sawmill', x: -25, z: -60, loot: { wood: 80, food: 30 } },
      { type: 'treasure_vault', name: 'Royal Frontier Vault', x: 45, z: -55, loot: { gold: 75, iron: 30, relicName: 'Crown of the Frontier' } },
      { type: 'alchemist_den', name: 'Hermit Alchemist Lab', x: 60, z: -30, loot: { gold: 30, food: 60, survivorName: 'Astrid the Healer' } },
      { type: 'ancient_crypt', name: 'Crypt of the Iron Knight', x: 35, z: -45, loot: { iron: 50, gold: 40 } },
      { type: 'sunken_cache', name: 'Lakeside Shipwreck', x: 50, z: 40, loot: { gold: 50, wood: 40, food: 40 } },
      { type: 'stone_henge', name: 'Celestial Stone Ring', x: 65, z: 30, loot: { gold: 60, relicName: 'Starstone Core' } },

      { type: 'abandoned_outpost', name: 'North Ridge Sentry', x: -40, z: 65, loot: { wood: 45, iron: 20 } },
      { type: 'ruined_temple', name: 'Overgrown Sanctum', x: -68, z: 50, loot: { gold: 40, stone: 35 } },
      { type: 'smelter_ruin', name: 'Ironforge Excavation', x: -75, z: 15, loot: { iron: 60, stone: 50 } },
      { type: 'ancient_crypt', name: 'Barrow of Lost Kings', x: -58, z: -40, loot: { gold: 55, iron: 35 } },
      { type: 'lumber_camp', name: 'Deepwood Logger Camp', x: -32, z: -78, loot: { wood: 90, food: 25 } },
      { type: 'stone_henge', name: 'High Alpine Shrines', x: 12, z: -82, loot: { gold: 45, food: 35 } },
      { type: 'treasure_vault', name: 'Dwarven Treasury', x: 42, z: -75, loot: { gold: 80, iron: 40 } },
      { type: 'alchemist_den', name: 'Witchweed Apothecary', x: 78, z: -22, loot: { food: 70, survivorName: 'Benton the Herbalist' } },
      { type: 'treasure_vault', name: 'Vault of the Dawn', x: 72, z: 22, loot: { gold: 70, relicName: 'Dawn Vanguard Crest' } },
      { type: 'sunken_cache', name: 'Sunken Fishermen Cache', x: 32, z: 68, loot: { food: 55, gold: 30 } },

      { type: 'stone_henge', name: 'Elder Monolith Circle', x: -16, z: 78, loot: { gold: 40, stone: 45 } },
      { type: 'lumber_camp', name: 'Pinecrest Carpenter Post', x: -78, z: 42, loot: { wood: 75, iron: 20 } },
      { type: 'smelter_ruin', name: 'Blackrock Kiln', x: -82, z: -18, loot: { iron: 55, stone: 40 } },
      { type: 'abandoned_outpost', name: 'Southern Bastion Ruins', x: -48, z: -72, loot: { wood: 40, iron: 30, survivorName: 'Kael the Guardian' } },
      { type: 'sunken_cache', name: 'Riverbank Supply Drift', x: 2, z: -72, loot: { food: 45, wood: 35 } },
      { type: 'ancient_crypt', name: 'Wyrmbone Tomb', x: 62, z: -68, loot: { gold: 65, iron: 45 } },
      { type: 'abandoned_outpost', name: 'East Wind Garrison', x: 82, z: -12, loot: { wood: 60, iron: 30 } },
      { type: 'sunken_cache', name: 'Sunken Gold Chest', x: 56, z: 62, loot: { gold: 65, food: 30 } },
      { type: 'ruined_temple', name: 'Ancient Sky Observatory', x: 22, z: 78, loot: { gold: 50, relicName: 'Celestial Lens' } },
      { type: 'stone_henge', name: 'Titan Altar of Ages', x: -72, z: -62, loot: { gold: 90, iron: 50, relicName: 'Heart of the Titan' } },
    ];

    definitions.forEach((def, index) => {
      const id = `struct_${index + 1}`;
      const y = this.getHeight(def.x, def.z);

      const struct: ExplorationStructure = {
        id,
        name: def.name,
        type: def.type,
        x: def.x,
        z: def.z,
        looted: false,
        loot: def.loot,
      };

      this.explorationStructures.push(struct);

      const mesh = createExplorationStructureMesh(def.type, false);
      mesh.position.set(def.x, y, def.z);
      mesh.rotation.y = (index * 0.7) % (Math.PI * 2);
      mesh.userData = { explorationId: id, type: def.type };
      scene.add(mesh);
      this.explorationMeshes.set(id, mesh);
    });
  }

  // Populate natural resources
  private populateResources(scene: THREE.Scene): void {
    let nodeId = 1;
    const addNode = (
      type: 'tree' | 'rock' | 'iron_vein' | 'gold_vein' | 'berry_bush',
      x: number,
      z: number,
      maxRes: number,
      scale = 1
    ) => {
      const y = this.getHeight(x, z);
      if (y < 0.25) return;

      const id = `res_${nodeId++}`;
      const node: ResourceNode = {
        id,
        type,
        x,
        z,
        scale,
        resourceRemaining: maxRes,
        maxResource: maxRes,
      };
      this.resourceNodes.push(node);

      const mesh = createResourceMesh(type);
      mesh.position.set(x, y, z);
      mesh.scale.setScalar(scale);
      mesh.rotation.y = Math.random() * Math.PI * 2;
      mesh.userData = { resourceId: id, type };
      scene.add(mesh);
      this.resourceMeshes.set(id, mesh);
    };

    // Trees (110 trees)
    for (let i = 0; i < 110; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 14 + Math.random() * 80;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      addNode('tree', x, z, 50, 0.85 + Math.random() * 0.35);
    }

    // Rocks (50 boulders)
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 16 + Math.random() * 80;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      addNode('rock', x, z, 60, 0.8 + Math.random() * 0.4);
    }

    // Iron Ore Veins (32 veins)
    for (let i = 0; i < 32; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 24 + Math.random() * 70;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      addNode('iron_vein', x, z, 40, 0.9 + Math.random() * 0.3);
    }

    // Gold Veins (18 veins)
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 42 + Math.random() * 50;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      addNode('gold_vein', x, z, 30, 0.9 + Math.random() * 0.3);
    }

    // Berry Bushes (40 bushes)
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 8 + Math.random() * 60;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      addNode('berry_bush', x, z, 25, 0.8 + Math.random() * 0.3);
    }
  }

  // Updates an exploration structure to looted appearance
  public markStructureLooted(scene: THREE.Scene, id: string): void {
    const struct = this.explorationStructures.find((s) => s.id === id);
    if (!struct) return;
    struct.looted = true;

    const oldMesh = this.explorationMeshes.get(id);
    if (oldMesh) {
      scene.remove(oldMesh);
    }
    const newMesh = createExplorationStructureMesh(struct.type, true);
    newMesh.position.set(struct.x, this.getHeight(struct.x, struct.z), struct.z);
    scene.add(newMesh);
    this.explorationMeshes.set(id, newMesh);
  }

  // Remove depleted node
  public removeResourceNode(scene: THREE.Scene, id: string): void {
    const idx = this.resourceNodes.findIndex((n) => n.id === id);
    if (idx !== -1) {
      this.resourceNodes.splice(idx, 1);
    }
    const mesh = this.resourceMeshes.get(id);
    if (mesh) {
      scene.remove(mesh);
      this.resourceMeshes.delete(id);
    }
  }
}
