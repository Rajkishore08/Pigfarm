import React from 'react';
import { ShieldAlert, AlertTriangle, Check, X, Bell } from 'lucide-react';
import { useSimulation } from '../state/useSimulationStore';

export const DiseaseAlertBanner: React.FC = () => {
  const store = useSimulation();

  if (!store.alertActive || !store.alertData) {
    return null;
  }

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[600px] max-w-[92vw] pointer-events-auto animate-in slide-in-from-top-6 duration-300">
      <div className="glass-panel-red p-4 rounded-2xl border-2 border-red-500 shadow-glow-red flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-red-600 text-white animate-bounce shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-600 text-white">
                CRITICAL BIOSECURITY ALERT
              </span>
              <span className="text-xs font-mono text-red-300">
                {store.alertData.timestamp}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white">
              Disease Risk Detected: {store.alertData.pigId}
            </h3>

            <p className="text-xs text-red-200">
              {store.alertData.message}
            </p>

            <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-red-300">
              <span>AI Confidence: <strong>94%</strong></span>
              <span>Risk Score: <strong>{store.alertData.riskScore}%</strong></span>
              <span>Edge Node: <strong>Jetson-01</strong></span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            onClick={() => store.dismissAlert()}
            className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 hover:text-white transition-colors"
            title="Dismiss Alert"
          >
            <X className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              store.dismissAlert();
              store.updatePigStatus('pig-024', 'NORMAL', 38.7, 82, 'LOW', false);
            }}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg"
          >
            Acknowledge & Treat
          </button>
        </div>
      </div>
    </div>
  );
};
