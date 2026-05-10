/**
 * StorageManager
 * Handles all low-level localStorage operations for the Arcade Portal.
 * Ensures data persistence across sessions.
 */
class StorageManager {
    static save(key, data) {
        try {
            localStorage.setItem(`arcade_${key}`, JSON.stringify(data));
        } catch (e) {
            console.error(`Error saving ${key} to storage:`, e);
        }
    }

    static load(key) {
        try {
            const data = localStorage.getItem(`arcade_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error(`Error loading ${key} from storage:`, e);
            return null;
        }
    }

    static remove(key) {
        localStorage.removeItem(`arcade_${key}`);
    }
}

export default StorageManager;
