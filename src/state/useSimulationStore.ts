import { useState, useEffect } from 'react';
import type { 
  PipelineStage, 
  PigData, 
  SensorData, 
  CameraData, 
  ScenarioType, 
  EnvironmentalConditions, 
  SyntheticDatasetStats, 
  TrainingMetrics,
  BehaviorState
} from '../types';

export const INITIAL_PIGS: PigData[] = [
  // Pen 1 (Left Front)
  {
    id: 'pig-024',
    penId: 1,
    tagNumber: 'TAG-024',
    position: [-4.2, 0.45, 2.2],
    rotation: 0.3,
    behavior: 'NORMAL',
    temperature: 38.7,
    activityScore: 82,
    feedIntakeRate: 2.4,
    waterIntakeRate: 7.2,
    healthRisk: 'LOW',
    aiConfidence: 96,
    anomalyDetected: false,
    history: [
      { time: '08:00', activity: 88, temp: 38.6 },
      { time: '10:00', activity: 85, temp: 38.7 },
      { time: '12:00', activity: 82, temp: 38.7 },
    ]
  },
  {
    id: 'pig-011',
    penId: 1,
    tagNumber: 'TAG-011',
    position: [-6.0, 0.45, 1.5],
    rotation: 1.2,
    behavior: 'EATING',
    temperature: 38.5,
    activityScore: 78,
    feedIntakeRate: 2.6,
    waterIntakeRate: 7.8,
    healthRisk: 'LOW',
    aiConfidence: 97,
    anomalyDetected: false,
    history: []
  },
  {
    id: 'pig-015',
    penId: 1,
    tagNumber: 'TAG-015',
    position: [-3.2, 0.45, 3.5],
    rotation: -0.8,
    behavior: 'WALKING',
    temperature: 38.6,
    activityScore: 91,
    feedIntakeRate: 2.5,
    waterIntakeRate: 7.0,
    healthRisk: 'LOW',
    aiConfidence: 95,
    anomalyDetected: false,
    history: []
  },

  // Pen 2 (Left Back)
  {
    id: 'pig-033',
    penId: 2,
    tagNumber: 'TAG-033',
    position: [-5.0, 0.45, -2.5],
    rotation: 2.1,
    behavior: 'RESTING',
    temperature: 38.8,
    activityScore: 65,
    feedIntakeRate: 2.2,
    waterIntakeRate: 6.9,
    healthRisk: 'LOW',
    aiConfidence: 98,
    anomalyDetected: false,
    history: []
  },
  {
    id: 'pig-038',
    penId: 2,
    tagNumber: 'TAG-038',
    position: [-3.0, 0.45, -3.2],
    rotation: -1.5,
    behavior: 'EATING',
    temperature: 38.6,
    activityScore: 74,
    feedIntakeRate: 2.7,
    waterIntakeRate: 8.0,
    healthRisk: 'LOW',
    aiConfidence: 94,
    anomalyDetected: false,
    history: []
  },

  // Pen 3 (Right Front)
  {
    id: 'pig-042',
    penId: 3,
    tagNumber: 'TAG-042',
    position: [3.5, 0.45, 2.8],
    rotation: -0.4,
    behavior: 'WALKING',
    temperature: 38.5,
    activityScore: 89,
    feedIntakeRate: 2.6,
    waterIntakeRate: 7.5,
    healthRisk: 'LOW',
    aiConfidence: 97,
    anomalyDetected: false,
    history: []
  },
  {
    id: 'pig-049',
    penId: 3,
    tagNumber: 'TAG-049',
    position: [5.2, 0.45, 1.8],
    rotation: 0.9,
    behavior: 'RESTING',
    temperature: 38.6,
    activityScore: 70,
    feedIntakeRate: 2.3,
    waterIntakeRate: 6.8,
    healthRisk: 'LOW',
    aiConfidence: 96,
    anomalyDetected: false,
    history: []
  },

  // Pen 4 (Right Back)
  {
    id: 'pig-057',
    penId: 4,
    tagNumber: 'TAG-057',
    position: [4.2, 0.45, -2.8],
    rotation: 1.8,
    behavior: 'EATING',
    temperature: 38.7,
    activityScore: 83,
    feedIntakeRate: 2.5,
    waterIntakeRate: 7.4,
    healthRisk: 'LOW',
    aiConfidence: 98,
    anomalyDetected: false,
    history: []
  },
  {
    id: 'pig-062',
    penId: 4,
    tagNumber: 'TAG-062',
    position: [6.0, 0.45, -1.8],
    rotation: -2.3,
    behavior: 'WALKING',
    temperature: 38.6,
    activityScore: 88,
    feedIntakeRate: 2.4,
    waterIntakeRate: 7.1,
    healthRisk: 'LOW',
    aiConfidence: 95,
    anomalyDetected: false,
    history: []
  },
];

export const INITIAL_SENSORS: SensorData[] = [
  {
    id: 'sensor-01',
    penId: 1,
    name: 'IoT Node #01 - North Bay',
    type: 'ENVIRONMENTAL',
    position: [-4.5, 2.6, 4.2],
    temperature: 24.2,
    humidity: 62.4,
    ammonia: 8.5,
    airQualityIndex: 92,
    status: 'OPTIMAL'
  },
  {
    id: 'sensor-02',
    penId: 2,
    name: 'IoT Node #02 - West Bay',
    type: 'ENVIRONMENTAL',
    position: [-4.5, 2.6, -4.2],
    temperature: 24.0,
    humidity: 63.1,
    ammonia: 9.1,
    airQualityIndex: 90,
    status: 'OPTIMAL'
  },
  {
    id: 'sensor-03',
    penId: 3,
    name: 'IoT Node #03 - East Bay',
    type: 'ENVIRONMENTAL',
    position: [4.5, 2.6, 4.2],
    temperature: 24.5,
    humidity: 61.8,
    ammonia: 7.9,
    airQualityIndex: 94,
    status: 'OPTIMAL'
  },
  {
    id: 'sensor-04',
    penId: 4,
    name: 'IoT Node #04 - South Bay',
    type: 'ENVIRONMENTAL',
    position: [4.5, 2.6, -4.2],
    temperature: 24.3,
    humidity: 62.9,
    ammonia: 8.8,
    airQualityIndex: 91,
    status: 'OPTIMAL'
  },
  {
    id: 'sensor-07',
    penId: 1,
    name: 'Motion & Cough Monitor #07',
    type: 'MOTION',
    position: [-1.2, 2.8, 1.0],
    temperature: 24.1,
    humidity: 62.5,
    ammonia: 8.2,
    airQualityIndex: 93,
    status: 'OPTIMAL'
  }
];

export const INITIAL_CAMERAS: CameraData[] = [
  {
    id: 'cam-01',
    name: 'Overhead 4K AI Cam #01',
    penId: 1,
    position: [-4.5, 4.2, 2.5],
    target: [-4.5, 0, 2.5],
    fov: 65,
    resolution: '3840x2160 @ 60fps',
    fps: 30,
    active: true,
    edgeLatencyMs: 28
  },
  {
    id: 'cam-02',
    name: 'Overhead 4K AI Cam #02',
    penId: 2,
    position: [-4.5, 4.2, -2.5],
    target: [-4.5, 0, -2.5],
    fov: 65,
    resolution: '3840x2160 @ 60fps',
    fps: 30,
    active: true,
    edgeLatencyMs: 27
  },
  {
    id: 'cam-03',
    name: 'Overhead 4K AI Cam #03',
    penId: 3,
    position: [4.5, 4.2, 2.5],
    target: [4.5, 0, 2.5],
    fov: 65,
    resolution: '3840x2160 @ 60fps',
    fps: 30,
    active: true,
    edgeLatencyMs: 29
  },
  {
    id: 'cam-04',
    name: 'Overhead 4K AI Cam #04',
    penId: 4,
    position: [4.5, 4.2, -2.5],
    target: [4.5, 0, -2.5],
    fov: 65,
    resolution: '3840x2160 @ 60fps',
    fps: 30,
    active: true,
    edgeLatencyMs: 28
  }
];

export interface SelectedObject {
  type: 'PIG' | 'SENSOR' | 'CAMERA' | 'PEN' | 'BARN' | 'STAGE' | 'JETSON';
  id: string;
  data?: any;
}

export type ActiveModal = 'none' | 'cosmos' | 'training' | 'jetson' | 'connect' | 'usecases' | 'cameraFeed';

// Global singleton listener pattern for reactive components
type Listener = () => void;

class SimulationStore {
  private listeners: Set<Listener> = new Set();

  public currentStage: PipelineStage = 'digital-twin';
  public activeModal: ActiveModal = 'none';
  public selectedObject: SelectedObject | null = { type: 'BARN', id: 'digital-twin-barn' };
  
  public simulationRunning: boolean = true;
  public simulationSpeed: number = 1.0;
  
  public activeScenario: ScenarioType = 'NORMAL';
  public environmental: EnvironmentalConditions = {
    ambientTemp: 24.2,
    humidity: 62.0,
    lighting: 85,
    ventilationSpeed: 75
  };

  public pigs: PigData[] = INITIAL_PIGS;
  public sensors: SensorData[] = INITIAL_SENSORS;
  public cameras: CameraData[] = INITIAL_CAMERAS;

  public syntheticStats: SyntheticDatasetStats = {
    syntheticSamples: 12480,
    diseaseScenarios: 8,
    behaviorVariations: 24,
    simToRealFidelity: 94.2,
    lastGeneratedTime: '12m ago'
  };

  public trainingMetrics: TrainingMetrics = {
    stage: 'MODEL_READY',
    progress: 100,
    accuracy: 94.8,
    precision: 92.6,
    recall: 91.4,
    mAP: 93.2,
    epochs: 150,
    loss: 0.042
  };

  public isTrainingActive: boolean = false;
  public isGeneratingSynthetic: boolean = false;

  // Disease scenario orchestration
  public diseaseScenarioActive: boolean = false;
  public diseaseScenarioStep: number = 0;
  public diseaseTimer: any = null;

  // Real-time alert state
  public alertActive: boolean = false;
  public alertDismissed: boolean = false;
  public alertData: {
    pigId: string;
    message: string;
    timestamp: string;
    riskScore: number;
  } | null = null;

  // Visual toggles
  public showGeometry: boolean = true;
  public showBehavior: boolean = true;
  public showBoundingBoxes: boolean = true;
  public showSegmentationMasks: boolean = false;
  public showSensors: boolean = true;
  public showCameras: boolean = true;
  public showDataFlow: boolean = true;
  public cameraFeedMode: boolean = false;

  // Guided Explainer
  public explainerActive: boolean = false;
  public explainerStep: number = 1;

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public setStage(stage: PipelineStage) {
    this.currentStage = stage;
    if (stage === 'digital-twin') {
      this.selectedObject = { type: 'BARN', id: 'digital-twin-barn' };
      this.activeModal = 'none';
      this.cameraFeedMode = false;
    } else if (stage === 'data-generation') {
      this.activeModal = 'cosmos';
    } else if (stage === 'ai-training') {
      this.activeModal = 'training';
    } else if (stage === 'ai-inference') {
      this.activeModal = 'none';
      this.cameraFeedMode = true;
      this.selectedObject = { type: 'PIG', id: 'pig-024', data: this.pigs.find(p => p.id === 'pig-024') };
    } else if (stage === 'edge-deployment') {
      this.activeModal = 'jetson';
      this.selectedObject = { type: 'JETSON', id: 'jetson-orin-01' };
    }
    this.notify();
  }

  public setActiveModal(modal: ActiveModal) {
    this.activeModal = modal;
    if (modal === 'none' && this.currentStage !== 'digital-twin' && !this.cameraFeedMode) {
      this.currentStage = 'digital-twin';
    }
    this.notify();
  }

  public closeAnyModal() {
    this.activeModal = 'none';
    this.currentStage = 'digital-twin';
    this.notify();
  }

  public exitCameraFeedMode() {
    this.cameraFeedMode = false;
    this.currentStage = 'digital-twin';
    this.selectedObject = { type: 'BARN', id: 'digital-twin-barn' };
    this.notify();
  }

  public setSelectedObject(obj: SelectedObject | null) {
    this.selectedObject = obj;
    this.notify();
  }

  public toggleSimulation() {
    this.simulationRunning = !this.simulationRunning;
    this.notify();
  }

  public setSimulationSpeed(speed: number) {
    this.simulationSpeed = speed;
    this.notify();
  }

  public setScenario(scenario: ScenarioType) {
    this.activeScenario = scenario;
    
    if (scenario === 'LETHARGY') {
      this.updatePigStatus('pig-024', 'LETHARGIC', 39.8, 18, 'CRITICAL', true);
    } else if (scenario === 'REDUCED_FEEDING') {
      this.updatePigStatus('pig-024', 'RESTING', 39.1, 42, 'MODERATE', false);
    } else if (scenario === 'RESPIRATORY_RISK') {
      this.updatePigStatus('pig-024', 'LETHARGIC', 40.2, 14, 'CRITICAL', true);
    } else {
      // Normal
      this.updatePigStatus('pig-024', 'NORMAL', 38.7, 82, 'LOW', false);
      this.alertActive = false;
      this.alertData = null;
    }
    this.notify();
  }

  public updateEnvironmental(patch: Partial<EnvironmentalConditions>) {
    this.environmental = { ...this.environmental, ...patch };
    
    // Dynamically adjust sensor readings to reflect environmental changes
    this.sensors = this.sensors.map(s => ({
      ...s,
      temperature: Number((this.environmental.ambientTemp + (Math.random() * 0.4 - 0.2)).toFixed(1)),
      humidity: Number((this.environmental.humidity + (Math.random() * 1.0 - 0.5)).toFixed(1))
    }));

    this.notify();
  }

  public updatePigStatus(
    pigId: string, 
    behavior: BehaviorState, 
    temp: number, 
    activity: number, 
    risk: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL',
    anomaly: boolean
  ) {
    this.pigs = this.pigs.map(p => {
      if (p.id === pigId) {
        return {
          ...p,
          behavior,
          temperature: temp,
          activityScore: activity,
          healthRisk: risk,
          anomalyDetected: anomaly,
          history: [
            ...p.history.slice(-4),
            { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), activity, temp }
          ]
        };
      }
      return p;
    });

    if (this.selectedObject?.id === pigId) {
      this.selectedObject = {
        ...this.selectedObject,
        data: this.pigs.find(p => p.id === pigId)
      };
    }
    this.notify();
  }

  // Trigger Synthetic Data generation animation and increment count
  public generateSyntheticScenario() {
    if (this.isGeneratingSynthetic) return;
    this.isGeneratingSynthetic = true;
    this.notify();

    setTimeout(() => {
      this.syntheticStats = {
        syntheticSamples: this.syntheticStats.syntheticSamples + 320,
        diseaseScenarios: this.syntheticStats.diseaseScenarios + 1,
        behaviorVariations: this.syntheticStats.behaviorVariations + 4,
        simToRealFidelity: 95.1,
        lastGeneratedTime: 'Just now'
      };
      this.isGeneratingSynthetic = false;
      this.notify();
    }, 1600);
  }

  // Interactive AI Model Training Sequence
  public startTrainingSimulation() {
    if (this.isTrainingActive) return;
    this.isTrainingActive = true;
    
    const stages: TrainingMetrics['stage'][] = [
      'DATA_INGESTION',
      'ANNOTATION_PROCESSING',
      'MODEL_TRAINING',
      'VALIDATION',
      'MODEL_READY'
    ];

    let currentIdx = 0;
    this.trainingMetrics.progress = 5;
    this.trainingMetrics.stage = stages[0];
    this.notify();

    const interval = setInterval(() => {
      this.trainingMetrics.progress += 15;
      
      if (this.trainingMetrics.progress >= 25 && currentIdx === 0) {
        currentIdx = 1;
        this.trainingMetrics.stage = stages[1];
      } else if (this.trainingMetrics.progress >= 50 && currentIdx === 1) {
        currentIdx = 2;
        this.trainingMetrics.stage = stages[2];
      } else if (this.trainingMetrics.progress >= 80 && currentIdx === 2) {
        currentIdx = 3;
        this.trainingMetrics.stage = stages[3];
      }

      if (this.trainingMetrics.progress >= 100) {
        clearInterval(interval);
        this.trainingMetrics.progress = 100;
        this.trainingMetrics.stage = 'MODEL_READY';
        this.trainingMetrics.accuracy = 95.4;
        this.trainingMetrics.precision = 93.8;
        this.trainingMetrics.recall = 92.6;
        this.trainingMetrics.mAP = 94.1;
        this.trainingMetrics.loss = 0.031;
        this.isTrainingActive = false;
      }
      this.notify();
    }, 450);
  }

  // 1-Click Complete 13-second Disease Scenario Workflow
  public runDiseaseScenario() {
    if (this.diseaseScenarioActive) return;
    this.diseaseScenarioActive = true;
    this.diseaseScenarioStep = 1;
    this.setStage('ai-inference');
    // Keep cameraFeedMode false so user remains in full 3D Orbit mode with free camera movement
    this.cameraFeedMode = false;
    this.alertActive = false;
    this.alertData = null;
    this.setSelectedObject({ type: 'PIG', id: 'pig-024', data: this.pigs.find(p => p.id === 'pig-024') });
    this.notify();

    // Step 1: Normal (0s)
    this.updatePigStatus('pig-024', 'NORMAL', 38.7, 82, 'LOW', false);

    // Step 2: 00:05 - Reduced activity detected
    setTimeout(() => {
      this.diseaseScenarioStep = 2;
      this.updatePigStatus('pig-024', 'RESTING', 39.0, 48, 'MODERATE', false);
    }, 3500);

    // Step 3: 00:10 - Lethargy pattern identified
    setTimeout(() => {
      this.diseaseScenarioStep = 3;
      this.updatePigStatus('pig-024', 'LETHARGIC', 39.6, 26, 'ELEVATED', true);
    }, 7000);

    // Step 4: 00:12 - Disease risk detected & Bounding Box pulse
    setTimeout(() => {
      this.diseaseScenarioStep = 4;
      this.updatePigStatus('pig-024', 'LETHARGIC', 39.9, 14, 'CRITICAL', true);
    }, 9500);

    // Step 5: 00:13 - Alert sent to Farm Operator
    setTimeout(() => {
      this.diseaseScenarioStep = 5;
      this.alertActive = true;
      this.alertData = {
        pigId: 'TAG-024 (Pen 1)',
        message: 'Lethargy Pattern & Elevated Thermal Signature Detected',
        timestamp: new Date().toLocaleTimeString(),
        riskScore: 94
      };
      this.diseaseScenarioActive = false;
      this.notify();
    }, 12000);
  }

  public dismissAlert() {
    this.alertActive = false;
    this.alertDismissed = true;
    this.notify();
  }

  // Visual Toggles
  public toggleGeometry() {
    this.showGeometry = !this.showGeometry;
    this.notify();
  }

  public toggleBehavior() {
    this.showBehavior = !this.showBehavior;
    this.notify();
  }

  public toggleBoundingBoxes() {
    this.showBoundingBoxes = !this.showBoundingBoxes;
    this.notify();
  }

  public toggleSegmentationMasks() {
    this.showSegmentationMasks = !this.showSegmentationMasks;
    this.notify();
  }

  public toggleSensors() {
    this.showSensors = !this.showSensors;
    this.notify();
  }

  public toggleCameras() {
    this.showCameras = !this.showCameras;
    this.notify();
  }

  public toggleDataFlow() {
    this.showDataFlow = !this.showDataFlow;
    this.notify();
  }

  public toggleCameraFeedMode() {
    this.cameraFeedMode = !this.cameraFeedMode;
    this.notify();
  }

  // Guided Explainer Navigation
  public startExplainer() {
    this.explainerActive = true;
    this.explainerStep = 1;
    this.applyExplainerStep(1);
  }

  public nextExplainerStep() {
    if (this.explainerStep < 7) {
      this.explainerStep += 1;
      this.applyExplainerStep(this.explainerStep);
    } else {
      this.explainerActive = false;
      this.notify();
    }
  }

  public prevExplainerStep() {
    if (this.explainerStep > 1) {
      this.explainerStep -= 1;
      this.applyExplainerStep(this.explainerStep);
    }
  }

  public stopExplainer() {
    this.explainerActive = false;
    this.notify();
  }

  private applyExplainerStep(step: number) {
    switch (step) {
      case 1: // DIGITAL TWIN
        this.currentStage = 'digital-twin';
        this.activeModal = 'none';
        this.cameraFeedMode = false;
        this.selectedObject = { type: 'BARN', id: 'digital-twin-barn' };
        break;
      case 2: // DATA & BEHAVIOR
        this.showBehavior = true;
        this.showSensors = true;
        this.selectedObject = { type: 'PIG', id: 'pig-024', data: this.pigs.find(p => p.id === 'pig-024') };
        break;
      case 3: // COSMOS
        this.currentStage = 'data-generation';
        this.activeModal = 'cosmos';
        break;
      case 4: // TRAINING
        this.currentStage = 'ai-training';
        this.activeModal = 'training';
        break;
      case 5: // DEPLOYMENT
        this.currentStage = 'edge-deployment';
        this.activeModal = 'jetson';
        this.selectedObject = { type: 'JETSON', id: 'jetson-orin-01' };
        break;
      case 6: // DETECTION
        this.currentStage = 'ai-inference';
        this.activeModal = 'none';
        this.cameraFeedMode = true;
        this.selectedObject = { type: 'PIG', id: 'pig-024', data: this.pigs.find(p => p.id === 'pig-024') };
        this.updatePigStatus('pig-024', 'LETHARGIC', 39.7, 22, 'CRITICAL', true);
        break;
      case 7: // ALERT
        this.alertActive = true;
        this.alertData = {
          pigId: 'TAG-024 (Pen 1)',
          message: 'Lethargy & Biometric Anomaly Detected',
          timestamp: new Date().toLocaleTimeString(),
          riskScore: 94
        };
        break;
    }
    this.notify();
  }

  public resetAll() {
    this.simulationRunning = true;
    this.simulationSpeed = 1.0;
    this.activeScenario = 'NORMAL';
    this.currentStage = 'digital-twin';
    this.activeModal = 'none';
    this.selectedObject = { type: 'BARN', id: 'digital-twin-barn' };
    this.pigs = INITIAL_PIGS;
    this.sensors = INITIAL_SENSORS;
    this.cameras = INITIAL_CAMERAS;
    this.alertActive = false;
    this.alertDismissed = false;
    this.alertData = null;
    this.diseaseScenarioActive = false;
    this.diseaseScenarioStep = 0;
    this.cameraFeedMode = false;
    this.explainerActive = false;
    this.explainerStep = 1;
    this.notify();
  }
}

export const simulationStore = new SimulationStore();

// React hook for subscribing to store changes
export function useSimulation() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return simulationStore.subscribe(() => {
      setTick(t => t + 1);
    });
  }, []);

  return simulationStore;
}
