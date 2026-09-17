import React, { useRef, useState } from 'react';
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

export const ProceduralPig: React.FC<ProceduralPigProps> = ({
  pig,
  isSelected,
  showBehavior,
  showBoundingBoxes,
  showSegmentationMasks,
  onSelect,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const legFLRef = useRef<THREE.Mesh>(null);
  const legFRRef = useRef<THREE.Mesh>(null);
  const legBLRef = useRef<THREE.Mesh>(null);
  const legBRRef = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);

  // Determine behavior color and indicator
  const getBehaviorColor = (behavior: string) => {
    switch (behavior) {
      case 'NORMAL': return '#22c55e'; // Green
      case 'EATING': return '#3b82f6'; // Blue
      case 'WALKING': return '#06b6d4'; // Cyan
      case 'RESTING': return '#a855f7'; // Purple
      case 'LETHARGIC': return '#ef4444'; // Red
      default: return '#76b900';
    }
  };

  const isLethargic = pig.behavior === 'LETHARGIC';
  const behaviorColor = getBehaviorColor(pig.behavior);

  // Animation frame loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speedMultiplier = isLethargic ? 0.3 : 1.0;

    // Body breathing pulse
    if (bodyRef.current) {
      const breathScale = 1.0 + Math.sin(t * 3.5 * speedMultiplier) * (isLethargic ? 0.05 : 0.025);
      bodyRef.current.scale.set(breathScale, 1, breathScale);
    }

    // Head nodding / eating / drooping
    if (headRef.current) {
      if (isLethargic) {
        headRef.current.rotation.x = 0.35 + Math.sin(t * 1.5) * 0.05; // Drooped low
      } else if (pig.behavior === 'EATING') {
        headRef.current.rotation.x = 0.4 + Math.sin(t * 6.0) * 0.12; // Rooting at trough
      } else if (pig.behavior === 'WALKING') {
        headRef.current.rotation.y = Math.sin(t * 5.0) * 0.12;
      } else {
        headRef.current.rotation.x = Math.sin(t * 2.0) * 0.06;
      }
    }

    // Legs locomotion animation
    if (pig.behavior === 'WALKING') {
      const legAngle = Math.sin(t * 6.0) * 0.4;
      if (legFLRef.current) legFLRef.current.rotation.x = legAngle;
      if (legFRRef.current) legFRRef.current.rotation.x = -legAngle;
      if (legBLRef.current) legBLRef.current.rotation.x = -legAngle;
      if (legBRRef.current) legBRRef.current.rotation.x = legAngle;
    } else if (isLethargic || pig.behavior === 'RESTING') {
      // Recumbent splayed legs
      if (legFLRef.current) legFLRef.current.rotation.z = 0.4;
      if (legFRRef.current) legFRRef.current.rotation.z = -0.4;
      if (legBLRef.current) legBLRef.current.rotation.z = 0.45;
      if (legBRRef.current) legBRRef.current.rotation.z = -0.45;
    } else {
      if (legFLRef.current) legFLRef.current.rotation.set(0, 0, 0);
      if (legFRRef.current) legFRRef.current.rotation.set(0, 0, 0);
      if (legBLRef.current) legBLRef.current.rotation.set(0, 0, 0);
      if (legBRRef.current) legBRRef.current.rotation.set(0, 0, 0);
    }

    // Tail wagging
    if (tailRef.current) {
      tailRef.current.rotation.y = isLethargic ? 0 : Math.sin(t * 8.0) * 0.35;
    }
  });

  // Vertical position adjustment
  const yOffset = (isLethargic || pig.behavior === 'RESTING') ? -0.15 : 0;

  // Vibrant high-contrast skin color for clear visibility
  const bodyColor = isLethargic
    ? (isSelected ? '#ff4d4f' : '#f87171')
    : (hovered || isSelected ? '#fed7aa' : '#fbcfe8');

  return (
    <group 
      ref={groupRef}
      position={[pig.position[0], pig.position[1] + yOffset, pig.position[2]]}
      rotation={[0, pig.rotation, isLethargic ? 0.3 : 0]}
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
        <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.75, 0.9, 32]} />
          <meshBasicMaterial color={isLethargic ? "#ff3b30" : "#76b900"} transparent opacity={0.85} />
        </mesh>
      )}

      {/* PROCEDURAL PIG BODY */}
      <group>
        {/* Main Torso (Horizontal capsule along Z axis) */}
        <mesh 
          ref={bodyRef} 
          position={[0, 0.1, 0]} 
          rotation={[Math.PI / 2, 0, 0]} 
          castShadow 
          receiveShadow
        >
          <capsuleGeometry args={[0.35, 0.7, 8, 16]} />
          <meshStandardMaterial 
            color={bodyColor} 
            roughness={0.5} 
            metalness={0.05}
            emissive={isLethargic ? '#ff0000' : '#000000'}
            emissiveIntensity={isLethargic ? 0.35 : 0}
          />
        </mesh>

        {/* Segmentation Wireframe Mask (Toggleable) */}
        {showSegmentationMasks && (
          <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.36, 0.72, 6, 8]} />
            <meshBasicMaterial color="#00e5ff" wireframe />
          </mesh>
        )}

        {/* Head Assembly */}
        <group ref={headRef} position={[0, 0.22, 0.52]}>
          {/* Head Base */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.28, 16, 16]} />
            <meshStandardMaterial color={bodyColor} roughness={0.5} />
          </mesh>

          {/* Snout */}
          <mesh position={[0, -0.05, 0.24]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.14, 0.18, 14]} />
            <meshStandardMaterial color="#f472b6" roughness={0.4} />
          </mesh>
          {/* Left Nostril */}
          <mesh position={[-0.05, -0.05, 0.34]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color="#1f2937" />
          </mesh>
          {/* Right Nostril */}
          <mesh position={[0.05, -0.05, 0.34]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color="#1f2937" />
          </mesh>

          {/* Eyes */}
          <mesh position={[-0.15, 0.1, 0.18]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="#030712" />
          </mesh>
          <mesh position={[0.15, 0.1, 0.18]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="#030712" />
          </mesh>

          {/* Left Ear */}
          <mesh position={[-0.2, 0.24, 0.02]} rotation={[-0.2, -0.3, -0.4]}>
            <boxGeometry args={[0.14, 0.22, 0.03]} />
            <meshStandardMaterial color="#f472b6" roughness={0.5} />
          </mesh>
          {/* Right Ear */}
          <mesh position={[0.2, 0.24, 0.02]} rotation={[-0.2, 0.3, 0.4]}>
            <boxGeometry args={[0.14, 0.22, 0.03]} />
            <meshStandardMaterial color="#f472b6" roughness={0.5} />
          </mesh>
        </group>

        {/* Curly Tail */}
        <group ref={tailRef} position={[0, 0.22, -0.52]}>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.09, 0.03, 8, 16, Math.PI * 1.6]} />
            <meshStandardMaterial color="#f472b6" roughness={0.5} />
          </mesh>
        </group>

        {/* Four Articulated Legs */}
        {/* Front Left */}
        <mesh ref={legFLRef} position={[-0.2, -0.22, 0.3]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.36, 10]} />
          <meshStandardMaterial color={bodyColor} roughness={0.6} />
        </mesh>
        {/* Front Right */}
        <mesh ref={legFRRef} position={[0.2, -0.22, 0.3]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.36, 10]} />
          <meshStandardMaterial color={bodyColor} roughness={0.6} />
        </mesh>
        {/* Back Left */}
        <mesh ref={legBLRef} position={[-0.2, -0.22, -0.3]} castShadow>
          <cylinderGeometry args={[0.065, 0.05, 0.36, 10]} />
          <meshStandardMaterial color={bodyColor} roughness={0.6} />
        </mesh>
        {/* Back Right */}
        <mesh ref={legBRRef} position={[0.2, -0.22, -0.3]} castShadow>
          <cylinderGeometry args={[0.065, 0.05, 0.36, 10]} />
          <meshStandardMaterial color={bodyColor} roughness={0.6} />
        </mesh>
      </group>

      {/* 3D YOLO / TAO BOUNDING BOX */}
      {(showBoundingBoxes || isLethargic || isSelected) && (
        <group position={[0, 0.1, 0]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.95, 0.95, 1.4)]} />
            <lineBasicMaterial 
              color={isLethargic ? "#ef4444" : (isSelected ? "#76b900" : "#38bdf8")} 
              linewidth={isSelected || isLethargic ? 2 : 1}
              transparent
              opacity={isSelected || isLethargic ? 0.95 : 0.4}
            />
          </lineSegments>

          {/* Corner highlight brackets */}
          {[-0.475, 0.475].map((x) =>
            [-0.475, 0.475].map((y) =>
              [-0.7, 0.7].map((z) => (
                <mesh key={`${x}-${y}-${z}`} position={[x, y, z]}>
                  <boxGeometry args={[0.06, 0.06, 0.06]} />
                  <meshBasicMaterial color={isLethargic ? "#ff3b30" : "#00e5ff"} />
                </mesh>
              ))
            )
          )}
        </group>
      )}

      {/* 3D FLOATING STATUS HUD / BEHAVIOR BADGE */}
      {showBehavior && (
        <group position={[0, 1.05, 0]}>
          {/* Background Plaque */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.4, 0.38, 0.02]} />
            <meshBasicMaterial color="#0b111a" transparent opacity={0.88} />
          </mesh>

          {/* Status Dot */}
          <mesh position={[-0.55, 0, 0.02]}>
            <circleGeometry args={[0.07, 16]} />
            <meshBasicMaterial color={behaviorColor} />
          </mesh>

          {/* Pig ID & Behavior Label */}
          <Text
            position={[-0.4, 0.03, 0.03]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
          >
            {`${pig.tagNumber} • ${pig.behavior}`}
          </Text>

          {/* Sub-label with Temp / Risk */}
          <Text
            position={[-0.4, -0.09, 0.03]}
            fontSize={0.09}
            color={isLethargic ? "#fca5a5" : "#94a3b8"}
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
