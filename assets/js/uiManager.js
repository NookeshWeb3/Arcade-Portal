/**
 * UIManager
 * Handles the dynamic updates of the Dashboard UI.
 */
import { leaderboardManager } from './leaderboard.js';
import { playerManager } from './playerManager.js';

class UIManager {
    constructor() {
        this.topPlayersContainer = document.getElementById('top-players-list');
        this.playerCard = {
            name: document.getElementById('curr-player-name'),
            stats: document.getElementById('curr-player-stats'),
            activity: document.getElementById('curr-player-activity')
        };
    }

    updateDashboard() {
        this.renderTopPlayers();
        this.renderPlayerCard();
    }

    renderTopPlayers() {
        if (!this.topPlayersContainer) return;

        const topScores = leaderboardManager.getTopScores(null, 10);

        this.topPlayersContainer.innerHTML = topScores.map((entry, index) => {
            const rank = index + 1;
            let badgeClass = '';
            if (rank === 1) badgeClass = 'gold';
            else if (rank === 2) badgeClass = 'silver';
            else if (rank === 3) badgeClass = 'bronze';

            return `
                <div class="leaderboard-row ${badgeClass}">
                    <div class="rank-cell"><span class="rank-badge">${rank}</span></div>
                    <div class="name-cell">${entry.playerName}</div>
                    <div class="game-cell">${entry.gameName}</div>
                    <div class="score-cell">${entry.score.toLocaleString()}</div>
                    <div class="time-cell">${this.formatDate(entry.timestamp)}</div>
                </div>
            `;
        }).join('');

        if (topScores.length === 0) {
            this.topPlayersContainer.innerHTML = '<div class="empty-msg">No high scores yet. Be the first!</div>';
        }
    }

    renderPlayerCard() {
        const player = playerManager.getCurrentPlayer();
        if (!this.playerCard.name) return;

        this.playerCard.name.textContent = player.name || 'Guest';

        const statsHtml = `
            <div class="stat-item"><span>Total Plays:</span> <strong>${player.totalGamesPlayed}</strong></div>
            <div class="stat-item"><span>Highest Score:</span> <strong>${player.highestScore}</strong></div>
            <div class="stat-item"><span>Total Points:</span> <strong>${player.totalScoreAccumulated}</strong></div>
        `;
        this.playerCard.stats.innerHTML = statsHtml;

        const activityHtml = player.recentActivity.map(act => `
            <div class="activity-item">
                <span>${act.game}</span>
                <span>${act.score} pts</span>
                <span class="time">${this.formatDate(act.timestamp)}</span>
            </div>
        `).join('');
        this.playerCard.activity.innerHTML = activityHtml || '<div class="empty-msg">No recent activity</div>';
    }

    formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

export const uiManager = new UIManager();
