import { playerManager } from './playerManager.js';
import { leaderboardManager } from './leaderboard.js';
import { uiManager } from './uiManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const portalScreen = document.getElementById('portal-screen');
    const enterBtn = document.getElementById('enter-btn');
    const nameInput = document.getElementById('user-name');
    const greeting = document.getElementById('greeting');
    const gameCards = document.querySelectorAll('.game-card');
    const gameModal = document.getElementById('game-modal');
    const gameFrame = document.getElementById('game-frame');
    const closeModal = document.getElementById('close-modal');

    // 1. Initial Entrance Logic
    const handleEntrance = () => {
        const name = nameInput.value.trim();
        if (!name) {
            nameInput.style.borderColor = 'red';
            nameInput.animate([
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(0)' }
            ], { duration: 300 });
            return;
        }

        // Update Greeting and Player Profile
        greeting.textContent = `Welcome, ${name} 🎮`;
        playerManager.setCurrentPlayer(name);

        // Transition Screens
        welcomeScreen.classList.remove('active');

        setTimeout(() => {
            portalScreen.classList.add('active');
            uiManager.updateDashboard();
        }, 400);
    };

    enterBtn.addEventListener('click', handleEntrance);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleEntrance();
    });

    // 2. Game Launching Logic
    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const gameUrl = card.getAttribute('data-game');
            launchGame(gameUrl);
        });
    });

    function launchGame(url) {
        gameFrame.src = url;
        gameModal.style.display = 'flex';

        // Fade in effect
        gameModal.animate([
            { opacity: 0, transform: 'scale(0.9)' },
            { opacity: 1, transform: 'scale(1)' }
        ], { duration: 300, fill: 'forwards' });
    }

    // 3. Modal Control
    closeModal.addEventListener('click', () => {
        gameModal.style.display = 'none';
        gameFrame.src = ''; // Reset iframe to stop game audio/processes
    });

    // Close modal on clicking outside the content
    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) {
            closeModal.click();
        }
    });

    // Keyboard Accessibility
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && gameModal.style.display === 'flex') {
            closeModal.click();
        }
    });

    // 4. Real-time Communication from Games
    window.addEventListener('message', (event) => {
        // Basic security: Only accept messages from our own origin
        if (event.origin !== window.location.origin) return;

        const { type, data } = event.data;

        if (type === 'GAME_SCORE_SUBMIT') {
            const { gameName, score } = data;
            const playerName = playerManager.getCurrentPlayer().name;

            // Save to global leaderboard
            leaderboardManager.saveScore(gameName, playerName, score);

            // Update player stats
            playerManager.updateStats(gameName, score);

            // Refresh Dashboard UI
            uiManager.updateDashboard();

            console.log(`Score received from ${gameName}: ${score}`);
        }
    });
});
