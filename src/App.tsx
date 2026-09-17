import React from 'react';
import { Header } from './components/Header';
import { PipelineNavigator } from './components/PipelineNavigator';
import { InformationPanel } from './components/InformationPanel';
import { SimulationControls } from './components/SimulationControls';
import { DataLegend } from './components/DataLegend';
import { DigitalTwinCanvas } from './components/3d/DigitalTwinCanvas';
import { CameraPresetsBar } from './components/3d/CameraPresetsBar';
import { InferenceMonitor } from './components/InferenceMonitor';
import { CosmosModule } from './components/CosmosModule';
import { TrainingModule } from './components/TrainingModule';
import { EdgeNodeModule } from './components/EdgeNodeModule';
import { HowItConnectsModal } from './components/HowItConnectsModal';
import { UseCaseExplorer } from './components/UseCaseExplorer';
import { GuidedExplainer } from './components/GuidedExplainer';
import { DiseaseAlertBanner } from './components/DiseaseAlertBanner';

export function App() {
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-dark-950 text-slate-100 antialiased select-none">
      {/* Top System Bar */}
      <Header />

      {/* Main Interactive Stage & Sidebars */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Pipeline Navigation Sidebar */}
        <PipelineNavigator />

        {/* Center: 3D Digital Twin Viewport & Overlays */}
        <main className="flex-1 relative h-full overflow-hidden bg-cyber-grid">
          {/* Main 3D Canvas */}
          <DigitalTwinCanvas />

          {/* Camera Presets Toolbar for one-click angle switches */}
          <CameraPresetsBar />

          {/* Real-Time Camera Feed HUD Simulator */}
          <InferenceMonitor />

          {/* Floating Bottom Simulation & Environmental Controls */}
          <SimulationControls />

          {/* Persistent Data Flow Legend & Quick Guide */}
          <DataLegend />
        </main>

        {/* Right Dynamic Contextual Inspector */}
        <InformationPanel />
      </div>

      {/* Interactive Feature Overlays & Modals */}
      <CosmosModule />
      <TrainingModule />
      <EdgeNodeModule />
      <HowItConnectsModal />
      <UseCaseExplorer />
      <GuidedExplainer />
      <DiseaseAlertBanner />
    </div>
  );
}

export default App;
