import React from 'react';
import { Video, Globe, Grid, Boxes, Layers } from 'lucide-react';
import { useSimulation } from '../../state/useSimulationStore';

export const CameraPresetsBar: React.FC = () => {
  const store = useSimulation();

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-1.5 glass-panel px-2.5 py-1.5 rounded-full border border-slate-700/80 shadow-xl max-w-[95vw] overflow-x-auto select-none">
      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider pl-1.5 pr-1 hidden md:inline">
        CAMERA VIEW:
      </span>

      {/* Overview 3D */}
      <button
        onClick={() => {
          store.exitCameraFeedMode();
          store.setSelectedObject({ type: 'BARN', id: 'digital-twin-barn' });
        }}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
          store.selectedObject?.type === 'BARN' && !store.cameraFeedMode
            ? 'bg-nvidia text-dark-950 shadow-glow-green font-bold'
            : 'bg-dark-900/80 hover:bg-slate-800 text-slate-300'
        }`}
      >
        <Globe className="w-3 h-3" />
        <span>3D Orbit</span>
      </button>

      {/* Top Down View */}
      <button
        onClick={() => {
          store.exitCameraFeedMode();
          store.setSelectedObject({ type: 'PEN', id: 'pen-1' });
        }}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
          store.selectedObject?.id === 'pen-1' && !store.cameraFeedMode
            ? 'bg-cyan-500 text-dark-950 font-bold'
            : 'bg-dark-900/80 hover:bg-slate-800 text-slate-300'
        }`}
      >
        <Grid className="w-3 h-3" />
        <span>Pen 1 & 2</span>
      </button>

      {/* Pen 3 & 4 */}
      <button
        onClick={() => {
          store.exitCameraFeedMode();
          store.setSelectedObject({ type: 'PEN', id: 'pen-3' });
        }}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
          store.selectedObject?.id === 'pen-3' && !store.cameraFeedMode
            ? 'bg-cyan-500 text-dark-950 font-bold'
            : 'bg-dark-900/80 hover:bg-slate-800 text-slate-300'
        }`}
      >
        <Grid className="w-3 h-3" />
        <span>Pen 3 & 4</span>
      </button>

      {/* Focus on Target Pig #024 */}
      <button
        onClick={() => {
          store.exitCameraFeedMode();
          store.setSelectedObject({
            type: 'PIG',
            id: 'pig-024',
            data: store.pigs.find((p) => p.id === 'pig-024'),
          });
        }}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
          store.selectedObject?.id === 'pig-024' && !store.cameraFeedMode
            ? 'bg-red-500 text-white shadow-glow-red font-bold'
            : 'bg-dark-900/80 hover:bg-slate-800 text-slate-300'
        }`}
      >
        <span>🐖 Pig #024</span>
      </button>

      {/* Edge Node */}
      <button
        onClick={() => {
          store.exitCameraFeedMode();
          store.setSelectedObject({ type: 'JETSON', id: 'jetson-orin-01' });
        }}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
          store.selectedObject?.type === 'JETSON' && !store.cameraFeedMode
            ? 'bg-amber-500 text-dark-950 font-bold'
            : 'bg-dark-900/80 hover:bg-slate-800 text-slate-300'
        }`}
      >
        <Boxes className="w-3 h-3" />
        <span>Jetson</span>
      </button>

      <div className="h-3 w-[1px] bg-slate-700 mx-0.5" />

      {/* Toggle Live AI Camera Feed */}
      <button
        onClick={() => {
          if (store.cameraFeedMode) {
            store.exitCameraFeedMode();
          } else {
            store.setStage('ai-inference');
          }
        }}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
          store.cameraFeedMode
            ? 'bg-red-600 text-white border-red-400 shadow-glow-red font-bold'
            : 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 hover:bg-cyan-900'
        }`}
      >
        <Video className="w-3 h-3" />
        <span>{store.cameraFeedMode ? '✕ Exit Cam Feed' : 'Live AI Cam'}</span>
      </button>
    </div>
  );
};
