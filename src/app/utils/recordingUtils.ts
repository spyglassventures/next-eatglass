/* eslint-disable */

/**
 * Dienstprogrammfunktionen für Audioaufnahmen
 */

// Typ für Aufnahmeergebnis
export interface RecordingResult {
    stream: MediaStream;
    recorder: any;
}

/**
 * Starten der Audioaufnahme
 * @returns Promise mit dem Medienstream und Recorder
 */
export const startRecording = async (): Promise<RecordingResult> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Ihr Browser unterstützt keine Audioaufnahmen");
    }

    try {
        // Audiostream abrufen
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });

        // Dynamischer Import von RecordRTC
        const { default: RecordRTC } = await import("recordrtc");

        // Recorder konfigurieren
        const recorder = new RecordRTC(stream, {
            type: "audio",
            mimeType: "audio/webm",
            recorderType: RecordRTC.StereoAudioRecorder,
            numberOfAudioChannels: 1, // Mono für bessere Spracherkennung
            desiredSampRate: 16000, // 16kHz Abtastrate
            timeSlice: 1000, // Visualisierung jede Sekunde aktualisieren
        });

        // Aufnahme starten
        recorder.startRecording();

        return { stream, recorder };
    } catch (err) {
        console.error("Aufnahmefehler:", err);
        throw new Error("Fehler beim Starten der Aufnahme");
    }
};

/**
 * Aufnahme stoppen und Audio-Blob erhalten
 * @param recorder Die RecordRTC-Instanz
 * @param callback Funktion, die mit dem Audio-Blob aufgerufen wird
 */
export const stopRecording = (
    recorder: any,
    callback: (blob: Blob) => void
): void => {
    if (!recorder) {
        throw new Error("Recorder nicht initialisiert");
    }

    recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        callback(blob);

        // Recorder zerstören, um Ressourcen freizugeben
        recorder.destroy();
    });
};

/**
 * Audio-Blob in Base64-String konvertieren
 * @param blob Audio-Blob
 * @returns Promise mit Base64-String
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String.split(',')[1]); // Daten-URL-Präfix entfernen
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

/**
 * Dauer eines Audio-Blobs in Sekunden ermitteln
 * @param blob Audio-Blob
 * @returns Promise mit Dauer in Sekunden
 */
export const getAudioDuration = (blob: Blob): Promise<number> => {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.onloadedmetadata = () => {
            resolve(audio.duration);
        };
        audio.onerror = () => {
            reject(new Error("Audio-Metadaten konnten nicht geladen werden"));
        };
        audio.src = URL.createObjectURL(blob);
    });
};