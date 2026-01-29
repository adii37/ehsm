# Safety Engineer Portal (EHSM) - v2.0 Professional

A next-generation, high-performance portal for Safety Engineers to manage workplace incidents and risk assessments. Built with React and designed for seamless integration with SAP S/4HANA OData services.

## 🌟 Enhanced Features

- **Modern Sidebar Layout**: Professional navigation structure with collapsible sidebar for better focus.
- **Indigo & Slate Theme**: A clean, high-contrast typography and color palette for maximum readability.
- **Deep Interactivity**:
  - **Interactive Analytics**: Click on chart bars to instantly filter the incidents table.
  - **Detail Drawer & Modals**: Click any record to view comprehensive details in a beautiful overlay.
  - **Smart Filtering & Sorting**: Real-time search and multi-column sorting for flexible data exploration.
- **Resilient Connectivity**:
  - **Auto-Parsing Engine**: Robustly handles both XML (Atom Feed) and JSON OData responses.
  - **Skeleton Loaders**: Smooth, bento-style loading states for a premium user experience.
  - **Real-time Notifications**: Integrated `react-hot-toast` for feedback on sync and operations.

## 🛠 Technology Stack

- **Core**: React 18 (Vite)
- **State & Logic**: Custom Hooks, UseMemo for heavy filtering.
- **Visuals**: Framer Motion (Animations), Recharts (Analytics), Lucide-React (Icons).
- **Styling**: Vanilla CSS Utility System with Glassmorphism and Modern Card design.
- **OData Backend**: Specialized `fast-xml-parser` integration for SAP legacy XML responses.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Locally**:
   ```bash
   npm run dev
   ```
   *Proxy is pre-configured in `vite.config.js` to handle `/sap` routes to the backend.*

3. **Production Build**:
   ```bash
   npm run build
   ```

## 🏗 Project Architecture

- `src/services/api.js`: The OData gateway. Handles authentication and complex XML parsing logic.
- `src/pages/Dashboard.jsx`: The core engine. Manages state, sorting, filtering, and tabbed visualizations.
- `src/pages/Login.jsx`: Split-screen immersive login experience.
- `src/index.css`: Centralized design system with custom bento-grid and animation tokens.
