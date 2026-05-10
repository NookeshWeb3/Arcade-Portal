/**
 * LeaderboardManager
 * Handles ranking, score tracking, and global high scores.
 */
import StorageManager from './storage.js';

class LeaderboardManager {
    constructor() {
        this.leaderboard = this.loadLeaderboard();
    }

    loadLeaderboard() {
        const data = StorageManager.load('leaderboard') || {
            snake: [],
            brickbreaker: []
        };
        return data;
    }

    saveScore(gameName, playerName, score) {
        if (!this.leaderboard[gameName]) {
            this.leaderboard[gameName] = [];
        }

        const entry = {
            playerName,
            gameName,
            score,
            timestamp: new Date().toISOString(),
            rank: 0 // Calculated on retrieval
        };

        this.leaderboard[gameName].push(entry);

        // Sort descending
        this.leaderboard[gameName].sort((a, b) => b.score - a.score);

        // Limit to top 50 for performance
        this.leaderboard[gameName] = this.leaderboard[gameName].slice(0, 50);

        StorageManager.save('leaderboard', this.leaderboard);
        return this.calculateRank(gameName, score);
    }

    calculateRank(gameName, score) {
        const scores = this.leaderboard[gameName].map(e => e.score);
        const rank = scores.findIndex(s => s >= score) + 1;
        return rank || 1;
    }

    getTopScores(gameName = null, limit = 10) {
        if (gameName) {
            return this.leaderboard[gameName]?.slice(0, limit) || [];
        }

        // Global Top Scores across all games
        let allScores = [];
        for (const game in this.leaderboard) {
            allScores = [...allScores, ...this.leaderboard[game]];
        }

        return allScores
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    getGlobalStats() {
        let totalPlays = 0;
        let totalPoints = 0;
        for (const game in this.leaderboard) {
            totalPlays += this.leaderboard[game].length;
            totalPoints += this.leaderboard[game].reduce((sum, entry) => sum + entry.score, 0);
        }
        return { totalPlays, totalPoints };
    }
}

export const leaderboardManager = new LeaderboardManager();
