# Anthony Fleming – Portfolio

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-blue?logo=github)](https://anthonyf2312.github.io/)
[![Build Status](https://img.shields.io/github/workflow/status/anthonyf2312/anthonyf2312.github.io/Deploy%20to%20GitHub%20Pages?label=build)](https://github.com/anthonyf2312/anthonyf2312.github.io/actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?logo=vite)](https://vitejs.dev/)

---

A modern, responsive portfolio website for Anthony Fleming, built with React, Vite, and Tailwind CSS. Showcases work, music, and personal story, with a focus on accessibility, performance, and design.

## 🚀 Features

- **Modern UI**: Minimalist, animated, and fully responsive
- **Dark Mode**: Toggle with system preference support
- **Sections**: Hero, Work (Graphene Discord Bot), Music (Spotify, visualizer), About (personal story, RRMS awareness)
- **Interactive Navbar**: Smooth scroll, dark mode toggle
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Performance**: Fast load times, code splitting, optimized assets

## 🛠️ Tech Stack

- **React 18**
- **Vite**
- **Tailwind CSS**
- **lucide-react** & **react-icons**

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/anthonyf2312/anthonyf2312.github.io.git
cd anthonyf2312.github.io
npm install
```

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

Output in `dist/`

## 🚢 Deployment

This site is ready for GitHub Pages. Build and deploy the `dist` folder, or use GitHub Actions for auto-deploy.

## 📁 Project Structure

```
├── src/
│   ├── components/     # React components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ScrollReveal.jsx
│   │   └── sections/
│   │       ├── Hero.jsx
│   │       ├── Work.jsx
│   │       ├── Music.jsx
│   │       └── About.jsx
│   ├── hooks/          # Custom hooks
│   │   └── useDarkMode.js
│   ├── pages/          # Page components
│   │   └── HomePage.jsx
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── postcss.config.js   # PostCSS config
```

## 👤 Author & Contact

- **Anthony Fleming**
- Discord: [Join Community](https://discord.com/invite/ycJmKVqety)
- GitHub: [GrapheneBot/GrapheneDiscordBot](https://github.com/GrapheneBot/GrapheneDiscordBot)
- Instagram: [@dot_wav3](https://instagram.com/dot_wav3)
- X (Twitter): [@AntFleming0](https://x.com/AntFleming0)
- Spotify: [Ant Fleming](https://open.spotify.com/artist/06BgaycqkokqPYneN8qDom)
- YouTube: [@Dot_WAV3](https://www.youtube.com/@Dot_WAV3)
- SoundCloud: [Anthony Fleming](https://soundcloud.com/anthony-fleming-753129500)

## 💡 Awareness

> "I navigate life with Relapsing-Remitting Multiple Sclerosis (RRMS). It teaches resilience and balance. While it doesn't define my work, it shapes my perspective."

## 📝 License

MIT © 2025 Anthony Fleming
