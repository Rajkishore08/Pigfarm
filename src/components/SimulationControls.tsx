import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Sun, 
  Droplets, 
  Thermometer, 
  Wind,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useSimulation } from '../state/useSimulationStore';
import type { ScenarioType } from '../types';

export const SimulationControls: React.FC = () => {
  const store = useSimulation();
  const [showEnvSliders, setShowEnvSliders] = useState(false);

  const scenarios: { id: ScenarioType; label: string; desc: string }[] = [
    { id: 'NORMAL', label: 'Normal Baseline', desc: 'Standard herd health & movement' },
    { id: 'LETHARGY', label: 'Lethargy Outbreak', desc: 'Pig 024 shows acute hypoactivity' },
    { id: 'RESPIRATORY_RISK', label: 'Respiratory Risk', desc: 'Elevated temp & reduced ventilation' },
    { id: 'REDUCED_FEEDING', label: 'Reduced Feeding', desc: 'Off-feed behavior flagged' },
  ];

  if (store.cameraFeedMode) {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 select-none pointer-events-auto">
      {/* Collapsible Environmental Parameters Panel */}
      {showEnvSliders && (
        <div className="glass-panel p-4 rounded-xl border border-slate-700/80 shadow-2xl w-[480px] max-w-[90vw] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-nvidia" />
              ENVIRONMENTAL CONTROL & SENSOR COUPLING
            </span>
            <button
              onClick={() => setShowEnvSliders(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Ambient Temperature */}
            <div className="bg-dark-900/60 p-2 rounded border border-slate-800">
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Barn Temp
                </span>
                <span className="font-mono font-bold text-white">
                  {store.environmental.ambientTemp}°C
                </span>
              </div>
              <input
                type="range"
                min="16"
                max="36"
                step="0.5"
                value={store.environmental.ambientTemp}
                onChange={(e) => store.updateEnvironmental({ ambientTemp: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Relative Humidity */}
            <div className="bg-dark-900/60 p-2 rounded border border-slate-800">
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" /> Humidity
                </span>
                <span className="font-mono font-bold text-white">
                  {store.environmental.humidity}%
                </span>
              </div>
              <input
                type="range"
                min="35"
                max="90"
                step="1"
                value={store.environmental.humidity}
                onChange={(e) => store.updateEnvironmental({ humidity: parseFloat(e.target.value) })}
                className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Barn Overhead Lighting */}
            <div className="bg-dark-900/60 p-2 rounded border border-slate-800">
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-yellow-400" /> Luminaire Lux
                </span>
                <span className="font-mono font-bold text-white">
                  {store.environmental.lighting}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={store.environmental.lighting}
                onChange={(e) => store.updateEnvironmental({ lighting: parseInt(e.target.value) })}
                className="w-full accent-yellow-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Exhaust Ventilation Fans */}
            <div className="bg-dark-900/60 p-2 rounded border border-slate-800">
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" /> Ventilation
                </span>
                <span className="font-mono font-bold text-white">
                  {store.environmental.ventilationSpeed}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={store.environmental.ventilationSpeed}
                onChange={(e) => store.updateEnvironmental({ ventilationSpeed: parseInt(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Navigation Dock */}
      <div className="glass-panel px-3.5 py-2 rounded-full border border-slate-700/80 shadow-2xl flex items-center gap-3">
        {/* Play / Pause */}
        <button
          onClick={() => store.toggleSimulation()}
          className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          title={store.simulationRunning ? "Pause" : "Play"}
        >
          {store.simulationRunning ? (
            <Pause className="w-4 h-4 text-amber-400" />
          ) : (
            <Play className="w-4 h-4 text-nvidia" />
          )}
        </button>

        <button
          onClick={() => store.resetAll()}
          className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-slate-700" />

        {/* Scenarios Quick Selector */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 mr-1 hidden sm:inline">
            SCENARIO:
          </span>
          {scenarios.map((sc) => {
            const isSelected = store.activeScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => store.setScenario(sc.id)}
                title={sc.desc}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  isSelected
                    ? sc.id === 'NORMAL'
                      ? 'bg-nvidia text-dark-950 shadow-glow-green font-bold'
                      : 'bg-red-500 text-white shadow-glow-red font-bold'
                    : 'bg-dark-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {sc.label}
              </button>
            );
          })}
        </div>

        <div className="h-4 w-[1px] bg-slate-700" />

        {/* Environmental Toggle Button */}
        <button
          onClick={() => setShowEnvSliders(!showEnvSliders)}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
            showEnvSliders
              ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-glow-cyan'
              : 'bg-dark-900 border-slate-800 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Sliders className="w-3 h-3 text-cyan-400" />
          <span>Environment</span>
        </button>
      </div>
    </div>
  );
};
