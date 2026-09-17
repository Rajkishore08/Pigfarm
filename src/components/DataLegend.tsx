import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Share2 } from 'lucide-react';

export const DataLegend: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute bottom-4 right-4 z-20 pointer-events-auto select-none max-w-[280px]">
      <div className="glass-panel p-3 rounded-xl border border-slate-800/80 shadow-2xl space-y-2">
        {/* Header */}
        <div 
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between cursor-pointer text-xs font-mono font-bold text-slate-300"
        >
          <div className="flex items-center gap-1.5 text-nvidia">
            <Share2 className="w-3.5 h-3.5" />
            <span>DATA FLOW & GUIDE</span>
          </div>
          <button className="text-slate-400 hover:text-white">
            {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {!collapsed && (
          <>
            {/* Legend Streams */}
            <div className="space-y-1.5 pt-1 text-[11px] font-mono border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-1.5 rounded bg-cyan-400 shrink-0" />
                <span className="text-slate-300">STRUCTURED DATA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-1.5 rounded bg-purple-400 shrink-0" />
                <span className="text-slate-300">SYNTHETIC DATA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-1.5 rounded bg-green-400 shrink-0" />
                <span className="text-slate-300">LIVE SENSOR DATA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-1.5 rounded bg-red-400 shrink-0" />
                <span className="text-slate-300">AI PREDICTION</span>
              </div>
            </div>

            {/* Quick How To Use Guide */}
            <div className="pt-2 border-t border-slate-800 text-[10px] space-y-1 text-slate-400">
              <div className="font-bold text-slate-300 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-cyan-400" />
                <span>QUICK START</span>
              </div>
              <ol className="list-decimal list-inside space-y-0.5 pl-0.5">
                <li>Orbit & zoom the 3D barn</li>
                <li>Click any pig, sensor, or pen</li>
                <li>Generate synthetic scenarios</li>
                <li>Train the swine health model</li>
                <li>Launch live AI detection</li>
                <li>Observe the 13s alert test</li>
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
