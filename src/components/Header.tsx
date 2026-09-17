import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Cpu, 
  Layers, 
  ShieldAlert,
  Activity,
  Radio
} from 'lucide-react';
import { useSimulation } from '../state/useSimulationStore';

export const Header: React.FC = () => {
  const store = useSimulation();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-dark-950/90 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0">
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-nvidia/30 via-nvidia/10 to-transparent border border-nvidia/50 flex items-center justify-center shadow-glow-green">
          <Activity className="w-5 h-5 text-nvidia" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>AI-Powered Swine Health Digital Twin</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-nvidia/20 text-nvidia border border-nvidia/40">
                v2.4
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            From Synthetic Simulation to Real-Time Disease Detection
          </p>
        </div>
      </div>

      {/* Center Status Indicators */}
      <div className="hidden lg:flex items-center gap-2 bg-dark-900/90 px-3 py-1.5 rounded-full border border-slate-800">
        <div className="flex items-center gap-1.5 px-2">
          <span className={`w-2 h-2 rounded-full ${store.simulationRunning ? 'bg-nvidia animate-pulse' : 'bg-slate-500'}`} />
          <span className="text-xs font-mono text-slate-300">
            {store.simulationRunning ? 'SIMULATION RUNNING' : 'PAUSED'}
          </span>
        </div>

        <div className="h-3 w-[1px] bg-slate-700 mx-1" />

        {/* Small Module Badges */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="flex items-center gap-1 text-slate-300 bg-slate-800/60 px-2 py-0.5 rounded">
            <Layers className="w-3 h-3 text-nvidia" /> DIGITAL TWIN
          </span>
          <span className="flex items-center gap-1 text-slate-300 bg-slate-800/60 px-2 py-0.5 rounded">
            <Sparkles className="w-3 h-3 text-purple-400" /> COSMOS SYNTHETIC
          </span>
          <span className="flex items-center gap-1 text-slate-300 bg-slate-800/60 px-2 py-0.5 rounded">
            <Cpu className="w-3 h-3 text-cyan-400" /> JETSON EDGE NODE
          </span>
        </div>

        <div className="h-3 w-[1px] bg-slate-700 mx-1" />

        <span className="text-[10px] font-mono tracking-wider text-amber-400/90 bg-amber-950/40 border border-amber-800/50 px-2 py-0.5 rounded-full">
          PROTOTYPE DEMONSTRATION
        </span>
      </div>

      {/* Action CTA & Guided Explainer */}
      <div className="flex items-center gap-2">
        {/* Play/Pause Toggle */}
        <button
          onClick={() => store.toggleSimulation()}
          className="p-2 rounded bg-dark-850 hover:bg-dark-800 border border-slate-800 text-slate-300 transition-colors"
          title={store.simulationRunning ? "Pause Simulation" : "Resume Simulation"}
        >
          {store.simulationRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-nvidia" />}
        </button>

        {/* Reset */}
        <button
          onClick={() => store.resetAll()}
          className="p-2 rounded bg-dark-850 hover:bg-dark-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Reset Simulation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Disease Scenario One-Click Button */}
        <button
          onClick={() => store.runDiseaseScenario()}
          disabled={store.diseaseScenarioActive}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold tracking-wide border transition-all ${
            store.diseaseScenarioActive
              ? 'bg-red-950/60 border-red-500 text-red-300 animate-pulse'
              : 'bg-red-900/30 hover:bg-red-900/50 border-red-500/40 text-red-300 hover:border-red-400 shadow-glow-red'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          <span>{store.diseaseScenarioActive ? 'RUNNING SCENARIO...' : 'RUN DISEASE SCENARIO'}</span>
        </button>

        {/* Guided Explainer Launch Button */}
        <button
          onClick={() => store.startExplainer()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-nvidia hover:bg-nvidia-light text-dark-950 font-bold text-xs shadow-glow-green transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>START EXPLAINER</span>
        </button>
      </div>
    </header>
  );
};
