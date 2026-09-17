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

  // Cached seamless organic body mesh
  const bodyGeometry = useMemo(() => createOrganicSwineBody(), []);
  const earGeometryLeft = useMemo(() => createCurvedSwineEar(true), []);
  const earGeometryRight = useMemo(() => createCurvedSwineEar(false), []);

  // Autonomous wandering & collision state inside pen boundaries
  const wanderState = useRef({
    pos: new THREE.Vector3(pig.position[0], pig.position[1], pig.position[2]),
    target: new THREE.Vector3(
      bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
      pig.position[1],
      bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ)
    ),
    heading: pig.rotation,
    state: 'WALKING' as 'WALKING' | 'SNIFFING' | 'EATING' | 'RESTING',
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

    if (isLethargic) {
      ws.state = 'RESTING';
    } else {
      // Autonomous state machine
      ws.timer -= delta;
      if (ws.timer <= 0) {
        if (ws.state === 'WALKING') {
          ws.state = Math.random() > 0.45 ? 'SNIFFING' : 'EATING';
          ws.timer = Math.random() * 4 + 3;
        } else {
          ws.target.set(
            bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
            pig.position[1],
            bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ)
          );
          ws.state = 'WALKING';
          ws.timer = Math.random() * 6 + 4;
        }
      }

      if (ws.state === 'WALKING') {
        const diffX = ws.target.x - ws.pos.x;
        const diffZ = ws.target.z - ws.pos.z;
        const dist = Math.hypot(diffX, diffZ);

        if (dist > 0.3) {
          const targetAngle = Math.atan2(diffX, diffZ);
          let angleDiff = targetAngle - ws.heading;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          ws.heading += angleDiff * Math.min(1, delta * 3.0);

          const moveDist = ws.speed * delta;
          ws.pos.x += Math.sin(ws.heading) * moveDist;
          ws.pos.z += Math.cos(ws.heading) * moveDist;
        } else {
          ws.state = 'SNIFFING';
          ws.timer = Math.random() * 3 + 2;
        }
      }
    }

    // -------------------------------------------------------------
    // INTER-PIG COLLISION AVOIDANCE & SEPARATION
    // (Prevents any pig from ever entering or walking inside another pig)
    // -------------------------------------------------------------
    pigSpatialRegistry.set(pig.id, {
      x: ws.pos.x,
      z: ws.pos.z,
      isResting: isLethargic || sitP > 0.4 || ws.state === 'RESTING',
    });

    for (const [otherId, other] of pigSpatialRegistry.entries()) {
      if (otherId === pig.id) continue;
      const dx = ws.pos.x - other.x;
      const dz = ws.pos.z - other.z;
      const dist = Math.hypot(dx, dz);
      const minSeparation = 1.35; // Safe buffer distance between swine centers

      if (dist < minSeparation && dist > 0.001) {
        const overlap = minSeparation - dist;
        const nx = dx / dist;
        const nz = dz / dist;

        // If the other pig is resting/dog-sitting, walking pig yields and deflects around it
        const pushFactor = other.isResting ? overlap * 0.95 : overlap * 0.5;
        ws.pos.x += nx * pushFactor;
        ws.pos.z += nz * pushFactor;

        // Steer heading smoothly away from the collision
        const awayAngle = Math.atan2(dx, dz);
        ws.heading = THREE.MathUtils.lerp(ws.heading, awayAngle, delta * 5.0);
      }
    }

    // Constrain strictly within pen boundaries
    ws.pos.x = THREE.MathUtils.clamp(ws.pos.x, bounds.minX + 0.4, bounds.maxX - 0.4);
    ws.pos.z = THREE.MathUtils.clamp(ws.pos.z, bounds.minZ + 0.4, bounds.maxZ - 0.4);

    // Apply root position
    if (rootGroupRef.current) {
      // In dog-sitting posture, drop pelvis/rump towards the pen floor
      const sitYOffset = sitP * -0.16;
      rootGroupRef.current.position.set(ws.pos.x, ws.pos.y + sitYOffset, ws.pos.z);
      rootGroupRef.current.rotation.y = ws.heading;
    }

    // -------------------------------------------------------------
    // CLINICAL DOG-SITTING POSTURE (Image 2 - Panel 3)
    // -------------------------------------------------------------
    if (spineGroupRef.current) {
      // Pelvis sits on floor, spine angled upward by 36°
      const pitchAngle = THREE.MathUtils.degToRad(sitP * -36);
      spineGroupRef.current.rotation.x = pitchAngle;
      spineGroupRef.current.position.y = THREE.MathUtils.lerp(0.44, 0.22, sitP);
      spineGroupRef.current.position.z = THREE.MathUtils.lerp(0, -0.12, sitP);

      // Heavy, labored breathing pulse for infected pig
      const breathFreq = isLethargic ? 2.0 : 3.5;
      const breathAmp = isLethargic ? 0.045 : 0.015;
      const breath = 1.0 + Math.sin(t * breathFreq) * breathAmp;
      spineGroupRef.current.scale.set(breath, breath, 1);
    }

    // Four limb locomotion & sitting articulation
    const walkPhase = t * ws.speed * 8.0;
    const isWalking = ws.state === 'WALKING' && sitP < 0.2;

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

    // Tail Wagging
    if (tailGroupRef.current) {
      tailGroupRef.current.rotation.y = isLethargic ? 0.04 : Math.sin(t * 7.5) * 0.35;
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

        {/* 2. REALISTIC SNOUT DISC & DUAL FLARED NOSTRILS */}
        <group position={[0, -0.09, 0.81]} rotation={[0.32, 0, 0]}>
          {/* Main Snout Disc (Rhinarium) */}
          <mesh castShadow>
            <cylinderGeometry args={[0.125, 0.135, 0.06, 24]} />
            <meshStandardMaterial color={snoutColor} roughness={0.38} metalness={0.02} />
          </mesh>

          {/* Left Nostril (Indented Oval) */}
          <mesh position={[-0.042, 0.031, 0.005]} rotation={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.024, 0.028, 0.02, 12]} />
            <meshBasicMaterial color="#241412" />
          </mesh>

          {/* Right Nostril (Indented Oval) */}
          <mesh position={[0.042, 0.031, 0.005]} rotation={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.024, 0.028, 0.02, 12]} />
            <meshBasicMaterial color="#241412" />
          </mesh>

          {/* Lower Jaw / Lip under the snout */}
          <mesh position={[0, -0.065, -0.06]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.13, 0.045, 0.12]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
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

        {/* 5. CORKSCREW SPIRAL TAIL */}
        <group ref={tailGroupRef} position={[0, 0.16, -0.71]} rotation={[0.45, 0, 0.15]}>
          <mesh rotation={[Math.PI / 2.8, 0, 0]}>
            <torusGeometry args={[0.08, 0.024, 8, 20, Math.PI * 2.2]} />
            <meshStandardMaterial color={snoutColor} roughness={0.5} />
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
            {`${pig.tagNumber} • ${isLethargic ? 'LETHARGIC (DOG-SIT)' : pig.behavior}`}
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
