import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DataFlowParticlesProps {
  showDataFlow: boolean;
}

interface StreamConfig {
  id: string;
  name: string;
  type: 'STRUCTURED' | 'SYNTHETIC' | 'ANNOTATION' | 'SENSOR' | 'PREDICTION';
  color: string;
  curve: THREE.CatmullRomCurve3;
  particleCount: number;
}

export const DataFlowParticles: React.FC<DataFlowParticlesProps> = ({ showDataFlow }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Define key Bézier paths across the barn environment
  const streams: StreamConfig[] = useMemo(() => {
    return [
      // 1. Digital Twin Barn -> AI Training Pipeline (Structured Geometry)
      {
        id: 'stream-geom',
        name: 'Structured 3D Geometry',
        type: 'STRUCTURED',
        color: '#00e5ff',
        particleCount: 14,
        curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(-4.5, 0.8, 2.5),
          new THREE.Vector3(-3.0, 3.2, 1.2),
          new THREE.Vector3(0.0, 4.0, 0.0),
          new THREE.Vector3(3.5, 3.8, -2.0),
          new THREE.Vector3(7.0, 2.8, -4.5),
        ]),
      },
      // 2. Camera 01 Live Video -> Jetson Edge Node (Live Video Feed)
      {
        id: 'stream-cam',
        name: 'Live 4K Edge Video',
        type: 'SENSOR',
        color: '#76b900',
        particleCount: 18,
        curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(-4.5, 4.2, 2.5),
          new THREE.Vector3(-1.0, 4.6, 3.8),
          new THREE.Vector3(4.0, 4.2, 4.8),
          new THREE.Vector3(8.5, 2.0, 5.5),
          new THREE.Vector3(8.8, 1.2, 5.5),
        ]),
      },
      // 3. IoT Sensors -> Digital Twin Data Bus (Telemetry)
      {
        id: 'stream-sensors',
        name: 'Environmental IoT Telemetry',
        type: 'SENSOR',
        color: '#22c55e',
        particleCount: 12,
        curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(-4.5, 2.6, 4.2),
          new THREE.Vector3(-2.0, 3.2, 3.0),
          new THREE.Vector3(1.0, 3.4, 2.5),
          new THREE.Vector3(5.5, 2.8, 3.8),
          new THREE.Vector3(8.8, 1.3, 5.4),
        ]),
      },
      // 4. Jetson Edge Node -> Pig 024 Alert / Detection (AI Inference Bounding Pulse)
      {
        id: 'stream-alert',
        name: 'AI Anomaly & Risk Pulse',
        type: 'PREDICTION',
        color: '#ef4444',
        particleCount: 15,
        curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(8.8, 1.4, 5.5),
          new THREE.Vector3(4.0, 2.8, 3.5),
          new THREE.Vector3(0.0, 2.5, 3.0),
          new THREE.Vector3(-2.5, 1.8, 2.5),
          new THREE.Vector3(-4.2, 0.8, 2.2),
        ]),
      },
      // 5. Cosmos Synthetic Generator -> AI Training Pipeline (Synthetic Rare Cases)
      {
        id: 'stream-cosmos',
        name: 'NVIDIA Cosmos Synthetic Data',
        type: 'SYNTHETIC',
        color: '#a855f7',
        particleCount: 16,
        curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(-7.5, 3.5, -4.5),
          new THREE.Vector3(-4.0, 4.5, -3.5),
          new THREE.Vector3(0.0, 4.2, -2.5),
          new THREE.Vector3(4.0, 3.5, -3.5),
          new THREE.Vector3(7.0, 2.8, -4.5),
        ]),
      },
    ];
  }, []);

  // Pre-generate line meshes
  const lines = useMemo(() => {
    return streams.map((s) => {
      const points = s.curve.getPoints(50);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: s.color,
        transparent: true,
        opacity: 0.25,
      });
      return new THREE.Line(geom, mat);
    });
  }, [streams]);

  // Particle instances per stream
  useFrame((state) => {
    if (!showDataFlow || !groupRef.current) return;
    const t = state.clock.getElapsedTime();

    streams.forEach((stream, streamIdx) => {
      const streamGroup = groupRef.current?.children[streamIdx] as THREE.Group;
      if (!streamGroup) return;

      const particlesGroup = streamGroup.children[1] as THREE.Group;
      if (!particlesGroup) return;

      particlesGroup.children.forEach((pMesh, pIdx) => {
        // Offset each particle along the curve normalized 0..1
        const speed = stream.type === 'PREDICTION' ? 0.35 : 0.22;
        const progress = ((t * speed + pIdx / stream.particleCount) % 1.0);
        const pt = stream.curve.getPointAt(progress);
        pMesh.position.copy(pt);
      });
    });
  });

  if (!showDataFlow) return null;

  return (
    <group ref={groupRef} name="DataFlowParticles">
      {streams.map((stream, idx) => (
        <group key={stream.id}>
          {/* Subtle glowing guide line */}
          <primitive object={lines[idx]} />

          {/* Glowing particle meshes traveling along the path */}
          <group>
            {Array.from({ length: stream.particleCount }).map((_, pIdx) => (
              <mesh key={`p-${pIdx}`}>
                <sphereGeometry args={[0.065, 8, 8]} />
                <meshBasicMaterial 
                  color={stream.color} 
                  transparent 
                  opacity={0.85} 
                />
              </mesh>
            ))}
          </group>
        </group>
      ))}
    </group>
  );
};
