import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useSimulation } from '../../state/useSimulationStore';

interface CameraDirectorProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

export const CameraDirector: React.FC<CameraDirectorProps> = ({ controlsRef }) => {
  const { camera } = useThree();
  const store = useSimulation();

  const targetPos = useRef(new THREE.Vector3(0, 14, 18));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimating = useRef(false);

  // Attach event listener so that whenever user touches or drags the controls,
  // we immediately release programmatic camera control!
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleStart = () => {
      isAnimating.current = false;
    };

    controls.addEventListener('start', handleStart);
    return () => {
      controls.removeEventListener('start', handleStart);
    };
  }, [controlsRef]);

  // Update target coordinates when selection or state changes
  useEffect(() => {
    isAnimating.current = true;

    if (store.explainerActive) {
      switch (store.explainerStep) {
        case 1: // DIGITAL TWIN: Overview of barn
          targetPos.current.set(0, 15, 17);
          targetLook.current.set(0, 0, 0);
          break;
        case 2: // DATA & BEHAVIOR: Focus on Pig Pen 1
          targetPos.current.set(-4.2, 4.0, 6.0);
          targetLook.current.set(-4.2, 0.5, 2.2);
          break;
        case 3: // COSMOS: High angle training overview
          targetPos.current.set(-6.0, 8.0, 8.0);
          targetLook.current.set(-2.0, 1.0, 0);
          break;
        case 4: // TRAINING PIPELINE: High angle view
          targetPos.current.set(0, 12, 14);
          targetLook.current.set(0, 1, 0);
          break;
        case 5: // JETSON EDGE NODE: Close-up on Edge compute rack
          targetPos.current.set(9.2, 2.5, 8.0);
          targetLook.current.set(8.8, 1.2, 5.5);
          break;
        case 6: // DETECTION: Zoom into Pig 024
          targetPos.current.set(-3.6, 2.2, 4.2);
          targetLook.current.set(-4.2, 0.45, 2.2);
          break;
        case 7: // ALERT: Slightly elevated drama shot on Pig 024
          targetPos.current.set(-3.2, 2.8, 4.8);
          targetLook.current.set(-4.2, 0.45, 2.2);
          break;
      }
      return;
    }

    if (store.cameraFeedMode) {
      // Perspective matching overhead Camera 01 looking down at Pen 1
      targetPos.current.set(-4.5, 4.8, 2.6);
      targetLook.current.set(-4.5, 0.2, 2.2);
      return;
    }

    if (store.selectedObject) {
      switch (store.selectedObject.type) {
        case 'PIG': {
          const pig = store.pigs.find((p) => p.id === store.selectedObject?.id);
          if (pig) {
            targetPos.current.set(pig.position[0] + 1.8, 2.2, pig.position[2] + 2.8);
            targetLook.current.set(pig.position[0], 0.5, pig.position[2]);
          }
          break;
        }
        case 'JETSON':
          targetPos.current.set(9.5, 2.4, 7.8);
          targetLook.current.set(8.8, 1.2, 5.5);
          break;
        case 'CAMERA': {
          const cam = store.cameras.find((c) => c.id === store.selectedObject?.id);
          if (cam) {
            targetPos.current.set(cam.position[0] + 1.5, cam.position[1] + 1.2, cam.position[2] + 2.0);
            targetLook.current.set(cam.position[0], cam.position[1] - 1.0, cam.position[2]);
          }
          break;
        }
        case 'SENSOR': {
          const sensor = store.sensors.find((s) => s.id === store.selectedObject?.id);
          if (sensor) {
            targetPos.current.set(sensor.position[0], sensor.position[1] + 1.0, sensor.position[2] + 2.5);
            targetLook.current.set(sensor.position[0], sensor.position[1], sensor.position[2]);
          }
          break;
        }
        case 'PEN':
          if (store.selectedObject.id === 'pen-1') {
            targetPos.current.set(-5.0, 7.0, 8.0);
            targetLook.current.set(-5.0, 0, 3.2);
          } else if (store.selectedObject.id === 'pen-2') {
            targetPos.current.set(-5.0, 7.0, -8.0);
            targetLook.current.set(-5.0, 0, -3.2);
          } else if (store.selectedObject.id === 'pen-3') {
            targetPos.current.set(5.0, 7.0, 8.0);
            targetLook.current.set(5.0, 0, 3.2);
          } else {
            targetPos.current.set(5.0, 7.0, -8.0);
            targetLook.current.set(5.0, 0, -3.2);
          }
          break;
        case 'BARN':
        default:
          targetPos.current.set(0, 14, 18);
          targetLook.current.set(0, 0, 0);
          break;
      }
    }
  }, [
    store.selectedObject,
    store.explainerActive,
    store.explainerStep,
    store.cameraFeedMode,
    store.pigs,
    store.cameras,
    store.sensors,
  ]);

  // Smooth lerp ONLY when an automated animation is active
  useFrame(() => {
    if (!isAnimating.current) return;

    camera.position.lerp(targetPos.current, 0.06);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook.current, 0.08);
      controlsRef.current.update();
    }

    // Stop animating once close enough so user has 100% free manual orbit!
    const distCam = camera.position.distanceTo(targetPos.current);
    const distTarget = controlsRef.current 
      ? controlsRef.current.target.distanceTo(targetLook.current)
      : 0;

    if (distCam < 0.08 && distTarget < 0.08) {
      isAnimating.current = false;
    }
  });

  return null;
};
