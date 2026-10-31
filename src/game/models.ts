/**
 * 3D Procedural Composite Models for Outpost Pioneer.
 * All models are constructed as 3-12 part THREE.Group assemblies with varied PBR roughness/metalness,
 * bottom-center grounded pivots, soft radial contact shadows, and procedural canvas textures.
 */

import * as THREE from 'three';
import { BuildingType, EnemyType, ExplorationStructureType, VillagerRole } from './state';

// Procedural Canvas Texture Generators (Zero 404s, linear/sRGB disciplined)
export function createWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#7a4e28';
  ctx.fillRect(0, 0, 256, 256);

  // Grain lines
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * 256;
    ctx.strokeStyle = Math.random() > 0.5 ? '#5c391a' : '#8e5c33';
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(80, y + (Math.random() - 0.5) * 20, 180, y + (Math.random() - 0.5) * 20, 256, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createStoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#6e7278';
  ctx.fillRect(0, 0, 256, 256);

  // Speckles & fissures
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const size = Math.random() * 3 + 1;
    ctx.fillStyle = Math.random() > 0.5 ? '#54585c' : '#868b91';
    ctx.fillRect(x, y, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Contact shadow texture (soft radial falloff)
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Shared Materials & Textures
const contactShadowTex = createContactShadowTexture();
const woodTex = createWoodTexture();
const stoneTex = createStoneTexture();

export const materials = {
  wood: new THREE.MeshStandardMaterial({
    map: woodTex,
    roughness: 0.85,
    metalness: 0.05,
  }),
  woodDark: new THREE.MeshStandardMaterial({
    color: 0x422614,
    roughness: 0.9,
    metalness: 0.02,
  }),
  thatchRoof: new THREE.MeshStandardMaterial({
    color: 0xa87738,
    roughness: 0.95,
    metalness: 0.0,
  }),
  stone: new THREE.MeshStandardMaterial({
    map: stoneTex,
    roughness: 0.8,
    metalness: 0.15,
  }),
  stoneDark: new THREE.MeshStandardMaterial({
    color: 0x3d4147,
    roughness: 0.85,
    metalness: 0.2,
  }),
  iron: new THREE.MeshStandardMaterial({
    color: 0x9ba2a8,
    roughness: 0.35,
    metalness: 0.85,
  }),
  gold: new THREE.MeshStandardMaterial({
    color: 0xffd23f,
    roughness: 0.25,
    metalness: 0.9,
  }),
  foliagePine: new THREE.MeshStandardMaterial({
    color: 0x245432,
    roughness: 0.75,
    metalness: 0.05,
    flatShading: true,
  }),
  foliageOak: new THREE.MeshStandardMaterial({
    color: 0x3a7d44,
    roughness: 0.7,
    metalness: 0.05,
    flatShading: true,
  }),
  soilTilled: new THREE.MeshStandardMaterial({
    color: 0x3d2716,
    roughness: 0.95,
    metalness: 0.0,
  }),
  wheat: new THREE.MeshStandardMaterial({
    color: 0xe5b842,
    roughness: 0.8,
    metalness: 0.05,
  }),
  skin: new THREE.MeshStandardMaterial({
    color: 0xe0a97c,
    roughness: 0.6,
    metalness: 0.05,
  }),
  playerArmor: new THREE.MeshStandardMaterial({
    color: 0x2b4c7e,
    roughness: 0.45,
    metalness: 0.4,
  }),
  villagerTunic: new THREE.MeshStandardMaterial({
    color: 0x8a6240,
    roughness: 0.8,
    metalness: 0.1,
  }),
  villagerMiner: new THREE.MeshStandardMaterial({
    color: 0x5a544c,
    roughness: 0.7,
    metalness: 0.3,
  }),
  villagerGuard: new THREE.MeshStandardMaterial({
    color: 0x8c2727,
    roughness: 0.4,
    metalness: 0.6,
  }),
  villagerFarmer: new THREE.MeshStandardMaterial({
    color: 0x4f772d,
    roughness: 0.8,
    metalness: 0.05,
  }),
  strawHat: new THREE.MeshStandardMaterial({
    color: 0xd4a359,
    roughness: 0.9,
    metalness: 0.0,
  }),
  shadowBeast: new THREE.MeshStandardMaterial({
    color: 0x18181f,
    roughness: 0.6,
    metalness: 0.3,
    flatShading: true,
  }),
  beastEyes: new THREE.MeshBasicMaterial({
    color: 0xff1e38,
  }),
  lanternGlass: new THREE.MeshStandardMaterial({
    color: 0xffb703,
    emissive: 0xffaa00,
    emissiveIntensity: 1.5,
    roughness: 0.1,
    metalness: 0.1,
  }),
  relicAura: new THREE.MeshStandardMaterial({
    color: 0x00f5d4,
    emissive: 0x00f5d4,
    emissiveIntensity: 1.6,
    roughness: 0.1,
    metalness: 0.2,
  }),
  lootChest: new THREE.MeshStandardMaterial({
    color: 0x5a3825,
    roughness: 0.7,
    metalness: 0.2,
  }),
  mossStone: new THREE.MeshStandardMaterial({
    color: 0x4a5d4e,
    roughness: 0.9,
    metalness: 0.1,
    flatShading: true,
  }),
  brickRed: new THREE.MeshStandardMaterial({
    color: 0x8b3a2b,
    roughness: 0.85,
    metalness: 0.1,
  }),
  gemRuby: new THREE.MeshStandardMaterial({
    color: 0xe63946,
    emissive: 0xff0033,
    emissiveIntensity: 1.2,
    roughness: 0.15,
    metalness: 0.8,
  }),
  hearthFire: new THREE.MeshBasicMaterial({
    color: 0xff7b00,
  }),
  contactShadow: new THREE.MeshBasicMaterial({
    map: contactShadowTex,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  }),
};

// Radial contact shadow helper
function addContactShadow(group: THREE.Group, radius: number) {
  const shadowGeo = new THREE.PlaneGeometry(radius * 2, radius * 2);
  const shadow = new THREE.Mesh(shadowGeo, materials.contactShadow);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02; // prevent z-fighting with terrain
  shadow.renderOrder = 1;
  group.add(shadow);
}

// ----------------------------------------------------
// 1. COMPOSITE HERO PLAYER CHARACTER (8-part assembly)
// ----------------------------------------------------
export function createPlayerMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Player';

  // 1. Torso / Tunic
  const torsoGeo = new THREE.BoxGeometry(0.7, 0.9, 0.45);
  const torso = new THREE.Mesh(torsoGeo, materials.playerArmor);
  torso.position.y = 1.15;
  torso.castShadow = true;
  group.add(torso);

  // 2. Head
  const headGeo = new THREE.BoxGeometry(0.45, 0.45, 0.45);
  const head = new THREE.Mesh(headGeo, materials.skin);
  head.position.y = 1.85;
  head.castShadow = true;
  group.add(head);

  // 3. Explorer Cap / Helmet with feather/trim
  const hatGeo = new THREE.BoxGeometry(0.55, 0.15, 0.55);
  const hat = new THREE.Mesh(hatGeo, materials.woodDark);
  hat.position.y = 2.12;
  head.add(hat);

  const featherGeo = new THREE.ConeGeometry(0.08, 0.35, 4);
  const feather = new THREE.Mesh(featherGeo, materials.gold);
  feather.position.set(0.24, 0.2, 0);
  feather.rotation.z = -0.4;
  hat.add(feather);

  // 4 & 5. Left and Right Legs
  const legGeo = new THREE.BoxGeometry(0.25, 0.7, 0.25);
  const legMat = materials.woodDark;

  const leftLeg = new THREE.Mesh(legGeo, legMat);
  leftLeg.position.set(-0.2, 0.35, 0);
  leftLeg.castShadow = true;
  leftLeg.name = 'leftLeg';
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, legMat);
  rightLeg.position.set(0.2, 0.35, 0);
  rightLeg.castShadow = true;
  rightLeg.name = 'rightLeg';
  group.add(rightLeg);

  // 6. Backpack with bedroll
  const packGeo = new THREE.BoxGeometry(0.55, 0.6, 0.3);
  const pack = new THREE.Mesh(packGeo, materials.woodDark);
  pack.position.set(0, 1.2, -0.35);
  pack.castShadow = true;
  group.add(pack);

  const bedrollGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.6, 8);
  const bedroll = new THREE.Mesh(bedrollGeo, materials.thatchRoof);
  bedroll.rotation.z = Math.PI / 2;
  bedroll.position.set(0, 0.38, 0);
  pack.add(bedroll);

  // 7. Right Arm & Tool/Weapon
  const armGeo = new THREE.BoxGeometry(0.2, 0.65, 0.2);
  const rightArm = new THREE.Mesh(armGeo, materials.playerArmor);
  rightArm.position.set(0.5, 1.2, 0);
  rightArm.name = 'rightArm';
  rightArm.castShadow = true;
  group.add(rightArm);

  // Weapon holder (sword / pickaxe / axe)
  const weaponHolder = new THREE.Group();
  weaponHolder.name = 'weaponHolder';
  weaponHolder.position.set(0, -0.3, 0.2);

  // Sword Blade & Hilt
  const bladeGeo = new THREE.BoxGeometry(0.08, 0.9, 0.04);
  const blade = new THREE.Mesh(bladeGeo, materials.iron);
  blade.position.y = 0.45;
  blade.castShadow = true;

  const crossguardGeo = new THREE.BoxGeometry(0.35, 0.08, 0.1);
  const crossguard = new THREE.Mesh(crossguardGeo, materials.gold);
  crossguard.position.y = 0.0;

  const gripGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.25, 6);
  const grip = new THREE.Mesh(gripGeo, materials.woodDark);
  grip.position.y = -0.15;

  weaponHolder.add(blade, crossguard, grip);
  rightArm.add(weaponHolder);

  // 8. Left Arm (torch or idle)
  const leftArm = new THREE.Mesh(armGeo, materials.playerArmor);
  leftArm.position.set(-0.5, 1.2, 0);
  leftArm.name = 'leftArm';
  leftArm.castShadow = true;
  group.add(leftArm);

  // Radial Ground Contact Shadow
  addContactShadow(group, 0.7);

  return group;
}

// ----------------------------------------------------
// 2. COMPOSITE VILLAGER CHARACTER (Role-based props)
// ----------------------------------------------------
export function createVillagerMesh(role: VillagerRole = 'idle'): THREE.Group {
  const group = new THREE.Group();
  group.name = `Villager_${role}`;

  // Role tunic material
  let tunicMat = materials.villagerTunic;
  if (role === 'farmer') tunicMat = materials.villagerFarmer;
  if (role === 'miner') tunicMat = materials.villagerMiner;
  if (role === 'guard') tunicMat = materials.villagerGuard;

  // 1. Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.4), tunicMat);
  torso.position.y = 1.05;
  torso.castShadow = true;
  group.add(torso);

  // 2. Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), materials.skin);
  head.position.y = 1.68;
  head.castShadow = true;
  group.add(head);

  // 3 & 4. Legs
  const legGeo = new THREE.BoxGeometry(0.22, 0.65, 0.22);
  const leftLeg = new THREE.Mesh(legGeo, materials.woodDark);
  leftLeg.position.set(-0.18, 0.32, 0);
  leftLeg.castShadow = true;
  leftLeg.name = 'leftLeg';
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, materials.woodDark);
  rightLeg.position.set(0.18, 0.32, 0);
  rightLeg.castShadow = true;
  rightLeg.name = 'rightLeg';
  group.add(rightLeg);

  // 5. Right Arm
  const armGeo = new THREE.BoxGeometry(0.18, 0.6, 0.18);
  const rightArm = new THREE.Mesh(armGeo, tunicMat);
  rightArm.position.set(0.42, 1.1, 0);
  rightArm.name = 'rightArm';
  rightArm.castShadow = true;
  group.add(rightArm);

  // Role Headwear & Tool Accents
  if (role === 'farmer') {
    // Straw sun hat with wide brim
    const brimGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.05, 12);
    const crownGeo = new THREE.ConeGeometry(0.25, 0.25, 12);
    const hat = new THREE.Group();
    hat.add(new THREE.Mesh(brimGeo, materials.strawHat));
    const crown = new THREE.Mesh(crownGeo, materials.strawHat);
    crown.position.y = 0.15;
    hat.add(crown);
    hat.position.y = 0.24;
    head.add(hat);

    // Hoe / Rake tool in hand
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 6), materials.woodDark);
    handle.position.set(0, -0.3, 0.2);
    handle.rotation.x = 0.3;
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.04), materials.iron);
    blade.position.set(0, 0.6, 0.05);
    blade.rotation.x = Math.PI / 2;
    handle.add(blade);
    rightArm.add(handle);
  } else if (role === 'miner') {
    // Miner hardhat with lamp
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 8), materials.iron);
    helmet.scale.set(1, 0.8, 1);
    helmet.position.y = 0.22;
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), materials.lanternGlass);
    lamp.position.set(0, 0, 0.25);
    helmet.add(lamp);
    head.add(helmet);

    // Pickaxe tool
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 6), materials.woodDark);
    handle.position.set(0, -0.2, 0.2);
    const pickHead = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.5, 4), materials.iron);
    pickHead.position.set(0, 0.5, 0);
    pickHead.rotation.z = Math.PI / 2;
    handle.add(pickHead);
    rightArm.add(handle);
  } else if (role === 'guard') {
    // Guard Iron Kettle Helmet
    const helm = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.35, 8), materials.iron);
    helm.position.y = 0.28;
    head.add(helm);

    // Spear / Bow in right hand
    const spearShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.6, 6), materials.woodDark);
    spearShaft.position.set(0, 0.1, 0.25);
    const spearTip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 4), materials.iron);
    spearTip.position.y = 0.85;
    spearShaft.add(spearTip);
    rightArm.add(spearShaft);

    // Wooden round shield on left arm
    const shieldGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.05, 12);
    const shield = new THREE.Mesh(shieldGeo, materials.woodDark);
    shield.rotation.z = Math.PI / 2;
    shield.position.set(-0.45, 1.05, 0.1);
    const boss = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), materials.iron);
    boss.position.y = 0.03;
    shield.add(boss);
    group.add(shield);
  }

  // Radial Ground Contact Shadow
  addContactShadow(group, 0.6);

  return group;
}

// ----------------------------------------------------
// 3. COMPOSITE HOSTILE CREATURES (3-10 part assemblies)
// ----------------------------------------------------
export function createEnemyMesh(type: EnemyType): THREE.Group {
  const group = new THREE.Group();
  group.name = `Enemy_${type}`;

  if (type === 'stalker') {
    // Fast Quadruped Shadow Beast
    // 1. Spined Torso
    const torsoGeo = new THREE.ConeGeometry(0.45, 1.4, 6);
    const torso = new THREE.Mesh(torsoGeo, materials.shadowBeast);
    torso.rotation.x = Math.PI / 2;
    torso.position.y = 0.6;
    torso.castShadow = true;
    group.add(torso);

    // 2. Menacing Skull Head with Glowing Eyes
    const headGeo = new THREE.ConeGeometry(0.35, 0.6, 5);
    const head = new THREE.Mesh(headGeo, materials.shadowBeast);
    head.rotation.x = -Math.PI / 2;
    head.position.set(0, 0.75, 0.85);
    head.castShadow = true;
    group.add(head);

    // Eyes
    const eyeGeo = new THREE.BoxGeometry(0.08, 0.08, 0.1);
    const eyeL = new THREE.Mesh(eyeGeo, materials.beastEyes);
    eyeL.position.set(-0.15, 0.1, 0.15);
    const eyeR = new THREE.Mesh(eyeGeo, materials.beastEyes);
    eyeR.position.set(0.15, 0.1, 0.15);
    head.add(eyeL, eyeR);

    // 3-6. 4 Clawed Legs
    const legGeo = new THREE.BoxGeometry(0.16, 0.65, 0.16);
    const legFL = new THREE.Mesh(legGeo, materials.shadowBeast);
    legFL.position.set(-0.35, 0.32, 0.45);
    legFL.castShadow = true;
    const legFR = new THREE.Mesh(legGeo, materials.shadowBeast);
    legFR.position.set(0.35, 0.32, 0.45);
    legFR.castShadow = true;
    const legBL = new THREE.Mesh(legGeo, materials.shadowBeast);
    legBL.position.set(-0.35, 0.32, -0.45);
    legBL.castShadow = true;
    const legBR = new THREE.Mesh(legGeo, materials.shadowBeast);
    legBR.position.set(0.35, 0.32, -0.45);
    legBR.castShadow = true;
    group.add(legFL, legFR, legBL, legBR);

    // 7. Spiny Ridge / Dorsal Spikes
    for (let i = 0; i < 3; i++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 4), materials.iron);
      spike.position.set(0, 0.85, 0.3 - i * 0.35);
      spike.rotation.x = -0.3;
      group.add(spike);
    }

    addContactShadow(group, 0.8);
  } else if (type === 'brute') {
    // Heavy Goblin Brute
    // 1. Muscular Hunched Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.1, 0.8), materials.stoneDark);
    torso.position.y = 1.2;
    torso.castShadow = true;
    group.add(torso);

    // 2. Horned Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.55, 0.6), materials.shadowBeast);
    head.position.set(0, 1.85, 0.2);
    head.castShadow = true;
    group.add(head);

    // Horns
    const hornGeo = new THREE.ConeGeometry(0.12, 0.4, 4);
    const hornL = new THREE.Mesh(hornGeo, materials.woodDark);
    hornL.position.set(-0.32, 0.3, 0);
    hornL.rotation.z = 0.5;
    const hornR = new THREE.Mesh(hornGeo, materials.woodDark);
    hornR.position.set(0.32, 0.3, 0);
    hornR.rotation.z = -0.5;
    head.add(hornL, hornR);

    // 3 & 4. Massive Arms & Spiked Club
    const armGeo = new THREE.BoxGeometry(0.4, 0.9, 0.4);
    const leftArm = new THREE.Mesh(armGeo, materials.stoneDark);
    leftArm.position.set(-0.8, 1.1, 0);
    const rightArm = new THREE.Mesh(armGeo, materials.stoneDark);
    rightArm.position.set(0.8, 1.1, 0);
    group.add(leftArm, rightArm);

    // Spiked Club in right hand
    const club = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.1, 1.4, 6), materials.woodDark);
    club.position.set(0, -0.4, 0.5);
    club.rotation.x = Math.PI / 3;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.25, 4), materials.iron);
    spike.position.set(0, 0.6, 0.15);
    spike.rotation.x = Math.PI / 2;
    club.add(spike);
    rightArm.add(club);

    // 5 & 6. Heavy Legs
    const legGeo = new THREE.BoxGeometry(0.4, 0.7, 0.4);
    const legL = new THREE.Mesh(legGeo, materials.shadowBeast);
    legL.position.set(-0.35, 0.35, 0);
    const legR = new THREE.Mesh(legGeo, materials.shadowBeast);
    legR.position.set(0.35, 0.35, 0);
    group.add(legL, legR);

    addContactShadow(group, 1.1);
  } else if (type === 'golem') {
    // Ancient Siege Stone Golem
    const torso = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2), materials.stone);
    torso.position.y = 1.7;
    torso.castShadow = true;
    group.add(torso);

    // Glowing core in chest
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.4), materials.lanternGlass);
    core.position.set(0, 1.7, 0.7);
    group.add(core);

    // Stone Fists
    const fistGeo = new THREE.BoxGeometry(0.65, 0.65, 0.65);
    const fistL = new THREE.Mesh(fistGeo, materials.stoneDark);
    fistL.position.set(-1.3, 1.2, 0.3);
    const fistR = new THREE.Mesh(fistGeo, materials.stoneDark);
    fistR.position.set(1.3, 1.2, 0.3);
    group.add(fistL, fistR);

    // Stumpy Stone Legs
    const legGeo = new THREE.CylinderGeometry(0.45, 0.5, 0.9, 6);
    const legL = new THREE.Mesh(legGeo, materials.stone);
    legL.position.set(-0.55, 0.45, 0);
    const legR = new THREE.Mesh(legGeo, materials.stone);
    legR.position.set(0.55, 0.45, 0);
    group.add(legL, legR);

    addContactShadow(group, 1.5);
  }

  return group;
}

// ----------------------------------------------------
// 4. COMPOSITE PROCEDURAL STRUCTURES (3-12 parts)
// ----------------------------------------------------
export function createBuildingMesh(type: BuildingType): THREE.Group {
  const group = new THREE.Group();
  group.name = `Building_${type}`;

  if (type === 'town_hall') {
    // 1. Stone Foundation Steps
    const baseGeo = new THREE.BoxGeometry(5.2, 0.6, 5.2);
    const base = new THREE.Mesh(baseGeo, materials.stone);
    base.position.y = 0.3;
    base.receiveShadow = true;
    group.add(base);

    // 2. Main Timber Walls
    const wallGeo = new THREE.BoxGeometry(4.4, 2.4, 4.4);
    const wall = new THREE.Mesh(wallGeo, materials.wood);
    wall.position.y = 1.8;
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);

    // 3. Timber Corner Posts
    for (const [x, z] of [[-2.2, -2.2], [2.2, -2.2], [-2.2, 2.2], [2.2, 2.2]]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.6, 0.5), materials.woodDark);
      post.position.set(x, 1.8, z);
      post.castShadow = true;
      group.add(post);
    }

    // 4. Steep Pitch Roof
    const roofGeo = new THREE.ConeGeometry(3.6, 2.2, 4);
    const roof = new THREE.Mesh(roofGeo, materials.thatchRoof);
    roof.position.y = 4.1;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    // 5. Beacon Watchtower Spire on Top
    const spireGeo = new THREE.CylinderGeometry(0.6, 0.8, 1.8, 8);
    const spire = new THREE.Mesh(spireGeo, materials.woodDark);
    spire.position.y = 5.6;
    spire.castShadow = true;
    group.add(spire);

    // 6. Glowing Gold Beacon Orb
    const orbGeo = new THREE.SphereGeometry(0.45, 12, 12);
    const orb = new THREE.Mesh(orbGeo, materials.lanternGlass);
    orb.position.y = 6.8;
    group.add(orb);

    // 7. Stone Chimney
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.5, 0.6), materials.stoneDark);
    chimney.position.set(1.4, 4.2, 1.2);
    chimney.castShadow = true;
    group.add(chimney);

    // 8. Front Wooden Door Porch
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 0.1), materials.woodDark);
    door.position.set(0, 1.4, 2.25);
    const porchRoof = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 0.9), materials.thatchRoof);
    porchRoof.position.set(0, 2.3, 2.4);
    porchRoof.rotation.x = 0.2;
    group.add(door, porchRoof);

    addContactShadow(group, 3.2);
  } else if (type === 'farm') {
    // 1. Tilled Earth Base
    const soil = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 4.2), materials.soilTilled);
    soil.position.y = 0.1;
    soil.receiveShadow = true;
    group.add(soil);

    // 2. Wooden Border Fence
    const fenceMat = materials.woodDark;
    for (const [x, z, w, d] of [
      [0, -2.1, 4.3, 0.15],
      [0, 2.1, 4.3, 0.15],
      [-2.1, 0, 0.15, 4.3],
      [2.1, 0, 0.15, 4.3],
    ]) {
      const fence = new THREE.Mesh(new THREE.BoxGeometry(w, 0.4, d), fenceMat);
      fence.position.set(x, 0.3, z);
      fence.castShadow = true;
      group.add(fence);
    }

    // 3. Wheat Clumps in Rows
    const wheatGeo = new THREE.ConeGeometry(0.18, 0.7, 5);
    for (let r = -1.4; r <= 1.4; r += 0.7) {
      for (let c = -1.4; c <= 1.4; c += 0.5) {
        const clump = new THREE.Mesh(wheatGeo, materials.wheat);
        clump.position.set(r + (Math.random() - 0.5) * 0.1, 0.55, c + (Math.random() - 0.5) * 0.1);
        clump.rotation.y = Math.random() * Math.PI;
        clump.scale.y = 0.8 + Math.random() * 0.4;
        clump.castShadow = true;
        group.add(clump);
      }
    }

    // 4. Water Barrel & Tool Shovel
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.6, 8), materials.woodDark);
    barrel.position.set(-1.6, 0.4, 1.6);
    barrel.castShadow = true;
    group.add(barrel);

    addContactShadow(group, 2.4);
  } else if (type === 'quarry') {
    // 1. Cut Stone Foundation Pit
    const base = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.4, 4.2), materials.stoneDark);
    base.position.y = 0.2;
    base.receiveShadow = true;
    group.add(base);

    // 2. Wooden Hoist Crane Frame
    const craneStilts = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 0.3), materials.woodDark);
    craneStilts.position.set(-1.2, 1.8, -1.2);
    craneStilts.castShadow = true;
    const craneArm = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.25, 0.25), materials.woodDark);
    craneArm.position.set(0, 3.3, -1.2);
    craneArm.castShadow = true;
    group.add(craneStilts, craneArm);

    // 3. Pulley Cable & Ore Bucket
    const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.5, 6), materials.iron);
    bucket.position.set(0.6, 2.1, -1.2);
    bucket.castShadow = true;
    group.add(bucket);

    // 4. Stone Rubble & Iron Ore Bins
    for (let i = 0; i < 4; i++) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35 + Math.random() * 0.2), materials.stone);
      rock.position.set(0.8 + (Math.random() - 0.5) * 1.2, 0.45, 0.6 + (Math.random() - 0.5) * 1.2);
      rock.castShadow = true;
      group.add(rock);
    }

    // 5. Wooden Mine Cart on Rails
    const cart = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.9), materials.woodDark);
    cart.position.set(-0.8, 0.6, 0.8);
    cart.castShadow = true;
    group.add(cart);

    addContactShadow(group, 2.5);
  } else if (type === 'watchtower') {
    // 1. 4 Tapered Wooden Stilts & Bracing
    const stiltMat = materials.woodDark;
    for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const stilt = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 4.6, 6), stiltMat);
      stilt.position.set(x * 0.85, 2.3, z * 0.85);
      stilt.castShadow = true;
      group.add(stilt);
    }

    // Cross braces
    const brace = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.15, 0.15), stiltMat);
    brace.position.y = 2.0;
    brace.rotation.y = Math.PI / 4;
    group.add(brace);

    // 2. High Archery Platform
    const platform = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.3, 2.6), materials.wood);
    platform.position.y = 4.6;
    platform.castShadow = true;
    platform.receiveShadow = true;
    group.add(platform);

    // 3. Wooden Railings / Battlements
    for (const [rx, rz, rw, rd] of [
      [0, -1.2, 2.6, 0.1],
      [0, 1.2, 2.6, 0.1],
      [-1.2, 0, 0.1, 2.6],
      [1.2, 0, 0.1, 2.6],
    ]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(rw, 0.8, rd), materials.woodDark);
      rail.position.set(rx, 5.15, rz);
      rail.castShadow = true;
      group.add(rail);
    }

    // 4. Lookout Thatched Canopy
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.3, 4), materials.thatchRoof);
    roof.position.y = 6.4;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    // 5. Ballista / Crossbow mount
    const ballista = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.9), materials.iron);
    ballista.position.set(0, 5.2, 1.0);
    group.add(ballista);

    addContactShadow(group, 1.8);
  } else if (type === 'palisade') {
    // 5 Sharpened Upright Timber Logs
    for (let i = -2; i <= 2; i++) {
      const logHeight = 2.2 + (Math.sin(i * 1.5) * 0.3);
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, logHeight, 6), materials.woodDark);
      log.position.set(i * 0.48, logHeight / 2, 0);
      log.castShadow = true;

      // Sharpened cone top
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 6), materials.woodDark);
      tip.position.y = logHeight / 2 + 0.2;
      log.add(tip);

      group.add(log);
    }

    // Horizontal cross-beam tying logs together
    const beam = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.18, 0.2), materials.wood);
    beam.position.set(0, 1.2, -0.2);
    beam.castShadow = true;
    group.add(beam);

    addContactShadow(group, 1.5);
  } else if (type === 'spiketrap') {
    // Wooden Floor Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 2.0), materials.woodDark);
    base.position.y = 0.05;
    base.receiveShadow = true;
    group.add(base);

    // 9 Wicked Iron Spikes
    const spikeGeo = new THREE.ConeGeometry(0.08, 0.6, 4);
    for (let x = -0.6; x <= 0.6; x += 0.6) {
      for (let z = -0.6; z <= 0.6; z += 0.6) {
        const spike = new THREE.Mesh(spikeGeo, materials.iron);
        spike.position.set(x, 0.35, z);
        spike.castShadow = true;
        group.add(spike);
      }
    }

    addContactShadow(group, 1.2);
  } else if (type === 'lantern') {
    // Stone Pedestal
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.4, 8), materials.stone);
    base.position.y = 0.2;
    group.add(base);

    // Carved Timber Post
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 2.4, 6), materials.woodDark);
    post.position.y = 1.4;
    post.castShadow = true;
    group.add(post);

    // Iron Arm Bracket
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.1), materials.iron);
    arm.position.set(0.3, 2.45, 0);
    group.add(arm);

    // Glowing Lantern Box
    const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.35), materials.lanternGlass);
    lantern.position.set(0.5, 2.15, 0);
    lantern.castShadow = true;
    group.add(lantern);

    addContactShadow(group, 0.8);
  } else if (type === 'barracks') {
    // Solid Timber Hall
    const wall = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.2, 4.4), materials.wood);
    wall.position.y = 1.2;
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);

    // Heavy Double Gabled Roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(3.4, 1.8, 4), materials.thatchRoof);
    roof.position.y = 3.1;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    // Weapon Rack outside
    const rack = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 0.3), materials.woodDark);
    rack.position.set(1.4, 0.5, 2.3);
    group.add(rack);

    // Training Dummy with Straw Torso
    const dummyPost = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.6, 6), materials.woodDark);
    dummyPost.position.set(-1.4, 0.8, 2.2);
    const dummyTorso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.3), materials.thatchRoof);
    dummyTorso.position.y = 0.4;
    dummyPost.add(dummyTorso);
    group.add(dummyPost);

    addContactShadow(group, 2.8);
  } else if (type === 'windmill') {
    // 1. Round Stone Base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.4, 1.8, 8), materials.stone);
    base.position.y = 0.9;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // 2. Timber Tower
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.0, 3.2, 8), materials.wood);
    tower.position.y = 3.4;
    tower.castShadow = true;
    group.add(tower);

    // 3. Conical Thatch Roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.8, 1.5, 8), materials.thatchRoof);
    roof.position.y = 5.75;
    roof.castShadow = true;
    group.add(roof);

    // 4. Rotating Windmill Sails Group
    const sailsGroup = new THREE.Group();
    sailsGroup.name = 'windmillSails';
    sailsGroup.position.set(0, 4.4, 1.5);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 8), materials.woodDark);
    hub.rotation.x = Math.PI / 2;
    sailsGroup.add(hub);

    // 4 Cross Blades
    for (let i = 0; i < 4; i++) {
      const bladeArm = new THREE.Group();
      bladeArm.rotation.z = (i * Math.PI) / 2;

      const spar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.2, 0.1), materials.woodDark);
      spar.position.y = 1.6;
      bladeArm.add(spar);

      const sailCloth = new THREE.Mesh(new THREE.BoxGeometry(0.65, 2.4, 0.04), materials.strawHat);
      sailCloth.position.set(0.35, 1.8, 0.05);
      bladeArm.add(sailCloth);

      sailsGroup.add(bladeArm);
    }
    group.add(sailsGroup);

    // 5. Grain Sacks & Door
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.4, 0.1), materials.woodDark);
    door.position.set(0, 0.7, 2.3);
    group.add(door);

    for (let s = 0; s < 3; s++) {
      const sack = new THREE.Mesh(new THREE.SphereGeometry(0.25, 6, 6), materials.strawHat);
      sack.scale.set(1, 1.3, 0.8);
      sack.position.set(1.4 + s * 0.3, 0.3, 1.8 - s * 0.2);
      group.add(sack);
    }

    addContactShadow(group, 2.8);
  } else if (type === 'blacksmith') {
    // 1. Stone Hearth & Forge Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.4, 4.2), materials.stoneDark);
    base.position.y = 0.2;
    base.receiveShadow = true;
    group.add(base);

    // 2. Heavy Stone Chimney & Furnace
    const furnace = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.4, 1.6), materials.brickRed);
    furnace.position.set(-1.0, 1.4, -1.0);
    furnace.castShadow = true;
    group.add(furnace);

    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.2, 0.8), materials.stoneDark);
    chimney.position.set(-1.0, 4.2, -1.0);
    chimney.castShadow = true;
    group.add(chimney);

    // Glowing forge coals
    const coals = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.3, 0.8), materials.hearthFire);
    coals.position.set(-1.0, 1.0, -0.1);
    group.add(coals);

    // 3. Iron Anvil
    const anvilStand = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.7, 6), materials.woodDark);
    anvilStand.position.set(0.6, 0.55, 0.4);
    const anvilTop = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 0.4), materials.iron);
    anvilTop.position.set(0.6, 1.0, 0.4);
    group.add(anvilStand, anvilTop);

    // 4. Water Quenching Trough
    const trough = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.6), materials.woodDark);
    trough.position.set(1.2, 0.5, -1.0);
    group.add(trough);

    // 5. Open Timber Roof Canopy
    for (const [x, z] of [[1.8, 1.8], [-1.8, 1.8], [1.8, -1.8]]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.8, 0.25), materials.woodDark);
      post.position.set(x, 1.6, z);
      group.add(post);
    }
    const roof = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.2, 4.4), materials.thatchRoof);
    roof.position.set(0, 3.1, 0);
    group.add(roof);

    addContactShadow(group, 2.6);
  } else if (type === 'clinic') {
    // 1. Herb Cottage Walls
    const wall = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.0, 3.6), materials.wood);
    wall.position.y = 1.1;
    wall.castShadow = true;
    group.add(wall);

    // 2. Gable Thatch Roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.8, 1.6, 4), materials.thatchRoof);
    roof.position.y = 2.9;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    // 3. Green Clinic Cross Sign
    const signPost = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.2, 0.1), materials.woodDark);
    signPost.position.set(2.1, 1.1, 1.5);
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.05), materials.relicAura);
    crossH.position.set(2.1, 2.1, 1.5);
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.05), materials.relicAura);
    crossV.position.set(2.1, 2.1, 1.5);
    group.add(signPost, crossH, crossV);

    // 4. Mortar & Potion Table
    const table = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.6), materials.woodDark);
    table.position.set(-1.0, 0.45, 2.0);
    group.add(table);

    addContactShadow(group, 2.4);
  } else if (type === 'stone_wall') {
    // 1. Heavy Ashlar Stone Wall
    const wall = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.4, 1.0), materials.stone);
    wall.position.y = 1.2;
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);

    // 2. 3 Crenellated Merlons on Top
    for (let m = -1; m <= 1; m++) {
      const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 1.05), materials.stoneDark);
      merlon.position.set(m * 1.0, 2.7, 0);
      merlon.castShadow = true;
      group.add(merlon);
    }

    // 3. Stone Buttress Braces
    for (const side of [-1, 1]) {
      const buttress = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.6, 0.8), materials.stoneDark);
      buttress.position.set(side * 1.2, 0.8, -0.6);
      group.add(buttress);
    }

    addContactShadow(group, 1.8);
  } else if (type === 'ballista') {
    // 1. Stone Octagonal Turret Base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 1.8, 8), materials.stoneDark);
    base.position.y = 0.9;
    base.castShadow = true;
    group.add(base);

    // 2. Swivel Mount
    const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.8, 8), materials.woodDark);
    mount.position.y = 2.2;
    group.add(mount);

    // 3. Giant Ballista Crossbow Assembly
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 2.6), materials.woodDark);
    stock.position.set(0, 2.7, 0.3);
    stock.castShadow = true;

    // Recurve Bow Arms
    const bowArms = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.2, 0.2), materials.iron);
    bowArms.position.set(0, 2.7, 1.4);
    bowArms.castShadow = true;

    // Heavy Piercing Bolt
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 4), materials.iron);
    bolt.rotation.x = Math.PI / 2;
    bolt.position.set(0, 2.85, 0.4);

    group.add(stock, bowArms, bolt);
    addContactShadow(group, 1.8);
  }

  return group;
}

// ----------------------------------------------------
// 5. PROCEDURAL EXPLORATION STRUCTURES (30 World Ruins & Loot)
// ----------------------------------------------------
export function createExplorationStructureMesh(type: ExplorationStructureType, looted = false): THREE.Group {
  const group = new THREE.Group();
  group.name = `Exploration_${type}`;

  const chestMat = looted ? materials.woodDark : materials.relicAura;

  if (type === 'ruined_temple') {
    // Stone Raised Dais
    const dais = new THREE.Mesh(new THREE.BoxGeometry(7, 0.6, 7), materials.mossStone);
    dais.position.y = 0.3;
    dais.receiveShadow = true;
    group.add(dais);

    // 4 Ancient Broken Columns
    for (const [x, z, h] of [[-2.5, -2.5, 4.2], [2.5, -2.5, 2.4], [-2.5, 2.5, 3.1], [2.5, 2.5, 1.5]]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, h, 8), materials.stone);
      col.position.set(x, h / 2 + 0.6, z);
      col.castShadow = true;
      group.add(col);
    }

    // Sacred Altar with Glowing Chest / Relic in Center
    const altar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 1.2), materials.stoneDark);
    altar.position.set(0, 1.1, 0);
    group.add(altar);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.5), chestMat);
    chest.position.set(0, 1.85, 0);
    chest.name = 'LootChest';
    group.add(chest);

    addContactShadow(group, 4.5);
  } else if (type === 'abandoned_outpost') {
    // Broken Wooden Stilt Tower
    for (const [x, z, h] of [[-1.2, -1.2, 5.0], [1.2, -1.2, 3.5], [-1.2, 1.2, 4.2], [1.2, 1.2, 2.0]]) {
      const stilt = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, h, 6), materials.woodDark);
      stilt.position.set(x, h / 2, z);
      stilt.castShadow = true;
      group.add(stilt);
    }
    const plat = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.3, 3.0), materials.wood);
    plat.position.y = 4.0;
    group.add(plat);

    // Supply Weapon Crate with Loot
    const crate = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.7, 0.8), chestMat);
    crate.position.set(0, 0.45, 0);
    crate.name = 'LootChest';
    group.add(crate);

    addContactShadow(group, 2.5);
  } else if (type === 'lumber_camp') {
    // Log Cabin Ruin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.8, 3.5), materials.woodDark);
    cabin.position.set(0, 0.9, 0);
    cabin.castShadow = true;
    group.add(cabin);

    // Timber Stacks
    for (let i = 0; i < 4; i++) {
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.0, 6), materials.wood);
      log.rotation.z = Math.PI / 2;
      log.position.set(0, 0.2 + i * 0.35, 2.4);
      group.add(log);
    }

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.5), chestMat);
    chest.position.set(0, 0.4, 0.8);
    chest.name = 'LootChest';
    group.add(chest);

    addContactShadow(group, 3.0);
  } else if (type === 'smelter_ruin') {
    // Stone Smelting Furnace & Iron Ingots
    const kiln = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.2, 8), materials.stoneDark);
    kiln.position.set(-1.0, 1.6, 0);
    kiln.castShadow = true;
    group.add(kiln);

    // Ingot Cache
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.9), chestMat);
    crate.position.set(1.0, 0.35, 0);
    crate.name = 'LootChest';
    group.add(crate);

    addContactShadow(group, 2.6);
  } else if (type === 'stone_henge') {
    // Megalith Stone Ring
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const sx = Math.cos(angle) * 3.5;
      const sz = Math.sin(angle) * 3.5;
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.2, 0.5), materials.mossStone);
      pillar.position.set(sx, 1.6, sz);
      pillar.lookAt(0, 1.6, 0);
      pillar.castShadow = true;
      group.add(pillar);
    }

    // Floating Celestial Relic in Center
    const relic = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), chestMat);
    relic.position.set(0, 1.8, 0);
    relic.name = 'LootChest';
    group.add(relic);

    addContactShadow(group, 4.2);
  } else if (type === 'ancient_crypt') {
    // Crypt Stone Vault
    const vault = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.4, 2.4), materials.stone);
    vault.position.y = 0.7;
    vault.castShadow = true;
    group.add(vault);

    // Sarcophagus with Carved Lid
    const lid = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.35, 2.6), materials.stoneDark);
    lid.position.y = 1.5;
    group.add(lid);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.6), chestMat);
    chest.position.set(0, 1.9, 0);
    chest.name = 'LootChest';
    group.add(chest);

    addContactShadow(group, 3.0);
  } else if (type === 'treasure_vault') {
    // Royal Iron Vault
    const vault = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 2.4), materials.iron);
    vault.position.y = 1.1;
    vault.castShadow = true;
    group.add(vault);

    const goldTrim = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.3, 2.5), materials.gold);
    goldTrim.position.y = 1.1;
    group.add(goldTrim);

    const chest = new THREE.Mesh(new THREE.OctahedronGeometry(0.6), chestMat);
    chest.position.set(0, 2.6, 0);
    chest.name = 'LootChest';
    group.add(chest);

    addContactShadow(group, 2.2);
  } else {
    // Generic Sunken Cache / Hermit Shack / Alchemist Den
    const hut = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.0, 2.8), materials.woodDark);
    hut.position.y = 1.0;
    hut.castShadow = true;
    group.add(hut);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.2, 4), materials.thatchRoof);
    roof.position.y = 2.6;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.5), chestMat);
    chest.position.set(0, 0.6, 1.6);
    chest.name = 'LootChest';
    group.add(chest);

    addContactShadow(group, 2.4);
  }

  return group;
}

// ----------------------------------------------------
// 5. COMPOSITE NATURAL RESOURCES (Pine, Oak, Rocks, Ore)
// ----------------------------------------------------
export function createResourceMesh(type: 'tree' | 'rock' | 'iron_vein' | 'gold_vein' | 'berry_bush'): THREE.Group {
  const group = new THREE.Group();
  group.name = `Resource_${type}`;

  if (type === 'tree') {
    // Multi-tier Pine Tree with beveled trunk and 3 foliage tiers
    // Trunk
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.38, 1.8, 7), materials.woodDark);
    trunk.position.y = 0.9;
    trunk.castShadow = true;
    group.add(trunk);

    // 3 Tiered foliage cones
    const tiers = [
      { y: 1.8, r: 1.8, h: 1.6 },
      { y: 2.8, r: 1.4, h: 1.4 },
      { y: 3.7, r: 0.9, h: 1.2 },
    ];
    tiers.forEach((t) => {
      const foliage = new THREE.Mesh(new THREE.ConeGeometry(t.r, t.h, 7), materials.foliagePine);
      foliage.position.y = t.y;
      foliage.rotation.y = Math.random() * Math.PI;
      foliage.castShadow = true;
      group.add(foliage);
    });

    addContactShadow(group, 1.6);
  } else if (type === 'rock') {
    // Multi-faceted Stone Boulder
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 1), materials.stone);
    rock.position.y = 0.8;
    rock.rotation.set(0.4, 0.2, 0.1);
    rock.scale.set(1.1, 0.8, 0.9);
    rock.castShadow = true;
    group.add(rock);

    // Small accent stone
    const smallRock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5), materials.stoneDark);
    smallRock.position.set(0.9, 0.35, 0.6);
    smallRock.castShadow = true;
    group.add(smallRock);

    addContactShadow(group, 1.4);
  } else if (type === 'iron_vein') {
    // Dark rock with glinting metallic iron ore crystals
    const baseRock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1), materials.stoneDark);
    baseRock.position.y = 0.7;
    baseRock.castShadow = true;
    group.add(baseRock);

    // Metallic crystal cubes
    for (let i = 0; i < 5; i++) {
      const crystal = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), materials.iron);
      crystal.position.set(
        (Math.random() - 0.5) * 0.8,
        0.5 + Math.random() * 0.6,
        (Math.random() - 0.5) * 0.8
      );
      crystal.rotation.set(Math.random(), Math.random(), Math.random());
      crystal.castShadow = true;
      group.add(crystal);
    }

    addContactShadow(group, 1.3);
  } else if (type === 'gold_vein') {
    // Dark rock with glowing rich gold ore nuggets
    const baseRock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.0), materials.stoneDark);
    baseRock.position.y = 0.65;
    baseRock.castShadow = true;
    group.add(baseRock);

    for (let i = 0; i < 6; i++) {
      const nugget = new THREE.Mesh(new THREE.OctahedronGeometry(0.22), materials.gold);
      nugget.position.set(
        (Math.random() - 0.5) * 0.7,
        0.5 + Math.random() * 0.5,
        (Math.random() - 0.5) * 0.7
      );
      nugget.rotation.set(Math.random(), Math.random(), Math.random());
      nugget.castShadow = true;
      group.add(nugget);
    }

    addContactShadow(group, 1.2);
  } else if (type === 'berry_bush') {
    // Dense foliage sphere with bright red berries
    const bush = new THREE.Mesh(new THREE.SphereGeometry(0.7, 7, 7), materials.foliageOak);
    bush.position.y = 0.5;
    bush.scale.set(1.2, 0.8, 1.2);
    bush.castShadow = true;
    group.add(bush);

    // Red berries
    const berryMat = new THREE.MeshStandardMaterial({ color: 0xef233c, roughness: 0.3 });
    const berryGeo = new THREE.SphereGeometry(0.08, 5, 5);
    for (let i = 0; i < 8; i++) {
      const berry = new THREE.Mesh(berryGeo, berryMat);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5;
      berry.position.set(
        Math.sin(phi) * Math.cos(theta) * 0.75,
        0.5 + Math.cos(phi) * 0.45,
        Math.sin(phi) * Math.sin(theta) * 0.75
      );
      group.add(berry);
    }

    addContactShadow(group, 0.8);
  }

  return group;
}
