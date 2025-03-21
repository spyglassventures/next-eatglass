"use client";

import React from 'react';
// Importing DocumentIcon if you plan to use it in the future
// import { DocumentIcon } from '@heroicons/react/24/solid';

// adjust in src/config/ai/components.js: import Translate from '@/components/Translate'; and fix buttons, icon, etc..
// { key: 'Translate', name: 'Translate', visible: true },
// ExclamationTriangleIcon,           // Import for Lieferengpass
// import Translate from '@/components/IntTranslate'; //
// case 'Translate':
//             return Translate;

/* eslint-disable */



import { useState, useEffect, useRef } from "react";
import axios from "axios";
import AudioRecorder from "../../components/Transcribe/AudioRecorder";
import Image from "next/image";

interface Transcription {
    id: string;
    text: string;
    date: string;
}

export default function MedienDiktat() {
    const [transcription, setTranscription] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showRecorder, setShowRecorder] = useState(true); // set default tab

    const [previousTranscriptions, setPreviousTranscriptions] = useState<Transcription[]>([]);

    // Real-time transcription states
    const [isRealtimeActive, setIsRealtimeActive] = useState(false);
    const [realtimeText, setRealtimeText] = useState<string>("");
    const [isListening, setIsListening] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<BlobPart[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    // Primary color for styling
    const primaryColor = "#24a0ed";

    // Load previous transcriptions from localStorage on component mount
    useEffect(() => {
        const savedTranscriptions = localStorage.getItem("previousTranscriptions");
        if (savedTranscriptions) {
            setPreviousTranscriptions(JSON.parse(savedTranscriptions));
        }
    }, []);

    // Cleanup function for real-time transcription
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const saveTranscription = (text: string) => {
        const newTranscription: Transcription = {
            id: Date.now().toString(),
            text: text,
            date: new Date().toLocaleString("de-DE"),
        };

        const updatedTranscriptions = [newTranscription, ...previousTranscriptions];
        // Keep only the last 10 transcriptions
        const limitedTranscriptions = updatedTranscriptions.slice(0, 10);

        setPreviousTranscriptions(limitedTranscriptions);
        localStorage.setItem("previousTranscriptions", JSON.stringify(limitedTranscriptions));
    };

    const deleteTranscription = (id: string) => {
        const updatedTranscriptions = previousTranscriptions.filter((t) => t.id !== id);
        setPreviousTranscriptions(updatedTranscriptions);
        localStorage.setItem("previousTranscriptions", JSON.stringify(updatedTranscriptions));
    };

    const loadTranscription = (text: string) => {
        setTranscription(text);
    };

    const handleRecordingComplete = (blob: Blob) => {
        setAudioBlob(blob);
        setShowRecorder(false);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setAudioBlob(event.target.files[0]);
        }
    };

    const transcribeAudio = async () => {
        if (!audioBlob) {
            setError("Bitte laden Sie zuerst eine Audiodatei hoch oder nehmen Sie eine auf.");
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

            // Save transcription locally
            saveTranscription(transcriptionText);
        } catch (err) {
            console.error("Fehler:", err);
            setError("Fehler bei der Transkription der Audiodatei.");
        }

        setLoading(false);
    };

    // Real-time transcription functions
    const recognitionRef = useRef<any>(null);
    const finalTranscriptRef = useRef<string>("");

    const startRealtimeTranscription = () => {
        if (!("webkitSpeechRecognition" in window)) {
            setError("Echtzeit-Transkription wird in diesem Browser nicht unterstützt.");
            return;
        }

        setRealtimeText("");
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
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + " ";
                } else {
                    interimTranscript += event.results[i][0].transcript + " ";
                }
            }

            if (finalTranscript) {
                finalTranscriptRef.current += finalTranscript;
                setRealtimeText(finalTranscriptRef.current);
            } else {
                setRealtimeText(finalTranscriptRef.current + interimTranscript);
            }
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

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        if (finalTranscriptRef.current.trim()) {
            saveTranscription(finalTranscriptRef.current);
            setTranscription(finalTranscriptRef.current);
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

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {/* Sidebar for previous transcriptions */}
            <div className="w-full md:w-64 lg:w-80 bg-white shadow-md p-4 md:min-h-screen overflow-y-auto">
                <div className="flex justify-center mb-6">
                    <Image
                        src="/images/logo/LogoLight.png"
                        alt="Doc Dialog Logo"
                        width={180}
                        height={60}
                        className="mt-2"
                    />
                </div>

                <h2 className="text-lg font-bold mb-4" style={{ color: primaryColor }}>
                    Vorherige Transkriptionen
                </h2>

                {previousTranscriptions.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">Keine vorherigen Transkriptionen vorhanden.</p>
                ) : (
                    <div className="space-y-3">
                        {Array.isArray(previousTranscriptions) ? (
                            previousTranscriptions.map((item) => (
                                <div key={item.id} className="p-3 bg-gray-50 rounded border hover:border-blue-300 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-xs text-gray-500">{item.date}</p>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => loadTranscription(item.text)}
                                                className="hover:text-blue-700 text-xs"
                                                style={{ color: primaryColor }}
                                                title="Transkription laden"
                                            >
                                                📄
                                            </button>
                                            <button
                                                onClick={() => deleteTranscription(item.id)}
                                                className="text-red-500 hover:text-red-700 text-xs"
                                                title="Transkription löschen"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 line-clamp-3">{item.text}</p>
                                </div>
                            ))
                        ) : null}

                    </div>
                )}
            </div>

            {/* Main content */}
            <div className="flex-1 p-4 md:p-8">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                    <h1
                        className="text-3xl font-bold mb-6 text-center"
                        style={{ color: primaryColor }}
                    >
                        Doc Dialog
                    </h1>
                    <p className="text-center text-gray-600 mb-8">
                        Ihr intelligenter Audio-Transkriptionsdienst für medizinische Dokumentation
                    </p>

                    {/* Transcription Modes Selector */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 p-1 rounded-lg inline-flex">

                            <button
                                onClick={() => {
                                    if (isRealtimeActive) stopRealtimeTranscription();
                                    setShowRecorder(true);
                                }}
                                className={`px-4 py-2 rounded-md transition-colors ${showRecorder ? "text-white" : "text-gray-700 hover:bg-gray-200"
                                    }`}
                                style={{
                                    backgroundColor: showRecorder ? primaryColor : "transparent",
                                }}
                            >
                                Aufnahme
                            </button>
                            <button
                                onClick={() => {
                                    if (isRealtimeActive) stopRealtimeTranscription();
                                    setShowRecorder(false);
                                }}
                                className={`px-4 py-2 rounded-md transition-colors ${!showRecorder && !isRealtimeActive
                                    ? "text-white"
                                    : "text-gray-700 hover:bg-gray-200"
                                    }`}
                                style={{
                                    backgroundColor: !showRecorder && !isRealtimeActive ? primaryColor : "transparent",
                                }}
                            >
                                Datei hochladen
                            </button>
                            <button
                                onClick={toggleRealtimeMode}
                                className={`px-4 py-2 rounded-md transition-colors ${isRealtimeActive ? "text-white" : "text-gray-700 hover:bg-gray-200"
                                    }`}
                                style={{
                                    backgroundColor: isRealtimeActive ? primaryColor : "transparent",
                                }}
                            >
                                Echtzeit
                            </button>
                        </div>
                    </div>

                    {!showRecorder && !isRealtimeActive ? (
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
                                        disabled={loading}
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
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
                    ) : showRecorder ? (
                        <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                    ) : (
                        // Real-time transcription UI
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
                                        <h2 className="font-bold text-lg mb-2" style={{ color: primaryColor }}>
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

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                            <p className="flex items-center gap-2">
                                <span className="text-xl">⚠️</span>
                                {error}
                            </p>
                        </div>
                    )}

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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
