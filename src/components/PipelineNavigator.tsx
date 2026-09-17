import React from 'react';
import { 
  Layers, 
  Sparkles, 
  Cpu, 
  Video, 
  Boxes, 
  GitFork, 
  Lightbulb, 
  Eye, 
  Box, 
  Activity, 
  Radio, 
  Share2 
} from 'lucide-react';
import { useSimulation } from '../state/useSimulationStore';
import type { PipelineStage } from '../types';

interface StageItem {
  id: PipelineStage;
  num: string;
  title: string;
  subtitle: string;
  concept: string;
  icon: React.ReactNode;
}

export const PipelineNavigator: React.FC = () => {
  const store = useSimulation();

  const stages: StageItem[] = [
    {
      id: 'digital-twin',
      num: '01',
      title: 'DIGITAL TWIN',
      subtitle: 'USD Barn & Animals',
      concept: 'NVIDIA Omniverse',
      icon: <Layers className="w-4 h-4 text-nvidia" />,
    },
    {
      id: 'data-generation',
      num: '02',
      title: 'DATA GENERATION',
      subtitle: 'Synthetic Rare Diseases',
      concept: 'NVIDIA Cosmos',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'ai-training',
      num: '03',
      title: 'AI TRAINING',
      subtitle: 'Swine Health Model',
      concept: 'NVIDIA TAO Toolkit',
      icon: <Cpu className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 'ai-inference',
      num: '04',
      title: 'AI INFERENCE',
      subtitle: 'Real-Time Monitoring',
      concept: 'Vision AI & Anomaly Scan',
      icon: <Video className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'edge-deployment',
      num: '05',
      title: 'EDGE DEPLOYMENT',
      subtitle: 'Local Acceleration',
      concept: 'NVIDIA Jetson',
      icon: <Boxes className="w-4 h-4 text-amber-400" />,
    },
  ];

  return (
    <aside className="w-72 border-r border-slate-800/80 bg-dark-950/90 backdrop-blur-md flex flex-col justify-between p-3.5 z-10 select-none overflow-y-auto">
      <div className="space-y-4">
        {/* Pipeline Title */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              ARCHITECTURE PIPELINE
            </span>
            <h2 className="text-xs font-bold text-white tracking-wider">
              END-TO-END WORKFLOW
            </h2>
          </div>
          <span className="w-2 h-2 rounded-full bg-nvidia animate-ping" />
        </div>

        {/* Chronological Stages List */}
        <div className="space-y-1.5">
          {stages.map((stage) => {
            const isActive = store.currentStage === stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => store.setStage(stage.id)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all relative overflow-hidden group ${
                  isActive
                    ? 'bg-dark-850/90 border-nvidia/60 shadow-glow-green'
                    : 'bg-dark-900/50 border-slate-800/60 hover:bg-dark-850 hover:border-slate-700'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-nvidia" />
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {stage.num}
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-nvidia transition-colors">
                      {stage.title}
                    </span>
                  </div>
                  {stage.icon}
                </div>

                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                  <span>{stage.subtitle}</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800/80 text-slate-300">
                    {stage.concept}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Global Architecture Exploration & Use Cases */}
        <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
          <button
            onClick={() => store.setActiveModal('connect')}
            className={`w-full text-left p-2.5 rounded-lg border flex items-center justify-between transition-all ${
              store.activeModal === 'connect'
                ? 'bg-dark-850 border-cyan-500 shadow-glow-cyan text-cyan-300'
                : 'bg-dark-900/60 border-slate-800 hover:bg-dark-850 text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs font-bold">HOW EVERYTHING CONNECTS</div>
                <div className="text-[10px] text-slate-400">Hybrid 3D/2D Architecture Map</div>
              </div>
            </div>
            <span className="text-xs">→</span>
          </button>

          <button
            onClick={() => store.setActiveModal('usecases')}
            className={`w-full text-left p-2.5 rounded-lg border flex items-center justify-between transition-all ${
              store.activeModal === 'usecases'
                ? 'bg-dark-850 border-amber-500 text-amber-300'
                : 'bg-dark-900/60 border-slate-800 hover:bg-dark-850 text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-bold">WHAT CAN THIS SYSTEM DO?</div>
                <div className="text-[10px] text-slate-400">8 Interactive Use Cases</div>
              </div>
            </div>
            <span className="text-xs">→</span>
          </button>
        </div>
      </div>

      {/* 3D Visual Layers Toggles */}
      <div className="pt-3 border-t border-slate-800/80">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
          3D SIMULATION LAYERS
        </span>
        <div className="grid grid-cols-2 gap-1.5 text-[11px] font-medium">
          <button
            onClick={() => store.toggleGeometry()}
            className={`px-2 py-1.5 rounded border flex items-center gap-1.5 transition-all ${
              store.showGeometry 
                ? 'bg-nvidia/20 border-nvidia/50 text-nvidia' 
                : 'bg-dark-900 border-slate-800 text-slate-400'
            }`}
          >
            <Box className="w-3 h-3" /> Geometry
          </button>

          <button
            onClick={() => store.toggleBehavior()}
            className={`px-2 py-1.5 rounded border flex items-center gap-1.5 transition-all ${
              store.showBehavior 
                ? 'bg-nvidia/20 border-nvidia/50 text-nvidia' 
                : 'bg-dark-900 border-slate-800 text-slate-400'
            }`}
          >
            <Activity className="w-3 h-3" /> Behavior
          </button>

          <button
            onClick={() => store.toggleBoundingBoxes()}
            className={`px-2 py-1.5 rounded border flex items-center gap-1.5 transition-all ${
              store.showBoundingBoxes 
                ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300' 
                : 'bg-dark-900 border-slate-800 text-slate-400'
            }`}
          >
            <Eye className="w-3 h-3" /> 3D Boxes
          </button>

          <button
            onClick={() => store.toggleSegmentationMasks()}
            className={`px-2 py-1.5 rounded border flex items-center gap-1.5 transition-all ${
              store.showSegmentationMasks 
                ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300' 
                : 'bg-dark-900 border-slate-800 text-slate-400'
            }`}
          >
            <Layers className="w-3 h-3" /> Seg Mask
          </button>

          <button
            onClick={() => store.toggleSensors()}
            className={`px-2 py-1.5 rounded border flex items-center gap-1.5 transition-all ${
              store.showSensors 
                ? 'bg-green-950/60 border-green-500/60 text-green-300' 
                : 'bg-dark-900 border-slate-800 text-slate-400'
            }`}
          >
            <Radio className="w-3 h-3" /> IoT Nodes
          </button>

          <button
            onClick={() => store.toggleDataFlow()}
            className={`px-2 py-1.5 rounded border flex items-center gap-1.5 transition-all ${
              store.showDataFlow 
                ? 'bg-purple-950/60 border-purple-500/60 text-purple-300' 
                : 'bg-dark-900 border-slate-800 text-slate-400'
            }`}
          >
            <Share2 className="w-3 h-3" /> Data Flow
          </button>
        </div>
      </div>
    </aside>
  );
};
