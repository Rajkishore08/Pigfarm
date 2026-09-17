import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BarnStructureProps {
  showGeometry: boolean;
  lightingIntensity: number;
}

export const BarnStructure: React.FC<BarnStructureProps> = ({ showGeometry, lightingIntensity }) => {
  const fanRef1 = useRef<THREE.Group>(null);
  const fanRef2 = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (fanRef1.current) fanRef1.current.rotation.z += delta * 4.0;
    if (fanRef2.current) fanRef2.current.rotation.z += delta * 4.0;
  });

  const wireframeProps = showGeometry ? { wireframe: false } : {};

  return (
    <group name="BarnStructure">
      {/* Concrete Slatted Base Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[20, 0.1, 14]} />
        <meshStandardMaterial 
          color="#161e29" 
          roughness={0.8} 
          metalness={0.2} 
          {...wireframeProps}
        />
      </mesh>

      {/* Central Concrete Walkway */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.0, 13.8]} />
        <meshStandardMaterial 
          color="#202b3a" 
          roughness={0.6} 
          metalness={0.1}
        />
      </mesh>

      {/* Slatted Floor Grid Lines (Visualizing drainage slats) */}
      <gridHelper 
        args={[19.6, 28, '#2a3b50', '#182433']} 
        position={[0, 0.02, 0]} 
      />

      {/* Outer Low Perimeter Walls (Concrete Curbs) */}
      <group name="PerimeterWalls">
        {/* Back Wall */}
        <mesh position={[0, 0.6, -6.9]} receiveShadow castShadow>
          <boxGeometry args={[20, 1.2, 0.2]} />
          <meshStandardMaterial color="#192330" roughness={0.7} />
        </mesh>
        {/* Front Low Wall */}
        <mesh position={[0, 0.6, 6.9]} receiveShadow castShadow>
          <boxGeometry args={[20, 1.2, 0.2]} />
          <meshStandardMaterial color="#192330" roughness={0.7} />
        </mesh>
        {/* Left Wall */}
        <mesh position={[-9.9, 1.2, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.2, 2.4, 14]} />
          <meshStandardMaterial color="#161f2c" roughness={0.7} />
        </mesh>
        {/* Right Wall */}
        <mesh position={[9.9, 1.2, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.2, 2.4, 14]} />
          <meshStandardMaterial color="#161f2c" roughness={0.7} />
        </mesh>
      </group>

      {/* Ceiling Steel Trusses & Beams */}
      <group name="RoofTrusses" position={[0, 4.8, 0]}>
        {[-6, -2, 2, 6].map((x) => (
          <group key={`truss-${x}`} position={[x, 0, 0]}>
            {/* Horizontal Crossbeam */}
            <mesh>
              <boxGeometry args={[0.15, 0.2, 14]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Hanging Cable Down to Light */}
            <mesh position={[0, -0.6, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} />
            </mesh>
            {/* Industrial Overhead LED Fixture */}
            <mesh position={[0, -1.2, 0]}>
              <boxGeometry args={[0.3, 0.1, 1.8]} />
              <meshStandardMaterial 
                color="#0f172a" 
                emissive="#e2e8f0" 
                emissiveIntensity={0.2 * (lightingIntensity / 100)} 
              />
            </mesh>
            <pointLight 
              position={[0, -1.3, 0]} 
              intensity={25 * (lightingIntensity / 100)} 
              distance={8} 
              color="#f8fafc" 
            />
          </group>
        ))}
      </group>

      {/* Ventilation Exhaust Fans on End Walls */}
      <group name="VentilationFan1" position={[-9.8, 2.2, -3]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.3, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        <group ref={fanRef1} rotation={[0, Math.PI / 2, 0]} position={[0.1, 0, 0]}>
          {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
            <mesh key={idx} rotation={[0, 0, (angle * Math.PI) / 180]} position={[0, 0.4, 0]}>
              <boxGeometry args={[0.15, 0.7, 0.02]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} />
            </mesh>
          ))}
        </group>
      </group>

      <group name="VentilationFan2" position={[-9.8, 2.2, 3]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.3, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        <group ref={fanRef2} rotation={[0, Math.PI / 2, 0]} position={[0.1, 0, 0]}>
          {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
            <mesh key={idx} rotation={[0, 0, (angle * Math.PI) / 180]} position={[0, 0.4, 0]}>
              <boxGeometry args={[0.15, 0.7, 0.02]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} />
            </mesh>
          ))}
        </group>
      </group>

      {/* USD Digital Twin Floating Badge Indicator */}
      <group position={[0, 4.4, 0]}>
        <mesh>
          <boxGeometry args={[3.2, 0.45, 0.06]} />
          <meshStandardMaterial 
            color="#0b121d" 
            emissive="#76b900" 
            emissiveIntensity={0.3} 
            transparent 
            opacity={0.85} 
          />
        </mesh>
      </group>
    </group>
  );
};
