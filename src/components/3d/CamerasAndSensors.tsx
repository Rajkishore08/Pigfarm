import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulation } from '../../state/useSimulationStore';
import type { CameraData, SensorData } from '../../types';

interface CamerasAndSensorsProps {
  cameras: CameraData[];
  sensors: SensorData[];
  showCameras: boolean;
  showSensors: boolean;
  onSelectCamera: (cam: CameraData) => void;
  onSelectSensor: (sensor: SensorData) => void;
  selectedId?: string;
}

export const CamerasAndSensors: React.FC<CamerasAndSensorsProps> = ({
  cameras,
  sensors,
  showCameras,
  showSensors,
  onSelectCamera,
  onSelectSensor,
  selectedId,
}) => {
  const store = useSimulation();
  const pulseRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pulseRef.current) {
      pulseRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshBasicMaterial;
          const phase = (t * 2 + i * 0.8) % 2;
          mesh.scale.set(1 + phase * 0.6, 1 + phase * 0.6, 1 + phase * 0.6);
          mat.opacity = Math.max(0, 0.7 - phase * 0.35);
        }
      });
    }
  });

  return (
    <group name="CamerasAndSensors">
      {/* OVERHEAD AI CAMERAS */}
      {showCameras &&
        cameras.map((cam) => {
          // If we are looking through Camera 01 in Camera Feed Mode, hide its own 3D model
          if (store.cameraFeedMode && cam.id === 'cam-01') return null;

          const isSelected = selectedId === cam.id;

          return (
            <group
              key={cam.id}
              position={cam.position}
              onClick={(e) => {
                e.stopPropagation();
                onSelectCamera(cam);
              }}
            >
              {/* Ceiling Mounting Arm */}
              <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
                <meshStandardMaterial color="#475569" metalness={0.9} />
              </mesh>

              {/* PTZ Dome Body */}
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
              </mesh>

              {/* Camera Lens Housing */}
              <mesh position={[0, -0.1, 0.05]} rotation={[Math.PI / 4, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.09, 0.15, 16]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
              </mesh>

              {/* Status LED */}
              <mesh position={[0.12, -0.05, 0.1]}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshBasicMaterial color={cam.active ? '#00e5ff' : '#64748b'} />
              </mesh>

              {/* Semi-transparent AI Vision Frustum / Scan Cone */}
              <mesh position={[0, -1.8, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.15, 2.4, 3.6, 16, 1, true]} />
                <meshBasicMaterial
                  color="#00e5ff"
                  transparent
                  opacity={isSelected ? 0.22 : 0.08}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                />
              </mesh>

              {/* Ground Footprint Ring */}
              <mesh position={[0, -3.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[2.3, 2.4, 32]} />
                <meshBasicMaterial color="#00e5ff" transparent opacity={0.3} />
              </mesh>

              {/* Label */}
              <group position={[0, 0.35, 0]}>
                <mesh>
                  <boxGeometry args={[1.3, 0.25, 0.02]} />
                  <meshBasicMaterial color="#0a0f17" transparent opacity={0.85} />
                </mesh>
                <Text
                  position={[0, 0, 0.02]}
                  fontSize={0.1}
                  color={isSelected ? '#76b900' : '#38bdf8'}
                  anchorX="center"
                  anchorY="middle"
                >
                  {`AI CAM • ${cam.edgeLatencyMs}ms`}
                </Text>
              </group>
            </group>
          );
        })}

      {/* IOT SENSORS */}
      {showSensors &&
        sensors.map((sensor) => {
          const isSelected = selectedId === sensor.id;
          const statusColor =
            sensor.status === 'ALERT'
              ? '#ef4444'
              : sensor.status === 'WARNING'
              ? '#f59e0b'
              : '#22c55e';

          return (
            <group
              key={sensor.id}
              position={sensor.position}
              onClick={(e) => {
                e.stopPropagation();
                onSelectSensor(sensor);
              }}
            >
              {/* Sensor Enclosure Box */}
              <mesh castShadow>
                <boxGeometry args={[0.28, 0.38, 0.16]} />
                <meshStandardMaterial
                  color="#1e293b"
                  roughness={0.4}
                  metalness={0.7}
                  emissive={isSelected ? '#76b900' : '#000000'}
                  emissiveIntensity={isSelected ? 0.3 : 0}
                />
              </mesh>

              {/* Sensor Probe / Antenna */}
              <mesh position={[0, 0.28, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} />
              </mesh>

              {/* Status Indicator LED */}
              <mesh position={[0, 0.1, 0.09]}>
                <circleGeometry args={[0.035, 12]} />
                <meshBasicMaterial color={statusColor} />
              </mesh>

              {/* Animated Pulse Ring */}
              <group ref={pulseRef} position={[0, 0, 0.1]}>
                <mesh>
                  <ringGeometry args={[0.18, 0.22, 16]} />
                  <meshBasicMaterial color={statusColor} transparent opacity={0.6} />
                </mesh>
              </group>

              {/* Floating Sensor Data Badge */}
              <group position={[0, 0.45, 0]}>
                <mesh>
                  <boxGeometry args={[1.6, 0.3, 0.02]} />
                  <meshBasicMaterial color="#0b111a" transparent opacity={0.88} />
                </mesh>
                <Text
                  position={[0, 0.04, 0.02]}
                  fontSize={0.09}
                  color="#f8fafc"
                  anchorX="center"
                  anchorY="middle"
                >
                  {sensor.name.split(' - ')[0]}
                </Text>
                <Text
                  position={[0, -0.06, 0.02]}
                  fontSize={0.075}
                  color="#94a3b8"
                  anchorX="center"
                  anchorY="middle"
                >
                  {`${sensor.temperature}°C • ${sensor.humidity}% RH • ${sensor.ammonia}ppm`}
                </Text>
              </group>
            </group>
          );
        })}
    </group>
  );
};
