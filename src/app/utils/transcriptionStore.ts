// File: utils/transcriptionStore.ts

// Define the structure of a transcription item
export interface Transcription {
    id: string;
    text: string;
    date: string;
}

// Key used for localStorage
const STORAGE_KEY = "previousTranscriptions";

/**
 * Loads transcriptions from localStorage.
 * Returns an empty array if nothing is found or if parsing fails.
 */
export const loadTranscriptionsFromStorage = (): Transcription[] => {
    if (typeof window === 'undefined') {
        // Avoid running localStorage operations during server-side rendering
        return [];
    }
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Basic validation to ensure it's an array
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (error) {
        console.error("Failed to load or parse transcriptions from localStorage:", error);
    }
    return []; // Return empty array on error or if nothing is saved
};

/**
 * Saves an array of transcriptions to localStorage.
 * @param transcriptions The array of transcriptions to save.
 */
export const saveTranscriptionsToStorage = (transcriptions: Transcription[]): void => {
    if (typeof window === 'undefined') {
        // Avoid running localStorage operations during server-side rendering
        return;
    }
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transcriptions));
    } catch (error) {
        console.error("Failed to save transcriptions to localStorage:", error);
        // Optional: Add more robust error handling, maybe notify the user
    }
};