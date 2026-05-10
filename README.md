# 🕹️ NEON ARCADE PLATFORM

A professional-grade, scalable gaming portal built with a modern neon-dark aesthetic.

## 📁 Project Structure
```
ArcadePortal/
├── index.html          # Main Entry Point
├── assets/            # Shared Resources
│   ├── css/style.css  # Portal Global Styles
│   └── js/script.js   # Portal Global Logic
├── games/             # Game Modules
│   ├── snake/          # Snake Game Logic & UI
│   └── brickbreaker/   # Brick Breaker Logic & UI
└── data/              # Persistence Layer
    └── leaderboard.json
```

## ✨ Features
- **Neon Glassmorphism UI**: High-end modern design with animated backgrounds.
- **Modular Architecture**: Games are decoupled from the main portal.
- **Responsive Gameplay**: Works across desktop and mobile devices.
- **Dynamic Loading**: Games load within a managed iframe modal.
- **State Management**: Ready for leaderboard and score tracking.

## 🚀 How to Run
1. Clone the repository or navigate to the `ArcadePortal` folder.
2. Open `index.html` using a modern web browser (Chrome, Firefox, Edge).
3. For the best experience, use a **Live Server** extension (like VS Code Live Server).

## 🛠️ Technologies Used
- **HTML5**: Semantic structure and Canvas API.
- **CSS3**: Grid, Flexbox, Keyframe Animations, and Glassmorphism.
- **Vanilla JavaScript**: ES6+ modular logic.

## 🗺️ Roadmap
- [ ] Integration with `leaderboard.json` for global high scores.
- [ ] Adding new game modules in `games/future-games/`.
- [ ] Sound effects and background music.
- [ ] User account system with local storage.
