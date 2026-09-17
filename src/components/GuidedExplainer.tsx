import React from 'react';
import { 
  Radio, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Layers, 
  Activity, 
  Sparkles, 
  Cpu, 
  Boxes, 
  Video, 
  ShieldAlert 
} from 'lucide-react';
import { useSimulation } from '../state/useSimulationStore';

export const GuidedExplainer: React.FC = () => {
  const store = useSimulation();

  if (!store.explainerActive) {
    return null;
  }

  const steps = [
    {
      step: 1,
      title: 'STEP 1: DIGITAL TWIN FACILITY',
      icon: <Layers className="w-5 h-5 text-nvidia" />,
      tag: 'NVIDIA Omniverse',
      narration: 'First, we construct a high-fidelity Universal Scene Description (USD) virtual representation of the commercial swine barn, complete with pens, slatted floors, ventilation, and automated feed troughs.',
    },
    {
      step: 2,
      title: 'STEP 2: STRUCTURED DATA & BEHAVIORS',
      icon: <Activity className="w-5 h-5 text-cyan-400" />,
      tag: 'Telemetry & Physics',
      narration: 'Next, the digital twin continuously provides structured 3D coordinates, IoT sensor streams, and simulated biomechanical behavioral states (normal walking, eating, resting).',
    },
    {
      step: 3,
      title: 'STEP 3: SYNTHETIC DATA FACTORY',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      tag: 'NVIDIA Cosmos',
      narration: 'Generative AI simulates rare disease scenarios—such as acute lethargy and off-feed behavior—that are dangerous and difficult to collect in real-world commercial production.',
    },
    {
      step: 4,
      title: 'STEP 4: AI MODEL TRAINING',
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      tag: 'NVIDIA TAO Toolkit',
      narration: 'The synthetic video frames, ground-truth 3D bounding annotations, and disease scenarios flow into the TAO Toolkit to train an accurate, generalized swine health neural model.',
    },
    {
      step: 5,
      title: 'STEP 5: EDGE DEPLOYMENT',
      icon: <Boxes className="w-5 h-5 text-amber-400" />,
      tag: 'NVIDIA Jetson AGX Orin',
      narration: 'The trained model is compiled into an optimized TensorRT engine and deployed directly onto an on-premise Jetson edge computer for autonomous 28ms inference inside the barn.',
    },
    {
      step: 6,
      title: 'STEP 6: REAL-TIME AI INFERENCE',
      icon: <Video className="w-5 h-5 text-cyan-400" />,
      tag: 'Vision AI Surveillance',
      narration: 'Live 4K barn surveillance video is processed frame-by-frame. When an individual pig exhibits abnormal immobility or elevated temperature, the vision AI flags the anomaly.',
    },
    {
      step: 7,
      title: 'STEP 7: RAPID DISEASE ALERT',
      icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
      tag: 'Early Biosecurity Action',
      narration: 'An automated disease alert is dispatched within seconds to the farm manager dashboard, enabling rapid quarantine and veterinary treatment before disease spreads across the herd.',
    },
  ];

  const currentStepData = steps[store.explainerStep - 1] || steps[0];

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 w-[640px] max-w-[92vw] pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="glass-panel-glow p-5 rounded-2xl border-2 border-nvidia shadow-glow-green flex flex-col space-y-3">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center p-1.5 rounded-lg bg-nvidia/20 border border-nvidia/40 text-nvidia">
              {currentStepData.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-nvidia">
                  {currentStepData.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-950 text-slate-300 border border-slate-700">
                  {currentStepData.tag}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => store.stopExplainer()}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Narrative Text */}
        <p className="text-sm text-slate-200 leading-relaxed font-medium">
          "{currentStepData.narration}"
        </p>

        {/* Stepper Progress Bar */}
        <div className="flex items-center gap-1.5 py-1">
          {steps.map((s) => (
            <div
              key={s.step}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s.step === store.explainerStep
                  ? 'bg-nvidia shadow-glow-green'
                  : s.step < store.explainerStep
                  ? 'bg-nvidia/50'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
          <div className="text-slate-400">
            Step {store.explainerStep} of {steps.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => store.prevExplainerStep()}
              disabled={store.explainerStep === 1}
              className="px-3 py-1.5 rounded bg-dark-850 hover:bg-dark-800 disabled:opacity-40 text-white font-semibold flex items-center gap-1 border border-slate-700 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => store.nextExplainerStep()}
              className="px-4 py-1.5 rounded bg-nvidia hover:bg-nvidia-light text-dark-950 font-bold flex items-center gap-1 shadow-glow-green transition-all"
            >
              <span>{store.explainerStep === 7 ? 'Complete Tour' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
