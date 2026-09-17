# AI-Powered Swine Health Digital Twin

> **From Synthetic Simulation to Real-Time Disease Detection**  
> An educational, interactive 3D digital twin demonstrator illustrating an end-to-end livestock biosecurity AI pipeline.

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r186-black?style=flat&logo=three.js)](https://threejs.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com)

---

## 🌟 Overview

This interactive web prototype demonstrates how modern digital twin simulation, generative AI, model training pipelines, and edge computing converge to protect livestock health:

```
DIGITAL TWIN (USD Facility Simulation)
        ↓
STRUCTURED DATA + ANNOTATIONS + BEHAVIORS
        ↓
SYNTHETIC DATA GENERATION (Cosmos Sim-to-Real & Rare Scenarios)
        ↓
AI TRAINING (TAO Toolkit Swine Health Neural Model)
        ↓
REAL-TIME INFERENCE (Overhead 4K Vision AI)
        ↓
DISEASE ALERT (Sub-13s Automated Biosecurity Flag)
        ↓
EDGE DEPLOYMENT (NVIDIA Jetson Autonomous On-Premise Compute)
```

---

## 🚀 Key Features

- **3D Procedural Barn Digital Twin**:
  - Slatted concrete drainage floors, galvanized steel pen railings, automatic feed troughs, and waterers.
  - Animated procedural 3D pigs with real-time behavioral locomotion (walking, feeding, resting, and lethargy with fever glow).
  - Overhead 4K AI surveillance cameras with dynamic vision frustum scan cones.
  - Multi-modal IoT environmental sensor beacons (temperature, relative humidity, ammonia NH3, motion).
  - Animated 3D Bézier particle streams depicting structured, synthetic, live sensor, and alert data flows.
- **NVIDIA Cosmos Concept (Synthetic Data Factory)**:
  - Sim-to-Real interactive split-slider visualizer.
  - Rare disease scenario generation (Normal → Reduced Activity → Acute Lethargy) with incrementing dataset counters.
  - Automated biomechanical physics curation & plausibility filtering.
- **NVIDIA TAO Toolkit Concept (AI Training)**:
  - Multi-modal dataset convergence (geometry, synthetic video, 3D annotations, disease profiles).
  - Interactive "Train Model" simulation with stepped progress (Data Ingestion → Annotation Processing → Model Training → Validation → Model Ready).
  - Simulated accuracy (95.4%), precision (93.8%), recall (92.6%), and loss curves.
- **Real-Time AI Vision Surveillance & 13s Disease Outbreak Sequence**:
  - Live CCTV camera viewfinder with optical HUD, scanning laser lines, and YOLO 3D bounding box tracking.
  - 1-Click 13-second automated sequence from initial activity drop to critical red alert dispatch.
- **NVIDIA Jetson AGX Orin Edge Node**:
  - 3D stylized edge computing server with black anodized heatsink fins and live heartbeat LEDs.
  - On-premise offline telemetry: **28ms latency**, **32 FPS throughput**, and TensorRT FP16 acceleration.
- **Interactive Guided Explainer (Story Mode)**:
  - 7-step guided architectural tour with smooth cinematic camera transitions and narrative audio-visual cue cards.
- **"How Everything Connects" & Use Case Explorer**:
  - Hybrid 2D/3D interactive architecture connection diagram with hover tooltips.
  - 8 real-world application deep-dive cards.
- **One-Click Camera Angle Presets**:
  - Switch instantly between 3D Orbit, Pen 1 & 2, Pen 3 & 4, Target Pig #024, Jetson Rack, and Live AI Camera view.

---

## 🛠 Tech Stack

- **Framework**: React 19, Vite 8, TypeScript
- **3D Graphics**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Styling**: Tailwind CSS, PostCSS, Lucide Icons
- **Design System**: NVIDIA-inspired dark industrial cyberpunk aesthetic (`#76B900` green, `#00E5FF` cyan, `#070A0F` obsidian)

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/Rajkishores/Pigfarm.git
cd Pigfarm

# Install dependencies (using npm with legacy-peer-deps configured via .npmrc)
npm install

# Start the local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Deploy to Vercel

### Method 1: Import via Vercel Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Click **Import Git Repository** and select `Rajkishores/Pigfarm`.
3. Vercel will automatically detect **Vite** via `vercel.json`.
4. Click **Deploy**.

### Method 2: Vercel CLI
```bash
npx vercel
```

---

## 📜 Disclaimer

This project is an **educational and architectural prototype**. All benchmarks, inference latency numbers, sensor readings, and video streams are simulated locally to demonstrate how modern digital twin simulation and edge AI technologies intersect in smart livestock management.
