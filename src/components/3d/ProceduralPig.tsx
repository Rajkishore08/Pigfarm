import React, { useRef, useState, useMemo } from 'react';
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

export const ProceduralPig: React.FC<ProceduralPigProps> = ({
  pig,
  isSelected,
  showBehavior,
  showBoundingBoxes,
  showSegmentationMasks,
  onSelect,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const bodyGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const chestRef = useRef<THREE.Mesh>(null);
  const bellyRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Group>(null);

  // Four leg joints
  const legFLRef = useRef<THREE.Group>(null);
  const legFRRef = useRef<THREE.Group>(null);
  const legBLRef = useRef<THREE.Group>(null);
  const legBRRef = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState(false);

  const bounds = PEN_BOUNDS[pig.penId] || PEN_BOUNDS[1];

  // Autonomous wandering state
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
    speed: 0.5 + Math.random() * 0.35,
    dogSitProgress: pig.behavior === 'LETHARGIC' ? 1.0 : 0.0,
  });

  const isLethargic = pig.behavior === 'LETHARGIC';

  // Natural swine skin colors
  const skinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#f5b8af',
      roughness: 0.55,
      metalness: 0.05,
    });
  }, []);

  const snoutMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#f49da5',
      roughness: 0.45,
      metalness: 0.02,
    });
  }, []);

  const hoofMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#52453e',
      roughness: 0.8,
      metalness: 0.1,
    });
  }, []);

  // Frame animation loop: handles autonomous pen navigation and posture transitions
  useFrame((state, delta) => {
    const ws = wanderState.current;
    const t = state.clock.getElapsedTime();

    // Smooth transition into Dog-Sitting posture when infected / lethargic (Reference Image 2)
    const targetSit = isLethargic ? 1.0 : 0.0;
    ws.dogSitProgress = THREE.MathUtils.lerp(ws.dogSitProgress, targetSit, delta * 2.5);

    const sitP = ws.dogSitProgress; // 0 = standing, 1 = dog-sitting

    if (isLethargic) {
      // Infected pig remains seated in place, breathing heavily with slow labored heave
      ws.state = 'RESTING';
    } else {
      // Healthy pig autonomous wandering logic inside pen boundaries
      ws.timer -= delta;
      if (ws.timer <= 0) {
        if (ws.state === 'WALKING') {
          // Arrived: pause, sniff the ground or eat
          ws.state = Math.random() > 0.4 ? 'SNIFFING' : 'EATING';
          ws.timer = Math.random() * 4 + 3;
        } else {
          // Pick a new random target within pen bounds
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
        // Move towards target
        const diffX = ws.target.x - ws.pos.x;
        const diffZ = ws.target.z - ws.pos.z;
        const dist = Math.hypot(diffX, diffZ);

        if (dist > 0.2) {
          const targetAngle = Math.atan2(diffX, diffZ);
          // Smooth rotation towards target heading
          let angleDiff = targetAngle - ws.heading;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          ws.heading += angleDiff * Math.min(1, delta * 3.5);

          // Walk forward along current heading
          const moveDist = ws.speed * delta;
          ws.pos.x += Math.sin(ws.heading) * moveDist;
          ws.pos.z += Math.cos(ws.heading) * moveDist;

          // Clamp within pen bounds
          ws.pos.x = THREE.MathUtils.clamp(ws.pos.x, bounds.minX, bounds.maxX);
          ws.pos.z = THREE.MathUtils.clamp(ws.pos.z, bounds.minZ, bounds.maxZ);
        } else {
          ws.state = 'SNIFFING';
          ws.timer = Math.random() * 3 + 2;
        }
      }
    }

    // Apply root position and orientation
    if (rootGroupRef.current) {
      // In dog-sitting posture, drop rear towards floor (lower yOffset)
      const sitYOffset = sitP * -0.16;
      rootGroupRef.current.position.set(ws.pos.x, ws.pos.y + sitYOffset, ws.pos.z);
      rootGroupRef.current.rotation.y = ws.heading;
    }

    // -------------------------------------------------------------
    // ACCURATE POSTURE MORPHING (Normal Standing vs. Dog-Sitting)
    // -------------------------------------------------------------
    if (bodyGroupRef.current) {
      // Dog-Sitting: Rump on floor, spine pitched upward ~38 degrees (Image 2 - Panel 3)
      const pitchAngle = THREE.MathUtils.degToRad(sitP * -38);
      bodyGroupRef.current.rotation.x = pitchAngle;
      bodyGroupRef.current.position.y = THREE.MathUtils.lerp(0.45, 0.24, sitP);
      bodyGroupRef.current.position.z = THREE.MathUtils.lerp(0, -0.15, sitP);
    }

    // Chest expansion / heavy labored respiration
    if (chestRef.current && bellyRef.current) {
      const breathFreq = isLethargic ? 2.0 : 3.2;
      const breathAmp = isLethargic ? 0.07 : 0.025;
      const breath = 1.0 + Math.sin(t * breathFreq) * breathAmp;
      chestRef.current.scale.set(breath, breath, 1);
      bellyRef.current.scale.set(breath, breath, 1);
    }

    // Head posture
    if (headGroupRef.current) {
      if (sitP > 0.5) {
        // Dog-sitting head posture: angled forward from tilted torso, drooped tiredly
        headGroupRef.current.rotation.x = THREE.MathUtils.degToRad(32 + Math.sin(t * 2.0) * 4);
        headGroupRef.current.rotation.y = Math.sin(t * 0.8) * 0.05;
      } else if (ws.state === 'SNIFFING' || ws.state === 'EATING') {
        // Head down rooting on ground or in trough
        headGroupRef.current.rotation.x = THREE.MathUtils.degToRad(26 + Math.sin(t * 5.0) * 6);
        headGroupRef.current.rotation.y = Math.sin(t * 2.5) * 0.12;
      } else if (ws.state === 'WALKING') {
        // Slight bobbing while walking
        headGroupRef.current.rotation.x = THREE.MathUtils.degToRad(8 + Math.sin(t * 7.0) * 3);
        headGroupRef.current.rotation.y = Math.sin(t * 3.5) * 0.08;
      } else {
        headGroupRef.current.rotation.x = THREE.MathUtils.degToRad(4 + Math.sin(t * 2.0) * 2);
        headGroupRef.current.rotation.y = 0;
      }
    }

    // Leg locomotion vs. Dog-sitting leg kinematics
    const walkPhase = t * ws.speed * 8.0;
    const isWalking = ws.state === 'WALKING' && sitP < 0.2;

    // FRONT LEGS: In dog-sitting, extend straight down from elevated chest to floor
    if (legFLRef.current && legFRRef.current) {
      if (sitP > 0.3) {
        // Straight braced front legs supporting chest
        legFLRef.current.rotation.x = THREE.MathUtils.degToRad(sitP * 36);
        legFRRef.current.rotation.x = THREE.MathUtils.degToRad(sitP * 36);
        legFLRef.current.rotation.z = THREE.MathUtils.degToRad(4);
        legFRRef.current.rotation.z = THREE.MathUtils.degToRad(-4);
      } else if (isWalking) {
        legFLRef.current.rotation.x = Math.sin(walkPhase) * 0.45;
        legFRRef.current.rotation.x = -Math.sin(walkPhase) * 0.45;
        legFLRef.current.rotation.z = 0;
        legFRRef.current.rotation.z = 0;
      } else {
        legFLRef.current.rotation.set(0, 0, 0);
        legFRRef.current.rotation.set(0, 0, 0);
      }
    }

    // HIND LEGS: In dog-sitting, fold flat along ground beside haunches
    if (legBLRef.current && legBRRef.current) {
      if (sitP > 0.3) {
        // Folded hind legs flat on floor
        legBLRef.current.rotation.x = THREE.MathUtils.degToRad(sitP * -68);
        legBRRef.current.rotation.x = THREE.MathUtils.degToRad(sitP * -68);
        legBLRef.current.rotation.z = THREE.MathUtils.degToRad(sitP * 28);
        legBRRef.current.rotation.z = THREE.MathUtils.degToRad(sitP * -28);
      } else if (isWalking) {
        legBLRef.current.rotation.x = -Math.sin(walkPhase) * 0.45;
        legBRRef.current.rotation.x = Math.sin(walkPhase) * 0.45;
        legBLRef.current.rotation.z = 0;
        legBRRef.current.rotation.z = 0;
      } else {
        legBLRef.current.rotation.set(0, 0, 0);
        legBRRef.current.rotation.set(0, 0, 0);
      }
    }

    // Tail wagging
    if (tailRef.current) {
      tailRef.current.rotation.y = isLethargic ? 0.1 : Math.sin(t * 8.0) * 0.4;
    }
  });

  // Color updates based on infection / fever state
  const bodyColor = isLethargic
    ? (isSelected ? '#ff4d4f' : '#f87171')
    : (hovered || isSelected ? '#fed7aa' : '#f5b8af');

  // Realistic Swine Cloven Leg Component
  const renderForeleg = (isLeft: boolean) => {
    const xSign = isLeft ? -1 : 1;
    return (
      <group position={[xSign * 0.22, -0.15, 0.32]}>
        {/* Upper shoulder / forearm */}
        <mesh position={[0, -0.08, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.055, 0.22, 10]} />
          <primitive object={skinMaterial} attach="material" color={bodyColor} />
        </mesh>
        {/* Knee / wrist joint */}
        <mesh position={[0, -0.2, 0.01]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <primitive object={skinMaterial} attach="material" color={bodyColor} />
        </mesh>
        {/* Cannon / lower leg */}
        <mesh position={[0, -0.28, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.18, 10]} />
          <primitive object={skinMaterial} attach="material" color={bodyColor} />
        </mesh>
        {/* Cloven Hoof (Two dark toes) */}
        <group position={[0, -0.38, 0.02]}>
          <mesh position={[-0.02, 0, 0]}>
            <boxGeometry args={[0.038, 0.06, 0.075]} />
            <primitive object={hoofMaterial} attach="material" />
          </mesh>
          <mesh position={[0.02, 0, 0]}>
            <boxGeometry args={[0.038, 0.06, 0.075]} />
            <primitive object={hoofMaterial} attach="material" />
          </mesh>
        </group>
      </group>
    );
  };

  const renderHindleg = (isLeft: boolean) => {
    const xSign = isLeft ? -1 : 1;
    return (
      <group position={[xSign * 0.24, -0.12, -0.34]}>
        {/* Massive muscular ham / upper thigh */}
        <mesh position={[0, -0.06, 0.02]} rotation={[0.2, 0, 0]} castShadow>
          <sphereGeometry args={[0.13, 10, 10]} />
          <primitive object={skinMaterial} attach="material" color={bodyColor} />
        </mesh>
        {/* Stifle / Hock joint (swine hock points backward) */}
        <mesh position={[0, -0.16, -0.04]} castShadow>
          <cylinderGeometry args={[0.075, 0.055, 0.18, 10]} />
          <primitive object={skinMaterial} attach="material" color={bodyColor} />
        </mesh>
        {/* Lower shank */}
        <mesh position={[0, -0.27, -0.02]} castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.16, 10]} />
          <primitive object={skinMaterial} attach="material" color={bodyColor} />
        </mesh>
        {/* Cloven Hoof */}
        <group position={[0, -0.37, 0.01]}>
          <mesh position={[-0.02, 0, 0]}>
            <boxGeometry args={[0.04, 0.06, 0.08]} />
            <primitive object={hoofMaterial} attach="material" />
          </mesh>
          <mesh position={[0.02, 0, 0]}>
            <boxGeometry args={[0.04, 0.06, 0.08]} />
            <primitive object={hoofMaterial} attach="material" />
          </mesh>
        </group>
      </group>
    );
  };

  return (
    <group
      ref={rootGroupRef}
      scale={[1.45, 1.45, 1.45]}
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

      {/* COMPLETE ANATOMICAL PIG BODY ASSEMBLY */}
      <group ref={bodyGroupRef}>
        {/* 1. Forequarter & Shoulder Withers */}
        <mesh ref={chestRef} position={[0, 0.05, 0.22]} castShadow receiveShadow>
          <sphereGeometry args={[0.34, 16, 16]} />
          <primitive
            object={skinMaterial}
            attach="material"
            color={bodyColor}
            emissive={isLethargic ? '#ff0000' : '#000000'}
            emissiveIntensity={isLethargic ? 0.35 : 0}
          />
        </mesh>

        {/* 2. Main Barrel Abdomen & Ribcage */}
        <mesh ref={bellyRef} position={[0, 0.02, -0.05]} castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.36, 0.48, 16]} />
          <primitive
            object={skinMaterial}
            attach="material"
            color={bodyColor}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </mesh>

        {/* 3. Rounded Muscular Rump / Pelvis */}
        <mesh position={[0, 0.05, -0.32]} castShadow receiveShadow>
          <sphereGeometry args={[0.34, 16, 16]} />
          <primitive object={skinMaterial} attach="material" color={bodyColor} />
        </mesh>

        {/* 4. Arched Back Spine Profile */}
        <mesh position={[0, 0.24, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.16, 0.58, 8, 12]} />
          <primitive object={skinMaterial} attach="material" color={bodyColor} />
        </mesh>

        {/* 5. Segmentation Wireframe Mask (Toggleable) */}
        {showSegmentationMasks && (
          <mesh position={[0, 0.04, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.4, 0.78, 6, 10]} />
            <meshBasicMaterial color="#00e5ff" wireframe />
          </mesh>
        )}

        {/* 6. ANATOMICAL HEAD ASSEMBLY */}
        <group ref={headGroupRef} position={[0, 0.16, 0.48]}>
          {/* Cranium / Forehead */}
          <mesh position={[0, 0.06, 0.06]} castShadow receiveShadow>
            <sphereGeometry args={[0.25, 14, 14]} />
            <primitive object={skinMaterial} attach="material" color={bodyColor} />
          </mesh>

          {/* Jowls / Cheeks */}
          <mesh position={[-0.14, -0.04, 0.02]}>
            <sphereGeometry args={[0.13, 10, 10]} />
            <primitive object={skinMaterial} attach="material" color={bodyColor} />
          </mesh>
          <mesh position={[0.14, -0.04, 0.02]}>
            <sphereGeometry args={[0.13, 10, 10]} />
            <primitive object={skinMaterial} attach="material" color={bodyColor} />
          </mesh>

          {/* Sloping Snout Bridge */}
          <mesh position={[0, -0.02, 0.22]} rotation={[0.42, 0, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.16, 0.24, 14]} />
            <primitive object={skinMaterial} attach="material" color={bodyColor} />
          </mesh>

          {/* Snout Disc (Pinkish Flat Nose with Flare) */}
          <group position={[0, -0.08, 0.33]} rotation={[0.4, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.125, 0.125, 0.06, 16]} />
              <primitive object={snoutMaterial} attach="material" />
            </mesh>
            {/* Left & Right Nostrils */}
            <mesh position={[-0.045, 0.032, 0]}>
              <sphereGeometry args={[0.026, 8, 8]} />
              <meshBasicMaterial color="#2d1f1f" />
            </mesh>
            <mesh position={[0.045, 0.032, 0]}>
              <sphereGeometry args={[0.026, 8, 8]} />
              <meshBasicMaterial color="#2d1f1f" />
            </mesh>
          </group>

          {/* Realistic Pig Eyes */}
          <group position={[0, 0.08, 0.16]}>
            <mesh position={[-0.15, 0, 0]}>
              <sphereGeometry args={[0.032, 8, 8]} />
              <meshBasicMaterial color="#1a1412" />
            </mesh>
            <mesh position={[0.15, 0, 0]}>
              <sphereGeometry args={[0.032, 8, 8]} />
              <meshBasicMaterial color="#1a1412" />
            </mesh>
          </group>

          {/* Floppy Pig Ears (Angle forward and flap over) */}
          {/* Left Ear */}
          <group position={[-0.18, 0.24, -0.02]} rotation={[-0.2, -0.4, -0.5]}>
            <mesh castShadow>
              <boxGeometry args={[0.15, 0.24, 0.025]} />
              <primitive object={snoutMaterial} attach="material" />
            </mesh>
            {/* Ear Tip Fold */}
            <mesh position={[0, -0.12, 0.04]} rotation={[0.6, 0, 0]}>
              <boxGeometry args={[0.13, 0.1, 0.02]} />
              <primitive object={snoutMaterial} attach="material" />
            </mesh>
          </group>

          {/* Right Ear */}
          <group position={[0.18, 0.24, -0.02]} rotation={[-0.2, 0.4, 0.5]}>
            <mesh castShadow>
              <boxGeometry args={[0.15, 0.24, 0.025]} />
              <primitive object={snoutMaterial} attach="material" />
            </mesh>
            {/* Ear Tip Fold */}
            <mesh position={[0, -0.12, 0.04]} rotation={[0.6, 0, 0]}>
              <boxGeometry args={[0.13, 0.1, 0.02]} />
              <primitive object={snoutMaterial} attach="material" />
            </mesh>
          </group>
        </group>

        {/* 7. Curly Tail */}
        <group ref={tailRef} position={[0, 0.18, -0.56]} rotation={[0.4, 0, 0]}>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.09, 0.026, 8, 16, Math.PI * 1.7]} />
            <primitive object={snoutMaterial} attach="material" />
          </mesh>
        </group>

        {/* 8. FOUR ARTICULATED LEGS */}
        {/* Front Left */}
        <group ref={legFLRef}>{renderForeleg(true)}</group>
        {/* Front Right */}
        <group ref={legFRRef}>{renderForeleg(false)}</group>
        {/* Back Left */}
        <group ref={legBLRef}>{renderHindleg(true)}</group>
        {/* Back Right */}
        <group ref={legBRRef}>{renderHindleg(false)}</group>
      </group>

      {/* 3D YOLO / TAO BOUNDING BOX */}
      {(showBoundingBoxes || isLethargic || isSelected) && (
        <group position={[0, 0.4, 0]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.0, 1.05, 1.55)]} />
            <lineBasicMaterial
              color={isLethargic ? '#ef4444' : isSelected ? '#76b900' : '#38bdf8'}
              linewidth={isSelected || isLethargic ? 2 : 1}
              transparent
              opacity={isSelected || isLethargic ? 0.95 : 0.35}
            />
          </lineSegments>

          {/* Corner brackets */}
          {[-0.5, 0.5].map((x) =>
            [-0.525, 0.525].map((y) =>
              [-0.775, 0.775].map((z) => (
                <mesh key={`${x}-${y}-${z}`} position={[x, y, z]}>
                  <boxGeometry args={[0.06, 0.06, 0.06]} />
                  <meshBasicMaterial color={isLethargic ? '#ff3b30' : '#00e5ff'} />
                </mesh>
              ))
            )
          )}
        </group>
      )}

      {/* 3D FLOATING STATUS HUD / BEHAVIOR BADGE */}
      {showBehavior && (
        <group position={[0, 1.15, 0]}>
          {/* Background Plaque */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.5, 0.38, 0.02]} />
            <meshBasicMaterial color="#0b111a" transparent opacity={0.88} />
          </mesh>

          {/* Status Dot */}
          <mesh position={[-0.6, 0, 0.02]}>
            <circleGeometry args={[0.07, 16]} />
            <meshBasicMaterial
              color={isLethargic ? '#ef4444' : '#22c55e'}
            />
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
