import React from 'react';
import { Text } from '@react-three/drei';
import { useSimulation } from '../../state/useSimulationStore';

interface PigPensProps {
  onSelectPen: (penId: number) => void;
}

export const PigPens: React.FC<PigPensProps> = ({ onSelectPen }) => {
  const store = useSimulation();

  // Pens configuration: 4 quadrants around central walkway
  const pens = [
    { id: 1, name: 'PEN 01 (N-WEST)', center: [-5.0, 0, 3.2], bounds: [-9.5, -0.9, 0.4, 6.4] },
    { id: 2, name: 'PEN 02 (S-WEST)', center: [-5.0, 0, -3.2], bounds: [-9.5, -0.9, -6.4, -0.4] },
    { id: 3, name: 'PEN 03 (N-EAST)', center: [5.0, 0, 3.2], bounds: [0.9, 9.5, 0.4, 6.4] },
    { id: 4, name: 'PEN 04 (S-EAST)', center: [5.0, 0, -3.2], bounds: [0.9, 9.5, -6.4, -0.4] },
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
              isHorizontal ? start[2] : start[2] + length / 2
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
              isHorizontal ? start[2] : start[2] + i * postSpacing
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
        const isSelected = store.selectedObject?.type === 'PEN' && store.selectedObject.id === `pen-${pen.id}`;

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

            {/* Stainless Steel Feeding Trough */}
            <group position={[pen.center[0] - 1.8, 0, pen.center[2] + (pen.id <= 2 ? 2.3 : -2.3)]}>
              <mesh position={[0, 0.22, 0]} castShadow>
                <boxGeometry args={[1.6, 0.4, 0.5]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Pellet Feed Inside */}
              <mesh position={[0, 0.32, 0]}>
                <boxGeometry args={[1.4, 0.1, 0.35]} />
                <meshStandardMaterial color="#b45309" roughness={0.9} />
              </mesh>
            </group>

            {/* Automatic Water Dispenser / Nipple Bar */}
            <group position={[pen.center[0] + 2.2, 0, pen.center[2] + (pen.id <= 2 ? 2.3 : -2.3)]}>
              <mesh position={[0, 0.45, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0.3, 0.15]} rotation={[Math.PI / 4, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
                <meshStandardMaterial color="#e2e8f0" metalness={1.0} />
              </mesh>
            </group>

            {/* Pen Floating Label */}
            <group position={[pen.center[0], 1.6, pen.center[2]]}>
              <mesh>
                <boxGeometry args={[1.6, 0.35, 0.02]} />
                <meshBasicMaterial color="#0b121d" transparent opacity={0.7} />
              </mesh>
              <Text
                position={[0, 0, 0.02]}
                fontSize={0.16}
                color={isSelected ? "#76b900" : "#94a3b8"}
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
