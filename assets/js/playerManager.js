/**
 * PlayerManager
 * Handles current player session and profile statistics.
 */
import StorageManager from './storage.js';

class PlayerManager {
    constructor() {
        this.currentPlayer = {
            name: '',
            totalGamesPlayed: 0,
            highestScore: 0,
            favoriteGame: 'None',
            totalScoreAccumulated: 0,
            recentActivity: []
        };
        this.loadProfile();
    }

    setCurrentPlayer(name) {
        this.currentPlayer.name = name;
        this.saveProfile();
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    updateStats(gameName, score) {
        this.currentPlayer.totalGamesPlayed++;
        this.currentPlayer.totalScoreAccumulated += score;

        if (score > this.currentPlayer.highestScore) {
            this.currentPlayer.highestScore = score;
        }

        // Simple favorite game tracking: game with most entries in activity
        this.currentPlayer.recentActivity.unshift({
            game: gameName,
            score: score,
            timestamp: new Date().toISOString()
        });

        // Keep only last 10 activities
        if (this.currentPlayer.recentActivity.length > 10) {
            this.currentPlayer.recentActivity.pop();
        }

        this.saveProfile();
    }

    saveProfile() {
        StorageManager.save('player_profile', this.currentPlayer);
    }

    loadProfile() {
        const savedProfile = StorageManager.load('player_profile');
        if (savedProfile) {
            this.currentPlayer = savedProfile;
        }
    }
}

export const playerManager = new PlayerManager();
