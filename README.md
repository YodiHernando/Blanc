<div align="center">
  <img src="public/blanc.png" alt="Blanc Logo" width="100" />
  <h1>Blanc Command Center</h1>
  <p><strong>A Minimalist, Local-First Personal Dashboard & Task Manager</strong></p>
</div>

<br />

> Blanc (French for "White/Clean") is an uncompromisingly minimal to-do list and personal command center. Stripping away heavy kanban boards and bloated matrices, Blanc embraces the Zen philosophy—giving you a tranquil, distraction-free environment to get actual work done.

## ✨ Core Features

- **Painless "Zen" UI:** Built heavily on Bento Grid alignments and glassmorphism. Completely clutter-free navigation.
- **Ultra Local & Fast:** 100% Client-side. Uses `Zustand` with `persist` middleware to save your tasks instantly into your browser's LocalStorage. Zero database latency, zero server cost.
- **Natural Language Parsing:** Automatically converts human inputs into functional due dates (combining `date-fns` & logic).
- **Butter-Smooth Motion:** Integrated with `Framer Motion` for organic, fluid transitions—from task completions to pop-up layouts.
- **Archive by Month:** Instead of deleting tasks into the void, your productivity is chronicled gracefully into a sticky-header monthly timeline.
- **Single-Click Domination:** Bypass tedious checkboxes. Hover over a task to unveil its urgency, click it once to modify its bounds, or click the discrete trash bin in the History view to permanently expunge it.

## 🛠 Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (v3.4) + clsx + tailwind-merge
- **State Manager:** Zustand
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Date Management:** date-fns

## 🚀 Getting Started

Since Blanc has no backend dependencies, setting it up on your local machine is extremely straightforward.

### 1. Requirements
Ensure you have **Node.js** (v18+) installed.

### 2. Installation
Clone the repository and install the dependencies:

```bash
git clone https://github.com/YodiHernando/blanc-app.git
cd blanc-app
npm install
```

### 3. Running the App
Spin up the local development server:

```bash
npm run dev
```
Navigate to `http://localhost:5173/` in your browser, and the space is yours.

## 📦 Building for Production
To generate a heavily optimized, compressed build ready for hosting platforms (like Vercel or Netlify):
```bash
npm run build
```
You can preview the frozen build file locally using: `npm run preview`

---
*Crafted with precision & focus by Yodi Hernando.*
