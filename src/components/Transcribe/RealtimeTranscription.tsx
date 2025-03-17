/* eslint-disable */

"use client";

import { useState, useRef } from "react";

interface RealtimeTranscriptionProps {
    setTranscription: (text: string) => void;
    saveTranscription: (text: string) => void;
    primaryColor: string;
}

export default function RealtimeTranscription({ setTranscription, saveTranscription, primaryColor }: RealtimeTranscriptionProps) {
    const [isRealtimeActive, setIsRealtimeActive] = useState(false);
    const [realtimeText, setRealtimeText] = useState<string>("");
    const [isListening, setIsListening] = useState(false);
    // const recognitionRef = useRef<null | SpeechRecognition>(null);
    const finalTranscriptRef = useRef<string>("");

    const startRealtimeTranscription = () => {
        if (typeof window === "undefined" || !("webkitSpeechRecognition" in window)) {
            alert("Echtzeit-Transkription wird in diesem Browser nicht unterstützt.");
            return;
        }

        setRealtimeText("");
        setIsRealtimeActive(true);
        setIsListening(true);

        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        if (!SpeechRecognition) {
            alert("Spracherkennung wird nicht unterstützt.");
            return;
        }

        const recognition = new SpeechRecognition();
        // recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "de-DE"; // German transcription

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
                finalTranscript = addPunctuation(finalTranscript); // Punctuation Fixer
                finalTranscriptRef.current += finalTranscript;
                setRealtimeText(finalTranscriptRef.current);
            } else {
                setRealtimeText(finalTranscriptRef.current + interimTranscript);
            }
        };

        recognition.onend = () => {
            if (isListening) {
                recognition.start(); // Restart automatically
            }
        };

        // recognition.onerror = (event) => {
        //     console.error("Spracherkennungsfehler:", event.error);
        //     stopRealtimeTranscription();
        // };

        recognition.start();
    };

    const stopRealtimeTranscription = () => {
        setIsListening(false);
        setIsRealtimeActive(false);

        // if (recognitionRef.current) {
        //     recognitionRef.current.stop();
        // }

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

    /** ✅ Function to Add Basic Punctuation */
    const addPunctuation = (text: string): string => {
        text = text.trim();
        if (!text) return text;

        text = text.replace(/(und|aber|denn|weil|oder) /gi, "$1, "); // Add commas
        text = text.replace(/(^|[.!?]\s+)([a-z])/g, (match) => match.toUpperCase()); // Capitalize starts
        if (!/[.!?]$/.test(text)) {
            text += ". "; // Add final punctuation if missing
        }

        return text;
    };

    return (
        <div className="space-y-4">
            <div className="text-center">
                <div className={`p-4 rounded-lg mb-4 ${isListening ? 'bg-red-50 animate-pulse' : 'bg-gray-50'}`}>
                    <p className="text-sm mb-2" style={{ color: isListening ? '#e53e3e' : '#718096' }}>
                        {isListening ? 'Aufnahme läuft - Sprechen Sie jetzt' : 'Drücken Sie Start, um die Echtzeit-Transkription zu beginnen'}
                    </p>
                </div>

                <button
                    onClick={toggleRealtimeMode}
                    className={`px-6 py-3 rounded-lg shadow transition-colors text-white ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                    {isListening ? 'Stoppen' : 'Starten'}
                </button>
            </div>

            {realtimeText && (
                <div className="p-5 border rounded-lg" style={{ backgroundColor: 'rgba(36, 160, 237, 0.1)', borderColor: 'rgba(36, 160, 237, 0.3)' }}>
                    <div className="flex justify-between items-start">
                        <h2 className="font-bold text-lg mb-2" style={{ color: primaryColor }}>Echtzeit-Transkription:</h2>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{realtimeText}</p>
                </div>
            )}
        </div>
    );
}
