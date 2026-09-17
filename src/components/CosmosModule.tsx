import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Cpu, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  Flame, 
  Sliders, 
  ShieldCheck, 
  Database,
  X
} from 'lucide-react';
import { useSimulation } from '../state/useSimulationStore';

export const CosmosModule: React.FC = () => {
  const store = useSimulation();
  const [sliderPos, setSliderPos] = useState(50);
  const [predictStep, setPredictStep] = useState(0);

  if (store.activeModal !== 'cosmos') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-[920px] max-w-full max-h-[92vh] rounded-2xl border border-purple-500/40 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-dark-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  SYNTHETIC DATA GENERATION
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-700/60">
                  NVIDIA COSMOS CONCEPT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generating rare and critical swine disease scenarios difficult to collect in real-world facilities
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

        {/* Content Body: 3 Interactive Cards */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CARD 1: COSMOS TRANSFER (SIM -> REAL) */}
            <div className="bg-dark-900/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-purple-500/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-purple-400">
                    COSMOS TRANSFER
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    SIM → REAL
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3 font-medium">
                  Transforms synthetic 3D simulation geometry into photorealistic training frames with real lighting and skin textures.
                </p>

                {/* Interactive Split Slider Visualizer */}
                <div className="relative h-32 rounded-lg overflow-hidden border border-slate-700 mb-3 bg-dark-950 flex items-center justify-center">
                  {/* Left Side: Synthetic Wireframe / Mesh */}
                  <div 
                    className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-2 text-center"
                    style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                  >
                    <Layers className="w-8 h-8 text-cyan-400 mb-1" />
                    <span className="text-[10px] font-mono text-cyan-300 font-bold">SYNTHETIC USD</span>
                    <span className="text-[9px] text-slate-400">Procedural 3D Mesh</span>
                  </div>

                  {/* Right Side: Photorealistic Neural Inferred */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-purple-950 to-slate-900 flex flex-col items-center justify-center p-2 text-center"
                    style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
                  >
                    <Sparkles className="w-8 h-8 text-purple-400 mb-1" />
                    <span className="text-[10px] font-mono text-purple-300 font-bold">PHOTOREAL REALISM</span>
                    <span className="text-[9px] text-slate-300">Diffusion Augmented</span>
                  </div>

                  {/* Dividing Handle */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Sim</span>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={sliderPos}
                    onChange={(e) => setSliderPos(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer h-1 bg-slate-800 rounded"
                  />
                  <span>Real</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex justify-between">
                <span>Fidelity Score:</span>
                <span className="text-purple-400 font-bold">{store.syntheticStats.simToRealFidelity}%</span>
              </div>
            </div>

            {/* CARD 2: COSMOS PREDICT (RARE DISEASE SCENARIO GENERATION) */}
            <div className="bg-dark-900/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-purple-500/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-purple-400">
                    COSMOS PREDICT
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    BEHAVIORAL AI
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3 font-medium">
                  Synthesizes rare disease behavior sequences across time (Normal → Reduced Movement → Severe Lethargy).
                </p>

                {/* Animated Progression Sequence */}
                <div className="space-y-1.5 mb-3 bg-dark-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-green-400 font-mono text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span>01. NORMAL BASELINE PIG</span>
                  </div>
                  <div className="w-3 h-2 border-l border-slate-700 ml-1.5" />
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>02. REDUCED LOCOMOTION</span>
                  </div>
                  <div className="w-3 h-2 border-l border-slate-700 ml-1.5" />
                  <div className="flex items-center gap-2 text-red-400 font-mono text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span>03. ACUTE LETHARGIC PROFILE</span>
                  </div>
                </div>

                <button
                  onClick={() => store.generateSyntheticScenario()}
                  disabled={store.isGeneratingSynthetic}
                  className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-purple-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${store.isGeneratingSynthetic ? 'animate-spin' : ''}`} />
                  <span>{store.isGeneratingSynthetic ? 'Synthesizing...' : 'Generate Scenario'}</span>
                </button>
              </div>

              {/* Dataset Telemetry Counters */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Synthetic Samples:</span>
                  <span className="text-white font-bold">{store.syntheticStats.syntheticSamples.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Rare Scenarios:</span>
                  <span className="text-purple-300 font-bold">{store.syntheticStats.diseaseScenarios}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Behavior Variations:</span>
                  <span className="text-white font-bold">{store.syntheticStats.behaviorVariations}</span>
                </div>
              </div>
            </div>

            {/* CARD 3: COSMOS REASON (SCENARIO CURATION & VALIDATION) */}
            <div className="bg-dark-900/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-purple-500/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-purple-400">
                    COSMOS REASON
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    CURATION
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3 font-medium">
                  Automated scenario curation & physical plausibility validation layer before feeding data into training pipelines.
                </p>

                <div className="space-y-2 bg-dark-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Biomechanical Physics:</span>
                    <span className="text-green-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Validated
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Pen Spatial Constraints:</span>
                    <span className="text-green-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 100% Collision-Free
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Outlier Elimination:</span>
                    <span className="text-green-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Filtered
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-2 bg-purple-950/40 rounded border border-purple-800/40 text-[11px] text-purple-200">
                  Guarantees AI models are not corrupted by physically impossible synthetic artifacts.
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Dataset Status:</span>
                <span className="text-green-400 font-mono font-bold">READY FOR TAO</span>
              </div>
            </div>
          </div>

          {/* Educational Concept Flow Diagram */}
          <div className="bg-dark-900/60 p-4 rounded-xl border border-slate-800">
            <div className="text-xs font-mono font-bold text-slate-300 mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span>DATA TRANSFORMATION LIFECYCLE</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-xs font-mono">
              <div className="p-2.5 bg-dark-950 rounded border border-slate-800 flex-1 w-full">
                <span className="text-slate-400 block text-[10px]">STAGE 1</span>
                <span className="text-cyan-400 font-bold">3D Omniverse Twin</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />
              <div className="p-2.5 bg-purple-950/40 rounded border border-purple-800 flex-1 w-full">
                <span className="text-purple-300 block text-[10px]">STAGE 2</span>
                <span className="text-purple-300 font-bold">Cosmos Synthesis</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />
              <div className="p-2.5 bg-dark-950 rounded border border-slate-800 flex-1 w-full">
                <span className="text-slate-400 block text-[10px]">STAGE 3</span>
                <span className="text-white font-bold">Physics Curation</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />
              <div className="p-2.5 bg-green-950/40 rounded border border-green-800 flex-1 w-full">
                <span className="text-green-300 block text-[10px]">STAGE 4</span>
                <span className="text-green-400 font-bold">TAO Training Input</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-dark-900/80 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-amber-400">
            * SIMULATED PROTOTYPE METRICS & SCENARIOS
          </span>
          <button
            onClick={() => store.setStage('ai-training')}
            className="px-4 py-2 rounded-lg bg-nvidia text-dark-950 font-bold flex items-center gap-1.5 hover:bg-nvidia-light transition-all"
          >
            <span>Proceed to AI Training (TAO)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
