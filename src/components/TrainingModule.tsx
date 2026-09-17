import React from 'react';
import { 
  Cpu, 
  Layers, 
  Sparkles, 
  FileText, 
  ShieldAlert, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Database,
  BarChart3,
  X
} from 'lucide-react';
import { useSimulation } from '../state/useSimulationStore';

export const TrainingModule: React.FC = () => {
  const store = useSimulation();
  const metrics = store.trainingMetrics;

  if (store.activeModal !== 'training') {
    return null;
  }

  const inputs = [
    { title: 'Structured Geometry', desc: 'USD Barn Coordinates & Pen Layouts', icon: <Layers className="w-4 h-4 text-cyan-400" /> },
    { title: 'Synthetic Video', desc: 'Cosmos Photoreal Motion Streams', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
    { title: 'Ground Truth Annotations', desc: 'YOLO 3D Bounding & Keypoint Masks', icon: <FileText className="w-4 h-4 text-amber-400" /> },
    { title: 'Rare Disease Scenarios', desc: 'Biomechanical Lethargy Profiles', icon: <ShieldAlert className="w-4 h-4 text-red-400" /> },
  ];

  const stages = [
    { key: 'DATA_INGESTION', label: '1. Data Ingestion' },
    { key: 'ANNOTATION_PROCESSING', label: '2. Annotation Parse' },
    { key: 'MODEL_TRAINING', label: '3. Neural Training' },
    { key: 'VALIDATION', label: '4. Validation Check' },
    { key: 'MODEL_READY', label: '5. Model Ready' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-[900px] max-w-full max-h-[92vh] rounded-2xl border border-blue-500/40 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-dark-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/50 flex items-center justify-center text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  AI TRAINING PIPELINE
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700">
                  NVIDIA TAO TOOLKIT CONCEPT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transfer learning and neural fine-tuning on synthesized swine health datasets
              </p>
            </div>
          </div>

          <button
            onClick={() => store.closeAnyModal()}
            className="p-2 rounded-lg bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Data Inputs -> Model Convergence Graph */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Left: 4 Data Inputs */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
                TRAINING INGESTION DATASETS
              </span>
              {inputs.map((inp, idx) => (
                <div 
                  key={idx} 
                  className="bg-dark-900/80 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2.5 hover:border-slate-700 transition-colors"
                >
                  <div className="p-1.5 rounded bg-dark-950 border border-slate-800">
                    {inp.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{inp.title}</div>
                    <div className="text-[10px] text-slate-400">{inp.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Middle: Neural Network Convergence Box */}
            <div className="bg-dark-900/90 p-5 rounded-xl border border-blue-500/50 shadow-glow-cyan text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-950 border border-blue-400 flex items-center justify-center text-blue-400 animate-pulse">
                <Cpu className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                  SWINE HEALTH MODEL
                </span>
                <span className="text-[11px] text-slate-400">
                  Vision Backbone: YOLOv8 / ViT
                </span>
              </div>

              <button
                onClick={() => store.startTrainingSimulation()}
                disabled={store.isTrainingActive}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-950 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <Play className={`w-3.5 h-3.5 ${store.isTrainingActive ? 'animate-spin' : ''}`} />
                <span>{store.isTrainingActive ? 'TRAINING NEURAL NET...' : 'TRAIN MODEL'}</span>
              </button>
            </div>

            {/* Right: Trained Model Output Package */}
            <div className="bg-dark-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between h-full">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-2">
                  OUTPUT ARTIFACT
                </span>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-sm font-bold text-white">SwineGuard-v2.engine</span>
                </div>
                <p className="text-xs text-slate-300">
                  Optimized TensorRT engine serialized for low-power edge inference on NVIDIA Jetson hardware.
                </p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-800 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Model Weight:</span>
                  <span className="text-white font-bold">14.8 MB (FP16)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Target Hardware:</span>
                  <span className="text-cyan-400 font-bold">Jetson Orin Nano / AGX</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stepped Progress Bar */}
          <div className="bg-dark-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold">
                TRAINING PIPELINE PROGRESS: {metrics.progress}%
              </span>
              <span className="text-blue-400 font-semibold">
                STAGE: {metrics.stage}
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-dark-950 h-3 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 transition-all duration-300"
                style={{ width: `${metrics.progress}%` }}
              />
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-5 gap-2 pt-1 text-center">
              {stages.map((st) => (
                <span 
                  key={st.key}
                  className={`text-[10px] font-mono py-1 rounded border transition-colors ${
                    metrics.stage === st.key
                      ? 'bg-blue-950 border-blue-500 text-blue-300 font-bold'
                      : 'border-slate-800 text-slate-500 bg-dark-950'
                  }`}
                >
                  {st.label}
                </span>
              ))}
            </div>
          </div>

          {/* Model Performance Metrics Cards */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-nvidia" />
                SIMULATED MODEL EVALUATION METRICS
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800">
                SIMULATED PROTOTYPE METRICS
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-dark-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-1">Accuracy</span>
                <span className="text-xl font-mono font-bold text-green-400">{metrics.accuracy}%</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">+3.2% vs Sim Baseline</span>
              </div>

              <div className="bg-dark-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-1">Precision</span>
                <span className="text-xl font-mono font-bold text-cyan-400">{metrics.precision}%</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Low false positives</span>
              </div>

              <div className="bg-dark-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-1">Recall</span>
                <span className="text-xl font-mono font-bold text-purple-400">{metrics.recall}%</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">99.1% on acute lethargy</span>
              </div>

              <div className="bg-dark-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-1">Mean Loss</span>
                <span className="text-xl font-mono font-bold text-white">{metrics.loss}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Epochs: {metrics.epochs}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-dark-900/80 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            * Representative AI pipeline for educational demonstration
          </span>
          <button
            onClick={() => {
              store.setStage('ai-inference');
              store.setActiveModal('none');
              store.toggleCameraFeedMode();
            }}
            className="px-4 py-2 rounded-lg bg-nvidia text-dark-950 font-bold flex items-center gap-1.5 hover:bg-nvidia-light transition-all"
          >
            <span>Deploy to Edge Inference (Jetson)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
