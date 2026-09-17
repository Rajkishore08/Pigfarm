import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface JetsonNode3DProps {
  position?: [number, number, number];
  isSelected: boolean;
  onSelect: () => void;
}

export const JetsonNode3D: React.FC<JetsonNode3DProps> = ({
  position = [8.8, 1.2, 5.5],
  isSelected,
  onSelect,
}) => {
  const ledRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ledRef.current) {
      // Rapid heartbeat pulse for edge AI inference
      ledRef.current.color.setRGB(
        0.46 + Math.sin(t * 10.0) * 0.1,
        0.72 + Math.sin(t * 10.0) * 0.1,
        0.0
      );
    }
  });

  return (
    <group 
      name="JetsonEdgeNode" 
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Wall Mounting Pedestal / Rack Bracket */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[1.2, 0.15, 0.8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Main Jetson Enclosure Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.9, 0.45, 0.6]} />
        <meshStandardMaterial 
          color="#0f172a" 
          metalness={0.9} 
          roughness={0.2}
          emissive={isSelected ? '#76b900' : '#000000'}
          emissiveIntensity={isSelected ? 0.25 : 0}
        />
      </mesh>

      {/* Black Anodized Heatsink Fins on Top */}
      <group position={[0, 0.25, 0]}>
        {Array.from({ length: 9 }).map((_, i) => (
          <mesh key={i} position={[0, 0.08, -0.22 + i * 0.055]}>
            <boxGeometry args={[0.8, 0.16, 0.02]} />
            <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.15} />
          </mesh>
        ))}
      </group>

      {/* NVIDIA Signature Green Accent Stripe */}
      <mesh position={[0, 0.08, 0.305]}>
        <boxGeometry args={[0.7, 0.04, 0.01]} />
        <meshBasicMaterial color="#76b900" />
      </mesh>

      {/* Ethernet & Camera Fiber Connection Ports */}
      {[-0.25, -0.1, 0.05, 0.2].map((x, idx) => (
        <mesh key={idx} position={[x, -0.1, 0.305]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
      ))}

      {/* Blinking Activity LED */}
      <mesh position={[0.32, 0.08, 0.305]}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshBasicMaterial ref={ledRef} color="#76b900" />
      </mesh>

      {/* Status Badge */}
      <group position={[0, 0.65, 0]}>
        <mesh>
          <boxGeometry args={[2.0, 0.42, 0.02]} />
          <meshBasicMaterial color="#090d14" transparent opacity={0.9} />
        </mesh>
        <Text
          position={[0, 0.08, 0.02]}
          fontSize={0.11}
          color="#76b900"
          anchorX="center"
          anchorY="middle"
        >
          NVIDIA JETSON AGX
        </Text>
        <Text
          position={[0, -0.08, 0.02]}
          fontSize={0.085}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
        >
          28ms Latency • 32 FPS • FP16
        </Text>
      </group>
    </group>
  );
};
