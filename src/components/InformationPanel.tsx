import React from 'react';
import { 
  Activity, 
  Thermometer, 
  Eye, 
  Radio, 
  Cpu, 
  ShieldAlert, 
  Video, 
  Layers, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useSimulation } from '../state/useSimulationStore';

export const InformationPanel: React.FC = () => {
  const store = useSimulation();
  const selected = store.selectedObject;

  // Helper for status badge
  const renderPigCard = () => {
    const pig = store.pigs.find(p => p.id === selected?.id) || store.pigs[0];
    const isLethargic = pig.behavior === 'LETHARGIC';

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-nvidia/20 text-nvidia border border-nvidia/30 font-bold">
                {pig.tagNumber}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                PEN #{pig.penId}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-1">
              Livestock Specimen Profile
            </h3>
          </div>

          <span className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 ${
            isLethargic 
              ? 'bg-red-950/80 text-red-400 border border-red-500 animate-pulse' 
              : 'bg-green-950/80 text-green-400 border border-green-500/50'
          }`}>
            {isLethargic ? <AlertTriangle className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
            {pig.behavior}
          </span>
        </div>

        {/* Real-time Vital Metrics */}
        <div className="grid grid-cols-2 gap-2">
          {/* Temperature */}
          <div className="bg-dark-900/80 p-2.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temperature
              </span>
              {pig.temperature > 39.4 && (
                <span className="text-[10px] text-red-400 font-bold">HIGH</span>
              )}
            </div>
            <div className="text-lg font-bold font-mono text-white">
              {pig.temperature}°C
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Normal: 38.5°C - 39.2°C
            </div>
          </div>

          {/* Activity Score */}
          <div className="bg-dark-900/80 p-2.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-cyan-400" /> Activity Index
              </span>
              {pig.activityScore < 40 ? (
                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <TrendingUp className="w-3.5 h-3.5 text-green-400" />
              )}
            </div>
            <div className="text-lg font-bold font-mono text-white">
              {pig.activityScore}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Movement: {pig.behavior === 'WALKING' ? 'Active' : isLethargic ? 'Immobile' : 'Normal'}
            </div>
          </div>

          {/* Feed Intake */}
          <div className="bg-dark-900/80 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-slate-400 text-[11px] block mb-1">Feed Rate</span>
            <div className="text-base font-bold font-mono text-white">
              {pig.feedIntakeRate} <span className="text-xs text-slate-400">kg/day</span>
            </div>
          </div>

          {/* AI Confidence */}
          <div className="bg-dark-900/80 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-slate-400 text-[11px] block mb-1">AI Confidence</span>
            <div className="text-base font-bold font-mono text-nvidia">
              {pig.aiConfidence}%
            </div>
          </div>
        </div>

        {/* Health Risk Gauge */}
        <div className={`p-3 rounded-lg border ${
          isLethargic 
            ? 'bg-red-950/40 border-red-500/60 text-red-200' 
            : 'bg-dark-900/60 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span>HEALTH RISK ASSESSMENT</span>
            <span className="font-mono font-bold">{pig.healthRisk}</span>
          </div>
          <div className="w-full bg-dark-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-500 ${
                isLethargic ? 'bg-red-500 w-[88%]' : 'bg-green-500 w-[15%]'
              }`} 
            />
          </div>
          {isLethargic && (
            <p className="text-[11px] text-red-300 mt-2 font-medium">
              ⚠ Critical behavioral deviation: persistent recumbency with slow respiration pattern flagged.
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              if (isLethargic) {
                store.updatePigStatus(pig.id, 'NORMAL', 38.7, 82, 'LOW', false);
              } else {
                store.updatePigStatus(pig.id, 'LETHARGIC', 39.8, 18, 'CRITICAL', true);
              }
            }}
            className={`w-full py-2 rounded-lg text-xs font-bold tracking-wide border transition-all flex items-center justify-center gap-1.5 ${
              isLethargic
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
                : 'bg-red-900/30 hover:bg-red-900/50 text-red-300 border-red-500/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isLethargic ? 'Reset to Normal State' : 'Simulate Lethargy Anomaly'}</span>
          </button>

          <button
            onClick={() => {
              store.setStage('ai-inference');
              store.toggleCameraFeedMode();
            }}
            className="w-full py-2 rounded-lg bg-dark-850 hover:bg-dark-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            <span>Switch to AI Camera Feed</span>
          </button>
        </div>
      </div>
    );
  };

  const renderSensorCard = () => {
    const sensor = store.sensors.find(s => s.id === selected?.id) || store.sensors[0];

    return (
      <div className="space-y-4">
        <div className="pb-3 border-b border-slate-800">
          <span className="text-xs font-mono text-green-400 bg-green-950/60 border border-green-800/50 px-2 py-0.5 rounded font-semibold">
            {sensor.id.toUpperCase()}
          </span>
          <h3 className="text-sm font-bold text-white mt-1.5">{sensor.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Pen #{sensor.penId} Environmental Telemetry</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-dark-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Temperature</span>
            <div className="text-lg font-bold font-mono text-white">{sensor.temperature}°C</div>
          </div>
          <div className="bg-dark-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Relative Humidity</span>
            <div className="text-lg font-bold font-mono text-white">{sensor.humidity}%</div>
          </div>
          <div className="bg-dark-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Ammonia (NH3)</span>
            <div className="text-lg font-bold font-mono text-white">{sensor.ammonia} ppm</div>
          </div>
          <div className="bg-dark-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Air Quality Index</span>
            <div className="text-lg font-bold font-mono text-green-400">{sensor.airQualityIndex} / 100</div>
          </div>
        </div>

        <div className="bg-dark-900/60 p-3 rounded-lg border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center justify-between font-semibold mb-1">
            <span>NODE STATUS</span>
            <span className="text-green-400 font-mono">OPTIMAL (99.8% Uptime)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            High-frequency BLE mesh reporting to NVIDIA Jetson edge gateway every 250ms.
          </p>
        </div>
      </div>
    );
  };

  const renderCameraCard = () => {
    const cam = store.cameras.find(c => c.id === selected?.id) || store.cameras[0];

    return (
      <div className="space-y-4">
        <div className="pb-3 border-b border-slate-800">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded font-semibold">
            {cam.id.toUpperCase()}
          </span>
          <h3 className="text-sm font-bold text-white mt-1.5">{cam.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Pen #{cam.penId} Vision AI Ingestion</p>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1.5 border-b border-slate-800/60">
            <span className="text-slate-400">Resolution</span>
            <span className="font-mono text-white">{cam.resolution}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-800/60">
            <span className="text-slate-400">Inference Stream</span>
            <span className="font-mono text-green-400">30 FPS Active</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-800/60">
            <span className="text-slate-400">Edge Pipeline Latency</span>
            <span className="font-mono text-cyan-400">{cam.edgeLatencyMs} ms</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-800/60">
            <span className="text-slate-400">Field of View</span>
            <span className="font-mono text-white">{cam.fov}° Wide Angle</span>
          </div>
        </div>

        <button
          onClick={() => {
            store.setStage('ai-inference');
            store.toggleCameraFeedMode();
          }}
          className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-dark-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-glow-cyan"
        >
          <Video className="w-3.5 h-3.5" />
          <span>Launch AI Inference Viewfinder</span>
        </button>
      </div>
    );
  };

  const renderJetsonCard = () => {
    return (
      <div className="space-y-4">
        <div className="pb-3 border-b border-slate-800">
          <span className="text-xs font-mono text-nvidia bg-nvidia/20 border border-nvidia/40 px-2 py-0.5 rounded font-bold">
            NVIDIA JETSON
          </span>
          <h3 className="text-sm font-bold text-white mt-1.5">AGX Orin Industrial Edge Server</h3>
          <p className="text-xs text-slate-400 mt-0.5">Local Micro-Data Center Inference</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-dark-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px] mb-1">Latency</span>
            <span className="text-lg font-mono font-bold text-cyan-400">28 ms</span>
          </div>
          <div className="bg-dark-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px] mb-1">Throughput</span>
            <span className="text-lg font-mono font-bold text-green-400">32 FPS</span>
          </div>
          <div className="bg-dark-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px] mb-1">Precision</span>
            <span className="text-sm font-mono font-semibold text-white">TensorRT FP16</span>
          </div>
          <div className="bg-dark-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px] mb-1">Power</span>
            <span className="text-sm font-mono font-semibold text-white">40W Mode</span>
          </div>
        </div>

        <div className="bg-dark-900/60 p-3 rounded-lg border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-nvidia font-bold mb-1">
            <Cpu className="w-3.5 h-3.5" /> Edge Autonomy
          </div>
          <p className="text-[11px] text-slate-400">
            AI inference occurs close to the camera, guaranteeing ultra-low detection latency without requiring continuous cloud connectivity.
          </p>
        </div>

        <button
          onClick={() => store.setActiveModal('jetson')}
          className="w-full py-2 rounded-lg bg-dark-850 hover:bg-dark-800 text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
        >
          <span>Open Edge Architecture Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  const renderBarnOverview = () => {
    return (
      <div className="space-y-4">
        <div className="pb-3 border-b border-slate-800">
          <span className="text-xs font-mono text-nvidia bg-nvidia/20 border border-nvidia/40 px-2 py-0.5 rounded font-bold">
            DIGITAL TWIN
          </span>
          <h3 className="text-sm font-bold text-white mt-1.5">Universal Scene Description (USD)</h3>
          <p className="text-xs text-slate-400 mt-0.5">Virtual representation of the commercial swine barn.</p>
        </div>

        <div className="space-y-2 bg-dark-900/60 p-3 rounded-lg border border-slate-800 text-xs">
          <div className="font-semibold text-slate-300 mb-2">Barn Structural Inventory:</div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-nvidia font-bold">✓</span> 3D slatted floor & corrugated architecture
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-nvidia font-bold">✓</span> 4 Monitored Pig Pens (48 animal capacity)
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-nvidia font-bold">✓</span> 4 Overhead 4K AI Cameras
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-nvidia font-bold">✓</span> 5 Multi-modal IoT Environmental Nodes
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-nvidia font-bold">✓</span> Biomechanical Behavioral state tracking
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-dark-900/80 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Active Specimen</span>
            <span className="text-base font-mono font-bold text-white">{store.pigs.length} Tracked</span>
          </div>
          <div className="p-2.5 bg-dark-900/80 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Spatial Precision</span>
            <span className="text-base font-mono font-bold text-cyan-400">±2 mm USD</span>
          </div>
        </div>

        <button
          onClick={() => {
            store.setSelectedObject({ type: 'PIG', id: 'pig-024', data: store.pigs.find(p => p.id === 'pig-024') });
          }}
          className="w-full py-2.5 rounded-lg bg-nvidia hover:bg-nvidia-light text-dark-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-glow-green"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Inspect Pig #024 (Demonstration Target)</span>
        </button>
      </div>
    );
  };

  return (
    <aside className="w-80 border-l border-slate-800/80 bg-dark-950/90 backdrop-blur-md flex flex-col justify-between p-4 z-10 select-none overflow-y-auto">
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
            INSPECTOR & CONTEXT
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {selected?.type || 'SYSTEM'}
          </span>
        </div>

        {selected?.type === 'PIG' && renderPigCard()}
        {selected?.type === 'SENSOR' && renderSensorCard()}
        {selected?.type === 'CAMERA' && renderCameraCard()}
        {selected?.type === 'JETSON' && renderJetsonCard()}
        {(!selected || selected?.type === 'BARN' || selected?.type === 'PEN') && renderBarnOverview()}
      </div>

      {/* Simulated Prototype Disclaimer */}
      <div className="pt-3 border-t border-slate-800/60 mt-4">
        <div className="bg-dark-900/80 p-2 rounded border border-slate-800/80 text-[10px] text-slate-400 font-mono">
          <div className="text-amber-400 font-bold tracking-wider mb-0.5">
            SIMULATED PROTOTYPE DATA
          </div>
          Educational demonstrator representing conceptual integration with NVIDIA Omniverse, Cosmos, TAO & Jetson.
        </div>
      </div>
    </aside>
  );
};
