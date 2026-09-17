import React, { useEffect, useState } from 'react';
import { 
  Video, 
  ShieldAlert, 
  Crosshair, 
  CheckCircle2, 
  AlertTriangle, 
  Maximize2, 
  Minimize2, 
  Clock, 
  Radio, 
  Cpu 
} from 'lucide-react';
import { useSimulation } from '../state/useSimulationStore';

export const InferenceMonitor: React.FC = () => {
  const store = useSimulation();
  const [scanY, setScanY] = useState(0);

  // Animated scanline effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScanY((prev) => (prev >= 100 ? 0 : prev + 1.2));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const targetPig = store.pigs.find(p => p.id === 'pig-024') || store.pigs[0];
  const isLethargic = targetPig.behavior === 'LETHARGIC';

  const timelineSteps = [
    { time: '00:00', title: 'Normal baseline activity recorded' },
    { time: '00:05', title: 'Activity drop below 50% threshold' },
    { time: '00:10', title: 'Lethargy signature & recumbency flagged' },
    { time: '00:12', title: 'Critical disease risk score computed' },
    { time: '00:13', title: 'Red Alert dispatched to farm manager' },
  ];

  if (!store.cameraFeedMode) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6">
      {/* Top HUD Overlay */}
      <div className="flex items-start justify-between">
        {/* Camera Info HUD */}
        <div className="pointer-events-auto glass-panel px-4 py-2.5 rounded-lg border border-cyan-500/40 shadow-glow-cyan flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-mono font-bold text-red-400">REC</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-700" />
          <div className="text-xs font-mono">
            <span className="text-cyan-400 font-bold">CAM 01 (NORTH-WEST PEN)</span>
            <span className="text-slate-400 text-[10px] ml-2">3840x2160 @ 30fps</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-700" />
          <div className="flex items-center gap-1.5 text-xs font-mono text-nvidia font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>JETSON TENSORRT • 28ms</span>
          </div>
        </div>

        {/* Viewfinder Controls & Exit */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => store.exitCameraFeedMode()}
            className="glass-panel px-3.5 py-2 rounded-lg border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-glow-cyan bg-dark-900/90"
            title="Exit Camera Mode and Return to 3D Barn"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Exit Camera View</span>
          </button>
        </div>
      </div>

      {/* Viewfinder Frame Guides (unobtrusive edges, never blocking center view) */}
      <div className="absolute inset-16 pointer-events-none border border-cyan-500/20 rounded-2xl">
        {/* Subtle Corner Accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

        {/* Subtle Scanning Laser Line */}
        <div 
          className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent z-10"
          style={{ top: `${scanY}%` }}
        />
      </div>

      {/* Bottom Live Analysis HUD & Disease Scenario Sequencer */}
      <div className="flex items-end justify-between">
        {/* AI Inference Real-Time Diagnostics Checklist */}
        <div className="pointer-events-auto glass-panel p-3.5 rounded-xl border border-slate-800/80 shadow-2xl w-80 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              REAL-TIME AI INFERENCE
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
              ACTIVE
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-1.5 bg-dark-900/60 rounded border border-slate-800/60">
              <span className="text-slate-300">OBJECT DETECTION</span>
              <span className="text-green-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Pig Identified
              </span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-dark-900/60 rounded border border-slate-800/60">
              <span className="text-slate-300">BEHAVIOR ANALYSIS</span>
              <span className={`font-bold flex items-center gap-1 ${
                isLethargic ? 'text-amber-400' : 'text-green-400'
              }`}>
                {isLethargic ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" /> Reduced Motion
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Normal Movement
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-dark-900/60 rounded border border-slate-800/60">
              <span className="text-slate-300">HEALTH RISK DETECTOR</span>
              <span className={`font-bold flex items-center gap-1 ${
                isLethargic ? 'text-red-400 animate-pulse' : 'text-slate-400'
              }`}>
                {isLethargic ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5" /> Disease Indicator
                  </>
                ) : (
                  'Low (Nominal)'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* 13-Second Automated Disease Scenario Timeline Controller */}
        <div className="pointer-events-auto glass-panel p-3.5 rounded-xl border border-red-500/40 shadow-glow-red w-[440px]">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span className="text-xs font-mono font-bold text-white">
                DISEASE OUTBREAK SCENARIO SEQUENCE
              </span>
            </div>
            <button
              onClick={() => store.runDiseaseScenario()}
              disabled={store.diseaseScenarioActive}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                store.diseaseScenarioActive
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {store.diseaseScenarioActive ? 'IN PROGRESS...' : 'TRIGGER 13s TEST'}
            </button>
          </div>

          {/* Stepped Timeline */}
          <div className="space-y-1">
            {timelineSteps.map((step, idx) => {
              const currentStep = store.diseaseScenarioStep;
              const isPast = currentStep > idx + 1;
              const isCurrent = currentStep === idx + 1;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2 text-xs py-1 px-2 rounded transition-colors ${
                    isCurrent
                      ? 'bg-red-950/80 border border-red-500 text-red-200 font-bold'
                      : isPast
                      ? 'text-slate-400 line-through opacity-70'
                      : 'text-slate-500'
                  }`}
                >
                  <span className="font-mono text-[10px] w-10 text-slate-400">{step.time}</span>
                  <span className="flex-1">{step.title}</span>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />}
                  {isPast && <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
