export type PipelineStage = 
  | 'digital-twin'
  | 'data-generation'
  | 'ai-training'
  | 'ai-inference'
  | 'edge-deployment';

export type BehaviorState = 'NORMAL' | 'EATING' | 'WALKING' | 'RESTING' | 'LETHARGIC';

export type HealthRiskLevel = 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';

export interface PigData {
  id: string;
  penId: number;
  tagNumber: string;
  position: [number, number, number];
  rotation: number;
  behavior: BehaviorState;
  temperature: number; // in Celsius e.g. 38.6
  activityScore: number; // 0 - 100
  feedIntakeRate: number; // kg / day
  waterIntakeRate: number; // L / day
  healthRisk: HealthRiskLevel;
  aiConfidence: number; // percentage e.g. 96
  anomalyDetected: boolean;
  history: {
    time: string;
    activity: number;
    temp: number;
  }[];
}

export interface SensorData {
  id: string;
  penId: number;
  name: string;
  type: 'ENVIRONMENTAL' | 'MOTION' | 'FEED' | 'WATER' | 'CAMERA';
  position: [number, number, number];
  temperature: number; // °C
  humidity: number; // %
  ammonia: number; // ppm
  airQualityIndex: number;
  status: 'OPTIMAL' | 'WARNING' | 'ALERT';
}

export interface CameraData {
  id: string;
  name: string;
  penId: number;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  resolution: string;
  fps: number;
  active: boolean;
  edgeLatencyMs: number;
}

export type ScenarioType = 'NORMAL' | 'LETHARGY' | 'RESPIRATORY_RISK' | 'REDUCED_FEEDING';

export interface EnvironmentalConditions {
  ambientTemp: number; // °C (e.g. 20 - 32)
  humidity: number; // % (e.g. 40 - 80)
  lighting: number; // 0 - 100%
  ventilationSpeed: number; // 0 - 100%
}

export interface SyntheticDatasetStats {
  syntheticSamples: number;
  diseaseScenarios: number;
  behaviorVariations: number;
  simToRealFidelity: number; // percentage
  lastGeneratedTime?: string;
}

export interface TrainingMetrics {
  stage: 'IDLE' | 'DATA_INGESTION' | 'ANNOTATION_PROCESSING' | 'MODEL_TRAINING' | 'VALIDATION' | 'MODEL_READY';
  progress: number; // 0 - 100
  accuracy: number;
  precision: number;
  recall: number;
  mAP: number; // Mean Average Precision
  epochs: number;
  loss: number;
}

export interface ExplainerStep {
  step: number;
  title: string;
  subtitle: string;
  narration: string;
  targetFocus: 'barn' | 'pig' | 'cosmos' | 'training' | 'jetson' | 'camera' | 'alert';
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  highlightElement: string;
}

export interface DiseaseScenarioTimeline {
  step: number;
  timestamp: string;
  title: string;
  description: string;
  pigState: BehaviorState;
  riskScore: number;
  alertSent: boolean;
}
