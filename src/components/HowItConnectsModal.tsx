import React, { useState } from 'react';
import { 
  GitFork, 
  Layers, 
  Sparkles, 
  Cpu, 
  Video, 
  Boxes, 
  ShieldAlert, 
  Activity,
  ArrowDown,
  ArrowRight,
  Info,
  X
} from 'lucide-react';
import { useSimulation } from '../state/useSimulationStore';

interface ConnectionInfo {
  id: string;
  name: string;
  source: string;
  destination: string;
  type: string;
  description: string;
  color: string;
}

export const HowItConnectsModal: React.FC = () => {
  const store = useSimulation();
  const [hoveredConn, setHoveredConn] = useState<ConnectionInfo | null>(null);

  if (store.activeModal !== 'connect') {
    return null;
  }

  const connections: Record<string, ConnectionInfo> = {
    geom: {
      id: 'geom',
      name: 'STRUCTURED GEOMETRY & BEHAVIOR',
      source: 'NVIDIA Omniverse Digital Twin',
      destination: 'AI Training Pipeline (TAO)',
      type: 'USD 3D Assets',
      description: '3D barn geometry, pen spatial bounds, object locations, sensor positions, and baseline anatomical pig behavioral states.',
      color: '#00e5ff',
    },
    synth: {
      id: 'synth',
      name: 'SYNTHETIC RARE SCENARIOS',
      source: 'NVIDIA Cosmos',
      destination: 'AI Training Pipeline (TAO)',
      type: 'Diffusion Video Frames',
      description: 'Photorealistic simulated video frames depicting rare pathology states (acute lethargy, off-feed, respiratory distress) impossible to collect in sufficient volume from healthy barns.',
      color: '#a855f7',
    },
    annot: {
      id: 'annot',
      name: 'GROUND TRUTH ANNOTATIONS',
      source: 'USD Omniverse Core',
      destination: 'AI Training Pipeline (TAO)',
      type: 'Automated 3D Labels',
      description: 'Pixel-perfect 2D/3D bounding boxes, instance segmentation masks, and joint keypoints generated with 100% ground-truth accuracy without manual labeling costs.',
      color: '#f59e0b',
    },
    model: {
      id: 'model',
      name: 'OPTIMIZED TENSORRT MODEL',
      source: 'AI Training Pipeline (TAO)',
      destination: 'NVIDIA Jetson Edge Node',
      type: 'Quantized FP16 Engine',
      description: 'Fine-tuned vision AI neural network serialized into an efficient TensorRT engine tailored for Jetson Orin edge silicon.',
      color: '#3b82f6',
    },
    stream: {
      id: 'stream',
      name: 'LIVE OPTICAL VIDEO STREAM',
      source: '4K Overhead Barn Camera',
      destination: 'NVIDIA Jetson Edge Node',
      type: 'RTSP Video Feed',
      description: 'Real-time uncompressed optical surveillance feed captured at 30 FPS under dynamic industrial lighting.',
      color: '#76b900',
    },
    alert: {
      id: 'alert',
      name: 'EARLY DISEASE DETECTION & ALERT',
      source: 'NVIDIA Jetson Edge AI',
      destination: 'Farm Manager Dashboard & Mobile Notification',
      type: 'Biometric Telemetry Alert',
      description: 'Automated alert triggered within 13 seconds of sustained lethargic recumbency, flagging high-risk animals before contagious spread.',
      color: '#ef4444',
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-[980px] max-w-full max-h-[94vh] rounded-2xl border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-dark-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  HOW EVERYTHING CONNECTS
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                  SYSTEM ARCHITECTURE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive mapping of data, model weights, and telemetry flowing between Omniverse, Cosmos, TAO, and Jetson
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

        {/* Content Body: Visual Hybrid Diagram */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Visual Architecture Flowchart */}
          <div className="bg-dark-900/80 p-6 rounded-2xl border border-slate-800 relative">
            <div className="flex flex-col items-center space-y-6">
              {/* TOP NODE: NVIDIA OMNIVERSE DIGITAL TWIN */}
              <div className="p-4 rounded-xl bg-dark-950 border-2 border-nvidia shadow-glow-green text-center w-72">
                <div className="flex items-center justify-center gap-2 text-nvidia font-mono font-bold text-xs mb-1">
                  <Layers className="w-4 h-4" /> NVIDIA OMNIVERSE
                </div>
                <div className="text-sm font-bold text-white">USD DIGITAL TWIN</div>
                <div className="text-[10px] text-slate-400 mt-1">Virtual 3D Barn & Behavior Simulation</div>
              </div>

              {/* Data paths branching down */}
              <div className="w-full flex items-center justify-center gap-2">
                <button
                  onMouseEnter={() => setHoveredConn(connections.geom)}
                  onMouseLeave={() => setHoveredConn(null)}
                  className="px-3 py-1.5 rounded-full border border-cyan-500/50 bg-cyan-950/40 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-900/60 transition-all flex items-center gap-1.5"
                >
                  <span>Geometry & Behavior</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onMouseEnter={() => setHoveredConn(connections.annot)}
                  onMouseLeave={() => setHoveredConn(null)}
                  className="px-3 py-1.5 rounded-full border border-amber-500/50 bg-amber-950/40 text-amber-300 text-xs font-mono font-bold hover:bg-amber-900/60 transition-all flex items-center gap-1.5"
                >
                  <span>Automated Annotations</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* MIDDLE TIER: COSMOS + AI TRAINING */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* NVIDIA COSMOS */}
                <div className="p-4 rounded-xl bg-purple-950/30 border-2 border-purple-500 text-center">
                  <div className="flex items-center justify-center gap-2 text-purple-400 font-mono font-bold text-xs mb-1">
                    <Sparkles className="w-4 h-4" /> NVIDIA COSMOS
                  </div>
                  <div className="text-sm font-bold text-white">SYNTHETIC DATA FACTORY</div>
                  <div className="text-[10px] text-slate-400 mt-1">Rare Disease Synthesis & Physics Curation</div>

                  <button
                    onMouseEnter={() => setHoveredConn(connections.synth)}
                    onMouseLeave={() => setHoveredConn(null)}
                    className="mt-3 px-3 py-1 rounded-full border border-purple-500/50 bg-purple-950/80 text-purple-300 text-xs font-mono font-bold hover:bg-purple-900 transition-all inline-flex items-center gap-1"
                  >
                    <span>Synthetic Video Streams</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* NVIDIA TAO TRAINING */}
                <div className="p-4 rounded-xl bg-blue-950/30 border-2 border-blue-500 text-center">
                  <div className="flex items-center justify-center gap-2 text-blue-400 font-mono font-bold text-xs mb-1">
                    <Cpu className="w-4 h-4" /> NVIDIA TAO TOOLKIT
                  </div>
                  <div className="text-sm font-bold text-white">AI TRAINING PIPELINE</div>
                  <div className="text-[10px] text-slate-400 mt-1">Multi-modal Swine Health Model Training</div>

                  <button
                    onMouseEnter={() => setHoveredConn(connections.model)}
                    onMouseLeave={() => setHoveredConn(null)}
                    className="mt-3 px-3 py-1 rounded-full border border-blue-500/50 bg-blue-950/80 text-blue-300 text-xs font-mono font-bold hover:bg-blue-900 transition-all inline-flex items-center gap-1"
                  >
                    <span>Trained TensorRT Model</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* LOWER TIER: NVIDIA JETSON & LIVE CAMERA */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* JETSON EDGE */}
                <div className="p-4 rounded-xl bg-amber-950/30 border-2 border-amber-500 text-center">
                  <div className="flex items-center justify-center gap-2 text-amber-400 font-mono font-bold text-xs mb-1">
                    <Boxes className="w-4 h-4" /> NVIDIA JETSON
                  </div>
                  <div className="text-sm font-bold text-white">EDGE AI DEPLOYMENT</div>
                  <div className="text-[10px] text-slate-400 mt-1">28ms Local Inference in Barn Facility</div>
                </div>

                {/* LIVE BARN CAMERAS */}
                <div className="p-4 rounded-xl bg-cyan-950/30 border-2 border-cyan-500 text-center">
                  <div className="flex items-center justify-center gap-2 text-cyan-400 font-mono font-bold text-xs mb-1">
                    <Video className="w-4 h-4" /> LIVE 4K CAMERAS
                  </div>
                  <div className="text-sm font-bold text-white">OPTICAL SURVEILLANCE</div>
                  <div className="text-[10px] text-slate-400 mt-1">30 FPS Live Real-World Pen Video</div>

                  <button
                    onMouseEnter={() => setHoveredConn(connections.stream)}
                    onMouseLeave={() => setHoveredConn(null)}
                    className="mt-3 px-3 py-1 rounded-full border border-cyan-500/50 bg-cyan-950/80 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-900 transition-all inline-flex items-center gap-1"
                  >
                    <span>Live Video Ingestion</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* FINAL DISPATCH: DISEASE ALERT */}
              <div className="p-4 rounded-xl bg-red-950/40 border-2 border-red-500 shadow-glow-red text-center w-80">
                <div className="flex items-center justify-center gap-2 text-red-400 font-mono font-bold text-xs mb-1">
                  <ShieldAlert className="w-4 h-4" /> REAL-TIME ACTION
                </div>
                <div className="text-sm font-bold text-white">DISEASE DETECTION & ALERT</div>
                <div className="text-[10px] text-slate-400 mt-1">Instant Notification to Farm Operators</div>
              </div>
            </div>
          </div>

          {/* Interactive Inspection Detail Box */}
          <div className="p-4 rounded-xl bg-dark-900/90 border border-slate-700 min-h-[90px] flex items-center justify-between">
            {hoveredConn ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredConn.color }} />
                  <span className="text-xs font-mono font-bold text-white">{hoveredConn.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {hoveredConn.source} ➔ {hoveredConn.destination}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{hoveredConn.description}</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Hover over any connection pill above to inspect the exact data and model formats transmitted between pipeline layers.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-dark-900/80 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            Conceptual hybrid architecture for educational demonstration
          </span>
          <button
            onClick={() => store.setActiveModal('none')}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-dark-950 font-bold transition-all"
          >
            Return to 3D Digital Twin
          </button>
        </div>
      </div>
    </div>
  );
};
