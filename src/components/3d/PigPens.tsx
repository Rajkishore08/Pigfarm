import React from 'react';
import { Text } from '@react-three/drei';
import { useSimulation } from '../../state/useSimulationStore';

interface PigPensProps {
  onSelectPen: (penId: number) => void;
}

// Detailed Automatic Feed Hopper & Trough
const FeedStation: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0,
}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* Base Mounting Frame */}
    <mesh position={[0, 0.05, 0]}>
      <boxGeometry args={[1.5, 0.1, 0.6]} />
      <meshStandardMaterial color="#334155" metalness={0.8} />
    </mesh>

    {/* Stainless Steel Feed Trough */}
    <mesh position={[0, 0.22, 0]} castShadow>
      <boxGeometry args={[1.4, 0.32, 0.5]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
    </mesh>

    {/* Golden Feed Pellets inside trough */}
    <mesh position={[0, 0.32, 0]}>
      <boxGeometry args={[1.32, 0.08, 0.42]} />
      <meshStandardMaterial color="#b45309" roughness={0.9} />
    </mesh>

    {/* Vertical Trough Dividing Grates */}
    {[-0.45, -0.15, 0.15, 0.45].map((x, i) => (
      <mesh key={`grate-${i}`} position={[x, 0.3, 0]}>
        <boxGeometry args={[0.02, 0.2, 0.48]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
      </mesh>
    ))}

    {/* Overhead Automatic Hopper Storage Box */}
    <mesh position={[0, 0.75, 0]} castShadow>
      <boxGeometry args={[1.3, 0.65, 0.45]} />
      <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} />
    </mesh>

    {/* Feed Drop Chute Pipe */}
    <mesh position={[0, 0.45, 0]}>
      <cylinderGeometry args={[0.06, 0.06, 0.25, 12]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.9} />
    </mesh>

    {/* Feed Station Label Badge */}
    <group position={[0, 1.15, 0]}>
      <mesh>
        <boxGeometry args={[1.25, 0.22, 0.02]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.88} />
      </mesh>
      <Text position={[0, 0, 0.02]} fontSize={0.085} color="#f59e0b" anchorX="center" anchorY="middle">
        FEED TROUGH • PELLETS
      </Text>
    </group>
  </group>
);

// Detailed Stainless Steel Drinker Aqua-Bowl & Nipple Bar
const WaterStation: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0,
}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* Wall Splash Guard Plate */}
    <mesh position={[0, 0.45, 0.22]}>
      <boxGeometry args={[0.9, 0.8, 0.03]} />
      <meshStandardMaterial color="#475569" metalness={0.8} />
    </mesh>

    {/* Stainless Steel Water Bowls with fresh blue water */}
    {[-0.22, 0.22].map((x, i) => (
      <group key={`bowl-${i}`} position={[x, 0.25, 0]}>
        {/* Bowl Rim & Body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.14, 0.2, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.15} />
        </mesh>
        {/* Clear Glowing Water Surface */}
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.16, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            roughness={0.05}
            metalness={0.1}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>
    ))}

    {/* Overhead Water Supply Riser Pipe */}
    <mesh position={[0, 0.7, 0.18]}>
      <cylinderGeometry args={[0.025, 0.025, 0.9, 12]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
    </mesh>

    {/* Brass Nipple Dispensers angled down into bowls */}
    {[-0.22, 0.22].map((x, i) => (
      <mesh key={`nipple-${i}`} position={[x, 0.4, 0.08]} rotation={[Math.PI / 3, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.018, 0.12, 10]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
      </mesh>
    ))}

    {/* Water Station Label Badge */}
    <group position={[0, 1.05, 0.18]}>
      <mesh>
        <boxGeometry args={[1.25, 0.22, 0.02]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.88} />
      </mesh>
      <Text position={[0, 0, 0.02]} fontSize={0.085} color="#38bdf8" anchorX="center" anchorY="middle">
        WATER BOWL • FRESH FLOW
      </Text>
    </group>
  </group>
);

export const PigPens: React.FC<PigPensProps> = ({ onSelectPen }) => {
  const store = useSimulation();

  // Pens configuration: 4 quadrants around central walkway
  const pens = [
    {
      id: 1,
      name: 'PEN 01 (N-WEST)',
      center: [-5.0, 0, 3.2],
      feedPos: [-6.2, 0, 4.8] as [number, number, number],
      feedRot: 0,
      waterPos: [-3.6, 0, 4.8] as [number, number, number],
      waterRot: 0,
    },
    {
      id: 2,
      name: 'PEN 02 (S-WEST)',
      center: [-5.0, 0, -3.2],
      feedPos: [-6.2, 0, -4.8] as [number, number, number],
      feedRot: Math.PI,
      waterPos: [-3.6, 0, -4.8] as [number, number, number],
      waterRot: Math.PI,
    },
    {
      id: 3,
      name: 'PEN 03 (N-EAST)',
      center: [5.0, 0, 3.2],
      feedPos: [3.6, 0, 4.8] as [number, number, number],
      feedRot: 0,
      waterPos: [6.2, 0, 4.8] as [number, number, number],
      waterRot: 0,
    },
    {
      id: 4,
      name: 'PEN 04 (S-EAST)',
      center: [5.0, 0, -3.2],
      feedPos: [3.6, 0, -4.8] as [number, number, number],
      feedRot: Math.PI,
      waterPos: [6.2, 0, -4.8] as [number, number, number],
      waterRot: Math.PI,
    },
  ];

  // Helper to render galvanized steel railing section
  const renderRailing = (
    start: [number, number, number],
    length: number,
    isHorizontal: boolean
  ) => {
    const postCount = Math.max(3, Math.floor(length / 1.5) + 1);
    const postSpacing = length / (postCount - 1);

    return (
      <group>
        {/* Horizontal top, mid, and bottom bars */}
        {[0.3, 0.65, 1.0].map((h, idx) => (
          <mesh
            key={`bar-${idx}`}
            position={[
              isHorizontal ? start[0] + length / 2 : start[0],
              h,
              isHorizontal ? start[2] : start[2] + length / 2,
            ]}
            rotation={[0, isHorizontal ? 0 : Math.PI / 2, 0]}
          >
            <boxGeometry args={[length, 0.04, 0.04]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}

        {/* Vertical posts */}
        {Array.from({ length: postCount }).map((_, i) => (
          <mesh
            key={`post-${i}`}
            position={[
              isHorizontal ? start[0] + i * postSpacing : start[0],
              0.55,
              isHorizontal ? start[2] : start[2] + i * postSpacing,
            ]}
          >
            <cylinderGeometry args={[0.03, 0.03, 1.1, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
          </mesh>
        ))}
      </group>
    );
  };

  return (
    <group name="PigPens">
      {pens.map((pen) => {
        const isSelected =
          store.selectedObject?.type === 'PEN' && store.selectedObject.id === `pen-${pen.id}`;

        return (
          <group
            key={`pen-${pen.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPen(pen.id);
            }}
          >
            {/* Pen Floor Sub-highlight when selected */}
            {isSelected && (
              <mesh position={[pen.center[0], 0.02, pen.center[2]]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[8.0, 5.5]} />
                <meshBasicMaterial color="#76b900" transparent opacity={0.12} />
              </mesh>
            )}

            {/* Inner Aisle Railing */}
            {pen.id === 1 && renderRailing([-9.5, 0, 0.6], 8.5, true)}
            {pen.id === 2 && renderRailing([-9.5, 0, -0.6], 8.5, true)}
            {pen.id === 3 && renderRailing([1.0, 0, 0.6], 8.5, true)}
            {pen.id === 4 && renderRailing([1.0, 0, -0.6], 8.5, true)}

            {/* Central Divider Divider Railing between front and back */}
            {pen.id === 1 && renderRailing([-0.9, 0, 0.6], 5.8, false)}
            {pen.id === 2 && renderRailing([-0.9, 0, -6.4], 5.8, false)}
            {pen.id === 3 && renderRailing([0.9, 0, 0.6], 5.8, false)}
            {pen.id === 4 && renderRailing([0.9, 0, -6.4], 5.8, false)}

            {/* Dedicated Stainless Steel Feeding Hopper & Pellet Trough */}
            <FeedStation position={pen.feedPos} rotationY={pen.feedRot} />

            {/* Dedicated Water Aqua-Bowls & Nipple Bar */}
            <WaterStation position={pen.waterPos} rotationY={pen.waterRot} />

            {/* Pen Floating Label */}
            <group position={[pen.center[0], 1.6, pen.center[2]]}>
              <mesh>
                <boxGeometry args={[1.6, 0.35, 0.02]} />
                <meshBasicMaterial color="#0b121d" transparent opacity={0.7} />
              </mesh>
              <Text
                position={[0, 0, 0.02]}
                fontSize={0.16}
                color={isSelected ? '#76b900' : '#94a3b8'}
                anchorX="center"
                anchorY="middle"
              >
                {pen.name}
              </Text>
            </group>
          </group>
        );
      })}
    </group>
  );
};
