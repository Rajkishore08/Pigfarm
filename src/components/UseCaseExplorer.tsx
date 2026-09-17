import React from 'react';
import { 
  Lightbulb, 
  ShieldAlert, 
  Sparkles, 
  Activity, 
  Eye, 
  Cpu, 
  Layers, 
  TrendingUp, 
  Check,
  X
} from 'lucide-react';
import { useSimulation } from '../state/useSimulationStore';

interface UseCase {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  action: () => void;
  badge: string;
}

export const UseCaseExplorer: React.FC = () => {
  const store = useSimulation();

  if (store.activeModal !== 'usecases') {
    return null;
  }

  const cases: UseCase[] = [
    {
      id: 'early-detection',
      title: '1. Early Disease Detection',
      category: 'Clinical Health',
      badge: 'Critical Impact',
      icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
      description: 'Identifies subtle hypokinesis, prolonged recumbency, and fever signatures days before visible physical symptoms or contagion onset.',
      action: () => {
        store.setActiveModal('none');
        store.runDiseaseScenario();
      }
    },
    {
      id: 'rare-scenarios',
      title: '2. Rare Disease Scenario Simulation',
      category: 'NVIDIA Cosmos',
      badge: 'Zero Biosafety Risk',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      description: 'Generates pathological scenarios without needing to infect real animals in physical experimental research barns.',
      action: () => {
        store.setActiveModal('cosmos');
        store.setStage('data-generation');
      }
    },
    {
      id: 'behavioral-monitoring',
      title: '3. Real-Time Behavioral Monitoring',
      category: 'Computer Vision',
      badge: '24/7 Autonomy',
      icon: <Activity className="w-5 h-5 text-cyan-400" />,
      description: 'Classifies micro-behaviors including feed bunk visits, water nipple touches, pen aggression, and sleeping postures.',
      action: () => {
        store.setActiveModal('none');
        store.setStage('digital-twin');
        store.setSelectedObject({ type: 'PIG', id: 'pig-024', data: store.pigs.find(p => p.id === 'pig-024') });
      }
    },
    {
      id: 'livestock-surveillance',
      title: '4. Automated Livestock Surveillance',
      category: 'Vision Systems',
      badge: 'Overhead 4K',
      icon: <Eye className="w-5 h-5 text-green-400" />,
      description: 'Replaces stressful and manual human barn walks with continuous multi-camera tracking across high-density pens.',
      action: () => {
        store.setActiveModal('none');
        store.setStage('ai-inference');
        store.toggleCameraFeedMode();
      }
    },
    {
      id: 'synthetic-training',
      title: '5. Synthetic Training Data Generation',
      category: 'Model Optimization',
      badge: 'NVIDIA TAO',
      icon: <Layers className="w-5 h-5 text-blue-400" />,
      description: 'Overcomes severe real-world data scarcity by generating thousands of synthetic annotated training frames automatically.',
      action: () => {
        store.setActiveModal('training');
        store.setStage('ai-training');
      }
    },
    {
      id: 'edge-monitoring',
      title: '6. Edge AI On-Premise Monitoring',
      category: 'NVIDIA Jetson',
      badge: '28ms Latency',
      icon: <Cpu className="w-5 h-5 text-amber-400" />,
      description: 'Runs offline low-power TensorRT neural network inference directly in rural barns with intermittent internet access.',
      action: () => {
        store.setActiveModal('none');
        store.setStage('edge-deployment');
        store.setSelectedObject({ type: 'JETSON', id: 'jetson-orin-01' });
      }
    },
    {
      id: 'digital-twin-sim',
      title: '7. Digital Twin Facility Simulation',
      category: 'NVIDIA Omniverse',
      badge: 'USD Standard',
      icon: <Layers className="w-5 h-5 text-nvidia" />,
      description: 'Creates a synchronized 3D digital duplicate linking IoT sensors, pen ventilation, and animal positions.',
      action: () => {
        store.setActiveModal('none');
        store.setStage('digital-twin');
        store.setSelectedObject({ type: 'BARN', id: 'digital-twin-barn' });
      }
    },
    {
      id: 'farm-intelligence',
      title: '8. Farm Operational Intelligence',
      category: 'Precision Farming',
      badge: 'Feed & Water ROI',
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      description: 'Optimizes feed conversion rates, predicts growth trajectories, and minimizes antibiotic treatments through early intervention.',
      action: () => {
        store.setActiveModal('none');
        store.setScenario('REDUCED_FEEDING');
      }
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-[940px] max-w-full max-h-[92vh] rounded-2xl border border-amber-500/40 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-dark-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  WHAT CAN THIS SYSTEM DO?
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700">
                  8 INTERACTIVE USE CASES
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Click any use case to configure the 3D digital twin and observe the pipeline in action
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

        {/* Content Body: 8 Grid Cards */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {cases.map((uc) => (
              <div
                key={uc.id}
                onClick={uc.action}
                className="bg-dark-900/80 hover:bg-dark-850 p-4 rounded-xl border border-slate-800 hover:border-slate-600 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-dark-950 border border-slate-800 group-hover:border-slate-600 transition-colors">
                      {uc.icon}
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                      {uc.badge}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white group-hover:text-nvidia transition-colors mb-1.5">
                    {uc.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {uc.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-[10px] text-slate-500">{uc.category}</span>
                  <span className="text-nvidia font-bold group-hover:translate-x-0.5 transition-transform">
                    Demonstrate →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-dark-900/80 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            Select any card to dynamically load that scenario into the 3D twin
          </span>
          <button
            onClick={() => store.setActiveModal('none')}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
