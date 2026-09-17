import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { PigData } from '../../types';

interface ProceduralPigProps {
  pig: PigData;
  isSelected: boolean;
  showBehavior: boolean;
  showBoundingBoxes: boolean;
  showSegmentationMasks: boolean;
  onSelect: (pig: PigData) => void;
}

// Pen boundaries to constrain autonomous pig movement
const PEN_BOUNDS: Record<number, { minX: number; maxX: number; minZ: number; maxZ: number }> = {
  1: { minX: -7.8, maxX: -2.0, minZ: 1.4, maxZ: 5.2 },
  2: { minX: -7.8, maxX: -2.0, minZ: -5.2, maxZ: -1.4 },
  3: { minX: 2.0, maxX: 7.8, minZ: 1.4, maxZ: 5.2 },
  4: { minX: 2.0, maxX: 7.8, minZ: -5.2, maxZ: -1.4 },
};

// Pen coordinates for designated food feeding trough and water drinking bowl stations
const PEN_STATIONS: Record<number, { feed: [number, number, number]; water: [number, number, number] }> = {
  1: { feed: [-6.2, 0, 4.0], water: [-3.6, 0, 4.0] },
  2: { feed: [-6.2, 0, -4.0], water: [-3.6, 0, -4.0] },
  3: { feed: [3.6, 0, 4.0], water: [6.2, 0, 4.0] },
  4: { feed: [3.6, 0, -4.0], water: [6.2, 0, -4.0] },
};

// Global spatial registry for inter-pig collision avoidance and obstacle steering
const pigSpatialRegistry = new Map<string, { x: number; z: number; isResting: boolean }>();

/**
 * Generates an ultra-smooth, continuous, organic swine body geometry
 * with accurate anatomical curves: rounded hams, arched backbone, withers hump,
 * sagging barrel belly, muscular jowls, and a tapering snout bridge.
 */
function createOrganicSwineBody(): THREE.BufferGeometry {
  const slices = 40;
  const ringPoints = 32;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // Rear apex point at z = -0.72 (tail root / upper rump)
  positions.push(0, 0.08, -0.72);
  uvs.push(0.5, 0);

  for (let i = 0; i <= slices; i++) {
    const u = i / slices;
    const z = -0.72 + u * 1.54; // z spans from -0.72 (rump) to +0.82 (snout base)

    let w = 0;
    let hTop = 0;
    let hBottom = 0;
    let yCenter = 0;

    if (u < 0.20) {
      // 1. Rounded Muscular Rump & Haunches
      const t = u / 0.20;
      const curve = Math.sin(t * Math.PI * 0.5);
      w = curve * 0.36;
      hTop = 0.30 * curve;
      hBottom = 0.22 * curve;
      yCenter = 0.06;
    } else if (u < 0.62) {
      // 2. Barrel Ribcage, Abdomen, Withers & Natural Belly Sag
      const t = (u - 0.20) / 0.42;
      w = 0.36 + Math.sin(t * Math.PI) * 0.04; // full barrel torso
      hTop = 0.30 + Math.sin(t * Math.PI * 0.8) * 0.06; // arched kyphotic spine & withers
      hBottom = 0.22 + Math.sin(t * Math.PI) * 0.09; // sagging soft belly
      yCenter = 0.06 - t * 0.03;
    } else if (u < 0.86) {
      // 3. Thick Muscular Neck, Wide Cheeks (Jowls) & Brow
      const t = (u - 0.62) / 0.24;
      w = 0.35 - t * 0.16;
      hTop = 0.34 - t * 0.16;
      hBottom = 0.29 - t * 0.14;
      yCenter = 0.03 - t * 0.07;
    } else {
      // 4. Tapering Muzzle Bridge down to Snout Disc
      const t = (u - 0.86) / 0.14;
      w = 0.19 - t * 0.09;
      hTop = 0.18 - t * 0.09;
      hBottom = 0.15 - t * 0.07;
      yCenter = -0.04 - t * 0.04;
    }

    // Generate seamless elliptical ring vertices with smooth vertical curvature (no sharp crease)
    const yMean = (hTop + hBottom) * 0.5;
    const yDiff = (hTop - hBottom) * 0.5;

    for (let j = 0; j < ringPoints; j++) {
      const v = j / ringPoints;
      const phi = v * Math.PI * 2;
      const cosP = Math.cos(phi);
      const sinP = Math.sin(phi);

      const rV = yMean + yDiff * sinP;
      const x = cosP * w;
      const y = yCenter + sinP * rV;

      positions.push(x, y, z);
      uvs.push(v, u);
    }
  }

  // Snout front tip apex point at z = 0.82
  const snoutTipIndex = positions.length / 3;
  positions.push(0, -0.08, 0.82);
  uvs.push(0.5, 1);

  // Rear cap triangles (apex point 0 to first ring)
  for (let j = 0; j < ringPoints; j++) {
    const nextJ = (j + 1) % ringPoints;
    indices.push(0, 1 + nextJ, 1 + j);
  }

  // Lofted quad rings along spine
  for (let i = 0; i < slices; i++) {
    const rowA = 1 + i * ringPoints;
    const rowB = 1 + (i + 1) * ringPoints;
    for (let j = 0; j < ringPoints; j++) {
      const nextJ = (j + 1) % ringPoints;
      const a = rowA + j;
      const b = rowA + nextJ;
      const c = rowB + nextJ;
      const d = rowB + j;
      indices.push(a, b, c);
      indices.push(a, c, d);
    }
  }

  // Front snout cap triangles
  const lastRow = 1 + slices * ringPoints;
  for (let j = 0; j < ringPoints; j++) {
    const nextJ = (j + 1) % ringPoints;
    indices.push(snoutTipIndex, lastRow + j, lastRow + nextJ);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

/**
 * Creates curved, realistic swine ear geometry with natural thickness
 * and inner ear cavity.
 */
function createCurvedSwineEar(isLeft: boolean): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // Ear base to tip contour
  shape.moveTo(0, 0);
  shape.bezierCurveTo(isLeft ? -0.1 : 0.1, 0.08, isLeft ? -0.14 : 0.14, 0.22, isLeft ? -0.06 : 0.06, 0.32);
  shape.bezierCurveTo(isLeft ? -0.02 : 0.02, 0.35, isLeft ? 0.02 : -0.02, 0.35, isLeft ? 0.06 : -0.06, 0.32);
  shape.bezierCurveTo(isLeft ? 0.14 : -0.14, 0.22, isLeft ? 0.1 : -0.1, 0.08, 0, 0);

  const extrudeSettings = {
    steps: 1,
    depth: 0.022,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.012,
    bevelSegments: 4,
  };

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

/**
 * Creates an authentic, anatomically tapered 3D helical corkscrew swine tail
 */
function createCorkscrewTailGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  const segments = 40;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const turns = 2.4 * Math.PI * 2;
    const angle = t * turns;
    const radius = 0.048 * (1.0 - t * 0.28);
    const x = Math.sin(angle) * radius + (t * 0.032);
    const y = Math.sin(t * Math.PI * 0.5) * 0.038 + Math.cos(angle) * radius;
    const z = -t * 0.16;
    points.push(new THREE.Vector3(x, y, z));
  }

  const path = new THREE.CatmullRomCurve3(points);
  const tubularSegments = 40;
  const radialSegments = 8;
  const geom = new THREE.TubeGeometry(path, tubularSegments, 0.015, radialSegments, false);
  const pos = geom.attributes.position;
  const center = new THREE.Vector3();

  // Taper the tube from a thicker root at the rump to a slender tip
  for (let idx = 0; idx < pos.count; idx++) {
    const i = Math.floor(idx / (radialSegments + 1));
    const t = i / tubularSegments;
    path.getPoint(t, center);
    const scale = 1.3 - t * 0.7; // 1.3x at root, tapering to 0.6x at tip
    const vx = pos.getX(idx);
    const vy = pos.getY(idx);
    const vz = pos.getZ(idx);
    pos.setXYZ(
      idx,
      center.x + (vx - center.x) * scale,
      center.y + (vy - center.y) * scale,
      center.z + (vz - center.z) * scale
    );
  }
  pos.needsUpdate = true;
  geom.computeVertexNormals();
  return geom;
}

export const ProceduralPig: React.FC<ProceduralPigProps> = ({
  pig,
  isSelected,
  showBehavior,
  showBoundingBoxes,
  showSegmentationMasks,
  onSelect,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const spineGroupRef = useRef<THREE.Group>(null);
  const tailGroupRef = useRef<THREE.Group>(null);

  // 4 limb root references for inverse kinematics & articulation
  const legFLRef = useRef<THREE.Group>(null);
  const legFRRef = useRef<THREE.Group>(null);
  const legBLRef = useRef<THREE.Group>(null);
  const legBRRef = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState(false);
  const bounds = PEN_BOUNDS[pig.penId] || PEN_BOUNDS[1];
  const isLethargic = pig.behavior === 'LETHARGIC';

  // Cached seamless organic body mesh & features
  const bodyGeometry = useMemo(() => createOrganicSwineBody(), []);
  const earGeometryLeft = useMemo(() => createCurvedSwineEar(true), []);
  const earGeometryRight = useMemo(() => createCurvedSwineEar(false), []);
  const tailGeometry = useMemo(() => createCorkscrewTailGeometry(), []);

  // Autonomous wandering, feeding, drinking & collision state
  const wanderState = useRef({
    pos: new THREE.Vector3(pig.position[0], pig.position[1], pig.position[2]),
    target: new THREE.Vector3(
      bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
      pig.position[1],
      bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ)
    ),
    heading: pig.rotation,
    state: 'WALKING' as 'WALKING' | 'SNIFFING' | 'EATING' | 'DRINKING' | 'RESTING',
    timer: Math.random() * 4 + 2,
    speed: 0.42 + Math.random() * 0.25,
    dogSitProgress: isLethargic ? 1.0 : 0.0,
  });

  // Clean up spatial registry on unmount
  useEffect(() => {
    return () => {
      pigSpatialRegistry.delete(pig.id);
    };
  }, [pig.id]);

  // Authentic swine skin materials
  const skinColor = isLethargic
    ? (isSelected ? '#ff6060' : '#f87171')
    : (hovered || isSelected ? '#fed7aa' : '#f5b5ab');

  const snoutColor = '#ea9399';
  const innerEarColor = '#f09aa0';
  const hoofColor = '#3f3530';

  // Animation frame loop
  useFrame((state, delta) => {
    const ws = wanderState.current;
    const t = state.clock.getElapsedTime();

    // Smooth transition into Dog-Sitting posture (Clinical Reference Image 2 - Panel 3)
    const targetSit = isLethargic ? 1.0 : 0.0;
    ws.dogSitProgress = THREE.MathUtils.lerp(ws.dogSitProgress, targetSit, delta * 3.0);
    const sitP = ws.dogSitProgress; // 0 = standing, 1 = dog-sitting

    // 1. Update Spatial Registry with current position
    pigSpatialRegistry.set(pig.id, {
      x: ws.pos.x,
      z: ws.pos.z,
      isResting: isLethargic || sitP > 0.4 || ws.state === 'RESTING',
    });

    if (isLethargic || sitP > 0.4) {
      ws.state = 'RESTING';
    } else {
      // 2. Autonomous state timer & station destination selection
      ws.timer -= delta;
      if (ws.timer <= 0) {
        if (ws.state === 'WALKING') {
          const rand = Math.random();
          const st = PEN_STATIONS[pig.penId] || PEN_STATIONS[1];

          if (rand < 0.35) {
            // Sniff around current location
            ws.state = 'SNIFFING';
            ws.timer = Math.random() * 4 + 3;
          } else if (rand < 0.68) {
            // Walk directly over to designated Feed Trough to eat pellets
            ws.target.set(st.feed[0] + (Math.random() - 0.5) * 0.4, pig.position[1], st.feed[2]);
            ws.state = 'EATING';
            ws.timer = Math.random() * 6 + 5;
          } else {
            // Walk directly over to designated Water Aqua-Bowl to drink water
            ws.target.set(st.water[0] + (Math.random() - 0.5) * 0.3, pig.position[1], st.water[2]);
            ws.state = 'DRINKING';
            ws.timer = Math.random() * 5 + 4;
          }
        } else {
          // Finished eating / drinking / sniffing -> resume wandering across pen
          ws.target.set(
            bounds.minX + 1.0 + Math.random() * (bounds.maxX - bounds.minX - 2.0),
            pig.position[1],
            bounds.minZ + 1.0 + Math.random() * (bounds.maxZ - bounds.minZ - 2.0)
          );
          ws.state = 'WALKING';
          ws.timer = Math.random() * 7 + 4;
        }
      }

      // If walking towards target (or approaching food / water station)
      if (ws.state === 'WALKING' || (ws.state === 'EATING' && Math.hypot(ws.target.x - ws.pos.x, ws.target.z - ws.pos.z) > 0.5) || (ws.state === 'DRINKING' && Math.hypot(ws.target.x - ws.pos.x, ws.target.z - ws.pos.z) > 0.5)) {
        // Goal Vector towards current target
        const toTargetX = ws.target.x - ws.pos.x;
        const toTargetZ = ws.target.z - ws.pos.z;
        const targetDist = Math.hypot(toTargetX, toTargetZ);

        if (targetDist < 0.4) {
          ws.state = 'SNIFFING';
          ws.timer = Math.random() * 3 + 2;
        } else {
          // Normalize goal direction
          const dirX = toTargetX / targetDist;
          const dirZ = toTargetZ / targetDist;

          // Compute avoidance vector from other pigs (smooth early avoidance)
          let avoidX = 0;
          let avoidZ = 0;
          let hasObstacle = false;

          for (const [otherId, other] of pigSpatialRegistry.entries()) {
            if (otherId === pig.id) continue;
            const dx = ws.pos.x - other.x;
            const dz = ws.pos.z - other.z;
            const dist = Math.hypot(dx, dz);
            const avoidRadius = 1.8; // Early detection bubble for smooth turning

            if (dist < avoidRadius && dist > 0.001) {
              hasObstacle = true;
              const strength = (avoidRadius - dist) / avoidRadius;
              const repelMag = Math.pow(strength, 1.8) * 3.6;
              avoidX += (dx / dist) * repelMag;
              avoidZ += (dz / dist) * repelMag;
            }
          }

          // Wall & fence avoidance (smooth turning before hitting pen edges)
          const wallMargin = 1.0;
          if (ws.pos.x < bounds.minX + wallMargin) {
            avoidX += ((bounds.minX + wallMargin - ws.pos.x) / wallMargin) * 2.4;
          } else if (ws.pos.x > bounds.maxX - wallMargin) {
            avoidX -= ((ws.pos.x - (bounds.maxX - wallMargin)) / wallMargin) * 2.4;
          }
          if (ws.pos.z < bounds.minZ + wallMargin) {
            avoidZ += ((bounds.minZ + wallMargin - ws.pos.z) / wallMargin) * 2.4;
          } else if (ws.pos.z > bounds.maxZ - wallMargin) {
            avoidZ -= ((ws.pos.z - (bounds.maxZ - wallMargin)) / wallMargin) * 2.4;
          }

          // Combined steering direction
          const combinedX = dirX + avoidX;
          const combinedZ = dirZ + avoidZ;

          // If obstacle is encountered ahead, update target to open space to prevent oscillation
          if (hasObstacle && (avoidX * avoidX + avoidZ * avoidZ) > 1.2) {
            const escapeAngle = Math.atan2(combinedX, combinedZ);
            const forwardX = Math.sin(escapeAngle);
            const forwardZ = Math.cos(escapeAngle);
            ws.target.x = THREE.MathUtils.clamp(ws.pos.x + forwardX * 2.2, bounds.minX + 0.8, bounds.maxX - 0.8);
            ws.target.z = THREE.MathUtils.clamp(ws.pos.z + forwardZ * 2.2, bounds.minZ + 0.8, bounds.maxZ - 0.8);
          }

          // Calculate desired heading smoothly
          const desiredHeading = Math.atan2(combinedX, combinedZ);

          // Calculate shortest angular turn (no 360-degree flips or flickering)
          let angleDiff = desiredHeading - ws.heading;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

          // Smooth turn rate clamped to realistic animal turn speed
          const maxTurnRate = delta * 2.8; // ~160 deg/sec
          const turn = THREE.MathUtils.clamp(angleDiff, -maxTurnRate, maxTurnRate);
          ws.heading += turn;

          // Normalize heading in [-PI, PI]
          while (ws.heading > Math.PI) ws.heading -= Math.PI * 2;
          while (ws.heading < -Math.PI) ws.heading += Math.PI * 2;

          // Forward locomotion with turn slowdown
          const turnSlowdown = Math.max(0.25, Math.cos(angleDiff));
          const step = ws.speed * turnSlowdown * delta;

          ws.pos.x += Math.sin(ws.heading) * step;
          ws.pos.z += Math.cos(ws.heading) * step;
        }
      }
    }

    // Soft physical separation safety (no teleportation or sudden jerks)
    for (const [otherId, other] of pigSpatialRegistry.entries()) {
      if (otherId === pig.id) continue;
      const dx = ws.pos.x - other.x;
      const dz = ws.pos.z - other.z;
      const dist = Math.hypot(dx, dz);
      const hardSeparation = 1.15; // Minimum physical safety bubble

      if (dist < hardSeparation && dist > 0.001) {
        const pushDist = (hardSeparation - dist) * 0.5 * Math.min(1, delta * 5.0);
        ws.pos.x += (dx / dist) * pushDist;
        ws.pos.z += (dz / dist) * pushDist;
      }
    }

    // Keep smoothly within pen boundaries
    ws.pos.x = THREE.MathUtils.clamp(ws.pos.x, bounds.minX + 0.5, bounds.maxX - 0.5);
    ws.pos.z = THREE.MathUtils.clamp(ws.pos.z, bounds.minZ + 0.5, bounds.maxZ - 0.5);

    // Apply root position
    if (rootGroupRef.current) {
      // In dog-sitting posture, drop pelvis/rump towards the pen floor
      const sitYOffset = sitP * -0.16;
      rootGroupRef.current.position.set(ws.pos.x, ws.pos.y + sitYOffset, ws.pos.z);
      rootGroupRef.current.rotation.y = ws.heading;
    }

    // -------------------------------------------------------------
    // POSTURE ARTICULATION: DOG-SITTING vs FEEDING vs DRINKING vs ROAMING
    // -------------------------------------------------------------
    if (spineGroupRef.current) {
      if (sitP > 0.1) {
        // Pelvis sits on floor, spine angled upward by 36°
        const pitchAngle = THREE.MathUtils.degToRad(sitP * -36);
        spineGroupRef.current.rotation.x = pitchAngle;
        spineGroupRef.current.position.y = THREE.MathUtils.lerp(0.44, 0.22, sitP);
        spineGroupRef.current.position.z = THREE.MathUtils.lerp(0, -0.12, sitP);
      } else if (ws.state === 'EATING' || ws.state === 'DRINKING') {
        // Dipping head down into feed trough or water bowl with subtle chewing / sipping bob
        const headBob = Math.sin(t * 6.0) * 0.032;
        spineGroupRef.current.rotation.x = THREE.MathUtils.degToRad(-15) + headBob;
        spineGroupRef.current.position.y = 0.40;
        spineGroupRef.current.position.z = 0.04;
      } else if (ws.state === 'SNIFFING') {
        const sniffBob = Math.sin(t * 9.0) * 0.02;
        spineGroupRef.current.rotation.x = THREE.MathUtils.degToRad(-10) + sniffBob;
        spineGroupRef.current.position.y = 0.42;
        spineGroupRef.current.position.z = 0.02;
      } else {
        spineGroupRef.current.rotation.x = 0;
        spineGroupRef.current.position.y = 0.44;
        spineGroupRef.current.position.z = 0;
      }

      // Heavy, labored breathing pulse for infected pig
      const breathFreq = isLethargic ? 2.0 : 3.5;
      const breathAmp = isLethargic ? 0.045 : 0.015;
      const breath = 1.0 + Math.sin(t * breathFreq) * breathAmp;
      spineGroupRef.current.scale.set(breath, breath, 1);
    }

    // Four limb locomotion & sitting articulation
    const distToDest = Math.hypot(ws.target.x - ws.pos.x, ws.target.z - ws.pos.z);
    const isStationNavigating = (ws.state === 'EATING' || ws.state === 'DRINKING') && distToDest > 0.5;
    const isWalking = (ws.state === 'WALKING' || isStationNavigating) && sitP < 0.2;
    const walkPhase = t * ws.speed * 8.0;

    // FRONT LEGS: In dog-sitting, extend straight down vertically from raised chest to floor
    if (legFLRef.current && legFRRef.current) {
      if (sitP > 0.3) {
        legFLRef.current.rotation.x = THREE.MathUtils.degToRad(sitP * 35);
        legFRRef.current.rotation.x = THREE.MathUtils.degToRad(sitP * 35);
        legFLRef.current.rotation.z = THREE.MathUtils.degToRad(4);
        legFRRef.current.rotation.z = THREE.MathUtils.degToRad(-4);
      } else if (isWalking) {
        legFLRef.current.rotation.x = Math.sin(walkPhase) * 0.4;
        legFRRef.current.rotation.x = -Math.sin(walkPhase) * 0.4;
        legFLRef.current.rotation.z = 0;
        legFRRef.current.rotation.z = 0;
      } else {
        legFLRef.current.rotation.set(0, 0, 0);
        legFRRef.current.rotation.set(0, 0, 0);
      }
    }

    // HIND LEGS: In dog-sitting, fold flat horizontally along the floor beside the hips
    if (legBLRef.current && legBRRef.current) {
      if (sitP > 0.3) {
        legBLRef.current.rotation.x = THREE.MathUtils.degToRad(sitP * -68);
        legBRRef.current.rotation.x = THREE.MathUtils.degToRad(sitP * -68);
        legBLRef.current.rotation.z = THREE.MathUtils.degToRad(sitP * 34);
        legBRRef.current.rotation.z = THREE.MathUtils.degToRad(sitP * -34);
      } else if (isWalking) {
        legBLRef.current.rotation.x = -Math.sin(walkPhase) * 0.4;
        legBRRef.current.rotation.x = Math.sin(walkPhase) * 0.4;
        legBLRef.current.rotation.z = 0;
        legBRRef.current.rotation.z = 0;
      } else {
        legBLRef.current.rotation.set(0, 0, 0);
        legBRRef.current.rotation.set(0, 0, 0);
      }
    }

    // 3D Corkscrew Tail Animation (Lively wagging when active, drooping when sick)
    if (tailGroupRef.current) {
      if (isLethargic) {
        // Limp, drooping tail when sick/lethargic
        tailGroupRef.current.rotation.x = 0.55;
        tailGroupRef.current.rotation.y = 0.02;
        tailGroupRef.current.rotation.z = -0.1;
      } else {
        // Lively, cheerful corkscrew tail wagging while walking/sniffing
        const wagSpeed = ws.state === 'WALKING' ? 9.5 : 4.5;
        const wagAmp = ws.state === 'WALKING' ? 0.36 : 0.16;
        tailGroupRef.current.rotation.x = 0.26 + Math.sin(t * wagSpeed) * 0.08;
        tailGroupRef.current.rotation.y = Math.sin(t * wagSpeed) * wagAmp;
        tailGroupRef.current.rotation.z = 0.12 + Math.cos(t * wagSpeed) * 0.12;
      }
    }
  });

  return (
    <group
      ref={rootGroupRef}
      scale={[1.35, 1.35, 1.35]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(pig);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* SELECTION RING ON FLOOR */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.85, 1.05, 32]} />
          <meshBasicMaterial color={isLethargic ? '#ff3b30' : '#76b900'} transparent opacity={0.85} />
        </mesh>
      )}

      {/* ANATOMICALLY CORRECT SWINE BODY & LIMBS */}
      <group ref={spineGroupRef}>
        {/* 1. SEAMLESS ORGANIC BODY MESH */}
        <mesh geometry={bodyGeometry} castShadow receiveShadow>
          <meshStandardMaterial
            color={skinColor}
            roughness={0.48}
            metalness={0.02}
            emissive={isLethargic ? '#ff0000' : '#000000'}
            emissiveIntensity={isLethargic ? 0.32 : 0}
          />
        </mesh>

        {/* 2. AUTHENTIC ANATOMICAL SWINE SNOUT (RHINARIUM & NOSTRILS) */}
        <group position={[0, -0.08, 0.82]} rotation={[Math.PI / 2 + 0.16, 0, 0]}>
          {/* Main Snout Disc (Broad oval pad) */}
          <mesh castShadow scale={[1.18, 1.0, 0.92]}>
            <cylinderGeometry args={[0.125, 0.138, 0.055, 32]} />
            <meshStandardMaterial color={snoutColor} roughness={0.36} metalness={0.02} />
          </mesh>

          {/* Fleshy Rolled Outer Rim of the Snout Disc */}
          <mesh position={[0, 0.024, 0]} scale={[1.18, 1.0, 0.92]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.118, 0.016, 12, 32]} />
            <meshStandardMaterial color={snoutColor} roughness={0.34} metalness={0.02} />
          </mesh>

          {/* Left Nostril (Recessed dark oval cavity) */}
          <group position={[-0.042, 0.03, 0]} rotation={[0, 0, 0.22]}>
            <mesh scale={[0.026, 0.018, 0.042]}>
              <cylinderGeometry args={[1, 1, 1, 16]} />
              <meshBasicMaterial color="#1a0f0d" />
            </mesh>
            {/* Subtle soft nostril border rim */}
            <mesh position={[0, 0.002, 0]} scale={[0.028, 0.004, 0.044]}>
              <cylinderGeometry args={[1, 1, 1, 16]} />
              <meshStandardMaterial color="#d47980" roughness={0.4} />
            </mesh>
          </group>

          {/* Right Nostril (Recessed dark oval cavity) */}
          <group position={[0.042, 0.03, 0]} rotation={[0, 0, -0.22]}>
            <mesh scale={[0.026, 0.018, 0.042]}>
              <cylinderGeometry args={[1, 1, 1, 16]} />
              <meshBasicMaterial color="#1a0f0d" />
            </mesh>
            <mesh position={[0, 0.002, 0]} scale={[0.028, 0.004, 0.044]}>
              <cylinderGeometry args={[1, 1, 1, 16]} />
              <meshStandardMaterial color="#d47980" roughness={0.4} />
            </mesh>
          </group>

          {/* Vertical Septum Crease between nostrils */}
          <mesh position={[0, 0.03, 0]}>
            <boxGeometry args={[0.008, 0.01, 0.045]} />
            <meshStandardMaterial color="#d47980" roughness={0.5} />
          </mesh>

          {/* Lower Jaw & Chin tucked under snout */}
          <group position={[0, -0.05, -0.06]} rotation={[-0.24, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.13, 0.048, 0.12]} />
              <meshStandardMaterial color={skinColor} roughness={0.52} />
            </mesh>
            {/* Soft pink lower lip */}
            <mesh position={[0, 0.02, 0.05]}>
              <cylinderGeometry args={[0.055, 0.06, 0.02, 16]} />
              <meshStandardMaterial color={snoutColor} roughness={0.45} />
            </mesh>
          </group>
        </group>

        {/* 3. LATERAL SWINE EYES WITH SUBTLE EYELIDS */}
        <group position={[0, 0.08, 0.54]}>
          {/* Left Eye */}
          <group position={[-0.175, 0, 0]} rotation={[0, -0.28, 0]}>
            <mesh>
              <sphereGeometry args={[0.032, 12, 12]} />
              <meshStandardMaterial color="#1a120e" roughness={0.1} />
            </mesh>
            {/* Eyelid rim */}
            <mesh position={[0, 0.015, 0]}>
              <boxGeometry args={[0.04, 0.015, 0.04]} />
              <meshStandardMaterial color={skinColor} roughness={0.6} />
            </mesh>
          </group>

          {/* Right Eye */}
          <group position={[0.175, 0, 0]} rotation={[0, 0.28, 0]}>
            <mesh>
              <sphereGeometry args={[0.032, 12, 12]} />
              <meshStandardMaterial color="#1a120e" roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.015, 0]}>
              <boxGeometry args={[0.04, 0.015, 0.04]} />
              <meshStandardMaterial color={skinColor} roughness={0.6} />
            </mesh>
          </group>
        </group>

        {/* 4. NATURAL CURVED SWINE EARS (Forward angled & slightly drooping) */}
        {/* Left Ear */}
        <group position={[-0.19, 0.22, 0.40]} rotation={[-0.35, -0.42, -0.52]}>
          <mesh geometry={earGeometryLeft} castShadow>
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          {/* Rosy Inner Ear Cavity */}
          <mesh position={[-0.01, 0.01, 0.015]} scale={[0.75, 0.75, 0.4]}>
            <mesh geometry={earGeometryLeft}>
              <meshStandardMaterial color={innerEarColor} roughness={0.4} />
            </mesh>
          </mesh>
        </group>

        {/* Right Ear */}
        <group position={[0.19, 0.22, 0.40]} rotation={[-0.35, 0.42, 0.52]}>
          <mesh geometry={earGeometryRight} castShadow>
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          <mesh position={[0.01, 0.01, 0.015]} scale={[0.75, 0.75, 0.4]}>
            <mesh geometry={earGeometryRight}>
              <meshStandardMaterial color={innerEarColor} roughness={0.4} />
            </mesh>
          </mesh>
        </group>

        {/* 5. AUTHENTIC 3D HELICAL CORKSCREW TAIL */}
        <group ref={tailGroupRef} position={[0, 0.12, -0.71]} rotation={[0.28, 0, 0]}>
          {/* Fleshy root base connection to rump */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.032, 10, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          {/* Tapered 3D Corkscrew Helical Tube */}
          <mesh geometry={tailGeometry} castShadow>
            <meshStandardMaterial color={skinColor} roughness={0.48} />
          </mesh>
          {/* Soft tapered tail tip */}
          <mesh position={[0.072, 0.032, -0.16]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color={snoutColor} roughness={0.4} />
          </mesh>
        </group>

        {/* 6. FOUR ANATOMICALLY ARTICULATED CLOVEN LEGS */}
        {/* Front Left Leg */}
        <group ref={legFLRef} position={[-0.20, -0.15, 0.32]}>
          {/* Upper shoulder & forearm */}
          <mesh position={[0, -0.12, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.048, 0.25, 12]} />
            <meshStandardMaterial color={skinColor} roughness={0.55} />
          </mesh>
          {/* Knee joint */}
          <mesh position={[0, -0.22, 0.01]}>
            <sphereGeometry args={[0.046, 8, 8]} />
            <meshStandardMaterial color={skinColor} roughness={0.55} />
          </mesh>
          {/* Cloven Dark Hooves (Two distinct forward claws) */}
          <group position={[0, -0.28, 0.01]}>
            <mesh position={[-0.022, 0, 0]}>
              <boxGeometry args={[0.034, 0.05, 0.065]} />
              <meshStandardMaterial color={hoofColor} roughness={0.8} />
            </mesh>
            <mesh position={[0.022, 0, 0]}>
              <boxGeometry args={[0.034, 0.05, 0.065]} />
              <meshStandardMaterial color={hoofColor} roughness={0.8} />
            </mesh>
          </group>
        </group>

        {/* Front Right Leg */}
        <group ref={legFRRef} position={[0.20, -0.15, 0.32]}>
          <mesh position={[0, -0.12, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.048, 0.25, 12]} />
            <meshStandardMaterial color={skinColor} roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.22, 0.01]}>
            <sphereGeometry args={[0.046, 8, 8]} />
            <meshStandardMaterial color={skinColor} roughness={0.55} />
          </mesh>
          <group position={[0, -0.28, 0.01]}>
            <mesh position={[-0.022, 0, 0]}>
              <boxGeometry args={[0.034, 0.05, 0.065]} />
              <meshStandardMaterial color={hoofColor} roughness={0.8} />
            </mesh>
            <mesh position={[0.022, 0, 0]}>
              <boxGeometry args={[0.034, 0.05, 0.065]} />
              <meshStandardMaterial color={hoofColor} roughness={0.8} />
            </mesh>
          </group>
        </group>

        {/* Hind Left Leg (with natural backward hock curve) */}
        <group ref={legBLRef} position={[-0.22, -0.14, -0.34]}>
          {/* Muscular Ham / Thigh */}
          <mesh position={[0, -0.06, 0.02]} rotation={[0.2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.10, 0.075, 0.18, 12]} />
            <meshStandardMaterial color={skinColor} roughness={0.55} />
          </mesh>
          {/* Hock Joint */}
          <mesh position={[0, -0.15, -0.02]}>
            <sphereGeometry args={[0.052, 8, 8]} />
            <meshStandardMaterial color={skinColor} roughness={0.55} />
          </mesh>
          {/* Lower Shank */}
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.052, 0.046, 0.14, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.55} />
          </mesh>
          {/* Cloven Dark Hooves */}
          <group position={[0, -0.30, 0]}>
            <mesh position={[-0.022, 0, 0]}>
              <boxGeometry args={[0.035, 0.05, 0.068]} />
              <meshStandardMaterial color={hoofColor} roughness={0.8} />
            </mesh>
            <mesh position={[0.022, 0, 0]}>
              <boxGeometry args={[0.035, 0.05, 0.068]} />
              <meshStandardMaterial color={hoofColor} roughness={0.8} />
            </mesh>
          </group>
        </group>

        {/* Hind Right Leg */}
        <group ref={legBRRef} position={[0.22, -0.14, -0.34]}>
          <mesh position={[0, -0.06, 0.02]} rotation={[0.2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.10, 0.075, 0.18, 12]} />
            <meshStandardMaterial color={skinColor} roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.15, -0.02]}>
            <sphereGeometry args={[0.052, 8, 8]} />
            <meshStandardMaterial color={skinColor} roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.052, 0.046, 0.14, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.55} />
          </mesh>
          <group position={[0, -0.30, 0]}>
            <mesh position={[-0.022, 0, 0]}>
              <boxGeometry args={[0.035, 0.05, 0.068]} />
              <meshStandardMaterial color={hoofColor} roughness={0.8} />
            </mesh>
            <mesh position={[0.022, 0, 0]}>
              <boxGeometry args={[0.035, 0.05, 0.068]} />
              <meshStandardMaterial color={hoofColor} roughness={0.8} />
            </mesh>
          </group>
        </group>

        {/* 7. SEGMENTATION MASK (Toggleable) */}
        {showSegmentationMasks && (
          <mesh geometry={bodyGeometry}>
            <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.6} />
          </mesh>
        )}
      </group>

      {/* 3D YOLO / TAO BOUNDING BOX (Only when selected or lethargic) */}
      {(showBoundingBoxes || isLethargic || isSelected) && (
        <group position={[0, 0.44, 0]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.95, 1.0, 1.6)]} />
            <lineBasicMaterial
              color={isLethargic ? '#ef4444' : isSelected ? '#76b900' : '#38bdf8'}
              linewidth={isSelected || isLethargic ? 2 : 1}
              transparent
              opacity={isSelected || isLethargic ? 0.9 : 0.3}
            />
          </lineSegments>

          {/* Corner brackets */}
          {[-0.475, 0.475].map((x) =>
            [-0.5, 0.5].map((y) =>
              [-0.8, 0.8].map((z) => (
                <mesh key={`${x}-${y}-${z}`} position={[x, y, z]}>
                  <boxGeometry args={[0.05, 0.05, 0.05]} />
                  <meshBasicMaterial color={isLethargic ? '#ff3b30' : '#00e5ff'} />
                </mesh>
              ))
            )
          )}
        </group>
      )}

      {/* 3D FLOATING STATUS HUD / BEHAVIOR BADGE */}
      {showBehavior && (
        <group position={[0, 1.18, 0]}>
          {/* Background Plaque */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.5, 0.38, 0.02]} />
            <meshBasicMaterial color="#0b111a" transparent opacity={0.88} />
          </mesh>

          {/* Status Dot */}
          <mesh position={[-0.6, 0, 0.02]}>
            <circleGeometry args={[0.07, 16]} />
            <meshBasicMaterial color={isLethargic ? '#ef4444' : '#22c55e'} />
          </mesh>

          {/* Pig ID & State Label */}
          <Text
            position={[-0.45, 0.03, 0.03]}
            fontSize={0.11}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
          >
            {`${pig.tagNumber} • ${isLethargic ? 'LETHARGIC (DOG-SIT)' : (wanderState.current.state || pig.behavior)}`}
          </Text>

          {/* Sub-label with Temp / Risk */}
          <Text
            position={[-0.45, -0.09, 0.03]}
            fontSize={0.085}
            color={isLethargic ? '#fca5a5' : '#94a3b8'}
            anchorX="left"
            anchorY="middle"
          >
            {`${pig.temperature}°C • AI: ${pig.aiConfidence}%`}
          </Text>
        </group>
      )}
    </group>
  );
};
