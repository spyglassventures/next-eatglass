"use client";

// Logi: on default use speechConfig.endpointId = "switzerland-secure-docdialog-speech-fine-tuned";
// find info on models and tuning here https://ai.azure.com/build/models/aoai/ftjob-c06f7cadcb3e4592b3615f75e90cdeef/details?wsid=/subscriptions/64cc99d8-d7ad-4e90-af87-ecb5ef4ac45c/resourcegroups/doc/providers/Microsoft.MachineLearningServices/workspaces/doc-dialog&tid=2c572ca7-2607-490a-bcdb-1f3ef931f8f0#Logs


import { useEffect, useRef, useState } from "react";
import { MicrophoneIcon } from "@heroicons/react/24/solid";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

interface RealtimeTranscriptionProps {
    isActive: boolean;
    setIsActive: (active: boolean) => void;
    realtimeText: string;
    setRealtimeText: (text: string) => void;
    handleNewTranscription: (text: string) => void;
    setError: (msg: string | null) => void;
    primaryColor: string;
    modelName: string;
}

export default function RealtimeTranscription({
    isActive,
    setIsActive,
    realtimeText,
    setRealtimeText,
    handleNewTranscription,
    setError,
    primaryColor,
    // modelName,
}: RealtimeTranscriptionProps) {
    const recognizerRef = useRef<SpeechSDK.SpeechRecognizer | null>(null);
    const finalTranscriptRef = useRef<string>("");
    const [status, setStatus] = useState<"idle" | "warming" | "listening">("idle");

    const [modelName, setModelName] = useState<string>("Azure Speech-to-Text");

// try custom model, if not available, fallback to standard model
    useEffect(() => {
        if (!isActive) return;
    
        const speechKey = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY!;
        const speechRegion = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION!;
    
        if (!speechKey || !speechRegion) {
            setError("Azure Speech Key oder Region fehlt.");
            setIsActive(false);
            return;
        }
    
        setRealtimeText("");
        finalTranscriptRef.current = "";
        setStatus("warming");
    
        const tryRecognizer = (useCustomModel: boolean) => {
            const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speechKey, speechRegion);
            speechConfig.speechRecognitionLanguage = "de-DE";
    
            if (useCustomModel) {
                speechConfig.endpointId = "switzerland-secure-docdialog-speech-fine-tuned";
                setModelName("Custom Model: DocDialog Fine-Tuned");
            } else {
                setModelName("Azure Speech-to-Text (Standard)");
            }
    
            const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
            const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
            recognizerRef.current = recognizer;
    
            recognizer.recognizing = (_s, e) => {
                setRealtimeText(finalTranscriptRef.current + e.result.text);
            };
    
            recognizer.recognized = (_s, e) => {
                if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                    finalTranscriptRef.current += e.result.text + " ";
                    setRealtimeText(finalTranscriptRef.current);
                }
            };
    
            recognizer.canceled = (_s, e) => {
                console.error("Erkennung abgebrochen:", e.errorDetails);
    
                if (useCustomModel) {
                    console.log("⚠️ Custom Model fehlgeschlagen – wechsle auf Standardmodell.");
                    tryRecognizer(false); // Fallback auf Standardmodell
                } else {
                    setError("Transkription abgebrochen: " + e.errorDetails);
                    stop();
                }
            };
    
            recognizer.sessionStarted = () => {
                setStatus("listening");
            };
    
            recognizer.sessionStopped = () => {
                stop();
            };
    
            recognizer.startContinuousRecognitionAsync();
        };
    
        tryRecognizer(true); // Versuche zuerst mit Custom Model
    
        return () => {
            recognizerRef.current?.stopContinuousRecognitionAsync(() => {}, () => {});
        };
    }, [isActive]);
    


    const stop = () => {
        recognizerRef.current?.stopContinuousRecognitionAsync(() => { }, () => { });
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
