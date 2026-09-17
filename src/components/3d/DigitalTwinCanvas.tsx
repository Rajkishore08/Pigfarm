import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { BarnStructure } from './BarnStructure';
import { PigPens } from './PigPens';
import { ProceduralPig } from './ProceduralPig';
import { CamerasAndSensors } from './CamerasAndSensors';
import { JetsonNode3D } from './JetsonNode3D';
import { DataFlowParticles } from './DataFlowParticles';
import { CameraDirector } from './CameraDirector';
import { useSimulation } from '../../state/useSimulationStore';
import type { PigData, CameraData, SensorData } from '../../types';

export const DigitalTwinCanvas: React.FC = () => {
  const store = useSimulation();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const handleSelectPig = (pig: PigData) => {
    store.setSelectedObject({
      type: 'PIG',
      id: pig.id,
      data: pig,
    });
  };

  const handleSelectCamera = (cam: CameraData) => {
    store.setSelectedObject({
      type: 'CAMERA',
      id: cam.id,
      data: cam,
    });
  };

  const handleSelectSensor = (sensor: SensorData) => {
    store.setSelectedObject({
      type: 'SENSOR',
      id: sensor.id,
      data: sensor,
    });
  };

  const handleSelectPen = (penId: number) => {
    store.setSelectedObject({
      type: 'PEN',
      id: `pen-${penId}`,
      data: { penId },
    });
  };

  const handleSelectJetson = () => {
    store.setSelectedObject({
      type: 'JETSON',
      id: 'jetson-orin-01',
      data: {
        model: 'NVIDIA Jetson AGX Orin 64GB',
        inferenceLatency: '28ms',
        fps: 32,
        precision: 'TensorRT FP16',
      },
    });
  };

  return (
    <div className="relative w-full h-full bg-dark-950 overflow-hidden select-none">
      <Canvas
        shadows
        camera={{ position: [0, 14, 18], fov: 45, near: 0.1, far: 1000 }}
        className="w-full h-full"
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#070a0f', 1);
        }}
      >
        <CameraDirector controlsRef={controlsRef} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.6 * (store.environmental.lighting / 100)} />

        <directionalLight
          position={[10, 20, 15]}
          intensity={1.4 * (store.environmental.lighting / 100)}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <directionalLight
          position={[-10, 12, -10]}
          intensity={0.5 * (store.environmental.lighting / 100)}
          color="#38bdf8"
        />

        {/* Unconditional Barn Structure & Grid */}
        <BarnStructure
          showGeometry={store.showGeometry}
          lightingIntensity={store.environmental.lighting}
        />

        {/* Modular Suspense for Interactive 3D Assets */}
        <Suspense fallback={null}>
          <PigPens onSelectPen={handleSelectPen} />
        </Suspense>

        <Suspense fallback={null}>
          {store.pigs.map((pig) => (
            <ProceduralPig
              key={pig.id}
              pig={pig}
              isSelected={store.selectedObject?.type === 'PIG' && store.selectedObject.id === pig.id}
              showBehavior={store.showBehavior}
              showBoundingBoxes={store.showBoundingBoxes}
              showSegmentationMasks={store.showSegmentationMasks}
              onSelect={handleSelectPig}
            />
          ))}
        </Suspense>

        <Suspense fallback={null}>
          <CamerasAndSensors
            cameras={store.cameras}
            sensors={store.sensors}
            showCameras={store.showCameras}
            showSensors={store.showSensors}
            onSelectCamera={handleSelectCamera}
            onSelectSensor={handleSelectSensor}
            selectedId={store.selectedObject?.id}
          />
        </Suspense>

        <Suspense fallback={null}>
          <JetsonNode3D
            isSelected={store.selectedObject?.type === 'JETSON'}
            onSelect={handleSelectJetson}
          />
        </Suspense>

        <Suspense fallback={null}>
          <DataFlowParticles showDataFlow={store.showDataFlow} />
        </Suspense>

        {/* Interactive Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={3}
          maxDistance={35}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
      </Canvas>

      {/* 3D Viewport Corner Badges */}
      <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1 z-10">
        <div className="flex items-center gap-2 bg-dark-900/80 backdrop-blur-md px-3 py-1.5 rounded border border-nvidia/30">
          <span className="w-2 h-2 rounded-full bg-nvidia animate-pulse" />
          <span className="text-xs font-mono font-semibold tracking-wider text-nvidia">
            USD DIGITAL TWIN VIEWPORT
          </span>
          <span className="text-[10px] text-slate-400 border-l border-slate-700 pl-2">
            NVIDIA OMNIVERSE CONCEPT
          </span>
        </div>
      </div>
    </div>
  );
};
