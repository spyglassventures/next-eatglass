"use client";

// currently realtime us based on azure speech service see https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models?tabs=global-standard%2Cstandard-chat-completions#gpt-4o-audio
// current use is ms speech recognition

/// DOES NOT NEED ANY API KEY, its default browser speech recognition

import { useEffect, useRef, useState } from "react";
import { MicrophoneIcon } from "@heroicons/react/24/solid";

interface RealtimeTranscriptionProps {
    isActive: boolean;
    setIsActive: (active: boolean) => void;
    realtimeText: string;
    setRealtimeText: (text: string) => void;
    handleNewTranscription: (text: string) => void;
    setError: (msg: string | null) => void;
    primaryColor: string;
    modelName: string; // 👈 show model name
}

export default function RealtimeTranscription({
    isActive,
    setIsActive,
    realtimeText,
    setRealtimeText,
    handleNewTranscription,
    setError,
    primaryColor,
    modelName,
}: RealtimeTranscriptionProps) {
    const recognitionRef = useRef<any>(null);
    const finalTranscriptRef = useRef<string>("");
    const [status, setStatus] = useState<"idle" | "warming" | "listening">("idle");

    useEffect(() => {
        if (!isActive) return;

        if (typeof window === "undefined" || !("webkitSpeechRecognition" in window)) {
            setError("Echtzeit-Transkription wird in diesem Browser nicht unterstützt.");
            setIsActive(false);
            return;
        }

        setRealtimeText("");
        finalTranscriptRef.current = "";
        setStatus("warming");

        const recognition = new (window as any).webkitSpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "de-DE";

        recognition.onstart = () => {
            setStatus("listening");
        };

        recognition.onresult = (event: any) => {
            let interim = "", final = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i][0].transcript + " ";
                if (event.results[i].isFinal) {
                    final += result;
                } else {
                    interim += result;
                }
            }

            if (final) finalTranscriptRef.current += final;
            setRealtimeText(finalTranscriptRef.current + interim);
        };

        recognition.onerror = (event: any) => {
            console.error("Spracherkennungsfehler:", event.error);
            setError("Fehler bei der Echtzeit-Transkription.");
            stop();
        };

        const delayStart = setTimeout(() => {
            recognition.start();
        }, 500); // <-- this delay helps catch the real first words

        return () => {
            clearTimeout(delayStart);
            recognition.stop();
        };
    }, [isActive]);

    const stop = () => {
        recognitionRef.current?.stop();
        setIsActive(false);

        const finalText = finalTranscriptRef.current.trim();
        if (finalText) {
            handleNewTranscription(finalText);
        }
        finalTranscriptRef.current = "";
        setStatus("idle");
    };

    return (
        <div className="space-y-4">
            <div className="p-6 rounded-xl mb-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-lg border border-gray-200">
                <p className="text-base mb-2 text-gray-700 font-medium flex items-center gap-2">
                    {status === "warming" && (
                        <>
                            <span className="animate-pulse">🎙</span> Initialisiere Mikrofon…
                        </>
                    )}
                    {status === "listening" && (
                        <>
                            <MicrophoneIcon className="w-5 h-5 text-green-600" />
                            Sprachtranskription aktiv – sprechen Sie jetzt.
                        </>
                    )}

                </p>
                <p className="text-sm text-gray-500 mb-2 italic">
                    Modell: <span className="font-medium">{modelName}</span>
                </p>
            </div>

            {realtimeText && (
                <div
                    className="p-5 border rounded-lg"
                    style={{ backgroundColor: "rgba(36, 160, 237, 0.1)", borderColor: "rgba(36, 160, 237, 0.3)" }}
                >
                    <h2 className="font-bold text-lg mb-2" style={{ color: primaryColor }}>
                        Echtzeit-Transkription:
                    </h2>
                    <p className="text-gray-700 whitespace-pre-line">{realtimeText}</p>
                </div>
            )}

            <button
                onClick={stop}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow disabled:opacity-50"
                disabled={status !== "listening"}
            >
                Aufnahme stoppen
            </button>
        </div>
    );
}
