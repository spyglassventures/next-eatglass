// File: components/MedienDiktat/TranscriptionUI.tsx
"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import AudioRecorder from "@/components/Transcribe/AudioRecorder"; // Pfad anpassen, falls nötig

interface Transcription {
    id: string;
    text: string;
    date: string;
}

interface TranscriptionUIProps {
    primaryColor: string;
    previousTranscriptions: Transcription[];
    setPreviousTranscriptions: React.Dispatch<React.SetStateAction<Transcription[]>>;
    saveLocal: boolean;
}

export default function TranscriptionUI({
    primaryColor,
    previousTranscriptions,
    setPreviousTranscriptions,
    saveLocal,
}: TranscriptionUIProps) {
    // UI States
    const [showRecorder, setShowRecorder] = useState(true); // Tab: Aufnahme
    const [isRealtimeActive, setIsRealtimeActive] = useState(false); // Tab: Echtzeit
    const [isListening, setIsListening] = useState(false);
    const [realtimeText, setRealtimeText] = useState("");
    const [transcription, setTranscription] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // File-based transcription
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [loadingFileTranscription, setLoadingFileTranscription] = useState(false);

    // SpeechRecognition
    const recognitionRef = useRef<any>(null);
    const finalTranscriptRef = useRef<string>("");

    // Helper: persist to localStorage
    const persistTranscriptions = (list: Transcription[]) => {
        localStorage.setItem("previousTranscriptions", JSON.stringify(list));
    };

    // Immer UI + optional localStorage
    const handleNewTranscription = (text: string) => {
        setTranscription(text); // Nur im Main-Bereich anzeigen
        if (!saveLocal) return; // NICHT in localStorage oder sidebar speichern

        // Normalfall: auch in sidebar + localStorage
        const newItem: Transcription = {
            id: Date.now().toString(),
            text,
            date: new Date().toLocaleString("de-DE"),
        };
        const updated = [newItem, ...previousTranscriptions].slice(0, 10);
        setPreviousTranscriptions(updated);
        persistTranscriptions(updated);
    };

    // *** TABS logic ***
    const handleTabClick = (label: string) => {
        // Falls wir noch in Echtzeit sind, beenden:
        if (isRealtimeActive) stopRealtimeTranscription();

        if (label === "Aufnahme") {
            setShowRecorder(true);
        } else if (label === "Datei hochladen") {
            setShowRecorder(false);
        } else if (label === "Echtzeit") {
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

    // *** FILE UPLOAD/RECORDING logic ***
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setAudioBlob(e.target.files[0]);
        }
    };

    const handleRecordingComplete = (blob: Blob) => {
        setAudioBlob(blob);
    };

    const transcribeAudio = async () => {
        if (!audioBlob) {
            return setError("Bitte laden Sie zuerst eine Audiodatei hoch oder nehmen Sie eine auf.");
        }
        setError(null);
        setLoadingFileTranscription(true);
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

    // *** REALTIME logic ***
    const startRealtimeTranscription = () => {
        if (!("webkitSpeechRecognition" in window)) {
            setError("Echtzeit-Transkription wird in diesem Browser nicht unterstützt.");
            return;
        }
        setError(null);
        setRealtimeText("");
        finalTranscriptRef.current = "";

        setIsRealtimeActive(true);
        setIsListening(true);

        const recognition = new (window as any).webkitSpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "de-DE";

        recognition.onresult = (event: any) => {
            let interimTranscript = "";
            let finalTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const chunk = event.results[i][0].transcript + " ";
                if (event.results[i].isFinal) {
                    finalTranscript += chunk;
                } else {
                    interimTranscript += chunk;
                }
            }

            if (finalTranscript) {
                finalTranscriptRef.current += finalTranscript;
            }
            setRealtimeText(finalTranscriptRef.current + interimTranscript);
        };

        recognition.onend = () => {
            if (isListening) {
                recognition.start();
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Spracherkennungsfehler:", event.error);
            setError("Fehler bei der Echtzeit-Transkription.");
            stopRealtimeTranscription();
        };

        recognition.start();
    };

    const stopRealtimeTranscription = () => {
        setIsListening(false);
        setIsRealtimeActive(false);
        recognitionRef.current?.stop();

        const finalText = finalTranscriptRef.current.trim();
        if (finalText) {
            handleNewTranscription(finalText);
        }
        finalTranscriptRef.current = "";
    };

    const toggleRealtimeMode = () => {
        if (isRealtimeActive) {
            stopRealtimeTranscription();
        } else {
            startRealtimeTranscription();
        }
    };

    const continueRealtimeRecording = () => {
        if (isRealtimeActive) {
            setIsListening(true);
            recognitionRef.current?.start();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: primaryColor }}>
                Doc Dialog
            </h1>
            <p className="text-center text-gray-600 mb-8">
                Ihr intelligenter Audio-Transkriptionsdienst für medizinische Dokumentation
            </p>

            {/* Tabs */}
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

            {/* If real-time is paused: show button to continue */}
            {isRealtimeActive && !isListening && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <button
                        onClick={continueRealtimeRecording}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                    >
                        Aufnahme fortsetzen
                    </button>
                </div>
            )}

            {/* Datei hochladen */}
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
                                <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
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

            {/* Aufnahme */}
            {showRecorder && !isRealtimeActive && (
                <div>
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

            {/* Echtzeit */}
            {isRealtimeActive && (
                <div className="space-y-4">
                    <div className="text-center">
                        <div
                            className={`p-4 rounded-lg mb-4 ${isListening ? "bg-red-50 animate-pulse" : "bg-gray-50"
                                }`}
                        >
                            <p
                                className="text-sm mb-2"
                                style={{ color: isListening ? "#e53e3e" : "#718096" }}
                            >
                                {isListening
                                    ? "Aufnahme läuft - Sprechen Sie jetzt"
                                    : "Drücken Sie Start, um die Echtzeit-Transkription zu beginnen"}
                            </p>
                            <div className="flex justify-center items-center h-16">
                                {isListening && (
                                    <div className="flex items-center space-x-1">
                                        <div
                                            className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                                            style={{ animationDelay: "0ms" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                                            style={{ animationDelay: "250ms" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                                            style={{ animationDelay: "500ms" }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={toggleRealtimeMode}
                            className={`px-6 py-3 rounded-lg shadow transition-colors text-white ${isListening ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                                }`}
                        >
                            {isListening ? "Stoppen" : "Starten"}
                        </button>
                    </div>

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
                                {isListening && (
                                    <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                                        Live
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-700 whitespace-pre-line">{realtimeText}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Fehlermeldung */}
            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                    <p className="flex items-center gap-2">
                        <span className="text-xl">⚠️</span> {error}
                    </p>
                </div>
            )}

            {/* Schlussanzeige, nur wenn nicht realtime */}
            {transcription && !isRealtimeActive && (
                <div
                    className="mt-6 p-5 border rounded-lg"
                    style={{
                        backgroundColor: "rgba(36, 160, 237, 0.1)",
                        borderColor: "rgba(36, 160, 237, 0.3)",
                    }}
                >
                    <h2
                        className="font-bold text-lg mb-2"
                        style={{ color: primaryColor }}
                    >
                        Transkription:
                    </h2>
                    <p className="text-gray-700 whitespace-pre-line">{transcription}</p>
                </div>
            )}
        </div>
    );
}
