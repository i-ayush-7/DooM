<div align="center">
  <img src="https://img.shields.io/badge/OKRA-Zero_Trust_Vault-8b5cf6?style=for-the-badge&logoColor=white" alt="OKRA Logo" />
  <br />
  <h1>OKRA: Zero-Trust Identity Vault</h1>
  <p>
    <strong>Cryptographic lease management and live telemetry for autonomous AI agents.</strong>
  </p>
  <br />

  [![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
  [![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=flat-square&logo=three.js)](https://threejs.org/)
  [![Gemini](https://img.shields.io/badge/Google-Gemini_2.5_Flash-orange?style=flat-square&logo=google)](https://deepmind.google/technologies/gemini/)
  
</div>

<br />

## 🔒 The Problem
As autonomous AI agents increasingly act on behalf of users (reading emails, executing trades, booking travel, provisioning servers), handing them raw, unrestricted API keys or bank credentials presents a massive security vulnerability.

## 🛡️ The Solution
**OKRA** acts as a middleware vault and active firewall. Instead of raw API keys, users mint **"Leased Identity Tokens"** for specific agents. These tokens are bounded by strict financial budgets, immutable network scopes, and continuously monitored through our high-fidelity gateway simulation.

---

## 🌟 Key Features

- **Procedural 3D Environment**: A cinematic, endless cryptographic terrain rendered in WebGL (`Three.js`), featuring smooth procedural morphing (`Simplex Noise`) to simulate live data flow.
- **Identity Vault Minting**: Generate unique cryptographic tokens for agents, configuring strict budget ceilings and immutable scope permissions.
- **Dynamic Gateway Simulator**: Test boundaries in real-time. Attempt payload dispatches and watch the **Terminal Reveal** animation as the simulated gateway `AUTHORIZES` or `REJECTS` requests based on zero-trust parameters.
- **Core Intelligence (AI Chat)**: A beautifully integrated chatbot powered by the **Google Gemini 2.5 Flash** model. The AI is fully context-aware, fetching live dashboard telemetry to act as your elite cyber-analyst.
- **State Persistence**: 100% demo-ready. Custom local persistence hooks ensure that minted agents, audit logs, and settings survive browser refreshes.

---

## 🏗️ System Architecture

OKRA operates using a decoupled front-end architecture, rendering a highly dynamic 2D Glassmorphic interface seamlessly overlaid atop a WebGL Canvas.

```mermaid
graph TD
    subgraph UI Layer [React 18 Component Tree]
        App[App.jsx Layout]
        App --> Sidebar[Sidebar Navigation]
        App --> MainArea[Main Dashboard / Vault Area]
        
        MainArea --> Dashboard[System Dashboard]
        MainArea --> TVault[Token Vault Manager]
        MainArea --> GSim[Gateway Audit Simulator]
        MainArea --> Settings[Platform Settings]
    end

    subgraph 3D Rendering Engine [Background3D.jsx]
        ThreeJS[Three.js Scene]
        Noise[Simplex Noise Terrain]
        Tween[Tween.js Camera Sync]
        
        ThreeJS --> Noise
        ThreeJS --> Tween
    end

    subgraph State & Logic Management
        useVault((useVault.js Hook))
        LocalStorage[(Local Storage Persistence)]
        ChatWidget[AI Chat Widget]
        Gemini((Gemini 2.5 API))
        
        useVault <--> LocalStorage
        App <--> useVault
        ChatWidget <--> Gemini
        ChatWidget ..-> useVault
    end

    UI Layer -. Z-Index Overlay .-> 3D Rendering Engine
    Tween -. Listens to Route .-> App
```

---

## 💻 Tech Stack

| Technology | Purpose | Implementation Details |
| :--- | :--- | :--- |
| **React 18** | UI Framework | Component modularity and state management. |
| **Vite** | Build Tool | Extremely fast HMR and optimized production bundles. |
| **Tailwind CSS** | Styling | "Fintech-Noir" glassmorphism, precise utility classing. |
| **Framer Motion** | 2D Animation | `AnimatePresence` layout transitions, spring physics for modals. |
| **Three.js** | 3D Rendering | Wireframe WebGL scenes, particle effects, geometry generation. |
| **Tween.js** | 3D Camera | Cinematic camera panning during application routing. |
| **Google Gemini API**| AI Integration | `gemini-2.5-flash` model utilizing dynamic system prompts. |
| **Lucide React** | Iconography | Scalable, high-quality SVG vector icons. |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A valid Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/i-ayush-7/DooM.git
   cd DooM
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Gemini API key (refer to `.env.example`):
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key
   ```

4. **Launch the Application:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:5173/` in your browser.

---

## 📸 Screenshots & Visuals

*The application features a dark-premium aesthetic characterized by Obsidian blacks, Violet trails, and Emerald security indicators nested atop a moving 3D environment.*

<div align="center">
  <blockquote>
    <p><em>"Trust nothing. Verify everything. Encrypt the rest."</em></p>
  </blockquote>
</div>
