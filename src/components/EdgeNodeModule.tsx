import React from 'react';
import { 
  Boxes, 
  Cpu, 
  Video, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Zap, 
  WifiOff, 
  Server,
  X
} from 'lucide-react';
import { useSimulation } from '../state/useSimulationStore';

export const EdgeNodeModule: React.FC = () => {
  const store = useSimulation();

  if (store.activeModal !== 'jetson') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-[860px] max-w-full max-h-[92vh] rounded-2xl border border-amber-500/40 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-dark-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  EDGE AI DEPLOYMENT
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700">
                  NVIDIA JETSON AGX ORIN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous on-premise inference executing directly within the barn facility
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
          {/* Hardware Telemetry Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-dark-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">INFERENCE LATENCY</span>
              <div className="text-2xl font-mono font-bold text-cyan-400">28 ms</div>
              <span className="text-[10px] text-slate-500 mt-1 block">Sub-frame response</span>
            </div>

            <div className="bg-dark-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">THROUGHPUT</span>
              <div className="text-2xl font-mono font-bold text-green-400">32 FPS</div>
              <span className="text-[10px] text-slate-500 mt-1 block">4x 4K Camera Feeds</span>
            </div>

            <div className="bg-dark-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">AI ACCELERATOR</span>
              <div className="text-base font-mono font-bold text-white">TensorRT FP16</div>
              <span className="text-[10px] text-slate-500 mt-1 block">275 TOPS Compute</span>
            </div>

            <div className="bg-dark-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">NETWORK FAILOVER</span>
              <div className="text-base font-mono font-bold text-nvidia flex items-center gap-1">
                <WifiOff className="w-4 h-4" /> 100% Offline
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Zero cloud dependency</span>
            </div>
          </div>

          {/* Operational Checkmarks */}
          <div className="bg-dark-900/70 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-mono font-bold text-slate-300 block mb-1">
              EDGE NODE SYSTEM VERIFICATION
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2 bg-dark-950 rounded border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">MODEL LOADED</div>
                  <div className="text-[10px] text-slate-400">SwineGuard-v2 Engine</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-dark-950 rounded border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">CAMERAS CONNECTED</div>
                  <div className="text-[10px] text-slate-400">4x RTSP Streams Synced</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-dark-950 rounded border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">INFERENCE ACTIVE</div>
                  <div className="text-[10px] text-slate-400">Continuous Behavioral Scan</div>
                </div>
              </div>
            </div>
          </div>

          {/* Edge Data Flow Diagram */}
          <div className="bg-dark-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-300 block">
              LOCAL EDGE INFERENCE WORKFLOW
            </span>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center text-xs font-mono">
              <div className="p-3 bg-dark-950 rounded-lg border border-slate-800 flex-1 w-full">
                <Video className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
                <span className="text-white font-bold block">4K AI Camera</span>
                <span className="text-[10px] text-slate-400">RTSP Video Feed</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

              <div className="p-3 bg-amber-950/40 rounded-lg border border-amber-800/80 flex-1 w-full">
                <Cpu className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                <span className="text-amber-300 font-bold block">Jetson Edge Node</span>
                <span className="text-[10px] text-amber-400/80">Local TensorRT Exec</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

              <div className="p-3 bg-dark-950 rounded-lg border border-slate-800 flex-1 w-full">
                <Activity className="w-5 h-5 text-nvidia mx-auto mb-1.5" />
                <span className="text-white font-bold block">AI Inference</span>
                <span className="text-[10px] text-slate-400">Behavior Classification</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

              <div className="p-3 bg-red-950/40 rounded-lg border border-red-800 flex-1 w-full">
                <ShieldAlert className="w-5 h-5 text-red-400 mx-auto mb-1.5" />
                <span className="text-red-300 font-bold block">Early Alert</span>
                <span className="text-[10px] text-red-400/80">SMS / Dashboard Dispatch</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <strong className="text-white">Why Edge Deployment Matters:</strong> Rural livestock facilities frequently experience bandwidth throttles or intermittent cellular coverage. By hosting model inference directly on NVIDIA Jetson, disease symptoms are flagged in milliseconds without leaking sensitive farm video onto external cloud networks.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-dark-900/80 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-amber-400">
            * SIMULATED PROTOTYPE DATA
          </span>
          <button
            onClick={() => {
              store.setActiveModal('none');
              store.runDiseaseScenario();
            }}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-glow-red"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Test End-to-End Disease Detection</span>
          </button>
        </div>
      </div>
    </div>
  );
};
