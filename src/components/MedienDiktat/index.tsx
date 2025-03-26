// File: app/medien/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AudioRecorder from "../../components/Transcribe/AudioRecorder";
import TranscriptSidebar from "@/components/MedienDiktat/TranscriptSidebar";

// download
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';



interface Transcription {
    id: string;
    text: string;
    date: string;
}

// Hilfsfunktion definieren
const downloadWordDoc = async (text: string) => {
    try {
        // .docx per GET laden
        const response = await axios.get('/forms/Blank/Briefkopf_blank.docx', {
            responseType: 'arraybuffer',
        });

        const zip = new PizZip(response.data);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Hier 'message' an den in der Vorlage verwendeten Platzhalter anpassen
        doc.setData({ message: text });
        doc.render();

        // Word-Datei als Blob generieren
        const out = doc.getZip().generate({
            type: 'blob',
            mimeType:
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        saveAs(out, 'Transkription.docx');
    } catch (error) {
        console.error('Error generating docx:', error);
    }
};

export default function MedienDiktat() {
    const [transcription, setTranscription] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Which tab is active: "Aufnahme" | "Datei hochladen" | "Echtzeit"
    const [showRecorder, setShowRecorder] = useState(true);

    // We keep transcriptions that appear in the sidebar
    const [previousTranscriptions, setPreviousTranscriptions] = useState<Transcription[]>([]);

    // Real-time transcription states
    const [isRealtimeActive, setIsRealtimeActive] = useState(false);
    const [realtimeText, setRealtimeText] = useState<string>("");

    // Toggle whether new transcriptions are saved & shown in the sidebar
    const [saveLocal, setSaveLocal] = useState(true);

    // We use these to manage real-time speech recognition
    const recognitionRef = useRef<any>(null);
    const finalTranscriptRef = useRef<string>("");

    const primaryColor = "#24a0ed";

    // Load from localStorage ONCE (on mount)
    useEffect(() => {
        const saved = localStorage.getItem("previousTranscriptions");
        if (saved) {
            setPreviousTranscriptions(JSON.parse(saved));
        }
        return () => {
            recognitionRef.current?.stop();
        };
    }, []);

    // Helper: write array to localStorage
    const persistTranscriptions = (transcriptions: Transcription[]) => {
        localStorage.setItem("previousTranscriptions", JSON.stringify(transcriptions));
    };

    // Create + show new transcription in main UI.
    // ONLY add to the sidebar + localStorage if "saveLocal" is true.
    const handleNewTranscription = (text: string) => {
        // Always show in main UI
        setTranscription(text);

        // If checkbox is unchecked, skip adding to sidebar.
        if (!saveLocal) {
            return; // ephemeral only
        }

        // Otherwise, build an item & store it in the sidebar + localStorage
        const newItem: Transcription = {
            id: Date.now().toString(),
            text,
            date: new Date().toLocaleString("de-DE"),
        };
        const updated = [newItem, ...previousTranscriptions].slice(0, 10);
        setPreviousTranscriptions(updated);
        persistTranscriptions(updated);
    };

    // Delete item from the sidebar array + localStorage
    const deleteTranscription = (id: string) => {
        const updated = previousTranscriptions.filter((t) => t.id !== id);
        setPreviousTranscriptions(updated);
        persistTranscriptions(updated);
    };

    // ========== AUDIO FILE TRANSCRIPTION LOGIC ============

    const [loadingFileTranscription, setLoadingFileTranscription] = useState(false);

    // handle file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setAudioBlob(e.target.files[0]);
        }
    };

    // handle finishing of local audio recording
    const handleRecordingComplete = (blob: Blob) => {
        setAudioBlob(blob);
    };

    // transcribe the uploaded or recorded file
    const transcribeAudio = async () => {
        if (!audioBlob) {
            return setError("Bitte laden Sie zuerst eine Audiodatei hoch oder nehmen Sie eine auf.");
        }
        setLoadingFileTranscription(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("file", audioBlob, "audio.wav");
            const res = await axios.post("/api/transcribe", formData);
            const text = res.data.DisplayText || "Keine Transkription gefunden.";

            handleNewTranscription(text);
        } catch (err) {
            console.error("Fehler:", err);
            setError("Fehler bei der Transkription der Audiodatei.");
        } finally {
            setLoadingFileTranscription(false);
        }
    };

    // ========== REAL-TIME TRANSCRIPTION LOGIC ============

    // Start real-time recognition
    const startRealtimeTranscription = () => {
        if (!("webkitSpeechRecognition" in window)) {
            setError("Echtzeit-Transkription wird in diesem Browser nicht unterstützt.");
            return;
        }
        setRealtimeText("");
        finalTranscriptRef.current = "";
        setIsRealtimeActive(true);

        const recognition = new (window as any).webkitSpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "de-DE";

        recognition.onresult = (event: any) => {
            let interimTranscript = "";
            let finalTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i][0].transcript + " ";
                if (event.results[i].isFinal) {
                    finalTranscript += result;
                } else {
                    interimTranscript += result;
                }
            }
            if (finalTranscript) {
                finalTranscriptRef.current += finalTranscript;
            }
            setRealtimeText(finalTranscriptRef.current + interimTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error("Spracherkennungsfehler:", event.error);
            setError("Fehler bei der Echtzeit-Transkription.");
            stopRealtimeTranscription();
        };

        recognition.start();
    };

    // Stop real-time completely
    const stopRealtimeTranscription = () => {
        setIsRealtimeActive(false);
        recognitionRef.current?.stop();

        // if user spoke final words, store them ephemeral or local
        const finalText = finalTranscriptRef.current.trim();
        if (finalText) {
            handleNewTranscription(finalText);
        }
        finalTranscriptRef.current = "";
    };

    // Toggle real-time mode fully
    const toggleRealtimeMode = () => {
        if (isRealtimeActive) {
            stopRealtimeTranscription();
        } else {
            startRealtimeTranscription();
        }
    };

    // ========== UI Handlers for tabs ============
    const [loadingMode, setLoadingMode] = useState("Aufnahme");

    const handleTabClick = (label: string) => {
        // If real-time is active, stop it
        if (isRealtimeActive) {
            stopRealtimeTranscription();
        }
        if (label === "Aufnahme") {
            setShowRecorder(true);
            setLoadingMode("Aufnahme");
        } else if (label === "Datei hochladen") {
            setShowRecorder(false);
            setLoadingMode("Datei hochladen");
        } else if (label === "Echtzeit") {
            setLoadingMode("Echtzeit");
            toggleRealtimeMode();
        }
    };

    const isActiveTab = (label: string) => {
        if (label === "Aufnahme") {
            return showRecorder && !isRealtimeActive;
        }
        if (label === "Datei hochladen") {
            return !showRecorder && !isRealtimeActive;
        }
        if (label === "Echtzeit") {
            return isRealtimeActive;
        }
        return false;
    };

    // Toggle local saving
    const toggleSaveLocal = () => {
        setSaveLocal((prev) => !prev);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {/* Sidebar */}
            <TranscriptSidebar
                previousTranscriptions={previousTranscriptions}
                loadTranscription={(text) => setTranscription(text)}
                deleteTranscription={deleteTranscription}
                primaryColor={primaryColor}
                saveLocal={saveLocal}
                toggleSaveLocal={toggleSaveLocal}
            />

            {/* Main content */}
            <div className="flex-1 p-4 md:p-8">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: primaryColor }}>
                        Doc Dialog
                    </h1>
                    <p className="text-center text-gray-600 mb-8">
                        Ihr intelligenter Audio-Transkriptionsdienst für medizinische Dokumentation
                    </p>

                    {/* Transcription Modes Selector */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                            {["Aufnahme", "Datei hochladen", "Echtzeit"].map((label) => {
                                const active = isActiveTab(label);
                                return (
                                    <button
                                        key={label}
                                        onClick={() => handleTabClick(label)}
                                        className={`px-4 py-2 rounded-md transition-colors ${active ? "text-white" : "text-gray-700 hover:bg-gray-200"
                                            }`}
                                        style={{ backgroundColor: active ? primaryColor : "transparent" }}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Datei hochladen mode */}
                    {!showRecorder && !isRealtimeActive && (
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        accept="audio/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="text-xl">📂</span>
                                        Audio hochladen
                                    </label>
                                </div>
                            </div>

                            {audioBlob && (
                                <div className="text-center">
                                    <div className="p-4 bg-gray-50 rounded-lg mb-4">
                                        <p className="text-sm text-gray-600 mb-2">
                                            Audiodatei bereit für Transkription
                                        </p>
                                        <audio
                                            controls
                                            src={URL.createObjectURL(audioBlob)}
                                            className="w-full"
                                        />
                                    </div>

                                    <button
                                        onClick={transcribeAudio}
                                        disabled={loadingFileTranscription}
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loadingFileTranscription ? (
                                            <span className="flex items-center gap-2">
                                                <svg
                                                    className="animate-spin h-5 w-5"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Transkribiere...
                                            </span>
                                        ) : (
                                            "Audio transkribieren"
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Aufnahme mode */}
                    {showRecorder && !isRealtimeActive && (
                        <div>
                            {/* This is where we have Pause & Resume in the local AudioRecorder. */}
                            <AudioRecorder onRecordingComplete={handleRecordingComplete} />

                            {audioBlob && (
                                <div className="text-center mt-4">
                                    <button
                                        onClick={transcribeAudio}
                                        disabled={loadingFileTranscription}
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loadingFileTranscription ? (
                                            <span className="flex items-center gap-2">
                                                <svg
                                                    className="animate-spin h-5 w-5"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Transkribiere...
                                            </span>
                                        ) : (
                                            "Audio transkribieren"
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Echtzeit mode */}
                    {isRealtimeActive && (
                        <div className="space-y-4">
                            <div className="text-center">
                                <div
                                    className="p-4 rounded-lg mb-4 bg-gray-50"
                                >
                                    <p className="text-sm mb-2 text-gray-700">
                                        Sprachaufnahme in Echtzeit
                                    </p>
                                </div>
                            </div>

                            {/* Show partial/final transcribed text */}
                            {realtimeText && (
                                <div
                                    className="p-5 border rounded-lg"
                                    style={{
                                        backgroundColor: "rgba(36, 160, 237, 0.1)",
                                        borderColor: "rgba(36, 160, 237, 0.3)",
                                    }}
                                >
                                    <div className="flex justify-between items-start">
                                        <h2
                                            className="font-bold text-lg mb-2"
                                            style={{ color: primaryColor }}
                                        >
                                            Echtzeit-Transkription:
                                        </h2>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-line">{realtimeText}</p>
                                </div>
                            )}
                            <button
                                onClick={stopRealtimeTranscription}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                            >
                                Aufnahme stoppen
                            </button>
                        </div>
                    )}

                    {/* Error msg */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                            <p className="flex items-center gap-2">
                                <span className="text-xl">⚠️</span> {error}
                            </p>
                        </div>
                    )}

                    {/* Non-realtime final transcription in main UI only*/}
                    {transcription && !isRealtimeActive && (
                        <div
                            className="mt-6 p-5 border rounded-lg"
                            style={{
                                backgroundColor: "rgba(36, 160, 237, 0.1)",
                                borderColor: "rgba(36, 160, 237, 0.3)",
                            }}
                        >
                            <h2 className="font-bold text-lg mb-2" style={{ color: primaryColor }}>
                                Transkription:
                            </h2>
                            <p className="text-gray-700 whitespace-pre-line">{transcription}</p>
                            <button
                                onClick={() => downloadWordDoc(transcription)}
                                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
                            >
                                Als Word herunterladen
                            </button>
                        </div>

                    )}

                </div>
            </div>
        </div>
    );
}
