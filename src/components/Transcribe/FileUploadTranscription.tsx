/* eslint-disable */

"use client";

import { useState } from "react";
import axios from "axios";

interface FileUploadProps {
    setTranscription: (text: string) => void;
    saveTranscription: (text: string) => void;
}

export default function FileUploadTranscription({ setTranscription, saveTranscription }: FileUploadProps) {
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setAudioBlob(event.target.files[0]);
        }
    };

    const transcribeAudio = async () => {
        if (!audioBlob) {
            setError("Bitte laden Sie zuerst eine Audiodatei hoch.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", audioBlob, "audio.wav");

            const response = await axios.post("/api/transcribe", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const transcriptionText = response.data.DisplayText || "Keine Transkription gefunden.";
            setTranscription(transcriptionText);
            saveTranscription(transcriptionText);
        } catch (err: any) {  // or a more specific error type if known
            console.error("Transcription error:", err); // Log the error for debugging
            setError("Fehler bei der Transkription.");
        }

        setLoading(false);
    };

    return (
        <div className="text-center">
            <input type="file" accept="audio/*" onChange={handleFileUpload} />
            <button onClick={transcribeAudio} disabled={loading} className="px-6 py-3 rounded-lg bg-green-500 text-white">
                {loading ? "Transkribiere..." : "Audio transkribieren"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}